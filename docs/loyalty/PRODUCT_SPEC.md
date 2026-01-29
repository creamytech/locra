# LOCRA Atlas Loyalty System

## Complete Product Specification

---

## 1. SYSTEM OVERVIEW

### Brand Language

- **Currency**: Atlas Miles (not "points")
- **Collectibles**: Passport Stamps (not "badges")
- **Cart**: Suitcase (not "cart")
- **Access**: Portal Entry (not "early access")
- **Tiers**: Traveler ranks (Initiate → Voyager → Collector → Laureate)

### Core Mechanics

```
Portal → Atlas → Destinations → Artifacts → Suitcase
   ↓        ↓          ↓            ↓           ↓
 Entry   Journey    Stamps      Products     Checkout
```

---

## 2. TIER SYSTEM

### Tier Definitions

| Tier          | Requirement               | Miles Multiplier | Key Perks                                  |
| ------------- | ------------------------- | ---------------- | ------------------------------------------ |
| **Initiate**  | Entry                     | 1.0x             | Base earning                               |
| **Voyager**   | 1,000 miles               | 1.2x             | Lower shipping, 24h early access           |
| **Collector** | 5 stamps OR 5,000 miles   | 1.5x             | Members-only artifacts, postcards          |
| **Laureate**  | 15 stamps OR 15,000 miles | 2.0x             | Free shipping, 72h early access, concierge |

### Tier Perks Detail

**Initiate**

- Earn 1 mile per $1 spent
- Access to Travel Club signup
- Basic order tracking

**Voyager** (1,000 miles)

- 1.2x miles on all purchases
- Free shipping on orders $75+ (vs $100 standard)
- 24h Portal Entry before public drops
- Quarterly destination digest email

**Collector** (5 stamps OR 5,000 miles)

- 1.5x miles on all purchases
- Access to members-only artifacts
- Physical destination postcards with orders
- Birthday miles bonus (250 miles)
- Atlas Page digital collectibles

**Laureate** (15 stamps OR 15,000 miles)

- 2.0x miles on all purchases
- Free shipping always
- 72h Portal Entry before drops
- Concierge channel access
- Annual Portal Pass (skip queue credit)
- Surprise destination drops first
- Monogram credit once yearly

---

## 3. EARNING RULES

### Miles Earning

| Action              | Base Miles   | Notes                       |
| ------------------- | ------------ | --------------------------- |
| Purchase            | $1 = 1 mile  | Multiplied by tier          |
| First Purchase      | +100 bonus   | One-time                    |
| Profile Complete    | +50 miles    | Quest reward                |
| Birthday            | +250 miles   | Collector+ only             |
| Referral (referrer) | +1,000 miles | After fulfillment + 14 days |
| Referral (new)      | +500 miles   | After fulfillment + 14 days |
| Journal Read        | +10 miles    | Max 5/month                 |
| Quest Complete      | Varies       | See quest table             |

### Earning Calculation

```
final_miles = base_miles × tier_multiplier

Example: $150 order as Collector
= 150 × 1.5 = 225 miles
```

### Miles Expiration

- Miles expire 18 months from earning
- Tier status evaluated monthly
- Any purchase resets expiration clock

---

## 4. PASSPORT STAMPS

### Stamp Mechanics

- Each destination has exactly one unique stamp
- Buying ANY artifact from a destination collection earns its stamp
- Stamps are permanent (never expire)
- Stamps unlock hidden artifacts and Atlas Pages

### Stamp Unlock Rewards

| Stamps | Unlock                                       |
| ------ | -------------------------------------------- |
| 1      | "First Stamp" quest complete (+100 miles)    |
| 3      | "Atlas Explorer" quest complete (+250 miles) |
| 5      | Collector tier eligibility                   |
| 10     | "Worldly" badge, exclusive artifact access   |
| 15     | Laureate tier eligibility                    |
| 25     | "Cartographer" title, annual Portal Pass     |
| 50     | "Atlas Keeper" title, lifetime Laureate      |

### Destination Stamps (Current)

```
MEDITERRANEAN
├── Santorini (Cyclades)
├── Amalfi Coast (Mediterranean)
└── Côte d'Azur (coming soon)

ASIA & BEYOND
├── Kyoto (East Asia)
├── Bali (coming soon)
└── Rajasthan (coming soon)

NORTH AFRICA
├── Marrakech (North Africa)
├── Cairo (coming soon)
└── Fez (coming soon)
```

---

## 5. REWARD CATALOG

### Tier-Gated Rewards

| Reward                      | Cost        | Tier Required | Type            |
| --------------------------- | ----------- | ------------- | --------------- |
| Free Shipping Token         | 500 miles   | Initiate+     | Access          |
| Destination Postcard        | 750 miles   | Voyager+      | Physical        |
| Early Portal Entry Pass     | 1,000 miles | Voyager+      | Access          |
| Travel Club Artifact Unlock | 2,500 miles | Collector+    | Access          |
| Monogram Credit             | 3,500 miles | Collector+    | Credit          |
| Portal Pass Skip Queue      | 5,000 miles | Laureate      | Access          |
| $25 Atlas Credit            | 2,000 miles | Collector+    | Discount (rare) |
| $50 Atlas Credit            | 3,500 miles | Laureate      | Discount (rare) |

