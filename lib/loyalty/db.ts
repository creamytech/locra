// @ts-nocheck
// LOCRA Atlas Loyalty System - Database Client
// =====================================================
// NOTE: Requires `pnpm add pg @types/pg` to use this module
/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  LoyaltyAccount,
  MilesTransaction,
  MilesTransactionType,
  Stamp,
  Destination,
  Reward,
  Redemption,
  Quest,
  QuestProgress,
  Referral,
  Tier,
  TierId,
} from './types';

// Helper type for raw database rows
type DbRow = Record<string, any>;

// Database pool type definition (inline to avoid pg dependency at build time)
interface PoolClient {
  query<T = DbRow>(text: string, values?: unknown[]): Promise<{ rows: T[] }>;
  release(): void;
}

interface DatabasePool {
  query<T = DbRow>(text: string, values?: unknown[]): Promise<{ rows: T[] }>;
  connect(): Promise<PoolClient>;
}


// Lazy-loaded database pool
let _pool: DatabasePool | null = null;

function getPool(): DatabasePool {
  if (!_pool) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { Pool } = require('pg');
      let connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || '';
      
      // Supabase and cloud Postgres providers require SSL with their own CA
      // The pg library's default SSL validation is too strict
      // Strip sslmode from URL and configure SSL manually to avoid cert errors
      const needsSSL = connectionString.includes('sslmode=') || 
                       connectionString.includes('supabase') ||
                       process.env.NODE_ENV === 'production';
      
      // Remove sslmode parameter from connection string to avoid double-configuration
      connectionString = connectionString.replace(/[?&]sslmode=[^&]*/g, '');
      // Clean up any leftover ? at the end or && in the middle
      connectionString = connectionString.replace(/\?&/g, '?').replace(/&&/g, '&').replace(/[?&]$/, '');
      
      _pool = new Pool({
        connectionString,
        // Disable strict certificate validation for cloud providers
        ssl: needsSSL ? { rejectUnauthorized: false } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
    } catch {
      // Return a stub pool for development without pg installed
      _pool = {
        query: async () => ({ rows: [] }),
        connect: async () => ({
          query: async () => ({ rows: [] }),
          release: () => {},
        }),
      };
      console.warn('PostgreSQL (pg) not installed. Loyalty system database operations will not work.');
    }
  }
  return _pool!;
}

// Getter for pool instance
const pool = {
  query: <T>(text: string, values?: unknown[]) => getPool().query<T>(text, values),
  connect: () => getPool().connect(),
};

// =====================================================
// ACCOUNT OPERATIONS
// =====================================================

export async function getAccountByShopifyId(shopifyCustomerId: string): Promise<LoyaltyAccount | null> {
  const { rows } = await pool.query<LoyaltyAccount>(
    `SELECT 
      id, shopify_customer_id as "shopifyCustomerId", email,
      current_tier_id as "currentTierId", lifetime_miles as "lifetimeMiles",
      available_miles as "availableMiles", stamp_count as "stampCount",
      profile_completed as "profileCompleted", first_name as "firstName",
      last_name as "lastName", birthday, preferred_destinations as "preferredDestinations",
      referral_code as "referralCode", referred_by_account_id as "referredByAccountId",
      referral_eligible as "referralEligible",
      created_at as "createdAt", updated_at as "updatedAt", last_activity_at as "lastActivityAt"
    FROM loyalty_accounts
    WHERE shopify_customer_id = $1`,
    [shopifyCustomerId]
  );
  return rows[0] || null;
}

