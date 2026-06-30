# Rasoi International Web + App Plan (US / CA / AU)

**For review** — India stays primary; abroad targets Indian diaspora + home cooks of Indian food.  
**Domain:** https://rasoiapplication.in  
**Aligned with:** [INTERNATIONAL_MARKETS.md](./INTERNATIONAL_MARKETS.md) · [SEO.md](./SEO.md)  
**Last updated:** June 2026

---

## 1. Executive summary

**Goal:** When someone in the US, Canada, or Australia finds Rasoi (web or Play), they see **local copy, local partners, local pricing** — not Blinkit/Zepto/₹49.

**Recommended approach:**

| Your idea | Refined recommendation |
|-----------|------------------------|
| Market pages at `/US`, `/CA`, `/AU` | Use **keyword URLs** as canonical (`/indian-recipe-app-usa`, etc.) with optional short aliases (`/us`, `/ca`, `/au`) |
| US users never see India homepage | **Soft geo-default** to market page + **country switcher**; all pages stay crawlable |
| Change website first, build later | **Parallel tracks:** web can ship first; **do not promote abroad** until app hides India partners |

**What already exists in code (head start):**

- Backend partner regions: `IN | US | CA | AU` in `rasoi_backend/src/lib/partners.ts`
- API: `/api/partners?region=US` (etc.)
- Supabase: `PartnerLink.region` column + migration
- Mobile: still **hardcoded to `region=IN`** in `rasoi_mobile/services/partners.ts`

**What does not exist yet:**

- International landing pages
- Geo routing in middleware
- hreflang / per-market SEO metadata
- US/CA/AU partner rows seeded in production
- Mobile region detection for partners
- Play Console localized subscription prices abroad

---

## 2. Objectives & success metrics

### Business objectives (90 days)

1. Rank for **niche diaspora queries** (not generic “recipe app”).
2. Convert web visitors → **Google Play installs** in US / CA / AU.
3. Avoid **bad reviews** from users seeing India-only partners abroad.
4. Keep **India experience unchanged** on `/`.

### KPIs

| Metric | Tool | Month 1 target | Month 3 target |
|--------|------|----------------|----------------|
| Indexed market pages | Search Console → Pages | 4+ (/, /us, /ca, /au + Play page) | Same + download |
| Impressions by country | GSC → Countries | Baseline (US > CA > AU) | ↑ vs baseline |
| Clicks to Play/download | GSC + analytics | Track weekly | ↑ week over week |
| Play installs by country | Play Console | Baseline | Measurable US traction |
| Partner tap rate (abroad) | In-app analytics | N/A until app ships | >0 after US launch |
| 1★ reviews mentioning wrong partners | Play reviews | **0** | **0** |

**Realistic traffic expectation (organic web only):** tens of clicks/month early on; low hundreds/month after 3–6 months if pages rank. **Play Store + community links will outperform the website** abroad.

---

## 3. URL & site architecture

### 3.1 URL map (recommended)

| Market | Canonical URL | Short alias (redirect) | hreflang |
|--------|---------------|------------------------|----------|
| **India (default)** | `/` | — | `en-IN` |
| **United States** | `/indian-recipe-app-usa` | `/us` → 301 to canonical | `en-US` |
| **Canada** | `/indian-recipe-app-canada` | `/ca` → 301 | `en-CA` |
| **Australia** | `/indian-recipe-app-australia` | `/au` → 301 | `en-AU` |
| **Global fallback** | `/` or future `/indian-recipe-app` | — | `x-default` |

**Global pages (same for all markets — do not geo-block):**

| Page | Why global |
|------|------------|
| `/download` | APK + Play entry |
| `/google-play/rasoi-aaj-kya-banaye-indian-recipe-app-android` | Play SEO landing |
| `/privacy`, `/terms`, `/delete-account` | Legal / Play requirements |
| `/api/*`, `/admin/*` | Unchanged |

### 3.2 Geo routing behavior (not a hard wall)

```
User visits rasoiapplication.in/
  │
  ├─ Cookie ?market=us|ca|au|in  →  respect user choice (priority)
  │
  ├─ No cookie, Vercel geo = US   →  302 to /indian-recipe-app-usa (once)
  ├─ No cookie, geo = CA          →  302 to /indian-recipe-app-canada
  ├─ No cookie, geo = AU          →  302 to /indian-recipe-app-australia
  │
  └─ India / unknown / bot        →  serve / (India home)

Footer/header always:  🇮🇳 India · 🇺🇸 US · 🇨🇦 Canada · 🇦🇺 Australia
```

