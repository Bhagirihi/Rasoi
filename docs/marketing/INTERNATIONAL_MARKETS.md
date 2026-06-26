# Rasoi — International markets (USA, Canada, Australia)

**Product:** Rasoi: Aaj Kya Banaye? — Android recipe app  
**Website:** https://rasoiapplication.in  
**India partners (live):** Blinkit, Zepto, Instamart, Zomato, Swiggy  
**Primary audience abroad:** Indian diaspora + anyone cooking Indian food at home  
**Last updated:** June 2026

Related docs: [SEO.md](./SEO.md) · [BRAND_BRIEF.md](./BRAND_BRIEF.md) · `rasoi_mobile/store/play-console/manifest.json`

---

## 1. Strategy summary

| Region | Role | Realistic goal |
|--------|------|----------------|
| **India** | Primary market | Recipes, pantry, partners, ads, Rasoi Plus |
| **USA** | Diaspora + largest English search volume | Rank for *Indian recipe app*; Instacart-style checkout |
| **Canada** | Strong South Asian diaspora | Same as US + SkipTheDishes |
| **Australia** | Growing Indian community | Woolworths/Coles grocery; no Instacart |

**Do not** try to beat AllRecipes or NYT Cooking on generic “recipe app” globally.  
**Do** own: *Indian home cooking*, *what to cook tonight*, *pantry match*, *regional cuisines* for expats and NRIs.

**Honest product split abroad**

| Feature | India | US / CA / AU |
|---------|-------|----------------|
| 1,200+ recipes, pantry match, diet filters | ✅ | ✅ |
| Meal reminders | ✅ | ✅ |
| Blinkit / Zepto / Instamart / Zomato / Swiggy | ✅ | ❌ Hide — apps don’t work there |
| Local grocery + delivery deep links | — | Ship per country (below) |
| Rasoi Plus (no ads + partners) | ₹49 / ₹499 | Localized Play pricing (below) |

---

## 2. Partner mapping (India → abroad)

Rasoi partner checkout = **search/deep link** into a grocery or delivery app with missing ingredients (same pattern as `rasoi_mobile/constants/partners.ts`).

### India (current — do not change)

| Type | Partners |
|------|----------|
| Quick grocery | Blinkit, Zepto, Instamart |
| Food delivery | Zomato, Swiggy |

### United States 🇺🇸

| Type | Recommended partners | Why |
|------|---------------------|-----|
| **Grocery** | **Instacart**, **Amazon** (Fresh / product search), **Walmart** | Closest to “shop missing items from recipe” |
| **Delivery** | **DoorDash**, **Uber Eats** | Optional third: Grubhub (city-dependent) |

**Launch set (minimum):** Instacart + Amazon + DoorDash

**Example search URL pattern (replace `{query}` with encoded ingredient search):**

```
Instacart:  https://www.instacart.com/store/s?k={query}&utm_source=rasoi&utm_medium=affiliate
Amazon:     https://www.amazon.com/s?k={query}&tag=rasoi-20
DoorDash:   https://www.doordash.com/search/store/{query}/?utm_source=rasoi
```

> Replace Amazon `tag=` with your Associates ID once approved. Verify deep links on a real device before shipping.

### Canada 🇨🇦

| Type | Recommended partners |
|------|---------------------|
| **Grocery** | **Instacart**, **Walmart** (Canada), **Amazon.ca** |
| **Delivery** | **DoorDash**, **Uber Eats**, **SkipTheDishes** |

**Launch set:** Instacart + Amazon.ca + SkipTheDishes

### Australia 🇦🇺

| Type | Recommended partners |
|------|---------------------|
| **Grocery** | **Woolworths**, **Coles**, **Amazon.com.au** |
| **Delivery** | **DoorDash**, **Uber Eats**, **Menulog** |

**Note:** Instacart is **not** in Australia. Woolworths + Coles are the Blinkit-equivalents.

**Launch set:** Woolworths + Coles + DoorDash

### Partners to avoid showing abroad

- Blinkit, Zepto, Instamart, Zomato, Swiggy — India-only; links fail or confuse users.
- Do not claim “10-minute delivery” unless verified for that city/country.

### Implementation checklist (engineering)

- [ ] Geo-detect country (Play Store country, locale, or optional user setting).
- [ ] Serve partner list from admin / seed per `region` (IN | US | CA | AU).
- [ ] Update Settings, recipe “Shop missing”, and paywall copy per region.
- [ ] Keep `PartnerLink` admin CRUD — same as India, different rows per country.
- [ ] Phase 1: search deep links only. Phase 2: affiliate IDs (`utm_*`, Amazon `tag`).

### Affiliate programs (phase 2)

| Partner | Program | Notes |
|---------|---------|--------|
| Instacart | Instacart affiliate / partner | US + Canada |
| Amazon | Amazon Associates | US, CA, AU separate accounts |
| DoorDash | Impact / partner (varies) | Apply when traffic justifies |
| Uber Eats | Uber affiliate (varies) | Often referral, not deep SKU |
| Woolworths / Coles | Brand / agency deals | Usually manual outreach |

