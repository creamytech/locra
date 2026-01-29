-- LOCRA Atlas Loyalty System
-- Database Schema (PostgreSQL)
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TIERS
-- Static tier definitions
-- =====================================================
CREATE TABLE tiers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  miles_threshold INTEGER NOT NULL DEFAULT 0,
  stamps_threshold INTEGER NOT NULL DEFAULT 0,
  miles_multiplier DECIMAL(3,2) NOT NULL DEFAULT 1.00,
  shipping_threshold_cents INTEGER, -- NULL = free always
  early_access_hours INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  perks JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed tiers
INSERT INTO tiers (id, name, display_name, miles_threshold, stamps_threshold, miles_multiplier, shipping_threshold_cents, early_access_hours, sort_order, perks) VALUES
('initiate', 'initiate', 'Initiate', 0, 0, 1.00, 10000, 0, 0, '["Base earning rate", "Travel Club access"]'),
('voyager', 'voyager', 'Voyager', 1000, 0, 1.20, 7500, 24, 1, '["1.2x miles", "Lower shipping threshold", "24h early Portal Entry"]'),
('collector', 'collector', 'Collector', 5000, 5, 1.50, 5000, 24, 2, '["1.5x miles", "Members-only artifacts", "Destination postcards", "Birthday bonus"]'),
('laureate', 'laureate', 'Laureate', 15000, 15, 2.00, 0, 72, 3, '["2x miles", "Free shipping always", "72h early Portal Entry", "Concierge channel", "Annual Portal Pass"]');

-- =====================================================
-- LOYALTY ACCOUNTS
-- One per Shopify customer
-- =====================================================
CREATE TABLE loyalty_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shopify_customer_id VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  
  -- Current state (denormalized for performance)
  current_tier_id VARCHAR(50) NOT NULL DEFAULT 'initiate' REFERENCES tiers(id),
  lifetime_miles INTEGER NOT NULL DEFAULT 0,
  available_miles INTEGER NOT NULL DEFAULT 0,
  stamp_count INTEGER NOT NULL DEFAULT 0,
  
  -- Profile completion
  profile_completed BOOLEAN NOT NULL DEFAULT FALSE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  birthday DATE,
  preferred_destinations TEXT[], -- array of destination handles
  
  -- Referral
  referral_code VARCHAR(20) UNIQUE,
  referred_by_account_id UUID REFERENCES loyalty_accounts(id),
  referral_eligible BOOLEAN NOT NULL DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tier_evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_loyalty_accounts_shopify_id ON loyalty_accounts(shopify_customer_id);
CREATE INDEX idx_loyalty_accounts_email ON loyalty_accounts(email);
CREATE INDEX idx_loyalty_accounts_referral_code ON loyalty_accounts(referral_code);
CREATE INDEX idx_loyalty_accounts_tier ON loyalty_accounts(current_tier_id);

-- =====================================================
-- MILES LEDGER
-- Append-only transaction log
-- =====================================================
CREATE TYPE miles_transaction_type AS ENUM (
  'earn_purchase',
  'earn_referral_bonus',
  'earn_quest_reward',
  'earn_birthday_bonus',
  'earn_signup_bonus',
  'earn_adjustment',
  'redeem_reward',
  'expire',
  'refund_clawback',
  'referral_clawback'
);

CREATE TABLE miles_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES loyalty_accounts(id),
  
  transaction_type miles_transaction_type NOT NULL,
  miles_amount INTEGER NOT NULL, -- positive = credit, negative = debit
  
  -- Context
  description TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  
  -- Idempotency
  idempotency_key VARCHAR(255) UNIQUE,
  
  -- Source references
  shopify_order_id VARCHAR(100),
  shopify_order_name VARCHAR(50),
  reward_redemption_id UUID,
  quest_id VARCHAR(100),
  referral_id UUID,
  
  -- Expiration tracking
  expires_at TIMESTAMPTZ, -- NULL = never expires
  expired BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Tier at time of transaction
  tier_at_transaction VARCHAR(50),
  multiplier_applied DECIMAL(3,2),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_miles_ledger_account ON miles_ledger(account_id);