**Rules:**

- **Never block** Googlebot or users from opening any market URL directly.
- **Never geo-redirect** `/download`, `/privacy`, `/terms`, Play page, or sitemap.
- Store preference in cookie `rasoi_market` (1 year).
- Bots: optional skip redirect on `/` (serve India + hreflang); or redirect consistently — pick one and keep it stable.

### 3.3 Shared vs localized content

| Section | India `/` | US / CA / AU pages |
|---------|-----------|---------------------|
| Hero (“Aaj kya banaye?”) | Keep | Keep — diaspora hook still works |
| Partner logos & copy | Blinkit, Zepto, etc. | Instacart, Woolworths, etc. |
| Pricing | ₹49 / ₹499 | $2.99, CAD 3.99, AUD 4.99 |
| FAQ | India checkout | “Can I use Rasoi in the US?” etc. |
| Schema `areaServed` | India | US / CA / AU |
| Sponsor section | India brands | Optional: hide or “coming to your market” |

---

## 4. Phased rollout (12 weeks)

### Phase 0 — Decisions (Week 0, before build)

**Review and sign off:**

- [ ] Markets in scope: **US, CA, AU** (NZ deferred — not in current doc; different grocery ecosystem)
- [ ] URL scheme: keyword canonical + `/us` `/ca` `/au` aliases
- [ ] Geo: **soft redirect + switcher**, not hard block
- [ ] Launch order: **US first**, then CA + AU together
- [ ] Honest messaging if partners not live: *“Recipes & pantry work worldwide. Grocery links rolling out in your country.”*

---

### Phase 1 — Web foundation (Weeks 1–2)

**No APK required. Safe to deploy to production.**

#### 1A. Market landing pages (Next.js)

Create 3 new pages reusing home layout/components with a `market` prop:

| File (proposed) | Route |
|-----------------|-------|
| `rasoi_backend/src/app/indian-recipe-app-usa/page.tsx` | `/indian-recipe-app-usa` |
| `rasoi_backend/src/app/indian-recipe-app-canada/page.tsx` | `/indian-recipe-app-canada` |
| `rasoi_backend/src/app/indian-recipe-app-australia/page.tsx` | `/indian-recipe-app-australia` |
| `rasoi_backend/src/app/us/page.tsx` | redirect → USA canonical |
| `rasoi_backend/src/app/ca/page.tsx` | redirect → CA canonical |
| `rasoi_backend/src/app/au/page.tsx` | redirect → AU canonical |

**Per-page content checklist:**

- Unique `<title>` and meta description (keyword + market)
- Unique H1 (e.g. “Indian Recipe App for the United States”)
- Market-specific partner section (even if “coming soon”)
- Market-specific Rasoi Plus pricing line
- 5–8 FAQs with FAQPage JSON-LD
- CTA → Play Store + `/download`
- Internal links to Play landing page

#### 1B. SEO infrastructure

| Task | File(s) |
|------|---------|
| `buildPageMetadata({ market: 'US' })` with `en_US`, US keywords | `rasoi_backend/src/lib/seo.ts` |
| hreflang alternates for `/`, `/usa`, `/canada`, `/australia` | `seo.ts` + each page metadata |
| Add 6 URLs to sitemap | `rasoi_backend/src/app/sitemap.ts` |
| India home keeps `en_IN`; fix `areaServed` / `countriesSupported` in JSON-LD per market | `seo.ts` |
| Country switcher component | new shared component in `rasoi_backend/src/app/_components/` |

#### 1C. Geo middleware

| Task | File |
|------|------|
| Read `x-vercel-ip-country` (or `request.geo`) | `rasoi_backend/src/middleware.ts` |
| Redirect only `/` for humans with no `rasoi_market` cookie | middleware |
| Set cookie when user picks market from switcher | client component + API route optional |
| Exclude: `/api`, `/admin`, static assets, legal, download, play page | middleware matcher |

#### 1D. Minor India home updates

- Add footer links: “Rasoi in USA / Canada / Australia”
- Add 1–2 international FAQs on India home (“Does Rasoi work outside India?”)

#### 1E. Deploy + Search Console