---

## 3. Rasoi Plus pricing

### India (keep — already in Play manifest)

| Plan | Price | Notes |
|------|-------|--------|
| Monthly | **₹49** | `rasoi_plus_monthly` |
| Yearly | **₹499** | ~15% cheaper than 12× monthly (~₹42/mo effective) |

Source: `rasoi_mobile/constants/plans.ts`, `rasoi_mobile/store/play-console/manifest.json`

### USA, Canada, Australia (recommended launch prices)

Do **not** convert ₹49 → USD literally (~$0.60). Use **localized lifestyle-app** pricing via Google Play.

| Market | Monthly | Yearly | ~Yearly savings vs 12× monthly |
|--------|---------|--------|--------------------------------|
| **United States** | **$2.99** | **$24.99** | ~30% |
| **Canada** | **CAD 3.99** | **CAD 34.99** | ~27% |
| **Australia** | **AUD 4.99** | **AUD 44.99** | ~25% |

**Why this band**

- Matches small utility / food apps ($2.99–4.99/mo), not streaming prices.
- AU/CA often sit one tier above US (tax + market norms).
- Diaspora audience will pay for *no ads + recipes + local shop links* if links work.

### Optional reference (UK / EU later)

| Market | Monthly | Yearly |
|--------|---------|--------|
| United Kingdom | £2.49 | £19.99 |
| European Union | €2.99 | €24.99 |

### How to set prices (Google Play Console)