CREATE INDEX idx_miles_ledger_order ON miles_ledger(shopify_order_id);
CREATE INDEX idx_miles_ledger_created ON miles_ledger(created_at);
CREATE INDEX idx_miles_ledger_expires ON miles_ledger(expires_at) WHERE expires_at IS NOT NULL AND NOT expired;
CREATE INDEX idx_miles_ledger_idempotency ON miles_ledger(idempotency_key);

-- =====================================================
-- DESTINATIONS
-- Destination registry for stamps
-- =====================================================
CREATE TABLE destinations (
  id VARCHAR(50) PRIMARY KEY, -- e.g., "santorini"
  handle VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  region VARCHAR(100) NOT NULL,
  
  -- Stamp visual
  stamp_emoji VARCHAR(10),
  stamp_image_url TEXT,
  stamp_color VARCHAR(7), -- hex color
  
  -- Metadata
  coordinates VARCHAR(50),
  tagline VARCHAR(200),
  
  -- Status
  active BOOLEAN NOT NULL DEFAULT TRUE,
  launch_date DATE,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed destinations
INSERT INTO destinations (id, handle, name, region, stamp_emoji, stamp_color, coordinates, tagline) VALUES
('santorini', 'santorini', 'Santorini', 'Cyclades', '🏛️', '#5B9BD5', '36.3932° N, 25.4615° E', 'The Caldera''s Silence'),
('amalfi', 'amalfi', 'Amalfi Coast', 'Mediterranean', '🍋', '#FFD966', '40.6340° N, 14.6027° E', 'Vertical Stone and Citrus'),
('kyoto', 'kyoto', 'Kyoto', 'East Asia', '🎋', '#70AD47', '35.0116° N, 135.7681° E', 'The Bamboo Path'),
('marrakech', 'marrakech', 'Marrakech', 'North Africa', '🏜️', '#C65911', '31.6295° N, 7.9811° W', 'Ochre Walls and Shadows');

-- =====================================================
-- STAMPS LEDGER
-- Passport stamps earned
-- =====================================================
CREATE TABLE stamps_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES loyalty_accounts(id),
  destination_id VARCHAR(50) NOT NULL REFERENCES destinations(id),
  
  -- Source
  shopify_order_id VARCHAR(100) NOT NULL,
  shopify_order_name VARCHAR(50),
  
  -- Idempotency (one stamp per destination per account)
  UNIQUE(account_id, destination_id),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_stamps_ledger_account ON stamps_ledger(account_id);

-- =====================================================
-- REWARDS
-- Reward catalog definitions
-- =====================================================
CREATE TYPE reward_type AS ENUM (
  'free_shipping',
  'early_access',
  'postcard',
  'artifact_unlock',
  'monogram_credit',
  'portal_pass',
  'atlas_credit'
);

CREATE TABLE rewards (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  reward_type reward_type NOT NULL,
  
  -- Cost
  miles_cost INTEGER NOT NULL,
  
  -- Eligibility
  min_tier_id VARCHAR(50) NOT NULL DEFAULT 'initiate' REFERENCES tiers(id),
  
  -- Limits
  max_per_month INTEGER, -- NULL = unlimited
  is_rare BOOLEAN NOT NULL DEFAULT FALSE, -- rare items have stricter limits
  
  -- For credit-type rewards
  credit_amount_cents INTEGER,
  
  -- Status
  active BOOLEAN NOT NULL DEFAULT TRUE,
  
  -- Display
  sort_order INTEGER NOT NULL DEFAULT 0,
  icon VARCHAR(50),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed rewards
INSERT INTO rewards (id, name, description, reward_type, miles_cost, min_tier_id, max_per_month, credit_amount_cents, sort_order, icon) VALUES
('free-shipping', 'Free Shipping Token', 'Removes shipping cost from your next order', 'free_shipping', 500, 'initiate', NULL, NULL, 1, 'package'),
('postcard', 'Destination Postcard', 'A collectible postcard shipped with your next order', 'postcard', 750, 'voyager', 2, NULL, 2, 'mail'),
('early-access', 'Early Portal Entry Pass', '24h early access to the next destination drop', 'early_access', 1000, 'voyager', NULL, NULL, 3, 'clock'),
('artifact-unlock', 'Travel Club Artifact Unlock', 'Access to a members-only artifact', 'artifact_unlock', 2500, 'collector', 1, NULL, 4, 'lock-open'),
('monogram', 'Monogram Credit', 'Personalization credit for select artifacts', 'monogram_credit', 3500, 'collector', 1, 2500, 5, 'pen-tool'),
('portal-pass', 'Portal Pass Skip Queue', 'Skip the queue on high-demand drops', 'portal_pass', 5000, 'laureate', 1, NULL, 6, 'zap'),
('credit-25', '$25 Atlas Credit', 'Store credit applied to your next order', 'atlas_credit', 2000, 'collector', 1, 2500, 7, 'credit-card'),
('credit-50', '$50 Atlas Credit', 'Store credit applied to your next order', 'atlas_credit', 3500, 'laureate', 1, 5000, 8, 'credit-card');

-- =====================================================
-- REDEMPTIONS
-- Reward redemption records
-- =====================================================
CREATE TYPE redemption_status AS ENUM (
  'pending',    -- Selected, not yet applied
  'applied',    -- Applied to an order
  'consumed',   -- Order completed
  'cancelled',  -- User cancelled
  'expired',    -- Not used within validity period
  'refunded'    -- Order refunded, reward restored
);

CREATE TABLE redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES loyalty_accounts(id),
  reward_id VARCHAR(50) NOT NULL REFERENCES rewards(id),
  
  -- Status
  status redemption_status NOT NULL DEFAULT 'pending',
  
  -- Miles deducted
  miles_deducted INTEGER NOT NULL,
  
  -- Application
  shopify_order_id VARCHAR(100),
  shopify_discount_code VARCHAR(50),
  
  -- Validity
  valid_until TIMESTAMPTZ NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  applied_at TIMESTAMPTZ,
  consumed_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ
);

CREATE INDEX idx_redemptions_account ON redemptions(account_id);
CREATE INDEX idx_redemptions_status ON redemptions(status);
CREATE INDEX idx_redemptions_order ON redemptions(shopify_order_id);

-- =====================================================
-- QUESTS
-- Quest definitions
-- =====================================================
CREATE TABLE quests (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  
  -- Reward
  miles_reward INTEGER NOT NULL,
  
  -- Requirements
  requirement_type VARCHAR(50) NOT NULL, -- 'profile', 'purchase', 'destinations', 'journal', 'referral'
  requirement_count INTEGER NOT NULL DEFAULT 1,
  
  -- Repeatability
  is_repeatable BOOLEAN NOT NULL DEFAULT FALSE,
  cooldown_days INTEGER, -- for repeatable quests
  
  -- Status
  active BOOLEAN NOT NULL DEFAULT TRUE,
  
  -- Display
  sort_order INTEGER NOT NULL DEFAULT 0,
  icon VARCHAR(50),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed quests
INSERT INTO quests (id, name, description, requirement_type, requirement_count, miles_reward, is_repeatable, cooldown_days, sort_order, icon) VALUES
('pack-suitcase', 'Pack Your Suitcase', 'Complete your traveler profile', 'profile', 1, 50, FALSE, NULL, 1, 'user-check'),
('first-stamp', 'First Stamp', 'Make your first purchase and earn your first stamp', 'purchase', 1, 100, FALSE, NULL, 2, 'stamp'),
('atlas-explorer', 'Atlas Explorer', 'Purchase from 3 different destinations', 'destinations', 3, 250, FALSE, NULL, 3, 'map'),
('journal-keeper', 'Journal Keeper', 'Read 2 journal posts', 'journal', 2, 75, FALSE, NULL, 4, 'book-open'),
('send-postcard', 'Send a Postcard', 'Refer a friend who completes a purchase', 'referral', 1, 1000, TRUE, NULL, 5, 'send'),
('collectors-path', 'Collector''s Path', 'Earn 5 passport stamps', 'stamps', 5, 500, FALSE, NULL, 6, 'award'),
('worldly-traveler', 'Worldly Traveler', 'Earn 10 passport stamps', 'stamps', 10, 1000, FALSE, NULL, 7, 'globe'),
('seasonal-voyager', 'Seasonal Voyager', 'Purchase during a destination drop', 'drop_purchase', 1, 150, TRUE, 90, 8, 'calendar'),
('return-journey', 'Return Journey', 'Make a repeat purchase', 'repeat_purchase', 2, 100, TRUE, 30, 9, 'repeat');

-- =====================================================
-- QUEST PROGRESS
-- User progress on quests
-- =====================================================
CREATE TABLE quest_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES loyalty_accounts(id),
  quest_id VARCHAR(50) NOT NULL REFERENCES quests(id),
  
  -- Progress
  current_count INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  
  -- For repeatable quests
  last_completed_at TIMESTAMPTZ,
  completion_count INTEGER NOT NULL DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(account_id, quest_id)
);

CREATE INDEX idx_quest_progress_account ON quest_progress(account_id);
CREATE INDEX idx_quest_progress_completed ON quest_progress(completed) WHERE NOT completed;

-- =====================================================
-- REFERRALS
-- Referral tracking
-- =====================================================
CREATE TYPE referral_status AS ENUM (
  'pending',      -- Link clicked, account created
  'order_placed', -- Order placed but not fulfilled
  'fulfilled',    -- Order fulfilled, in buffer period
  'credited',     -- Miles credited to both
  'rejected',     -- Failed fraud check
  'clawback'      -- Order refunded, miles clawed back
);

CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Parties
  referrer_account_id UUID NOT NULL REFERENCES loyalty_accounts(id),
  referred_account_id UUID NOT NULL REFERENCES loyalty_accounts(id),
  
  -- Status
  status referral_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  
  -- Order details
  shopify_order_id VARCHAR(100),
  order_total_cents INTEGER,
  order_fulfilled_at TIMESTAMPTZ,
  
  -- Buffer tracking
  buffer_ends_at TIMESTAMPTZ,
  
  -- Credits
  referrer_miles_credited INTEGER,
  referred_miles_credited INTEGER,
  credited_at TIMESTAMPTZ,
  
  -- Fraud checks
  fraud_checks JSONB NOT NULL DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(referred_account_id) -- One referral per new account
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_account_id);
CREATE INDEX idx_referrals_status ON referrals(status);
CREATE INDEX idx_referrals_buffer ON referrals(buffer_ends_at) WHERE status = 'fulfilled';