- [ ] Deploy backend to Vercel (from `development` → `main` per release rules)
- [ ] Submit sitemap in Google Search Console
- [ ] Request indexing for new URLs
- [ ] GSC → Settings → confirm geo target **India** for domain (fine for `.in`)
- [ ] Baseline GSC country report (US, CA, AU, IN)

**Phase 1 exit criteria:** All market pages live, hreflang valid, sitemap submitted, geo redirect works, **no app changes required**.

---

### Phase 2 — Play Console (Weeks 2–3, parallel with Phase 1)

**No APK required for pricing; listing updates recommended before US promotion.**

| Task | Where |
|------|-------|
| Add subscription prices US / CA / AU | Play Console → Monetize → Subscriptions |
| US: $2.99/mo, $24.99/yr | `rasoi_plus_monthly`, `rasoi_plus_yearly` |
| CA: CAD 3.99 / 34.99 | same SKUs |
| AU: AUD 4.99 / 44.99 | same SKUs |
| **Custom store listings** per country | Play Console → Store presence |
| US listing: Instacart, Amazon, DoorDash in description | not Blinkit |
| CA listing: SkipTheDishes, Instacart, Amazon.ca | |
| AU listing: Woolworths, Coles, DoorDash | |
| Update screenshots (one frame: local partners) | when app ships |
| Website field stays `https://rasoiapplication.in` | OK — geo handles market |

**Phase 2 exit criteria:** Abroad users see correct Play prices; store text does not promise India partners.

---

### Phase 3 — App internationalization (Weeks 3–5)

**APK required. Do not run US ads or heavy promotion until this ships.**

#### 3A. Partner region detection (mobile)

| Task | Detail |
|------|--------|
| Resolve user `PartnerRegion` | Priority: user setting (optional) → Play billing country / device locale → fallback `IN` |
| Pass region to partner fetch | Change `loadPartnerLinks` to use dynamic region |
| Supabase query | `.eq('region', resolvedRegion)` instead of hardcoded `IN` |
| API fallback | `/api/partners?region=${region}` |
| If no rows for region | Show honest empty state: “Grocery links coming soon in your country” |
| **Never show IN partners** when region ≠ IN | Critical |

**Files:**

- `rasoi_mobile/services/partners.ts`
- `rasoi_mobile/context/PartnersContext.tsx`
- New: `rasoi_mobile/utils/partnerRegion.ts` (detection helper)
- Settings: optional “Country / market” override

#### 3B. Seed partner data (Supabase + admin)

Seed `PartnerLink` rows per [INTERNATIONAL_MARKETS.md](./INTERNATIONAL_MARKETS.md):

| Region | Launch partners |
|--------|-----------------|
| US | Instacart, Amazon, DoorDash (+ Walmart optional) |
| CA | Instacart, Amazon.ca, SkipTheDishes |
| AU | Woolworths, Coles, DoorDash |

- Use search deep links from INTERNATIONAL_MARKETS.md (verify on real device in each country)
- Admin CRUD already supports partners — add region filter in admin UI if missing
- Run seed against production Supabase **before** APK ships

**Backend reference:** `rasoi_backend/src/lib/partners.ts` already has URL templates for US/CA/AU.

#### 3C. Paywall & plan copy

| Task | File |
|------|------|
| INR fallback only when region = IN | `rasoi_mobile/constants/plans.ts` |
| Paywall partner line per region | paywall component |
| RevenueCat `priceString` from Play | already planned — verify abroad |

#### 3D. Build & QA

```bash
cd rasoi_mobile && npm run qa:preflight
# Device QA with VPN or test accounts per region
cd rasoi_mobile && npm run android:release-apk
cd rasoi_backend && npm run sync:apk   # if shipping APK on site
```

**Device QA checklist (per region):**

- [ ] Home / recipes / pantry work
- [ ] Partner section shows **correct** logos only
- [ ] “Shop missing ingredients” opens correct app/web
- [ ] No Blinkit/Zepto/Zomato/Swiggy visible
- [ ] Rasoi Plus shows local currency from Play
- [ ] OTP login works abroad

**Phase 3 exit criteria:** Release APK to Play production; US user gets US partners or honest “coming soon” — never India partners.

---

### Phase 4 — Promotion & SEO growth (Weeks 6–12)

#### 4A. On-site SEO (ongoing)

