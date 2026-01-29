// LOCRA Atlas Loyalty System - API Route Handlers
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import * as db from './db';
import type {
  MemberStatus,
  EarnMilesRequest,
  EarnMilesResponse,
  RedeemRewardRequest,
  RedeemRewardResponse,
  ReferralClaimRequest,
} from './types';

// =====================================================
// GET MEMBER STATUS
// =====================================================

export async function getMemberStatus(shopifyCustomerId: string): Promise<MemberStatus | null> {
  const account = await db.getAccountByShopifyId(shopifyCustomerId);
  if (!account) return null;

  const [tier, nextTier, stamps, transactions, questProgress, rewards, redemptions] = await Promise.all([
    db.getTier(account.currentTierId),
    db.getNextTier(account.currentTierId),
    db.getAccountStamps(account.id),
    db.getMilesTransactions(account.id, 10),
    db.getAccountQuestProgress(account.id),
    db.getAvailableRewardsForAccount(account.id),
    db.getAccountRedemptions(account.id),
  ]);

  if (!tier) return null;

  // Calculate progress to next tier
  let progressToNextTier = {
    milesProgress: account.lifetimeMiles,
    milesRequired: nextTier?.milesThreshold || account.lifetimeMiles,
    stampsProgress: account.stampCount,
    stampsRequired: nextTier?.stampsThreshold || account.stampCount,
    percentComplete: 100,
  };

  if (nextTier) {
    const milesPercent = Math.min(100, (account.lifetimeMiles / nextTier.milesThreshold) * 100);
    const stampsPercent = nextTier.stampsThreshold > 0
      ? Math.min(100, (account.stampCount / nextTier.stampsThreshold) * 100)
      : 0;
    progressToNextTier = {
      milesProgress: account.lifetimeMiles,
      milesRequired: nextTier.milesThreshold,
      stampsProgress: account.stampCount,
      stampsRequired: nextTier.stampsThreshold,
      percentComplete: Math.max(milesPercent, stampsPercent),
    };
  }

  return {
    account,
    tier,
    nextTier: nextTier || undefined,
    progressToNextTier,
    stamps,
    recentTransactions: transactions,
    activeQuests: questProgress.filter((q) => !q.completed),
    availableRewards: rewards,
    pendingRedemptions: redemptions.filter((r) => r.status === 'pending' || r.status === 'applied'),
  };
}

// =====================================================
// EARN MILES (from purchase)
// =====================================================

export async function earnMilesFromPurchase(request: EarnMilesRequest): Promise<EarnMilesResponse> {
  const account = await db.getAccountByShopifyId(request.shopifyCustomerId);
  if (!account) {
    return { success: false, milesEarned: 0, newStamps: [], questsCompleted: [] };
  }

  const baseMiles = Math.floor(request.orderTotalCents / 100); // $1 = 1 mile
  const questsCompleted: string[] = [];
  const newStamps: string[] = [];

  // Add purchase miles
  const transaction = await db.addMiles(
    account.id,
    'earn_purchase',
    baseMiles,
    `Purchase: Order ${request.shopifyOrderName}`,
    {
      idempotencyKey: `purchase-${request.shopifyOrderId}`,
      shopifyOrderId: request.shopifyOrderId,
      shopifyOrderName: request.shopifyOrderName,
      metadata: { orderTotalCents: request.orderTotalCents },
    }
  );

  if (!transaction) {
    // Already processed (idempotency)
    return { success: true, milesEarned: 0, newStamps: [], questsCompleted: [] };
  }

  // Award stamps for destinations
  for (const destinationHandle of request.destinationHandles) {
    const destination = await db.getDestinationByHandle(destinationHandle);
    if (destination) {
      const stamp = await db.addStamp(
        account.id,
        destination.id,
        request.shopifyOrderId,
        request.shopifyOrderName
      );
      if (stamp) {
        newStamps.push(destination.name);
      }
    }
  }

  // Update quest progress
  const updatedAccount = await db.getAccountById(account.id);
  if (updatedAccount) {
    // First purchase quest
    if (updatedAccount.lifetimeMiles === transaction.milesAmount) {
      const firstPurchase = await db.updateQuestProgress(account.id, 'first-stamp');
      if (firstPurchase?.completed) questsCompleted.push('First Stamp');
    }

    // Atlas Explorer (3 destinations)
    if (newStamps.length > 0) {
      const stamps = await db.getAccountStamps(account.id);
      if (stamps.length >= 3) {
        const explorer = await db.updateQuestProgress(account.id, 'atlas-explorer', stamps.length);
        if (explorer?.completed) questsCompleted.push('Atlas Explorer');
      }

      // Collector's Path (5 stamps)
      if (stamps.length >= 5) {
        const collector = await db.updateQuestProgress(account.id, 'collectors-path', stamps.length);
        if (collector?.completed) questsCompleted.push("Collector's Path");
      }

      // Worldly Traveler (10 stamps)
      if (stamps.length >= 10) {
        const worldly = await db.updateQuestProgress(account.id, 'worldly-traveler', stamps.length);
        if (worldly?.completed) questsCompleted.push('Worldly Traveler');
      }
    }

    // Return Journey (repeat purchase)
    const transactions = await db.getMilesTransactions(account.id, 50);
    const purchaseCount = transactions.filter((t) => t.transactionType === 'earn_purchase').length;
    if (purchaseCount >= 2) {
      const returnJourney = await db.updateQuestProgress(account.id, 'return-journey', purchaseCount);
      if (returnJourney?.completed) questsCompleted.push('Return Journey');
    }
  }

  // Check for tier upgrade
  const finalAccount = await db.getAccountById(account.id);
  const tierUpgrade = finalAccount && finalAccount.currentTierId !== account.currentTierId
    ? finalAccount.currentTierId
    : undefined;

  return {
    success: true,
    milesEarned: transaction.milesAmount,
    newStamps,
    tierUpgrade,
    questsCompleted,
  };
}

