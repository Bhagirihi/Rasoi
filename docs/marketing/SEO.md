# Rasoi SEO — `rasoiapplication.in`

**Domain:** https://rasoiapplication.in  
**Product:** Rasoi — Indian home-cooking app (Android)  
**Market:** India-first · Hindi + English search intent  
**Last updated:** June 2026

---

## 1. SEO goal

Rank for **high-intent Indian home-cooking queries** and convert visitors to **Android APK downloads** — not generic recipe blog traffic.

Primary conversion: `https://rasoiapplication.in/download`

---

## 2. Target keywords

### Tier 1 — Brand + core intent (prioritize)

| Keyword | Language | Intent |
|---------|----------|--------|
| rasoi app | EN | Brand |
| rasoiapplication.in | EN | Brand / direct |
| aaj kya banaye app | HI/EN | Daily dinner decision |
| indian recipe app | EN | Category |
| home cooking app india | EN | Category |
| pantry recipe app | EN | Feature |
| what to cook tonight app | EN | Problem |

### Tier 2 — Feature + diet

| Keyword | Notes |
|---------|-------|
| veg recipe app india | Diet filter |
| jain recipe app | Niche, high loyalty |
| quick dinner recipes app | Under 20 min filter |
| regional indian recipes app | 15 cuisines USP |
| gujarati recipe app | Geo/regional ads |
| south indian recipe app | Breakfast + dinner |

### Tier 3 — Long-tail (blog / Reels / FAQ)

- "cook with ingredients at home app"
- "dinner ideas from fridge india"
- "leftover rice recipe app"
- "hostel cooking app india"
- "meal planner app indian food" *(avoid over-promising — no weekly planner)*

### Keywords to avoid leading with

- "AI recipe chat" — not built
- "meal planner calendar" — not built
- Generic Western terms (meal prep app, keto app)

---

## 3. Page-level SEO (live on site)

Implemented in `rasoi_backend/src/lib/seo.ts`.

| Page | URL | Title |
|------|-----|-------|
| Home | `/` | Rasoi — Aaj Kya Banaye? Indian Recipe App \| Pantry Match & Regional Dishes |
| Download | `/download` | Download Rasoi App — Free Android APK \| rasoiapplication.in |

### Meta description (home)

> Rasoi helps Indian home cooks decide dinner from what is already in the kitchen. 1,200+ regional recipes, pantry match %, Veg/Jain filters, and Blinkit/Zepto checkout. Download free on Android — rasoiapplication.in

### Technical SEO (implemented)

| Item | Path |
|------|------|
| Sitemap | `/sitemap.xml` |
| Robots | `/robots.txt` (blocks `/admin/`, `/api/`) |
| Canonical | `https://rasoiapplication.in` |
| Open Graph | Home + download |
| JSON-LD | Organization, WebSite, MobileApplication, FAQPage |
| Language | `en-IN` |
| FAQ section | `#faq` on homepage |

---

## 4. Title & description templates

### Homepage

```
Title: Rasoi — Aaj Kya Banaye? Indian Recipe App | Pantry Match & Regional Dishes
Description: Rasoi helps Indian home cooks decide dinner from what's already in the kitchen. 1,200+ regional recipes, pantry match %, Veg/Jain filters, and Blinkit/Zepto checkout. Download free on Android.
```

### Download page

```
Title: Download Rasoi App — Free Android APK | rasoiapplication.in
Description: Download Rasoi free for Android. Indian recipe app with pantry match, regional cuisines, meal reminders, and partner checkout. Official APK.
```

### Future blog post template

```
Title: {Dish or problem} — Rasoi | Indian Home Cooking
Description: {1 sentence answer} + Download Rasoi free — cook from your pantry with {X}% match recipes.
```

---

## 5. Content strategy (90 days)

### On-site (rasoiapplication.in)