-- =====================================================
-- FRAUD PREVENTION
-- Track suspicious patterns
-- =====================================================
CREATE TABLE fraud_signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- What we're tracking
  signal_type VARCHAR(50) NOT NULL, -- 'address', 'payment', 'ip', 'email_domain'
  signal_value TEXT NOT NULL,
  
  -- Context
  account_id UUID REFERENCES loyalty_accounts(id),
  referral_id UUID REFERENCES referrals(id),
  
  -- Count
  occurrence_count INTEGER NOT NULL DEFAULT 1,
  
  -- Timestamps
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fraud_signals_type_value ON fraud_signals(signal_type, signal_value);

-- =====================================================
-- SHOPIFY WEBHOOK LOG
-- Idempotency and debugging
-- =====================================================
CREATE TABLE shopify_webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  webhook_id VARCHAR(100) UNIQUE NOT NULL,
  topic VARCHAR(100) NOT NULL,
  
  -- Payload
  shopify_order_id VARCHAR(100),
  shopify_customer_id VARCHAR(100),
  payload JSONB NOT NULL,
  
  -- Processing
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  error TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shopify_webhooks_topic ON shopify_webhooks(topic);
CREATE INDEX idx_shopify_webhooks_order ON shopify_webhooks(shopify_order_id);
CREATE INDEX idx_shopify_webhooks_processed ON shopify_webhooks(processed) WHERE NOT processed;

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Calculate available miles for an account
CREATE OR REPLACE FUNCTION calculate_available_miles(p_account_id UUID)
RETURNS INTEGER AS $$
  SELECT COALESCE(SUM(miles_amount), 0)::INTEGER
  FROM miles_ledger
  WHERE account_id = p_account_id
    AND NOT expired
    AND (expires_at IS NULL OR expires_at > NOW());