export async function getAccountById(id: string): Promise<LoyaltyAccount | null> {
  const { rows } = await pool.query<LoyaltyAccount>(
    `SELECT 
      id, shopify_customer_id as "shopifyCustomerId", email,
      current_tier_id as "currentTierId", lifetime_miles as "lifetimeMiles",
      available_miles as "availableMiles", stamp_count as "stampCount",
      profile_completed as "profileCompleted", first_name as "firstName",
      last_name as "lastName", birthday, preferred_destinations as "preferredDestinations",
      referral_code as "referralCode", referred_by_account_id as "referredByAccountId",
      referral_eligible as "referralEligible",
      created_at as "createdAt", updated_at as "updatedAt", last_activity_at as "lastActivityAt"
    FROM loyalty_accounts
    WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

export async function getAccountByReferralCode(referralCode: string): Promise<LoyaltyAccount | null> {
  const { rows } = await pool.query<LoyaltyAccount>(
    `SELECT 
      id, shopify_customer_id as "shopifyCustomerId", email,
      current_tier_id as "currentTierId", lifetime_miles as "lifetimeMiles",
      available_miles as "availableMiles", stamp_count as "stampCount",
      profile_completed as "profileCompleted", first_name as "firstName",
      last_name as "lastName", birthday, preferred_destinations as "preferredDestinations",
      referral_code as "referralCode", referred_by_account_id as "referredByAccountId",
      referral_eligible as "referralEligible",
      created_at as "createdAt", updated_at as "updatedAt", last_activity_at as "lastActivityAt"
    FROM loyalty_accounts
    WHERE referral_code = $1`,
    [referralCode]
  );
  return rows[0] || null;
}

export async function createAccount(
  shopifyCustomerId: string,
  email: string,
  referredByAccountId?: string
): Promise<LoyaltyAccount> {
  const { rows } = await pool.query<LoyaltyAccount>(
    `INSERT INTO loyalty_accounts (shopify_customer_id, email, referred_by_account_id)
    VALUES ($1, $2, $3)
    RETURNING 
      id, shopify_customer_id as "shopifyCustomerId", email,
      current_tier_id as "currentTierId", lifetime_miles as "lifetimeMiles",
      available_miles as "availableMiles", stamp_count as "stampCount",
      profile_completed as "profileCompleted", first_name as "firstName",
      last_name as "lastName", birthday, preferred_destinations as "preferredDestinations",
      referral_code as "referralCode", referred_by_account_id as "referredByAccountId",
      referral_eligible as "referralEligible",
      created_at as "createdAt", updated_at as "updatedAt", last_activity_at as "lastActivityAt"`,
    [shopifyCustomerId, email, referredByAccountId]
  );
  return rows[0];
}

export async function updateAccountProfile(
  accountId: string,
  profile: {
    firstName?: string;
    lastName?: string;
    birthday?: Date;
    preferredDestinations?: string[];
  }
): Promise<LoyaltyAccount | null> {
  const { rows } = await pool.query<LoyaltyAccount>(
    `UPDATE loyalty_accounts
    SET 
      first_name = COALESCE($2, first_name),
      last_name = COALESCE($3, last_name),
      birthday = COALESCE($4, birthday),
      preferred_destinations = COALESCE($5, preferred_destinations),
      profile_completed = TRUE,
      updated_at = NOW()
    WHERE id = $1
    RETURNING 
      id, shopify_customer_id as "shopifyCustomerId", email,
      current_tier_id as "currentTierId", lifetime_miles as "lifetimeMiles",
      available_miles as "availableMiles", stamp_count as "stampCount",
      profile_completed as "profileCompleted", first_name as "firstName",
      last_name as "lastName", birthday, preferred_destinations as "preferredDestinations",
      referral_code as "referralCode", referred_by_account_id as "referredByAccountId",
      referral_eligible as "referralEligible",
      created_at as "createdAt", updated_at as "updatedAt", last_activity_at as "lastActivityAt"`,
    [accountId, profile.firstName, profile.lastName, profile.birthday, profile.preferredDestinations]
  );
  return rows[0] || null;
}

// =====================================================
// TIERS
// =====================================================

export async function getTier(tierId: TierId): Promise<Tier | null> {
  const { rows } = await pool.query<Tier>(
    `SELECT 
      id, name, display_name as "displayName",
      miles_threshold as "milesThreshold", stamps_threshold as "stampsThreshold",
      miles_multiplier as "milesMultiplier", shipping_threshold_cents as "shippingThresholdCents",
      early_access_hours as "earlyAccessHours", perks
    FROM tiers
    WHERE id = $1`,
    [tierId]
  );
  return rows[0] || null;
}

export async function getAllTiers(): Promise<Tier[]> {
  const { rows } = await pool.query<Tier>(
    `SELECT 
      id, name, display_name as "displayName",
      miles_threshold as "milesThreshold", stamps_threshold as "stampsThreshold",
      miles_multiplier as "milesMultiplier", shipping_threshold_cents as "shippingThresholdCents",
      early_access_hours as "earlyAccessHours", perks
    FROM tiers
    ORDER BY sort_order`
  );
  return rows;
}

export async function getNextTier(currentTierId: TierId): Promise<Tier | null> {
  const { rows } = await pool.query<Tier>(
    `SELECT 
      id, name, display_name as "displayName",
      miles_threshold as "milesThreshold", stamps_threshold as "stampsThreshold",
      miles_multiplier as "milesMultiplier", shipping_threshold_cents as "shippingThresholdCents",
      early_access_hours as "earlyAccessHours", perks
    FROM tiers
    WHERE sort_order > (SELECT sort_order FROM tiers WHERE id = $1)
    ORDER BY sort_order
    LIMIT 1`,
    [currentTierId]
  );
  return rows[0] || null;
}

// =====================================================
// MILES OPERATIONS
// =====================================================

export async function addMiles(
  accountId: string,
  transactionType: MilesTransactionType,
  milesAmount: number,
  description: string,
  options: {
    idempotencyKey?: string;
    shopifyOrderId?: string;
    shopifyOrderName?: string;
    questId?: string;
    referralId?: string;
    rewardRedemptionId?: string;
    metadata?: Record<string, unknown>;
  } = {}
): Promise<MilesTransaction | null> {
  // Get current tier for multiplier
  const account = await getAccountById(accountId);
  if (!account) return null;

  const tier = await getTier(account.currentTierId);
  const multiplier = tier?.milesMultiplier || 1;

  // Apply multiplier for earning transactions
  const finalMiles = transactionType.startsWith('earn_')
    ? Math.floor(milesAmount * multiplier)
    : milesAmount;

  // Calculate expiration (18 months from now for earnings)
  const expiresAt = transactionType.startsWith('earn_')
    ? new Date(Date.now() + 18 * 30 * 24 * 60 * 60 * 1000)
    : null;

  try {
    const { rows } = await pool.query<MilesTransaction>(
      `INSERT INTO miles_ledger (
        account_id, transaction_type, miles_amount, description,
        metadata, idempotency_key, shopify_order_id, shopify_order_name,
        quest_id, referral_id, reward_redemption_id,
        tier_at_transaction, multiplier_applied, expires_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      ON CONFLICT (idempotency_key) DO NOTHING
      RETURNING 
        id, account_id as "accountId", transaction_type as "transactionType",
        miles_amount as "milesAmount", description, metadata,
        shopify_order_id as "shopifyOrderId", shopify_order_name as "shopifyOrderName",
        tier_at_transaction as "tierAtTransaction", multiplier_applied as "multiplierApplied",
        expires_at as "expiresAt", created_at as "createdAt"`,
      [
        accountId,
        transactionType,
        finalMiles,
        description,
        JSON.stringify(options.metadata || {}),
        options.idempotencyKey,
        options.shopifyOrderId,
        options.shopifyOrderName,
        options.questId,
        options.referralId,
        options.rewardRedemptionId,
        account.currentTierId,
        multiplier,
        expiresAt,
      ]
    );

    if (rows[0] && transactionType.startsWith('earn_')) {
      // Update lifetime miles
      await pool.query(
        `UPDATE loyalty_accounts 
        SET lifetime_miles = lifetime_miles + $2, last_activity_at = NOW()
        WHERE id = $1`,
        [accountId, finalMiles]
      );
    }

    return rows[0] || null;
  } catch (error) {
    // Idempotency key conflict, return null
    console.error('Failed to add miles:', error);
    return null;
  }
}

export async function getMilesTransactions(
  accountId: string,
  limit: number = 20
): Promise<MilesTransaction[]> {
  const { rows } = await pool.query<MilesTransaction>(
    `SELECT 
      id, account_id as "accountId", transaction_type as "transactionType",
      miles_amount as "milesAmount", description, metadata,
      shopify_order_id as "shopifyOrderId", shopify_order_name as "shopifyOrderName",
      tier_at_transaction as "tierAtTransaction", multiplier_applied as "multiplierApplied",
      expires_at as "expiresAt", created_at as "createdAt"
    FROM miles_ledger
    WHERE account_id = $1
    ORDER BY created_at DESC
    LIMIT $2`,
    [accountId, limit]
  );
  return rows;
}

// =====================================================
// STAMPS OPERATIONS
// =====================================================

export async function getDestinations(): Promise<Destination[]> {
  const { rows } = await pool.query<Destination>(
    `SELECT 
      id, handle, name, region,
      stamp_emoji as "stampEmoji", stamp_image_url as "stampImageUrl",
      stamp_color as "stampColor", coordinates, tagline, active
    FROM destinations
    WHERE active = TRUE
    ORDER BY name`
  );
  return rows;
}

export async function getDestinationByHandle(handle: string): Promise<Destination | null> {
  const { rows } = await pool.query<Destination>(
    `SELECT 
      id, handle, name, region,
      stamp_emoji as "stampEmoji", stamp_image_url as "stampImageUrl",
      stamp_color as "stampColor", coordinates, tagline, active
    FROM destinations
    WHERE handle = $1`,
    [handle]
  );
  return rows[0] || null;
}

export async function addStamp(
  accountId: string,
  destinationId: string,
  shopifyOrderId: string,
  shopifyOrderName?: string
): Promise<Stamp | null> {
  try {
    const { rows } = await pool.query<Stamp>(
      `INSERT INTO stamps_ledger (account_id, destination_id, shopify_order_id, shopify_order_name)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (account_id, destination_id) DO NOTHING
      RETURNING 
        id, account_id as "accountId", destination_id as "destinationId",
        shopify_order_id as "shopifyOrderId", shopify_order_name as "shopifyOrderName",
        created_at as "createdAt"`,
      [accountId, destinationId, shopifyOrderId, shopifyOrderName]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Failed to add stamp:', error);
    return null;
  }
}

export async function getAccountStamps(accountId: string): Promise<(Stamp & { destination: Destination })[]> {
  const { rows } = await pool.query(
    `SELECT 
      s.id, s.account_id as "accountId", s.destination_id as "destinationId",
      s.shopify_order_id as "shopifyOrderId", s.shopify_order_name as "shopifyOrderName",
      s.created_at as "createdAt",
      d.id as "destination.id", d.handle as "destination.handle", d.name as "destination.name",
      d.region as "destination.region", d.stamp_emoji as "destination.stampEmoji",
      d.stamp_image_url as "destination.stampImageUrl", d.stamp_color as "destination.stampColor",
      d.coordinates as "destination.coordinates", d.tagline as "destination.tagline"
    FROM stamps_ledger s
    JOIN destinations d ON s.destination_id = d.id
    WHERE s.account_id = $1
    ORDER BY s.created_at`,
    [accountId]
  );

  return rows.map((row) => ({
    id: row.id,
    accountId: row.accountId,
    destinationId: row.destinationId,
    shopifyOrderId: row.shopifyOrderId,
    shopifyOrderName: row.shopifyOrderName,
    createdAt: row.createdAt,
    destination: {
      id: row['destination.id'],
      handle: row['destination.handle'],
      name: row['destination.name'],
      region: row['destination.region'],
      stampEmoji: row['destination.stampEmoji'],
      stampImageUrl: row['destination.stampImageUrl'],
      stampColor: row['destination.stampColor'],
      coordinates: row['destination.coordinates'],
      tagline: row['destination.tagline'],
      active: true,
    },
  }));
}

// =====================================================
// REWARDS OPERATIONS
// =====================================================

export async function getRewards(): Promise<Reward[]> {
  const { rows } = await pool.query<Reward>(
    `SELECT 
      id, name, description, reward_type as "rewardType",
      miles_cost as "milesCost", min_tier_id as "minTierId",
      max_per_month as "maxPerMonth", is_rare as "isRare",
      credit_amount_cents as "creditAmountCents",
      active, sort_order as "sortOrder", icon
    FROM rewards
    WHERE active = TRUE
    ORDER BY sort_order`
  );
  return rows;
}

export async function getAvailableRewardsForAccount(accountId: string): Promise<Reward[]> {
  const account = await getAccountById(accountId);
  if (!account) return [];

  const { rows } = await pool.query<Reward>(
    `SELECT 
      r.id, r.name, r.description, r.reward_type as "rewardType",
      r.miles_cost as "milesCost", r.min_tier_id as "minTierId",
      r.max_per_month as "maxPerMonth", r.is_rare as "isRare",
      r.credit_amount_cents as "creditAmountCents",
      r.active, r.sort_order as "sortOrder", r.icon
    FROM rewards r
    JOIN tiers t ON r.min_tier_id = t.id
    JOIN tiers current_tier ON current_tier.id = $2
    WHERE r.active = TRUE
      AND t.sort_order <= current_tier.sort_order
      AND r.miles_cost <= $3
    ORDER BY r.sort_order`,
    [accountId, account.currentTierId, account.availableMiles]
  );
  return rows;
}

export async function createRedemption(
  accountId: string,
  rewardId: string
): Promise<Redemption | null> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get account and reward
    const { rows: accounts } = await client.query<LoyaltyAccount>(
      `SELECT * FROM loyalty_accounts WHERE id = $1 FOR UPDATE`,
      [accountId]
    );
    const account = accounts[0];

    const { rows: rewards } = await client.query<Reward>(
      `SELECT * FROM rewards WHERE id = $1`,
      [rewardId]
    );
    const reward = rewards[0];

    if (!account || !reward) {
      await client.query('ROLLBACK');
      return null;
    }

    // Check eligibility
    if (account.availableMiles < reward.milesCost) {
      await client.query('ROLLBACK');
      return null;
    }

    // Check monthly limit
    if (reward.maxPerMonth) {
      const { rows: recentRedemptions } = await client.query(
        `SELECT COUNT(*) as count FROM redemptions
        WHERE account_id = $1 AND reward_id = $2
        AND created_at > NOW() - INTERVAL '30 days'`,
        [accountId, rewardId]
      );
      if (parseInt(recentRedemptions[0].count) >= reward.maxPerMonth) {
        await client.query('ROLLBACK');
        return null;
      }
    }

    // Create redemption
    const validUntil = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days
    const { rows: redemptions } = await client.query<Redemption>(
      `INSERT INTO redemptions (account_id, reward_id, miles_deducted, valid_until)
      VALUES ($1, $2, $3, $4)
      RETURNING 
        id, account_id as "accountId", reward_id as "rewardId",
        status, miles_deducted as "milesDeducted",
        shopify_order_id as "shopifyOrderId", shopify_discount_code as "shopifyDiscountCode",
        valid_until as "validUntil", created_at as "createdAt"`,
      [accountId, rewardId, reward.milesCost, validUntil]
    );

    // Deduct miles
    await addMiles(accountId, 'redeem_reward', -reward.milesCost, `Redeemed: ${reward.name}`, {
      rewardRedemptionId: redemptions[0].id,
    });

    await client.query('COMMIT');
    return redemptions[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to create redemption:', error);
    return null;
  } finally {
    client.release();
  }
}

export async function getAccountRedemptions(accountId: string): Promise<(Redemption & { reward: Reward })[]> {
  const { rows } = await pool.query(
    `SELECT 
      red.id, red.account_id as "accountId", red.reward_id as "rewardId",
      red.status, red.miles_deducted as "milesDeducted",
      red.shopify_order_id as "shopifyOrderId", red.shopify_discount_code as "shopifyDiscountCode",
      red.valid_until as "validUntil", red.created_at as "createdAt",
      red.applied_at as "appliedAt", red.consumed_at as "consumedAt",
      r.name as "reward.name", r.description as "reward.description",
      r.reward_type as "reward.rewardType", r.icon as "reward.icon"
    FROM redemptions red
    JOIN rewards r ON red.reward_id = r.id
    WHERE red.account_id = $1
    ORDER BY red.created_at DESC`,
    [accountId]
  );

  return rows.map((row) => ({
    id: row.id,
    accountId: row.accountId,
    rewardId: row.rewardId,
    status: row.status,
    milesDeducted: row.milesDeducted,
    shopifyOrderId: row.shopifyOrderId,
    shopifyDiscountCode: row.shopifyDiscountCode,
    validUntil: row.validUntil,
    createdAt: row.createdAt,
    appliedAt: row.appliedAt,
    consumedAt: row.consumedAt,
    reward: {
      id: row.rewardId,
      name: row['reward.name'],
      description: row['reward.description'],
      rewardType: row['reward.rewardType'],
      icon: row['reward.icon'],
      milesCost: row.milesDeducted,
      minTierId: 'initiate' as TierId,
      isRare: false,
      active: true,
      sortOrder: 0,
    },
  }));
}

// =====================================================
// QUESTS OPERATIONS
// =====================================================

export async function getQuests(): Promise<Quest[]> {
  const { rows } = await pool.query<Quest>(
    `SELECT 
      id, name, description, miles_reward as "milesReward",
      requirement_type as "requirementType", requirement_count as "requirementCount",
      is_repeatable as "isRepeatable", cooldown_days as "cooldownDays",
      active, sort_order as "sortOrder", icon
    FROM quests
    WHERE active = TRUE
    ORDER BY sort_order`
  );
  return rows;
}

export async function getAccountQuestProgress(accountId: string): Promise<(QuestProgress & { quest: Quest })[]> {
  const { rows } = await pool.query(
    `SELECT 
      qp.id, qp.account_id as "accountId", qp.quest_id as "questId",
      qp.current_count as "currentCount", qp.completed, qp.completed_at as "completedAt",
      qp.last_completed_at as "lastCompletedAt", qp.completion_count as "completionCount",
      q.name as "quest.name", q.description as "quest.description",
      q.miles_reward as "quest.milesReward", q.requirement_type as "quest.requirementType",
      q.requirement_count as "quest.requirementCount", q.is_repeatable as "quest.isRepeatable",
      q.icon as "quest.icon"
    FROM quest_progress qp
    JOIN quests q ON qp.quest_id = q.id
    WHERE qp.account_id = $1
    ORDER BY qp.completed, q.sort_order`,
    [accountId]
  );

  return rows.map((row) => ({
    id: row.id,
    accountId: row.accountId,
    questId: row.questId,
    currentCount: row.currentCount,
    completed: row.completed,
    completedAt: row.completedAt,
    lastCompletedAt: row.lastCompletedAt,
    completionCount: row.completionCount,
    quest: {
      id: row.questId,
      name: row['quest.name'],
      description: row['quest.description'],
      milesReward: row['quest.milesReward'],
      requirementType: row['quest.requirementType'],
      requirementCount: row['quest.requirementCount'],
      isRepeatable: row['quest.isRepeatable'],
      icon: row['quest.icon'],
      active: true,
      sortOrder: 0,
    },
  }));
}

export async function updateQuestProgress(
  accountId: string,
  questId: string,
  incrementBy: number = 1
): Promise<{ completed: boolean; milesAwarded: number } | null> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get or create progress
    await client.query(
      `INSERT INTO quest_progress (account_id, quest_id)
      VALUES ($1, $2)
      ON CONFLICT (account_id, quest_id) DO NOTHING`,
      [accountId, questId]
    );

    // Get quest and progress
    const { rows: quests } = await client.query<Quest>(
      `SELECT * FROM quests WHERE id = $1`,
      [questId]
    );
    const quest = quests[0];

    const { rows: progress } = await client.query<QuestProgress>(
      `SELECT * FROM quest_progress WHERE account_id = $1 AND quest_id = $2 FOR UPDATE`,
      [accountId, questId]
    );
    const questProgress = progress[0];

    if (!quest || !questProgress) {
      await client.query('ROLLBACK');
      return null;
    }

    // Check if already completed (for non-repeatable)
    if (questProgress.completed && !quest.isRepeatable) {
      await client.query('ROLLBACK');
      return { completed: false, milesAwarded: 0 };
    }

    // Check cooldown for repeatable
    if (quest.isRepeatable && questProgress.lastCompletedAt && quest.cooldownDays) {
      const cooldownEnd = new Date(questProgress.lastCompletedAt);
      cooldownEnd.setDate(cooldownEnd.getDate() + quest.cooldownDays);
      if (new Date() < cooldownEnd) {
        await client.query('ROLLBACK');
        return { completed: false, milesAwarded: 0 };
      }
    }

    // Update progress
    const newCount = questProgress.currentCount + incrementBy;
    const nowCompleted = newCount >= quest.requirementCount;

    await client.query(
      `UPDATE quest_progress
      SET current_count = $3,
          completed = $4,
          completed_at = CASE WHEN $4 AND NOT completed THEN NOW() ELSE completed_at END,
          last_completed_at = CASE WHEN $4 THEN NOW() ELSE last_completed_at END,
          completion_count = CASE WHEN $4 THEN completion_count + 1 ELSE completion_count END,
          updated_at = NOW()
      WHERE account_id = $1 AND quest_id = $2`,
      [accountId, questId, newCount, nowCompleted]
    );

    let milesAwarded = 0;
    if (nowCompleted && !questProgress.completed) {
      // Award miles
      await addMiles(accountId, 'earn_quest_reward', quest.milesReward, `Quest completed: ${quest.name}`, {
        questId: quest.id,
      });
      milesAwarded = quest.milesReward;
    }

    await client.query('COMMIT');
    return { completed: nowCompleted, milesAwarded };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to update quest progress:', error);
    return null;
  } finally {
    client.release();
  }
}

// =====================================================
// REFERRAL OPERATIONS
// =====================================================

export async function createReferral(
  referrerAccountId: string,
  referredAccountId: string
): Promise<Referral | null> {
  try {
    const { rows } = await pool.query<Referral>(
      `INSERT INTO referrals (referrer_account_id, referred_account_id)
      VALUES ($1, $2)
      ON CONFLICT (referred_account_id) DO NOTHING
      RETURNING 
        id, referrer_account_id as "referrerAccountId", referred_account_id as "referredAccountId",
        status, rejection_reason as "rejectionReason",
        shopify_order_id as "shopifyOrderId", order_total_cents as "orderTotalCents",
        order_fulfilled_at as "orderFulfilledAt", buffer_ends_at as "bufferEndsAt",
        referrer_miles_credited as "referrerMilesCredited", referred_miles_credited as "referredMilesCredited",
        credited_at as "creditedAt", created_at as "createdAt"`,
      [referrerAccountId, referredAccountId]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Failed to create referral:', error);
    return null;
  }
}

export async function updateReferralOrderPlaced(
  referredAccountId: string,
  shopifyOrderId: string,
  orderTotalCents: number
): Promise<void> {
  await pool.query(
    `UPDATE referrals
    SET status = 'order_placed',
        shopify_order_id = $2,
        order_total_cents = $3,
        updated_at = NOW()
    WHERE referred_account_id = $1 AND status = 'pending'`,
    [referredAccountId, shopifyOrderId, orderTotalCents]
  );
}

export async function updateReferralFulfilled(
  shopifyOrderId: string
): Promise<void> {
  const bufferEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days
  await pool.query(
    `UPDATE referrals
    SET status = 'fulfilled',
        order_fulfilled_at = NOW(),
        buffer_ends_at = $2,
        updated_at = NOW()
    WHERE shopify_order_id = $1 AND status = 'order_placed'`,
    [shopifyOrderId, bufferEndsAt]
  );
}

export async function processReferralCredits(): Promise<void> {
  // Find referrals ready for credit
  const { rows } = await pool.query<Referral>(
    `SELECT 
      id, referrer_account_id as "referrerAccountId", referred_account_id as "referredAccountId"
    FROM referrals
    WHERE status = 'fulfilled' AND buffer_ends_at <= NOW()`
  );

  for (const referral of rows) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Credit referrer
      await addMiles(referral.referrerAccountId, 'earn_referral_bonus', 1000, 'Referral bonus: Friend completed purchase', {
        referralId: referral.id,
      });

      // Credit referred
      await addMiles(referral.referredAccountId, 'earn_referral_bonus', 500, 'Welcome bonus: Referred by a friend', {
        referralId: referral.id,
      });

      // Update referral status
      await client.query(
        `UPDATE referrals
        SET status = 'credited',
            referrer_miles_credited = 1000,
            referred_miles_credited = 500,
            credited_at = NOW(),
            updated_at = NOW()
        WHERE id = $1`,
        [referral.id]
      );

      // Update quest progress for referrer
      await updateQuestProgress(referral.referrerAccountId, 'send-postcard');

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Failed to process referral credit:', error);
    } finally {
      client.release();
    }
  }
}

// =====================================================
// WEBHOOK IDEMPOTENCY
// =====================================================

export async function recordWebhook(
  webhookId: string,
  topic: string,
  payload: Record<string, unknown>,
  shopifyOrderId?: string,
  shopifyCustomerId?: string
): Promise<boolean> {
  try {
    await pool.query(
      `INSERT INTO shopify_webhooks (webhook_id, topic, payload, shopify_order_id, shopify_customer_id)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (webhook_id) DO NOTHING`,
      [webhookId, topic, JSON.stringify(payload), shopifyOrderId, shopifyCustomerId]
    );
    return true;
  } catch {
    return false;
  }
}

export async function isWebhookProcessed(webhookId: string): Promise<boolean> {
  const { rows } = await pool.query(
    `SELECT processed FROM shopify_webhooks WHERE webhook_id = $1`,
    [webhookId]
  );
  return rows[0]?.processed || false;
}

export async function markWebhookProcessed(webhookId: string, error?: string): Promise<void> {
  await pool.query(
    `UPDATE shopify_webhooks
    SET processed = TRUE, processed_at = NOW(), error = $2
    WHERE webhook_id = $1`,
    [webhookId, error]
  );
}