| Priority | Action |
|----------|--------|
| P0 | ✅ Meta tags, sitemap, FAQ, structured data |
| P1 | Add dedicated `/privacy` and `/terms` pages (trust signals) |
| P2 | `/recipes` public index (top 50 recipes as static/SSR pages — huge SEO lift) |
| P3 | Hindi landing variant or `hreflang` if traffic warrants |

### Off-site (supports domain authority)

| Channel | SEO role |
|---------|----------|
| Instagram `@rasoiapp` | Brand searches + link in bio → rasoiapplication.in |
| YouTube Shorts | "Aaj kya banaye" + link in description |
| Google Play (when live) | ASO + website field → rasoiapplication.in |
| GitHub releases | APK trust + backlinks |

### Content pillars for Reels / future blog

1. **Aaj Kya Banaye** — daily dinner hooks  
2. **Pantry to Plate** — 3-ingredient dinners  
3. **Regional** — Gujarati, South, Punjabi weekly rotation  
4. **Fridge Check** — "You have aloo, bread, cheese — …"  
5. **Quick filters** — under 20 min weeknight  

---

## 6. Google Search Console setup

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: **URL prefix** → `https://rasoiapplication.in`
3. Verify via **DNS TXT record** in Hostinger (recommended) or HTML tag
4. Submit sitemap: `https://rasoiapplication.in/sitemap.xml`
5. Monitor: Queries containing "aaj kya banaye", "recipe app", "rasoi"

### Hostinger DNS TXT (verification example)

```
Type: TXT
Name: @
Value: google-site-verification=XXXXXXXXXXXX
```

---

## 7. Local / India SEO

- `locale: en_IN` in Open Graph  
- Use **Hindi hooks in H1/subheads** ("Aaj kya banaye?") alongside English  
- Mention **Indian partners** (Blinkit, Zepto) — familiar trust signals  
- Target cities in paid/social geo: Mumbai, Bangalore, Delhi, Ahmedabad, Pune  

---

## 8. App Store Optimization (ASO) — aligned with web SEO

Use the **same keywords** on Play Store when listed:

| Field | Copy direction |
|-------|----------------|
| App name | Rasoi — Indian Recipes & Pantry |
| Short description | Aaj kya banaye? Cook from your pantry. 15 cuisines. |
| Full description | Lead with dinner decision + pantry match, not AI |
| Website | https://rasoiapplication.in |

See [`RASOI_APP_STORE_DESIGN_SYSTEM.md`](../RASOI_APP_STORE_DESIGN_SYSTEM.md).

---

## 9. Competitor keyword map

| Competitor angle | Rasoi counter-message |
|------------------|----------------------|
| Generic recipe apps | **Indian regional + diet filters** |
| YouTube / Google | **Decision in 30 sec from YOUR pantry** |
| Swiggy/Zomato | **Cook at home first; order only what's missing** |
| Jamvanu / meal apps | **Pantry match %, not generic suggestions** |

---

## 10. KPIs (monthly)

| Metric | Tool | Month 1 aim |
|--------|------|-------------|
| Indexed pages | Search Console | 2+ (home, download) |
| Impressions | Search Console | Baseline |
| Brand queries "rasoi app" | Search Console | Track |
| Organic clicks to /download | Search Console + analytics | ↑ week over week |
| APK downloads | GitHub releases | Correlate with organic |

---

## 11. Checklist after deploy

- [ ] Set `NEXT_PUBLIC_SITE_URL=https://rasoiapplication.in` on Vercel  
- [ ] Redeploy `rasoi_backend`  
- [ ] Verify `https://rasoiapplication.in/robots.txt`  
- [ ] Verify `https://rasoiapplication.in/sitemap.xml`  
- [ ] Test rich results: [Google Rich Results Test](https://search.google.com/test/rich-results)  
- [ ] Add site to Google Search Console  
- [ ] Link rasoiapplication.in in Instagram bio, APK page, email signature  

---

*Aligned with [`BRAND_BRIEF.md`](./BRAND_BRIEF.md) — pantry match over AI; "Aaj kya banaye?" as primary hook.*
