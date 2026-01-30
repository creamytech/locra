// LOCRA Atlas Loyalty System - Type Definitions
// =====================================================

// Tier Types
export type TierId = 'initiate' | 'voyager' | 'collector' | 'laureate';

export interface Tier {
  id: TierId;
  name: string;
  displayName: string;
  milesThreshold: number;
  stampsThreshold: number;
  milesMultiplier: number;
  shippingThresholdCents: number | null;
  earlyAccessHours: number;
  perks: string[];
}

// Miles Types
export type MilesTransactionType =
  | 'earn_purchase'
  | 'earn_referral_bonus'
  | 'earn_quest_reward'
  | 'earn_birthday_bonus'
  | 'earn_signup_bonus'
  | 'earn_adjustment'
  | 'redeem_reward'
  | 'expire'
  | 'refund_clawback'
  | 'referral_clawback';

export interface MilesTransaction {
  id: string;
  accountId: string;
  transactionType: MilesTransactionType;
  milesAmount: number;
  description: string;
  metadata: Record<string, unknown>;
  shopifyOrderId?: string;
  shopifyOrderName?: string;
  tierAtTransaction: TierId;
  multiplierApplied: number;
  expiresAt?: Date;
  createdAt: Date;
}

// Account Types
export interface LoyaltyAccount {
  id: string;
  shopifyCustomerId: string;
  email: string;
  
  // Current state
  currentTierId: TierId;
  lifetimeMiles: number;
  availableMiles: number;
  stampCount: number;
  
  // Profile
  profileCompleted: boolean;
  firstName?: string;
  lastName?: string;
  birthday?: Date;
  preferredDestinations: string[];
  
  // Referral
  referralCode: string;
  referredByAccountId?: string;
  referralEligible: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
}

// Stamp Types
export interface Destination {
  id: string;
  handle: string;
  name: string;
  region: string;
  stampEmoji: string;
  stampImageUrl?: string;
  stampColor: string;
  coordinates: string;
  tagline: string;
  active: boolean;
}

export interface Stamp {
  id: string;
  accountId: string;
  destinationId: string;
  shopifyOrderId: string;
  shopifyOrderName?: string;
  createdAt: Date;
}

// Reward Types
export type RewardType =
  | 'free_shipping'
  | 'early_access'
  | 'postcard'
  | 'artifact_unlock'
  | 'monogram_credit'
  | 'portal_pass'
  | 'atlas_credit';

export interface Reward {
  id: string;
  name: string;
  description: string;
  rewardType: RewardType;
  milesCost: number;
  minTierId: TierId;
  maxPerMonth?: number;
  isRare: boolean;
  creditAmountCents?: number;
  active: boolean;
  sortOrder: number;
  icon: string;
}

export type RedemptionStatus =
  | 'pending'
  | 'applied'
  | 'consumed'
  | 'cancelled'
  | 'expired'
  | 'refunded';

export interface Redemption {
  id: string;
  accountId: string;
  rewardId: string;
  status: RedemptionStatus;
  milesDeducted: number;
  shopifyOrderId?: string;
  shopifyDiscountCode?: string;
  validUntil: Date;
  createdAt: Date;
  appliedAt?: Date;
  consumedAt?: Date;
}

// Quest Types
export type QuestRequirementType =
  | 'profile'
  | 'purchase'
  | 'destinations'
  | 'journal'
  | 'referral'
  | 'stamps'
  | 'drop_purchase'
  | 'repeat_purchase';

export interface Quest {
  id: string;
  name: string;
  description: string;
  milesReward: number;
  requirementType: QuestRequirementType;
  requirementCount: number;
  isRepeatable: boolean;
  cooldownDays?: number;
  active: boolean;
  sortOrder: number;
  icon: string;
}

export interface QuestProgress {
  id: string;
  accountId: string;
  questId: string;
  currentCount: number;
  completed: boolean;
  completedAt?: Date;
  lastCompletedAt?: Date;
  completionCount: number;
}

// Referral Types
export type ReferralStatus =
  | 'pending'
  | 'order_placed'
  | 'fulfilled'
  | 'credited'
  | 'rejected'
  | 'clawback';

export interface Referral {
  id: string;
  referrerAccountId: string;
  referredAccountId: string;
  status: ReferralStatus;
  rejectionReason?: string;
  shopifyOrderId?: string;
  orderTotalCents?: number;
  orderFulfilledAt?: Date;
  bufferEndsAt?: Date;
  referrerMilesCredited?: number;
  referredMilesCredited?: number;
  creditedAt?: Date;
  createdAt: Date;
}

// API Response Types
export interface MemberStatus {
  account: LoyaltyAccount;
  tier: Tier;
  nextTier?: Tier;
  progressToNextTier: {
    milesProgress: number;
    milesRequired: number;
    stampsProgress: number;
    stampsRequired: number;
    percentComplete: number;
  };
  stamps: (Stamp & { destination: Destination })[];
  recentTransactions: MilesTransaction[];
  activeQuests: (QuestProgress & { quest: Quest })[];
  availableRewards: Reward[];
  pendingRedemptions: (Redemption & { reward: Reward })[];
}

export interface EarnMilesRequest {
  shopifyCustomerId: string;
  shopifyOrderId: string;
  shopifyOrderName: string;
  orderTotalCents: number;
  destinationHandles: string[];
  idempotencyKey: string;
}

export interface EarnMilesResponse {
  success: boolean;
  milesEarned: number;
  newStamps: string[];
  tierUpgrade?: TierId;
  questsCompleted: string[];
}

export interface RedeemRewardRequest {
  accountId: string;
  rewardId: string;
}

export interface RedeemRewardResponse {
  success: boolean;
  redemption?: Redemption;
  discountCode?: string;
  error?: string;
}

export interface ApplyRewardRequest {
  redemptionId: string;
  shopifyOrderId: string;
}

export interface ReferralClaimRequest {
  referralCode: string;
  newAccountId: string;
}

// Webhook Types
export interface ShopifyOrderWebhook {
  id: number;
  name: string;
  email: string;
  total_price: string;
  customer: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  line_items: Array<{
    product_id: number;
    variant_id: number;
    title: string;
    vendor: string;
    properties: Array<{ name: string; value: string }>;
    // Product metafields included via webhook configuration
    // Requires setting up the webhook to include `product.metafields.custom.destination`
  }>;
  shipping_address?: {
    address1: string;
    address2?: string;
    city: string;
    province: string;
    country: string;
    zip: string;
  };
  fulfillment_status: string | null;
  financial_status: string;
}

// Extended line item type for Admin API queries (with metafields)
export interface ShopifyOrderLineItemWithMetafields {
  product_id: number;
  variant_id: number;
  title: string;
  vendor: string;
  properties: Array<{ name: string; value: string }>;
  // Custom product metafields
  destination?: string; // Metafield: custom.destination
  stamp_name?: string;  // Metafield: custom.stamp_name (alternative)
}