1. [Play Console](https://play.google.com/console) → **Monetize → Subscriptions**.
2. Open `rasoi_plus_monthly` and `rasoi_plus_yearly`.
3. **Pricing → Set prices** → add **United States, Canada, Australia** (and others as needed).
4. Enter recommended prices above (or accept Google’s suggested tiers and adjust up if too low).
5. **Same product IDs** everywhere — no new SKUs per country.
6. **RevenueCat** — offerings unchanged; app shows `priceString` from Play/App Store per user country.

### Paywall / marketing copy per region

| Region | Partner line on paywall |
|--------|-------------------------|
| India | Blinkit, Zepto, Instamart, Zomato, Swiggy |
| US | Instacart, Amazon, DoorDash |
| Canada | Instacart, Walmart, SkipTheDishes |
| Australia | Woolworths, Coles, DoorDash |

**Before local partners ship:**  
“Recipes & pantry work worldwide. Grocery checkout links rolling out in your country.”

---

## 4. Web SEO (USA, Canada, Australia)

Site: https://rasoiapplication.in (`.in` signals India — still rankable abroad for niche queries).

### What limits international ranking today

- `locale: en_IN`, `areaServed: India`, `countriesSupported: IN` in `rasoi_backend/src/lib/seo.ts`
- Copy mentions ₹, Blinkit, Zepto — India-specific
- Only ~6 indexable pages (no diaspora landing pages yet)

### Target keywords (diaspora — not generic Western “meal prep”)

| Market | Example queries |
|--------|-------------------|
| USA | indian recipe app android, what to cook tonight indian, south indian recipes app |
| Canada | indian cooking app canada, punjabi recipes app |
| Australia | indian recipe app australia, veg indian recipes app |

### Recommended new pages

| Page | Example path | Purpose |
|------|--------------|---------|
| Global hub | `/indian-recipe-app` | Category keyword (English) |
| USA | `/indian-recipe-app-usa` | US diaspora + Play install |
| Canada | `/indian-recipe-app-canada` | CA diaspora |
| Australia | `/indian-recipe-app-australia` | AU diaspora |
| Play (exists) | `/google-play/rasoi-aaj-kya-banaye-indian-recipe-app-android` | Brand + “Google Play” intent |

Each page: unique title/description, FAQs (“Can I use Rasoi in the US?”), links to Play + `/download`, honest partner status.

### Play landing page SEO

URL: https://rasoiapplication.in/google-play/rasoi-aaj-kya-banaye-indian-recipe-app-android

**Already strong:** H1, FAQ schema, MobileApplication JSON-LD, breadcrumbs.

**To improve ranking**

- [ ] Internal links from home, download, footer with anchor “Rasoi on Google Play”
- [ ] Add international FAQs (US/CA/AU availability)
- [ ] Consider delaying auto-redirect to Play Store for crawlers (human-only redirect)
- [ ] Request indexing in [Google Search Console](https://search.google.com/search-console)
- [ ] Align Play Store listing title/keywords with this page

**Sitemap rule:** Only `rasoiapplication.in` URLs in `/sitemap.xml` — **never** `play.google.com` (Search Console rejects cross-domain URLs). Play is linked on-page and via `sameAs` schema.

### Google Search Console MCP (Cursor)

Configured at `.cursor/mcp-servers/google-search-console/`.  
Setup: enable Search Console API + `gcloud auth application-default login` with `webmasters.readonly`.

---

## 5. App Store Optimization (Play) abroad

Web SEO and **Play Store search** are separate.

| Channel | What ranks | You optimize |
|---------|------------|--------------|
| Google web | `rasoiapplication.in/...` | Site + backlinks |
| Google Play | `play.google.com/store/apps/details?id=com.bhagihiri.rasoiapp` | Play Console listing |

**Play listing actions**

- [ ] Add **US, CA, AU** store listings (English; optional Hindi retained for India).
- [ ] Short description: lead with *Indian recipes + pantry*, not India-only partners, for default/global listing — or use **custom store listings** per country.
- [ ] Screenshots: one frame showing “Shop missing ingredients” with **local** partner logos when available.
- [ ] Default language in manifest is `en-US` — good for global discovery.

---

## 6. Go-to-market (90 days)

### Month 1 — Foundation

- [ ] Set Play subscription prices for US, CA, AU (section 3).
- [ ] Deploy fixed sitemap; submit in Search Console.
- [ ] Request indexing: `/`, `/download`, Play landing page.
- [ ] GSC: monitor Performance → Countries (US, CA, AU).
- [ ] Hide India-only partners for non-IN users (or ship US partner links).

### Month 2 — US first

- [ ] Ship US partner deep links (Instacart, Amazon, DoorDash).
- [ ] Publish `/indian-recipe-app-usa` (or global hub + US section).
- [ ] Reddit / Facebook NRI groups, Indian community sites (US) — link to Play landing.
- [ ] Optional: Google Ads test US, $10–20/day → Play page.

### Month 3 — CA + AU

- [ ] CA and AU partner sets + landing pages.
- [ ] YouTube Shorts / Reels in English → Play link.
- [ ] Apply Instacart + Amazon Associates when traffic warrants.

---

## 7. RevenueCat & subscriber attributes

- **App User ID:** Rasoi Supabase user UUID (do not use email as primary ID).
- **Attributes synced:** `$email`, `$displayName`, `$phoneNumber`, custom (`plan_tier`, `city`, `region`, etc.).
- **Pricing display:** Live from Play via RevenueCat when `storeReady`; fallback copy uses INR constants in India builds only.

---

## 8. Legal & product honesty

- Privacy policy / terms already on `rasoiapplication.in`.
- Location: optional city — used for relevance; disclose in Play Data safety.
- **Abroad:** Partner links are outbound; Rasoi does not fulfill orders.
- **Subscriptions:** Billed by Google Play; cancel in Play → Subscriptions.
- Do not list partners in a country until links are tested on a real device there.

---

## 9. Quick reference tables

### Partner IDs (proposed — not in code until implemented)

| `partnerId` | Label | Region | Category |
|-------------|-------|--------|----------|
| `instacart` | Instacart | US, CA | grocery |
| `amazon_us` | Amazon | US | grocery |
| `amazon_ca` | Amazon | CA | grocery |
| `amazon_au` | Amazon | AU | grocery |
| `walmart` | Walmart | US, CA | grocery |
| `woolworths` | Woolworths | AU | grocery |
| `coles` | Coles | AU | grocery |
| `doordash` | DoorDash | US, CA, AU | delivery |
| `ubereats` | Uber Eats | US, CA, AU | delivery |
| `skip` | SkipTheDishes | CA | delivery |
| `menulog` | Menulog | AU | delivery |

### Pricing snapshot

| Region | Monthly | Yearly |
|--------|---------|--------|
| India | ₹49 | ₹499 |
| USA | $2.99 | $24.99 |
| Canada | CAD 3.99 | CAD 34.99 |
| Australia | AUD 4.99 | AUD 44.99 |

---

## 10. Code touchpoints (when implementing)

| Area | Path |
|------|------|
| Partner defaults (mobile) | `rasoi_mobile/constants/partners.ts` |
| Partner defaults (backend) | `rasoi_backend/src/lib/partners.ts` |
| Partner API / seed | `rasoi_backend/src/lib/partner-seed.ts`, `/api/partners` |
| Admin partner URLs | `rasoi_backend/src/app/admin/(console)/partners/` |
| Plan copy / INR fallback | `rasoi_mobile/constants/plans.ts` |
| Play subscription manifest | `rasoi_mobile/store/play-console/manifest.json` |
| Site SEO / schema | `rasoi_backend/src/lib/seo.ts` |
| Sitemap | `rasoi_backend/src/app/sitemap.ts` |
| RevenueCat sync | `rasoi_mobile/components/RevenueCatBridge.tsx` |

---

## 11. FAQ (internal)

**Q: Should we use one global Play listing or per-country?**  
A: One app; use **custom store listings** per country for partner names in description. Same APK.

**Q: Can we charge $0.99 in the US to match ₹49?**  
A: No — too low; undervalues product and hurts perceived quality. Use $2.99+.

**Q: Do recipes work without partners abroad?**  
A: Yes. Partners are a Plus upsell; core value is recipes + pantry.

**Q: `.in` domain hurt US ranking?**  
A: Slightly for generic queries; niche “Indian recipe app” still achievable with content + links.

---

*Aligned with [BRAND_BRIEF.md](./BRAND_BRIEF.md) — pantry match over AI; “Aaj kya banaye?” for home cooks everywhere.*