### Reward Rules

- Discount rewards: Max 1 per month per member
- Access rewards: Stack as desired
- Physical rewards: Ship with next order
- Tokens valid for 90 days

---

## 6. QUESTS

### Quest Definitions

| Quest              | Requirement          | Reward      | One-Time     |
| ------------------ | -------------------- | ----------- | ------------ |
| Pack Your Suitcase | Complete profile     | 50 miles    | Yes          |
| First Stamp        | Make first purchase  | 100 miles   | Yes          |
| Atlas Explorer     | Visit 3 destinations | 250 miles   | Yes          |
| Journal Keeper     | Read 2 journal posts | 75 miles    | Yes          |
| Send a Postcard    | Refer a friend       | 1,000 miles | No           |
| Collector's Path   | Earn 5 stamps        | 500 miles   | Yes          |
| Worldly Traveler   | Earn 10 stamps       | 1,000 miles | Yes          |
| Seasonal Voyager   | Purchase during drop | 150 miles   | No (1/drop)  |
| Return Journey     | Repeat purchase      | 100 miles   | No (1/month) |

### Quest Progress Tracking

- Progress saved incrementally
- Push notification on 80% progress
- Celebration on completion

---

## 7. REFERRAL SYSTEM

### Flow

```
1. Member generates unique referral link
2. New traveler clicks link → cookie set (30 days)
3. New traveler creates account
4. New traveler completes paid order
5. Order fulfilled + 14 day buffer
6. Both users credited miles
```

### Anti-Fraud Rules

- **Duplicate Address Block**: Same shipping address used by existing member
- **Payment Fingerprint**: Same card/PayPal used by existing member
- **IP Rate Limit**: Max 3 referrals from same IP per month
- **Self-Referral**: Email domain + name proximity check
- **Fulfillment Required**: Order must be marked fulfilled
- **Buffer Period**: 14 days post-fulfillment before credit
- **Return Clawback**: If order refunded, miles revoked

### Referral Rewards

- Referrer: +1,000 miles (after buffer)
- New Traveler: +500 miles (after buffer)

---

## 8. USER JOURNEY

### New Member Flow

```
1. Sign up for Travel Club (email capture)
2. Create account (Initiate tier)
3. Complete profile → "Pack Your Suitcase" quest
4. Browse Atlas destinations
5. Make first purchase → First stamp + miles
6. Accumulate miles → Tier upgrades
7. Redeem rewards → Enhanced experience
8. Refer friends → Grow community
```

### Passport Page Structure

```
┌─────────────────────────────────────────────────┐
│  YOUR ATLAS PASSPORT                            │
├─────────────────────────────────────────────────┤
│  ┌─────┐                                        │
│  │ 🌍  │  COLLECTOR                             │
│  │     │  7,450 Atlas Miles                     │
│  └─────┘  6 Passport Stamps                     │
│                                                 │
│  ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░ 74% to Laureate          │
├─────────────────────────────────────────────────┤
│  PASSPORT STAMPS                                │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐     │
│  │ 🏛️ │ │ 🍋 │ │ 🎋 │ │ 🏜️ │ │ ░░ │ │ ░░ │     │
│  │Sant│ │Amal│ │Kyot│ │Marr│ │????│ │????│     │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘     │
├─────────────────────────────────────────────────┤
│  ACTIVE QUESTS                                  │
│  ○ Atlas Explorer      2/3 destinations         │
│  ○ Journal Keeper      1/2 posts read           │
├─────────────────────────────────────────────────┤
│  AVAILABLE REWARDS                              │
│  • Free Shipping Token     500 miles  [Redeem]  │
│  • Destination Postcard    750 miles  [Redeem]  │
│  • Early Portal Entry    1,000 miles  [Redeem]  │
└─────────────────────────────────────────────────┘
```

---

## 9. REDEMPTION RULES

### Checkout Integration

```
1. Member views Suitcase (cart)
2. "Apply Reward" button visible
3. Available rewards shown in drawer
4. Select reward → Apply to order
5. Reward marked as "pending" until order paid
6. Order paid → Reward consumed
7. Order refunded → Reward restored
```

### Reward Application

- Free Shipping: Removes shipping cost
- Atlas Credit: Reduces order total
- Early Access: Auto-applied at drop time
- Monogram: Credit code generated

---

## 10. NOTIFICATION STRATEGY

### Email Triggers

- Welcome to Travel Club
- Tier upgrade celebration
- New stamp earned
- Miles expiring (30 days notice)
- Quest completed
- Reward available
- Referral success

### In-App Toasts

- Miles earned after purchase
- Quest progress update
- Tier threshold approaching
- New destination unlocked
