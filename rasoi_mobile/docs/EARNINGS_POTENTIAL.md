# Rasoi — Earnings Potential (India)

**App model:** Free forever · No subscription · Revenue from affiliate checkout, food-delivery referrals, and native sponsor slots.

**Last updated:** June 2026  
**Status of build:** Monetization UI is live; partner links are **mock placeholders** until real affiliate / brand deals are signed. **Current revenue: ₹0.**

---

## Executive summary

| Scenario | Monthly active users (MAU) | Realistic gross revenue / month | Notes |
|----------|---------------------------|----------------------------------|-------|
| **Pre-partnership (today)** | Any | **₹0** | Mock deep links do not pay |
| **Early launch** | 1,000–5,000 | **₹5,000 – ₹35,000** | Needs 1–2 grocery or delivery partnerships |
| **Growing** | 10,000–50,000 | **₹40,000 – ₹3,50,000** | Sponsors + affiliates both active |
| **Scale** | 1,00,000+ | **₹4,00,000 – ₹15,00,000+** | Requires retention, SEO/ASO, and sales team |

**Annual range (moderate path, Year 2):** roughly **₹5 lakh – ₹25 lakh** gross before costs, if you close partners and reach ~15k–30k MAU with healthy checkout conversion.

This is an **estimate**, not a guarantee. Actual numbers depend on signed contracts, attribution, city mix, and how often users complete orders after leaving Rasoi.

---

## How Rasoi makes money (5 streams)

| # | Stream | Where in app | Partner examples | Typical deal type |
|---|--------|--------------|------------------|-------------------|
| 1 | **Quick-commerce affiliate** | Home, Pantry, recipe missing items, checkout modal | Blinkit, Zepto, Instamart | % of order value or CPA per attributed order |
| 2 | **Food delivery affiliate** | Recipe “Skip cooking?” modal, Zomato/Swiggy strip | Zomato, Swiggy | CPA or % on attributed food orders |
| 3 | **Native sponsor rails** | Home, Pantry, Saved, in-recipe brand cards | Amul, Tata Sampann, regional brands | Fixed CPM / monthly slot fee |
| 4 | **Ingredient brand placement** | Recipe detail (`BrandSponsor`) | Paneer, dal, spice brands | CPC or fixed sponsorship |
| 5 | **Supplemental ads (optional)** | Banners if added later | Google AdMob | eCPM — **not primary** for this product |

Primary revenue should stay **affiliate + sponsors**, not display ads, to protect UX and trust (“100% free” positioning).

---

## Funnel assumptions (used in math below)

These are **industry-style benchmarks** for a cooking + grocery intent app in India. Tune them once you have analytics.

| Metric | Conservative | Moderate | Optimistic |
|--------|--------------|----------|------------|
| MAU → opens recipe detail | 4× / month | 6× / month | 10× / month |
| Recipe views → grocery checkout tap | 8% | 12% | 18% |
| Checkout tap → completed partner order | 25% | 35% | 45% |
| Avg grocery order value (AOV) | ₹450 | ₹650 | ₹850 |
| Grocery commission (effective) | 2.5% | 4% | 5% |
| Recipe views → food delivery tap | 3% | 6% | 10% |
| Food tap → completed order | 20% | 30% | 40% |
| Avg food order value | ₹350 | ₹450 | ₹550 |
| Food commission (effective) | 2% | 3% | 4% |
| Sponsor fill + effective CPM | ₹40 | ₹80 | ₹150 |
| Sponsor impressions / MAU / month | 8 | 15 | 25 |

**Example (moderate, 10,000 MAU):**

- Recipe views ≈ 10,000 × 6 = **60,000** / month  
- Grocery orders ≈ 60,000 × 12% × 35% ≈ **2,520 orders**  
- Grocery revenue ≈ 2,520 × ₹650 × 4% ≈ **₹65,520** / month  
- Food orders ≈ 60,000 × 6% × 30% ≈ **1,080 orders**  
- Food revenue ≈ 1,080 × ₹450 × 3% ≈ **₹14,580** / month  
- Sponsors ≈ 10,000 × 15 impr × ₹80 CPM / 1000 ≈ **₹12,000** / month  

**Total moderate @ 10k MAU ≈ ₹92,000 / month (~₹11 lakh / year gross)**

---

## Revenue by MAU (moderate assumptions)

| MAU | Grocery affiliate | Food delivery | Native sponsors | **Total / month** | **Total / year** |
|-----|-------------------|---------------|-----------------|-------------------|------------------|
| 1,000 | ₹6,500 | ₹1,500 | ₹1,200 | **₹9,200** | **₹1.1L** |
| 5,000 | ₹32,500 | ₹7,300 | ₹6,000 | **₹45,800** | **₹5.5L** |
| 10,000 | ₹65,500 | ₹14,600 | ₹12,000 | **₹92,100** | **₹11L** |
| 25,000 | ₹1,63,750 | ₹36,500 | ₹30,000 | **₹2.3L** | **₹27.6L** |
| 50,000 | ₹3,27,500 | ₹73,000 | ₹60,000 | **₹4.6L** | **₹55L** |
| 1,00,000 | ₹6,55,000 | ₹1,46,000 | ₹1,20,000 | **₹9.2L** | **₹1.1Cr** |

Conservative scenario is roughly **40–50%** of the table above. Optimistic is **1.5–2×**.

---

## What each partner type might pay (India, indicative)

Public rates are rarely published for indie apps. Use these **negotiation anchors**:

### Quick commerce (Blinkit / Zepto / Instamart)

