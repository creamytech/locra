# LOCRA Atlas Loyalty System

## Build Checklist

---

## Phase 1: Infrastructure (Week 1)

### 1.1 Database Setup

- [x] Set up PostgreSQL database (Vercel Postgres, Supabase, or Neon)
- [x] Run schema migration (`docs/loyalty/SCHEMA.sql`)
- [x] Verify tier and quest seed data
- [x] Create database connection string in `.env.local`

```bash
# Add to .env.local
POSTGRES_URL="postgresql://..."
```

### 1.2 Install Dependencies

- [x] Install PostgreSQL client

```bash
pnpm add pg @types/pg
```

### 1.3 Shopify Webhook Setup

- [x] Create webhook secret and add to `.env.local`
- [ ] Register webhooks in Shopify Admin → Settings → Notifications

```bash
# Add to .env.local
SHOPIFY_WEBHOOK_SECRET="your-webhook-secret"
```

Required webhooks:
| Topic | Endpoint |
|-------|----------|
| `orders/paid` | `/api/webhooks/orders/paid` |
| `orders/fulfilled` | `/api/webhooks/orders/fulfilled` |
| `refunds/create` | `/api/webhooks/orders/refunded` |
| `customers/create` | `/api/webhooks/customers/create` |

---

## Phase 2: API Routes (Week 1-2)

### 2.1 Create API Route Files

- [x] `app/api/loyalty/status/route.ts` - GET member status
- [x] `app/api/loyalty/redeem/route.ts` - POST redeem reward
- [ ] `app/api/loyalty/profile/route.ts` - PATCH update profile
- [x] `app/api/loyalty/referral/route.ts` - POST claim referral
- [x] `app/api/loyalty/earn/route.ts` - POST earn miles
- [x] `app/api/webhooks/orders/paid/route.ts`
- [x] `app/api/webhooks/orders/fulfilled/route.ts`
- [x] `app/api/webhooks/orders/refunded/route.ts`
- [x] `app/api/webhooks/customers/create/route.ts`
- [x] `app/api/cron/loyalty/route.ts` - Process pending referrals & expire miles

### 2.2 Example Route Implementation

```typescript
// app/api/loyalty/status/route.ts
import { NextRequest } from "next/server";
import { handleGetMemberStatus } from "@/lib/loyalty/api";

export async function GET(req: NextRequest) {
  return handleGetMemberStatus(req);
}
```

---

## Phase 3: Shopify Integration (Week 2)

### 3.1 Product Tagging

- [ ] Add `destination` metafield to products in Shopify
- [ ] Tag products with destination handle (e.g., `santorini`, `amalfi`)

### 3.2 Discount Code Integration

For credit-type rewards, implement Shopify Admin API calls:

- [ ] Create price rules for redeemed credits
- [ ] Generate unique discount codes
- [ ] Apply to checkout

```typescript
// Example: Create discount code via Admin API
async function createDiscountCode(amount: number, redemptionId: string) {
  // Call Shopify Admin API to create price rule + discount code
}
```

### 3.3 Customer Account Integration

- [ ] Add loyalty data to Shopify customer metafields (optional)
- [ ] Sync tier status for segmentation

---

## Phase 4: Frontend Integration (Week 2-3)

### 4.1 Passport Page

- [x] Create `app/(portal)/passport/page.tsx`
- [x] Fetch member status from API via `useLoyalty` hook
- [x] Render PassportPage component with tabs (Overview, Stamps, Quests)

### 4.2 Suitcase (Cart) Integration

- [x] Add CartLoyaltyBanner to cart drawer
- [x] Show miles to be earned on purchase
- [x] Created SuitcasePerks component for applied rewards

### 4.3 Toast Notifications

- [x] Created MilesEarnedToast component
- [x] Created TierUpgradeModal component
- [x] Created MilesEarnedCelebration for order confirmation

### 4.4 Account Navigation

- [x] Add "Passport" link to mobile navigation menu
- [x] Created AccountWidget for nav (tier badge + miles)

### 4.5 Product Page Integration

- [x] Added ProductMilesBanner showing miles on product pages
- [x] Created TravelClubBanner promotional component (hero/card/inline)

### 4.6 Travel Club Page

- [x] Created comprehensive loyalty program showcase page
- [x] Tier progression visualization
- [x] Rewards catalog preview

---

## Phase 5: Referral System (Week 3)

### 5.1 Referral Link Generation