$$ LANGUAGE SQL STABLE;

-- Calculate stamp count for an account
CREATE OR REPLACE FUNCTION calculate_stamp_count(p_account_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(DISTINCT destination_id)::INTEGER
  FROM stamps_ledger
  WHERE account_id = p_account_id;
$$ LANGUAGE SQL STABLE;

-- Determine tier based on miles and stamps
CREATE OR REPLACE FUNCTION determine_tier(p_lifetime_miles INTEGER, p_stamp_count INTEGER)
RETURNS VARCHAR(50) AS $$
DECLARE
  v_tier_id VARCHAR(50);
BEGIN
  SELECT id INTO v_tier_id
  FROM tiers
  WHERE (p_lifetime_miles >= miles_threshold OR p_stamp_count >= stamps_threshold)
  ORDER BY sort_order DESC
  LIMIT 1;
  
  RETURN COALESCE(v_tier_id, 'initiate');
END;
$$ LANGUAGE plpgsql STABLE;

-- Update account denormalized fields
CREATE OR REPLACE FUNCTION update_account_stats(p_account_id UUID)
RETURNS VOID AS $$
DECLARE
  v_available_miles INTEGER;
  v_stamp_count INTEGER;
  v_tier_id VARCHAR(50);
BEGIN
  v_available_miles := calculate_available_miles(p_account_id);
  v_stamp_count := calculate_stamp_count(p_account_id);
  
  SELECT determine_tier(lifetime_miles, v_stamp_count) INTO v_tier_id
  FROM loyalty_accounts WHERE id = p_account_id;
  
  UPDATE loyalty_accounts
  SET 
    available_miles = v_available_miles,
    stamp_count = v_stamp_count,
    current_tier_id = v_tier_id,
    updated_at = NOW()
  WHERE id = p_account_id;
END;
$$ LANGUAGE plpgsql;

-- Generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS VARCHAR(20) AS $$
DECLARE
  v_code VARCHAR(20);
  v_exists BOOLEAN;
BEGIN
  LOOP
    v_code := 'ATLAS-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
    SELECT EXISTS(SELECT 1 FROM loyalty_accounts WHERE referral_code = v_code) INTO v_exists;
    EXIT WHEN NOT v_exists;
  END LOOP;
  RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-generate referral code on account creation
CREATE OR REPLACE FUNCTION trigger_generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_loyalty_accounts_referral_code
  BEFORE INSERT ON loyalty_accounts
  FOR EACH ROW
  EXECUTE FUNCTION trigger_generate_referral_code();

-- Update stats after miles ledger changes
CREATE OR REPLACE FUNCTION trigger_update_stats_on_miles()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_account_stats(NEW.account_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_miles_ledger_update_stats
  AFTER INSERT ON miles_ledger
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_stats_on_miles();

-- Update stats after stamp ledger changes
CREATE OR REPLACE FUNCTION trigger_update_stats_on_stamp()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_account_stats(NEW.account_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_stamps_ledger_update_stats
  AFTER INSERT ON stamps_ledger
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_stats_on_stamp();