| Model | Indicative range | Comment |
|-------|------------------|---------|
| Revenue share | 2–6% of GMV | Needs official partner / MMP (AppsFlyer, Adjust) |
| CPA | ₹25 – ₹80 per new or attributed order | Common in performance campaigns |
| Fixed integration fee | ₹50k – ₹5L one-time + rev share | Larger apps only |

**Reality:** Blinkit/Zepto often prefer **BD partnerships**, not open self-serve affiliate. Budget **3–6 months** of outreach.

### Food delivery (Zomato / Swiggy)

| Model | Indicative range |
|-------|------------------|
| Affiliate / performance | 2–5% or ₹15 – ₹50 per order |
| “Skip cooking” placement | Higher intent; good story for partnerships |

Attribution is hard (user leaves app). You need **tracked deep links + postback** or coupon codes (`RASOI50`).

### Native sponsors (Amul, Tata, regional FMCG)

| Inventory | Indicative monthly (early app) | At scale |
|-----------|----------------------------------|----------|
| 1 home rail | ₹8,000 – ₹25,000 | ₹50k+ |
| Pantry + recipe brand card bundle | ₹15,000 – ₹40,000 | ₹1L+ |
| Category exclusivity (e.g. only Amul paneer) | Premium 20–40% |

CPM-equivalent for niche Indian food apps: **₹40 – ₹150** per 1,000 impressions.

### Google AdMob (optional, supplemental)

| Format | India eCPM (rough) |
|--------|-------------------|
| Banner | ₹20 – ₹80 |
| Interstitial | ₹80 – ₹250 |

At 10k MAU with light ads, expect **₹3,000 – ₹15,000 / month** — usually **not worth** hurting the premium affiliate UX unless MAU is huge.

---

## Costs to subtract (net earnings)

| Cost item | Early stage / month | Growth stage / month |
|-----------|---------------------|----------------------|
| Apple + Google developer fees | ~₹800 amortized | ~₹800 |
| Expo / hosting / analytics | ₹0 – ₹2,000 | ₹5,000 – ₹20,000 |
| Attribution (MMP) | ₹0 | ₹10,000 – ₹40,000 |
| Recipe content / CMS | ₹0 (self) | ₹20,000 – ₹1,00,000 |
| Part-time dev / design | ₹0 | ₹50,000 – ₹2,00,000 |
| Legal / GST / CA | ₹2,000 – ₹5,000 | ₹10,000 – ₹30,000 |

**Example net @ ₹92k gross (10k MAU moderate):**  
After ₹15k–₹30k ops costs → **₹60k – ₹75k / month** (~₹7–9L / year) for a solo founder before tax.

---

## Path from ₹0 → first ₹1 lakh / month

1. **Replace mock links** in `utils/affiliate.ts` with signed tracking URLs.  
2. **Add analytics:** checkout tap, partner chosen, outbound click (Firebase / PostHog).  
3. **Close one grocery partner** (Zepto/Blinkit BD email + demo deck showing “missing ingredient → cart” flow).  
4. **Close 2–3 FMCG sponsor pilots** (Amul-style paneer rails) at ₹10–25k/month each.  
5. **Grow MAU** via Instagram Reels recipes, WhatsApp sharing, Hindi ASO keywords.  
6. **Expand catalog** beyond 15 recipes — more recipes = more checkout moments.  
7. **GST registration** once gross > ₹20L/year (consult a CA).

---

## Risks that lower earnings

- **No attribution** → partners pay nothing.  
- **Low order completion** → users search on partner app but don’t buy.  
- **Metro-only partners** → Tier 2/3 users don’t convert.  
- **Policy changes** → deep link / affiliate rules change on iOS/Android.  
- **Trust** → too many promos → uninstalls (keep food promo strong, grocery subtle on recipe page — as you’ve designed).

---

## Quick reference: revenue formula

```
Monthly grocery revenue ≈
  MAU × recipe_views_per_user
  × grocery_tap_rate × order_completion_rate
  × avg_order_value × commission_rate

Monthly food revenue ≈
  MAU × recipe_views_per_user
  × food_tap_rate × order_completion_rate
  × avg_food_order_value × commission_rate

Monthly sponsor revenue ≈
  (sponsor_impressions / 1000) × effective_CPM
```

---

## Bottom line

| Question | Answer |
|----------|--------|
| **Can you earn from this app?** | Yes — model fits Indian users (cook vs order vs quick commerce). |
| **How much today?** | **₹0** until real partner contracts and tracking exist. |
| **Realistic Year 1 (solo, part-time growth)?** | **₹0 – ₹3L gross** if you launch but don’t close partners; **₹3L – ₹12L** with 1–2 deals + 5k–15k MAU. |
| **Realistic Year 2 (moderate traction)?** | **₹6L – ₹30L+ gross** at 15k–50k MAU with affiliates + sponsors working. |
| **Ceiling (strong product + sales)?** | **₹1Cr+ / year gross** at 1L+ MAU — still small vs BigBasket/Zomato, but viable indie business. |

**Not financial advice.** Validate every rate in a term sheet with partners. Update this doc when you have 30 days of real click and conversion data.

---

## Related files in this repo

- `constants/monetization.ts` — partner list, disclosures  
- `utils/affiliate.ts` — checkout / deep link handlers (placeholder IDs today)  
- `components/AffiliateCheckoutModal.tsx` — grocery checkout UX  
- `components/FoodDeliveryModal.tsx` — Zomato / Swiggy UX  

When you sign a partner, document the agreed **commission %, cookie window, and payment cycle** in a private `docs/partner-contracts/` folder (do not commit secrets).