// =====================================================
// REDEEM REWARD
// =====================================================

export async function redeemReward(request: RedeemRewardRequest): Promise<RedeemRewardResponse> {
  const redemption = await db.createRedemption(request.accountId, request.rewardId);

  if (!redemption) {
    return {
      success: false,
      error: 'Unable to redeem reward. Check your miles balance and eligibility.',
    };
  }

  // For credit-type rewards, generate a discount code
  // In production, this would call Shopify Admin API to create a price rule
  let discountCode: string | undefined;
  if (redemption.rewardId.includes('credit') || redemption.rewardId === 'free-shipping') {
    discountCode = `ATLAS-${redemption.id.substring(0, 8).toUpperCase()}`;
    // TODO: Create Shopify discount code via Admin API
  }

  return {
    success: true,
    redemption,
    discountCode,
  };
}

// =====================================================
// APPLY REWARD TO CHECKOUT
// =====================================================

export async function applyRewardToCheckout(
  redemptionId: string,
  shopifyOrderId: string
): Promise<boolean> {
  // Update redemption status to applied
  // In production, this validates the discount was used on the order
  return true;
}

// =====================================================
// REFERRAL CLAIM
// =====================================================

export async function claimReferral(request: ReferralClaimRequest): Promise<{ success: boolean; error?: string }> {
  const referrerAccount = await db.getAccountByReferralCode(request.referralCode);
  if (!referrerAccount) {
    return { success: false, error: 'Invalid referral code.' };
  }

  const newAccount = await db.getAccountById(request.newAccountId);
  if (!newAccount) {
    return { success: false, error: 'Account not found.' };
  }

  // Can't refer yourself
  if (referrerAccount.id === newAccount.id) {
    return { success: false, error: 'You cannot refer yourself.' };
  }

  // Create referral record
  const referral = await db.createReferral(referrerAccount.id, newAccount.id);
  if (!referral) {
    return { success: false, error: 'Referral already claimed.' };
  }

  return { success: true };
}

// =====================================================
// UPDATE PROFILE
// =====================================================

export async function updateProfile(
  accountId: string,
  profile: {
    firstName?: string;
    lastName?: string;
    birthday?: Date;
    preferredDestinations?: string[];
  }
): Promise<{ success: boolean; questCompleted?: boolean }> {
  const account = await db.updateAccountProfile(accountId, profile);
  if (!account) {
    return { success: false };
  }

  // Check profile completion quest
  if (account.profileCompleted && account.firstName && account.lastName) {
    const quest = await db.updateQuestProgress(accountId, 'pack-suitcase');
    return { success: true, questCompleted: quest?.completed };
  }

  return { success: true };
}

// =====================================================
// TRACK JOURNAL READ
// =====================================================

export async function trackJournalRead(accountId: string): Promise<{ questCompleted: boolean; milesAwarded: number }> {
  const result = await db.updateQuestProgress(accountId, 'journal-keeper');
  return {
    questCompleted: result?.completed || false,
    milesAwarded: result?.milesAwarded || 0,
  };
}

// =====================================================
// API ROUTE HANDLERS
// =====================================================

export async function handleGetMemberStatus(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const shopifyCustomerId = searchParams.get('customerId');

  if (!shopifyCustomerId) {
    return NextResponse.json({ error: 'Customer ID required' }, { status: 400 });
  }

  const status = await getMemberStatus(shopifyCustomerId);
  if (!status) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 });
  }

  return NextResponse.json(status);
}

export async function handleEarnMiles(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json() as EarnMilesRequest;
    const result = await earnMilesFromPurchase(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Earn miles error:', error);
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 });
  }
}

export async function handleRedeemReward(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json() as RedeemRewardRequest;
    const result = await redeemReward(body);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error('Redeem reward error:', error);
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 });
  }
}

export async function handleClaimReferral(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json() as ReferralClaimRequest;
    const result = await claimReferral(body);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error('Claim referral error:', error);
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 });
  }
}
