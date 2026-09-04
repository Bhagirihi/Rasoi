# Rasoi — Affiliate Links & Sponsor Setup Guide

Step-by-step guide to replace **mock** partner URLs with **real** tracked links, and how to **win sponsor deals** for native placements in the app.

**Current state:** Links in `utils/affiliate.ts` use placeholder IDs (`rasoi_india`, `rasoi_partner`). They open partner apps/sites but **do not pay** until you have approved partner programs and correct tracking.

---

## Table of contents

1. [Before you start](#1-before-you-start)
2. [Where links live in the codebase](#2-where-links-live-in-the-codebase)
3. [Quick commerce affiliates (Blinkit, Zepto, Instamart)](#3-quick-commerce-affiliates-blinkit-zepto-instamart)
4. [Food delivery affiliates (Zomato, Swiggy)](#4-food-delivery-affiliates-zomato-swiggy)
5. [App config (iOS / Android deep links)](#5-app-config-ios--android-deep-links)
6. [Attribution & analytics (required for payouts)](#6-attribution--analytics-required-for-payouts)
7. [Testing checklist](#7-testing-checklist)
8. [How to get sponsors](#8-how-to-get-sponsors)
9. [Updating sponsor content in the app](#9-updating-sponsor-content-in-the-app)
10. [Legal & disclosure (India)](#10-legal--disclosure-india)
11. [Launch checklist](#11-launch-checklist)

---

## 1. Before you start

| Item | Why |
|------|-----|
| **Published app or TestFlight / internal APK** | Partners want a working demo, not only Expo Go |
| **Privacy policy URL** | Required for store + partner reviews |
| **Business entity (optional early, needed later)** | Proprietorship / LLP for invoices & GST |
| **GSTIN** | Often required once revenue grows (>₹20L/year; confirm with CA) |
| **Analytics** | Firebase or PostHog — log `checkout_tap`, `partner_id`, `recipe_id` |
| **One-pager deck** | MAU, audience (home cooks, cities), screenshot of checkout flow |

**You do not need a custom backend on day one.** You need **approved partner links + tracking** (see [EARNINGS_POTENTIAL.md](./EARNINGS_POTENTIAL.md)).

---

## 2. Where links live in the codebase

| File | Purpose |
|------|---------|
| `utils/affiliate.ts` | **Main file to edit** — grocery checkout, food delivery, brand search |
| `constants/monetization.ts` | Partner labels, colors, disclosures, **sponsor card copy** |
| `components/AffiliateCheckoutModal.tsx` | Blinkit / Zepto / Instamart modal |
| `components/FoodDeliveryModal.tsx` | Zomato / Swiggy modal |
| `components/SponsorRail.tsx` | Tappable sponsor card → opens Blinkit search (today) |
| `components/BrandSponsor.tsx` | In-recipe brand → opens affiliate search |

**After you receive real URLs from partners**, update `utils/affiliate.ts` (examples in sections below).

---

## 3. Quick commerce affiliates (Blinkit, Zepto, Instamart)

### How Rasoi uses them today

User taps **Order** → app calls `openAffiliateCheckout(missingIngredients, partner)` → opens deep link or web fallback with ingredient names.

```ts
// utils/affiliate.ts — CURRENT (placeholder — replace after partnership)
blinkit: (items) =>
  `blinkit://cart/checkout?items=${items}&affiliate_id=rasoi_india&source=recipe_detail`,
```

### Blinkit

| Step | Action |
|------|--------|
| 1 | Search **“Blinkit partner program”** / **“Blinkit affiliate”** / contact via LinkedIn (Growth, Partnerships, Performance Marketing) |
| 2 | Pitch: *“Recipe app — user sees missing paneer, dal, etc. → one tap to Blinkit cart”* |
| 3 | Ask for: **affiliate ID**, **deep link format**, **web fallback URL**, **commission % or CPA**, **attribution window** (e.g. 7 days) |
| 4 | Replace placeholder in `PARTNER_URLS.blinkit` and `FALLBACK_URLS.blinkit` |

**Typical link patterns (confirm with Blinkit — these vary):**

```
Deep link:  blinkit://...  or https://blinkit.com/...?utm_source=rasoi&utm_campaign=...
Web:        https://blinkit.com/s/?q={items}&utm_source={your_id}
```

**Contact angles:** Business development email, Twitter/X DM to Blinkit marketing, warm intro via accelerator.

### Zepto

| Step | Action |
|------|--------|
| 1 | Reach **Zepto Partner / Brand / Growth** team (website careers → partnerships, or LinkedIn) |
| 2 | Same pitch as Blinkit; emphasize **10–15 min delivery** match with “cook tonight” |
| 3 | Get official **ref / campaign / affiliate** parameters |
| 4 | Update `PARTNER_URLS.zepto` and `FALLBACK_URLS.zepto` |

**Fallback today:** `https://www.zeptonow.com/search?query={items}`

### Instamart (Swiggy)

Instamart is Swiggy’s quick-commerce arm. Often negotiated **via Swiggy Instamart BD**, not a separate public affiliate signup.

| Step | Action |
|------|--------|
| 1 | Contact **Swiggy Instamart partnerships** (separate from restaurant Swiggy affiliate) |
| 2 | Ask for Instamart-specific deep links + tracking |
| 3 | Update `PARTNER_URLS.instamart` and Instamart web search URL |

**Note:** Current code uses `swiggy://instamart/...` — validate scheme with Swiggy docs before production.

### Alternative: affiliate networks (if direct BD is slow)

Some teams use networks that list grocery brands (availability in India changes often):

- **Cuelinks**, **vCommission**, **EarnKaro** (verify Blinkit/Zepto/Instamart offers live in dashboard)
- Trade-off: **lower commission**, easier start, less control over deep link format

If you use a network, they give you a **tracking URL template** — paste into `FALLBACK_URLS` and use web opens until deep links are approved.

### Code example after you get Blinkit tracking URL

```ts
// utils/affiliate.ts — example only; use exact format from Blinkit legal/partner team
const BLINKIT_AFFILIATE_ID = 'YOUR_APPROVED_ID';

const PARTNER_URLS: Record<AffiliatePartner, (items: string) => string> = {
  blinkit: (items) =>
    `https://blinkit.com/s/?q=${items}&utm_source=rasoi&utm_medium=affiliate&utm_campaign=missing_ingredients&partner_id=${BLINKIT_AFFiliate_ID}`,
  // ...
};
```

Prefer **https links** if deep link schema is undocumented — they work everywhere; partner app opens from web on mobile.

---

## 4. Food delivery affiliates (Zomato, Swiggy)

### How Rasoi uses them

Recipe screen → **Skip cooking?** → `openFoodDelivery(recipeTitle, 'zomato' | 'swiggy')`.

```ts
// utils/affiliate.ts — CURRENT
zomato: {
  web: (query) =>
    `https://www.zomato.com/search?q=${query}&utm_source=rasoi&utm_medium=affiliate`,
},
```

### Zomato

| Step | Action |
|------|--------|
| 1 | **Zomato Affiliate Program** — search “Zomato affiliate program India” / partner portals (Cuelinks, vCommission often list Zomato) |
| 2 | Or BD email to Zomato **performance marketing** with app demo |
| 3 | Get tracked URL for **restaurant / dish search**, not just homepage |
| 4 | Replace `FOOD_DELIVERY_URLS.zomato` deep + web |

**Also ask about:** coupon code `RASOI` for attribution if link tracking is weak.

### Swiggy (food, not Instamart)

| Step | Action |
|------|--------|
| 1 | Swiggy affiliate via networks or **Swiggy partner marketing** |
| 2 | Separate conversation from **Instamart grocery** — different teams |
| 3 | Update `FOOD_DELIVERY_URLS.swiggy` |

### Code example

```ts
const ZOMATO_AFFILIATE_PARAMS = 'utm_source=rasoi&utm_medium=affiliate&cid=YOUR_CID';

zomato: {
  web: (query) =>
    `https://www.zomato.com/search?q=${query}&${ZOMATO_AFFILIATE_PARAMS}`,
  deep: (query) =>
    `zomato://search?q=${query}&${ZOMATO_AFFILIATE_PARAMS}`,
},
```

---

## 5. App config (iOS / Android deep links)

Without this, `Linking.canOpenURL()` may fail and users only get web fallbacks.

### Expo `app.json` — iOS query schemes

Add under `expo.ios`:

```json
"ios": {
  "supportsTablet": true,
  "infoPlist": {
    "LSApplicationQueriesSchemes": [
      "blinkit",
      "zepto",
      "swiggy",
      "zomato"
    ]
  }
}
```

### Android

Most https fallbacks work without extra config. For custom schemes, confirm intent filters in partner docs. After adding iOS schemes, run **`npx expo prebuild`** (or EAS Build) — Expo Go may not reflect all deep link behavior.

---

## 6. Attribution & analytics (required for payouts)

Partners pay on **attributed orders**, not taps.

### Minimum (no custom backend)

1. **Firebase Analytics** (free) — log events:

   | Event | Params |
   |-------|--------|
   | `affiliate_checkout_tap` | `partner`, `recipe_id`, `item_count` |
   | `affiliate_checkout_open` | `partner`, `url_type` (deep/web) |
   | `food_delivery_tap` | `partner`, `recipe_title` |
   | `sponsor_rail_tap` | `brand`, `screen` |

2. Log events inside `openAffiliateCheckout` / `openFoodDelivery` in `utils/affiliate.ts`.

### Recommended when revenue matters

| Tool | Role |
|------|------|
| **AppsFlyer** or **Branch** | Mobile attribution, deferred deep links |
| **Partner postbacks** | Partner sends conversion to your webhook (needs Cloud Function later) |
| **Coupon codes** | Backup attribution (`RASOI10` on Zomato) |

### What to agree in each partner contract

- Commission (% or flat ₹ per order)
- **Cookie / attribution window** (e.g. 7 days)
- **Payment cycle** (monthly NET-30)
- **Minimum payout** threshold
- **Allowed placements** (recipe screen, push, etc.)
- **Disclosure text** (already in `REVENUE_DISCLOSURE`)

---

## 7. Testing checklist

After updating links:

- [ ] Tap **Blinkit** in checkout modal on real device with app installed → lands in search/cart with ingredients
- [ ] Repeat **Zepto**, **Instamart**
- [ ] Tap **Zomato / Swiggy** from Skip cooking modal → search shows recipe name
- [ ] Test **without** partner app installed → web fallback opens in browser
- [ ] iOS: deep link attempt works after `LSApplicationQueriesSchemes`
- [ ] Partner dashboard (or network) shows **clicks** within 24–48h
- [ ] Place a **test order** (if partner allows) and confirm attribution in 7–14 days

---

## 8. How to get sponsors

Sponsors = **paid native placements** in Rasoi (not affiliate %). Configured today in `constants/monetization.ts` as `HOME_SPONSOR`, `PANTRY_SPONSOR`, and in-recipe `BrandSponsor`.

### Inventory you can sell

| Placement | File / component | Best for |
|-----------|------------------|----------|
| Home feed rail (after 2nd recipe) | `HOME_SPONSOR` → `SponsorRail` on Home | FMCG, paneer, staples |
| Pantry screen rail | `PANTRY_SPONSOR` → Pantry | Dal, spices, oil brands |
| Saved tab (compact) | `HOME_SPONSOR` on Saved | Same as home |
| Recipe ingredient brand card | `recommendedBrand` in `data/mockRecipes.ts` | SKU-specific (Amul Paneer, etc.) |
| Settings partner strip | `PartnerStrip` in Settings | Logo recognition deals |

### Who to target (India)

> **Complete sponsor playbook (targets, contacts, templates, pricing, pitch):** [`docs/marketing/SPONSOR_OUTREACH_PLAYBOOK.md`](../../../docs/marketing/SPONSOR_OUTREACH_PLAYBOOK.md) · Extended brand list: [`SPONSOR_BRANDS_TO_CONTACT.md`](../../../docs/marketing/SPONSOR_BRANDS_TO_CONTACT.md)

**Tier 1 — easiest fit**

- **Amul**, **Mother Dairy**, **Britannia** — paneer, butter, dairy in recipes
- **Tata Sampann**, **Fortune**, **Aashirvaad** — atta, dal, staples (pantry screen)
- **MDH**, **Everest**, **Catch** — spices tied to recipe region
- **Regional:** iD Fresh, MTR, Haldiram (South); Patanjali / local atta brands (North)

**Tier 2 — quick commerce (co-marketing)**

- Blinkit / Zepto **brand days** — they fund placement if you drive checkout
- D2C food brands on quick commerce (Yoga Bar, True Elements)

**Tier 3 — appliances (later)**

- Prestige, Philips Airfryer — higher CPM, fewer impressions

### Pricing guide (pilot deals)

Use these as **starting asks** for early app (<10k MAU):

| Format | Suggested pilot (₹/month) |
|--------|---------------------------|
| Home rail only | ₹8,000 – ₹20,000 |
| Pantry rail only | ₹6,000 – ₹15,000 |
| Home + Pantry bundle | ₹15,000 – ₹35,000 |
| Exclusive category (e.g. only Amul paneer) | +20–40% premium |
| Recipe-level brand card (5 recipes) | ₹5,000 – ₹12,000 |

At **50k+ MAU**, re-price using CPM: `(impressions / 1000) × ₹80–150`.

### 8-step sponsor sales process

1. **Package** — PDF with 3 screenshots: Home rail, Pantry rail, Recipe brand card + “100% free app, no subscription” audience story.
2. **List 30 brands** — marketing manager on LinkedIn (“Brand Manager FMCG”, “Digital Head Amul”, etc.).
3. **Cold email / LinkedIn** (template below).
4. **Offer 2-week free pilot** — track taps in Firebase; share report.
5. **Convert to 3-month contract** — invoice + UPI/bank transfer.
6. **Deliver** — update `HOME_SPONSOR` / `PANTRY_SPONSOR` / recipe `recommendedBrand`.
7. **Report monthly** — impressions (analytics), taps, optional checkout downstream.
8. **Renew or upsell** bundle + more recipe integrations.

### Email template — FMCG sponsor

```
Subject: Sponsored placement in Rasoi — Indian recipe app (free, no ads)

Hi [Name],

I'm building Rasoi — a free Indian cooking app that helps home cooks decide
"what to cook tonight" and shop missing ingredients via Blinkit/Zepto.

We have native sponsor slots (not banner ads):
• Home screen sponsored rail (~[X] impressions/month at current MAU)
• Pantry "restock" placement
• Optional: recommended brand on recipes using [Paneer / Dal / Spices]

Would [Brand] be open to a 2-week pilot? I can share analytics on taps and
engagement.

Deck + APK: [link]

Best,
[Your name] | [phone] | [GST if applicable]
```

### Email template — quick commerce co-marketing

```
Subject: Partnership — Rasoi drives missing-ingredient checkout to [Blinkit/Zepto]

Hi [Name],

Rasoi shows users exactly which ingredients they're missing for a recipe,
then opens [Partner] checkout in one tap.

I'd love to integrate official affiliate/deep links and explore a co-branded
"sponsored essentials" slot for launch in [cities].

Can we schedule a 15-min demo?

Thanks,
[Your name]
```

### Where sponsors often come from (fastest paths)

1. **LinkedIn** direct to brand digital leads  
2. **Startup / D2C communities** — India Twitter, Indie Hackers India  
3. **Food influencers** intro to brand managers  
4. **Quick commerce BD** — they introduce FMCG brand budgets  
5. **Local kirana / regional brands** — cheaper pilots, good for proof  

---

## 9. Updating sponsor content in the app

### Home & Pantry rails

Edit `constants/monetization.ts`:

```ts
export const HOME_SPONSOR = {
  brandName: 'Amul',
  productLabel: 'Amul Paneer — tonight\'s dinner sorted',
  tagline: 'Fresh block paneer, perfect for curries',
  logoUrl: 'https://...',  // use CDN URL from brand or licensed asset
  cta: 'Shop now',
};
```

**Important:** Use **licensed logos** from the brand contract. Do not use random Wikipedia logos in production without permission.

### Recipe-level brand (ingredient sponsor)

In `data/mockRecipes.ts`, on an ingredient:

```ts
{
  name: 'Paneer',
  isStaple: false,
  recommendedBrand: {
    name: 'Amul Paneer',
    logo: 'https://cdn.example.com/amul-paneer.png',
  },
},
```

`BrandSponsor` opens affiliate search for that ingredient via `openBrandSearch`.

### Sponsor click destination

Today `SponsorRail` calls `openBrandSearch(brandName)` → Blinkit search. After sponsor deal, you may use:

- Brand’s **Amazon / Blinkit product URL** with tracking  
- Or keep search-based flow per contract  

Update `components/SponsorRail.tsx` if a sponsor pays for a **fixed product URL** instead of search.

---

## 10. Legal & disclosure (India)

Rasoi already shows:

- `FREE_APP_BADGE` — “100% free · No subscription”
- `REVENUE_DISCLOSURE` — affiliate fee disclosure
- `FOOD_DELIVERY_DISCLOSURE` — on food delivery modal
- **“Sponsored”** label on `SponsorRail` and `BrandSponsor`

**You should also:**

- Add **Privacy Policy** + **Terms** on website; link in Settings before scale  
- Label sponsored content clearly (**“Sponsored”** — already in UI)  
- Follow **ASCI** guidelines for digital advertising in India  
- Keep **screenshots of signed IO / email approval** for each sponsor logo  
- Register **GST** when required; issue invoices for sponsor fees  

Do not claim official partnership in store listing unless contract allows (“Amul partner” vs “Amul products suggested”).

---

## 11. Launch checklist

### Affiliate

- [ ] At least **one** grocery partner link live with real tracking ID  
- [ ] Zomato or Swiggy food link live (or disable food modal until approved)  
- [ ] `utils/affiliate.ts` placeholders removed  
- [ ] iOS `LSApplicationQueriesSchemes` added  
- [ ] Analytics events on every outbound partner open  
- [ ] Privacy policy published  

### Sponsors

- [ ] First pilot sponsor signed (even ₹5k/month)  
- [ ] Logo usage approved in writing  
- [ ] `HOME_SPONSOR` / `PANTRY_SPONSOR` updated with real assets  
- [ ] Monthly report template ready for renewals  

### Optional next steps

- [ ] Move partner URLs to **Firebase Remote Config** (change links without app update)  
- [ ] Add **AppsFlyer** when partner requires attributed installs/orders  
- [ ] See [EARNINGS_POTENTIAL.md](./EARNINGS_POTENTIAL.md) for revenue scenarios  

---

## Quick reference — files to touch

```
utils/affiliate.ts          ← partner URLs (affiliate)
constants/monetization.ts   ← sponsor copy + partner UI metadata
data/mockRecipes.ts         ← per-recipe recommendedBrand
app.json                    ← iOS deep link query schemes
components/SponsorRail.tsx  ← sponsor tap action (if custom URL)
docs/EARNINGS_POTENTIAL.md  ← revenue estimates
```

**Questions?** After your first partner reply, paste their URL template into `utils/affiliate.ts` and run the [testing checklist](#7-testing-checklist) on a physical device.