- [ ] Internal links: market pages ↔ Play page ↔ download
- [ ] Consider `/indian-recipe-app` global hub (links to all markets)
- [ ] International FAQs on Play landing page
- [ ] Review crawler behavior on Play page auto-redirect (humans only if possible)

#### 4B. Off-site (highest ROI for early traffic)

| Channel | Action |
|---------|--------|
| Reddit | r/IndianFood, city subreddits — authentic “built this for diaspora” posts |
| Facebook | NRI / Indian community groups (US first) |
| Instagram | Link in bio → `rasoiapplication.in/us` or Play |
| YouTube Shorts | English recipe clips → Play link |
| Google Ads (optional) | $10–20/day US → Play landing page, 2-week test |

#### 4C. Affiliates (only when traffic justifies)

- Amazon Associates (separate US / CA / AU accounts)
- Instacart affiliate
- DoorDash partner program

#### 4D. Monitor weekly

- GSC: impressions/clicks by country
- Play Console: installs by country
- Reviews mentioning partners / pricing
- Partner link tap events

---

## 5. Content matrix (copy you'll need)

### 5.1 Page titles (draft)

| Page | Title |
|------|-------|
| India `/` | Rasoi — Aaj Kya Banaye? \| Indian Recipe App \| Pantry Match & Regional Dishes |
| USA | Indian Recipe App for USA \| Rasoi — Cook from Your Pantry \| Android |
| Canada | Indian Cooking App Canada \| Rasoi — Regional Recipes & Pantry Match |
| Australia | Indian Recipe App Australia \| Rasoi — Veg, Jain & Regional Dishes |

### 5.2 Meta descriptions (draft)

**US:**

> Rasoi helps Indian home cooks in the USA decide dinner from your pantry. 1,200+ regional recipes, pantry match %, and shop missing ingredients via Instacart, Amazon & DoorDash. Free on Android.

**CA / AU:** Same structure with local partner names.

### 5.3 FAQs (each market page — 5 minimum)

1. Can I use Rasoi in the [US/Canada/Australia]?
2. Do Indian recipes work without local grocery partners?
3. Which apps can I use to shop missing ingredients?
4. How much is Rasoi Plus in [market]?
5. Is Rasoi on Google Play in my country?

### 5.4 Paywall one-liner (before partners live)

> Recipes & pantry work worldwide. Grocery checkout links are rolling out in your country.

### 5.5 Paywall one-liner (after partners live)

| Market | Copy |
|--------|------|
| US | Instacart, Amazon & DoorDash checkout with Rasoi Plus |
| CA | Instacart, Amazon & SkipTheDishes with Rasoi Plus |
| AU | Woolworths, Coles & DoorDash with Rasoi Plus |

---

## 6. Technical implementation map

| Area | Path | Phase |
|------|------|-------|
| Market pages | `rasoi_backend/src/app/indian-recipe-app-*/page.tsx` | 1 |
| Geo middleware | `rasoi_backend/src/middleware.ts` | 1 |
| SEO / hreflang | `rasoi_backend/src/lib/seo.ts` | 1 |
| Sitemap | `rasoi_backend/src/app/sitemap.ts` | 1 |
| Country switcher | `rasoi_backend/src/app/_components/MarketSwitcher.tsx` | 1 |
| Partner defaults | `rasoi_backend/src/lib/partners.ts` | 3 (seed) |
| Partner API | `rasoi_backend/src/app/api/partners/route.ts` | exists |
| Partner seed | `rasoi_backend/src/lib/partner-seed.ts` | 3 |
| Admin partners | `rasoi_backend/src/app/admin/(console)/partners/` | 3 |
| Mobile partner load | `rasoi_mobile/services/partners.ts` | 3 |
| Mobile partners UI | `rasoi_mobile/context/PartnersContext.tsx` | 3 |
| Plan copy | `rasoi_mobile/constants/plans.ts` | 3 |
| Play pricing manifest | `rasoi_mobile/store/play-console/manifest.json` | 2 |
| Strategy doc | `docs/marketing/INTERNATIONAL_MARKETS.md` | update after sign-off |

---

## 7. Release sequence (strict order)

```
Week 1–2   Web Phase 1 (pages + SEO + geo)     → deploy
Week 2–3   Play Console pricing + listings      → no APK
Week 3–5   App partner region + seed + QA       → APK to Play
Week 3     sync:apk if APK on /download         → commit APK
Week 5+    Promote US (organic + optional ads)
Week 6–8   CA + AU partner verification         → same APK if already seeded
Week 8+    Promote CA + AU
```