- [x] Create shareable referral link component (`ReferralShareCard`)
- [x] Track referral code in URL params (`useReferralTracking` hook)
- [x] Store referral cookie (30 days) via `ReferralProvider`
- [x] Created referral landing page `/ref/[code]`
- [x] Referral banner for referred visitors (`ReferralBanner`)

### 5.2 Referral Claim & Attribution

- [x] `ReferralClaimForm` component for manual code entry
- [x] `ReferralWidgetCompact` for passport page
- [x] Backend API for claiming referrals (`/api/loyalty/referral`)
- [x] Referral tracking in database (referrals table)

### 5.3 Referral Credit Processing

- [x] Set up Vercel cron for `/api/cron/loyalty` (processes referrals daily)
- [x] Buffer period for referral credits (7 days after delivery)
- [x] Referrer gets 1,000 miles, referred gets 500 miles

### 5.4 Fraud Prevention (Not Yet Implemented)

- [ ] Implement address deduplication check
- [ ] Implement payment fingerprint check
- [ ] Add IP rate limiting

---

## Phase 6: Testing & QA (Week 3-4)

### 6.1 Unit Tests

- [ ] Test miles earning calculation
- [ ] Test tier determination logic
- [ ] Test stamp deduplication
- [ ] Test referral fraud checks

### 6.2 Integration Tests

- [ ] Test webhook processing end-to-end
- [ ] Test reward redemption flow
- [ ] Test referral credit flow

### 6.3 Manual QA

- [ ] Complete purchase flow
- [ ] Verify miles credited
- [ ] Verify stamps awarded
- [ ] Test tier upgrade
- [ ] Test reward redemption
- [ ] Test referral flow

---

## Phase 7: Launch Prep (Week 4)

### 7.1 Data Migration (if existing customers)

- [ ] Create loyalty accounts for existing customers
- [ ] Backfill miles from order history (optional)

### 7.2 Email Templates

- [ ] Welcome to Travel Club
- [ ] Tier upgrade celebration
- [ ] Miles expiring soon (30 days notice)
- [ ] Quest completed
- [ ] Referral success

### 7.3 Documentation

- [ ] Create FAQ for customers
- [ ] Update Terms of Service
- [ ] Create program rules page

### 7.4 Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Set up webhook failure alerts
- [ ] Monitor miles ledger for anomalies

---

## Quick Start Guide

### Minimal Viable Launch

For fastest launch, implement in this order:

1. **Database** - Set up Postgres, run schema
2. **Webhooks** - `orders/paid` only (earn miles)
3. **API** - `/loyalty/status` endpoint
4. **UI** - PassportPage with tier progress
5. **Stamps** - Add stamp earning on purchase

This gives you:

- ✅ Miles earning on purchase
- ✅ Tier progression
- ✅ Passport stamps
- ✅ Member status page

Add later:

- Reward redemption
- Quests
- Referrals
- Email notifications

---

## File Structure

```
lib/loyalty/
├── types.ts          # TypeScript types
├── db.ts             # Database operations
├── api.ts            # API handlers
├── webhooks.ts       # Webhook handlers
└── index.ts          # Exports

components/loyalty/
├── TierProgressBar.tsx
├── StampGrid.tsx
├── RewardsDrawer.tsx
├── PassportPage.tsx
├── SuitcasePerks.tsx
└── index.ts

app/api/
├── loyalty/
│   ├── status/route.ts
│   ├── redeem/route.ts
│   └── profile/route.ts
├── webhooks/
│   └── orders/
│       ├── paid/route.ts
│       ├── fulfilled/route.ts
│       └── refunded/route.ts
└── cron/
    ├── referrals/route.ts
    └── expire-miles/route.ts

docs/loyalty/
├── PRODUCT_SPEC.md
├── SCHEMA.sql
└── BUILD_CHECKLIST.md
```

---

## Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."

# Shopify
SHOPIFY_WEBHOOK_SECRET="..."
SHOPIFY_ADMIN_ACCESS_TOKEN="..."  # For discount code creation

# Optional
SENTRY_DSN="..."
```

---

## Success Metrics

Track these KPIs post-launch:

- **Enrollment Rate**: % of customers who create loyalty accounts
- **Engagement Rate**: % of members who check passport monthly
- **Redemption Rate**: % of earned miles redeemed
- **Stamp Completion**: Average stamps per member
- **Tier Distribution**: % at each tier
- **Referral Success Rate**: % of referrals that complete purchase
- **Repeat Purchase Rate**: Impact on returning customers