**Production deploy checklist (repo rules):**

1. API smoke: `QA_API_URL=https://rasoiapplication.in npx tsx scripts/qa-api-smoke.ts`
2. Mobile QA on device if APK changed
3. `npm run sync:apk` if new build
4. Commit → push GitHub → Vercel deploy
5. Verify APK: `curl -sI https://rasoiapplication.in/rasoi-release.apk` → 200, >50MB
6. Re-run production smoke

---

## 8. Risks & mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| US user sees Blinkit partners | 1★ reviews | Ship Phase 3 before promotion; interim honest copy |
| Hard geo-block hurts SEO | India or US pages under-indexed | Soft redirect + hreflang + sitemap |
| `.in` domain weak for US generic queries | Low traffic | Target niche keywords; don't chase “recipe app” |
| Partner deep links break | Bad UX | Test on real devices per country before listing |
| Googlebot geo confusion | Wrong canonical | hreflang + consistent rules; test in GSC URL Inspection |
| Low organic traffic | Discouragement | Expect slow SEO; lean on Play ASO + community |
| Scope creep (NZ, UK, EU) | Delays launch | **Defer** until US/CA/AU stable |

---

## 9. Out of scope (Phase 1–4)

- **New Zealand** — add later (Countdown / New World; smaller market)
- **UK / EU** — INTERNATIONAL_MARKETS.md has optional pricing only
- **iOS App Store**
- **Recipe blog / thousands of SSR recipe pages** (huge SEO lift but separate project)
- **Hindi hreflang** — only if India Hindi traffic warrants it
- **Affiliate revenue** — Phase 4+
- **Paid influencer campaigns** — optional after US validation

---

## 10. Effort estimate (rough)

| Phase | Engineering | Content/SEO | Calendar |
|-------|-------------|-------------|----------|
| Phase 1 — Web | 3–5 days | 1–2 days copy | Week 1–2 |
| Phase 2 — Play Console | 0.5 day | 1 day listings | Week 2–3 |
| Phase 3 — App + seed | 4–6 days | — | Week 3–5 |
| Phase 4 — Growth | ongoing | 2–4 hrs/week | Week 6–12 |

*Assumes one developer familiar with the codebase; SEO help can parallelize copy in Phase 1.*

---

## 11. Decisions to mark ✅ / ❌

| # | Decision | Recommendation |
|---|----------|----------------|
| 1 | Keyword URLs vs `/US` only | **Keyword canonical + `/us` alias** |
| 2 | Hard block US from `/` | **No** — soft redirect + switcher |
| 3 | Launch US before CA/AU | **Yes** |
| 4 | Ship web before APK | **Yes** — but don't promote app abroad until Phase 3 |
| 5 | Include NZ in v1 | **No** — defer |
| 6 | Show “coming soon” partners vs wait for links | **Show coming soon** on web; **hide or coming soon** in app |
| 7 | Optional paid ads US $10–20/day | **After** Phase 3 |
| 8 | APK on website for international users | **Keep** `/download` global (sideload works worldwide) |

---

## 12. Definition of done (v1 international)

- [ ] US, CA, AU landing pages indexed with unique metadata
- [ ] hreflang valid; sitemap includes all market URLs
- [ ] Geo default works; user can switch country
- [ ] India `/` unchanged for primary audience
- [ ] Play prices set for US, CA, AU
- [ ] App shows correct partners (or honest empty state) per region
- [ ] No India-only partners shown abroad
- [ ] Production QA passed; APK synced if build changed
- [ ] GSC baseline captured; weekly country report reviewed

---

## 13. Suggested immediate next steps (after approval)

1. Confirm decisions in **Section 11**.
2. **Phase 1:** Build US page first (template for CA/AU).
3. **Phase 2:** Play Console US pricing + custom listing (can do same day as US page deploy).
4. **Phase 3:** Mobile `partnerRegion` + seed US partners → QA → release.
5. Promote US only for 2–4 weeks; then enable CA/AU promotion.

---

*See also: [INTERNATIONAL_MARKETS.md](./INTERNATIONAL_MARKETS.md) (partners, pricing, ASO) · [SEO.md](./SEO.md) (India-first web SEO)*
