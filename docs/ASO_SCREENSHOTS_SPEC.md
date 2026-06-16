# Rasoi — App Store & Play Store Screenshot Spec (ASO)

**Role:** Senior Mobile Product Designer · ASO · Growth  
**App:** Rasoi — India's smart kitchen companion  
**Canvas:** 1290 × 2796 px (iPhone 6.7") · export variants below  
**Date:** June 2026  
**Implementation:** `rasoi_mobile/screenshots/` → `npm run generate` → `app-store-assets/`

**Related:** [`RASOI_APP_STORE_DESIGN_SYSTEM.md`](./RASOI_APP_STORE_DESIGN_SYSTEM.md) · [`marketing/BRAND_BRIEF.md`](./marketing/BRAND_BRIEF.md)

---

# INPUT (Filled)

| Field | Value |
|-------|-------|
| **App Name** | Rasoi |
| **Tagline** | Aaj Kya Banaye? · Dinner, decided. |
| **Target Audience** | Indian home cooks — working women, housewives, couples, families (25–45). India-first, Android-first. |
| **Primary Problem** | Every evening: *"Aaj kya banaye?"* — deciding what to cook is harder than cooking. |
| **Key Features** | Tonight's picks · Pantry match % · 15 regional cuisines · 1,200+ recipes · Diet filters (Veg/Jain/Egg/Non-Veg) · Quick filters (under 20 min, leftovers, kids) · 5 daily meal nudges · Order missing items (Blinkit, Zepto, Instamart, Swiggy, Zomato) |
| **Brand Colors** | `#FF9933` saffron · `#FF6B35` orange · `#FFF9F6` cream · `#00A86B` green · `#1A1A2E` charcoal |
| **Design Style** | Premium Indian startup — Jamvanu + Swiggy clarity + Blinkit grids + Zomato emotion. Orange band + cream body. No blue gradients. |
| **Screenshots Available** | Marketing UI in `rasoi_mobile/screenshots/src/screens/` — hero, todays-picks, pantry-match, indian-regions, smart-filters, cook-shop-order, personalization, final |
| **Competitors** | Jamvanu (meal decision) · Swiggy / Zomato (trust + speed) · Blinkit / Zepto (pantry/action) · Plat / Toing (feature credibility) |

### Do NOT show (not in product)

- AI chat / GPT assistant  
- Weekly meal planner calendar  
- Fake star ratings or review quotes  
- "AI-powered" as headline  

---

# OBJECTIVE

8 screenshots that:

1. Communicate value in **5 seconds** on Screen 1  
2. Tell a story: **stress → decision → cook → shop**  
3. Use **benefit verbs**: Decided · Cook · Shop · Order  
4. Look **top 1%** — Apple-level typography, Swiggy-level clarity  
5. Convert on **Play Store first**, App Store second  

---

# DESIGN PRINCIPLES (Applied)

| Principle | Rasoi execution |
|-----------|-----------------|
| **Premium** | 84px Inter 800 headlines, 72px margins, cream negative space |
| **Modern** | Glass pills, soft shadows, saffron gradient band (not full-bleed chaos) |
| **Trustworthy** | Marketing UI mirrors real app — only implemented features |
| **Conversion** | Every frame answers *"What do I get?"* not *"What buttons exist?"* |

### Layout formula (all 8 screens)

```
┌─────────────────────────────┐
│  SAFFRON BAND (~32%)        │  Headline + optional tagline (white)
│  #FF9933 → #FF6B35          │
├─────────────────────────────┤
│  CREAM BODY (#FFF9F6)       │  Phone 680×1380, centred, 72px overlap
│                             │  Floating cards / food / proof chips
│                             │
└─────────────────────────────┘
```

---

# SCREENSHOT 1 — Hook

**Goal:** Stop scroll. Own *"Aaj kya banaye?"* in one glance.

**Headline:**  
`Aaj Kya`  
`Banaye?`

**Supporting text:**  
Never struggle with deciding your next meal.

**Visual composition:**
- Top: Kadai logo + **RASOI** wordmark (top-left, 72px inset)
- Orange band: headline left-aligned, 2-line break
- Cream zone: app icon (180px, rounded 42px) + **FREE** green pill + trust chips: `1,200+ recipes` · `15 cuisines` · `Pantry match`
- Bottom: **Download** CTA button (charcoal or orange gradient)
- Optional: single floating push card *"Tonight's pick: Paneer Butter Masala"*

**Background style:** Saffron band `#FF9933`→`#FF6B35` · cream `#FFF9F6` · subtle 3D kadai decor (low opacity)

**UI screen:** `HeroScreen` — brand lockup, not raw home export

**Design notes:**
- Borrow **Jamvanu** hook + **Taco Bell** clarity (icon + FREE + CTA on frame 1)
- Headline must survive App Store search crop (top 40%)
- No phone on screen 1 — brand + promise only (v2 pattern)

---

# SCREENSHOT 2 — Problem → Solution

**Goal:** Name the pain, show the fix in seconds.

**Headline:**  
`Dinner,`  
`Decided.`

**Supporting text:**  
Know what to cook today in seconds.

**Visual composition:**
- Orange band: headline
- Cream: large phone showing **Tonight's Pick** hero card (Paneer Butter Masala, 25 min, 92% match)
- Floating push notification card: *"7 PM · Dinner pick ready"*
- Alternate row: Masala Dosa · Dal Tadka (smaller cards)

**Background style:** Cream dominant · soft orange glow behind phone

**UI screen:** `TodaysPicksScreen` — meal slot ranking

**Design notes:**
- Problem implied: empty evening → solution: one hero pick
- **Swiggy** speed — one dominant card, not a grid
- Show **time + match %** — proof without "AI" label

---

# SCREENSHOT 3 — Feature Highlight (Strongest)

**Goal:** Lead feature — pantry-to-recipe matching.

**Headline:**  
`Cook From`  
`Your Pantry`

**Supporting text:**  
Turn what's at home into dinner tonight.

**Visual composition:**
- Phone: Pantry screen with Have / Need ingredient grid
- Giant green ring: **92% match**
- Floating ingredient chips with ✓ (paneer, tomato, cream, spices)
- Missing count badge: *"Only 2 items short"*

**Background style:** Cream · Blinkit-style product grid energy

**UI screen:** `PantryMatchScreen`

**Design notes:**
- **Blinkit** Have/Need grid pattern
- Benefit: *no surprise missing ingredients*
- Never say "AI" — say **match %** and **personalized**

---

# SCREENSHOT 4 — Feature Highlight (Second)

**Goal:** Regional depth — differentiation vs generic recipe apps.

**Headline:**  
`1,200+`  
`Recipes`

**Supporting text:**  
15 regional cuisines. Your flavours, one app.

**Visual composition:**
- Phone: cuisine carousel or region grid (Gujarati, South, Punjabi, Bengali…)
- Floating cuisine cards with real food photography
- Number **1,200+** in headline (Swiggy-style stat lead)

**Background style:** Warm cream · regional food photos bleeding softly at edges

**UI screen:** `IndianRegionsScreen`

**Design notes:**
- **Swiggy** — number in headline converts better than "Explore recipes"
- Stick to **1,200+** everywhere (store consistency)
- Show diversity — not only North Indian

---

# SCREENSHOT 5 — Feature Highlight (Third)

**Goal:** Speed + lifestyle filters.

**Headline:**  
`Find What`  
`Fits Today`

**Supporting text:**  
Under 20 min. Leftovers. Kid-friendly.

**Visual composition:**
- Phone: Home quick filters row active
- Three glass pills: `Under 20 min` · `Leftovers` · `Kids`
- Single recipe card result: Pav Bhaji · 18 min

**Background style:** Minimal cream · Zepto-level clutter-free

**UI screen:** `SmartFiltersScreen`

**Design notes:**
- **Zepto** minimal — three filters max visible
- Benefit: *cook for your real life today*

---

# SCREENSHOT 6 — Social Proof

**Goal:** Trust without fake reviews.

**Headline:**  
`Shop. Order.`  
`Eat.`

**Supporting text:**  
Missing ingredients? One tap to order.

**Visual composition:**
- Phone: Recipe detail → partner row (Blinkit, Zepto, Instamart, Swiggy, Zomato) with real brand colours
- Trust chips (not fake stars): `1,200+ recipes` · `Veg · Jain · Egg` · `15 cuisines` · `Pantry match`
- Small note chip: *"Partner checkout — Rasoi Plus trial"*

**Background style:** Cream · partner logos on white cards (Plat/Toing pattern)

**UI screen:** `CookShopOrderScreen`

**Design notes:**
- **Honest proof** — product stats, not fabricated 4.9★
- When real reviews exist, add Screen 6b variant with quotes
- Label Plus-gated features clearly

---

# SCREENSHOT 7 — Lifestyle

**Goal:** Emotional payoff — less stress, more family time.

**Headline:**  
`Fuel Your`  
`Kitchen`

**Supporting text:**  
Less deciding. More cooking.

**Visual composition:**
- **Zomato-style split:** top 40% dark charcoal emotion zone · bottom 60% warm food spread (thali, dosa, curry — real plates)
- Overlay: 5 notification timeline cards (8 AM breakfast · 12:30 lunch · 4 PM snack · 7 PM dinner · 10 PM late-night)
- No phone required — food + emotion first

**Background style:** Dark `#1A1A2E` top · cream/food bottom · cinematic warmth

**UI screen:** Notification timeline illustration (not meal planner calendar)

**Design notes:**
- **Zomato** emotion frame — identity + feeling
- **Jamvanu** notification story — *5 daily meal picks*
- Message: *spend less time deciding, more time with family*

---

# SCREENSHOT 8 — Call To Action

**Goal:** Close the story. Drive install.

**Headline:**  
`Cook Smarter`  
`With Rasoi`

**Supporting text:**  
Your everyday Indian kitchen companion.

**Visual composition:**
- Orange band: headline
- Cream: glass brand lockup — kadai + RASOI + *Indian cooking made easy*
- Credibility grid: `FREE to start` · `1,200+ recipes` · `15 cuisines` · `Pantry match`
- Large **Download Rasoi** CTA
- Play Store + App Store badges (Android lead)

**Background style:** Full brand moment · saffron + cream · premium close

**UI screen:** `FinalScreen`

**Design notes:**
- **Headspace** / **Duolingo** closing frame — clear CTA + recap
- Repeat USP from Screen 1 for memory
- End on **action**, not another feature

---

# OVERALL VISUAL DIRECTION

### Story arc (8 frames)

| # | User state | Message |
|---|------------|---------|
| 1 | Scrolling store | *This app solves dinner stress* |
| 2 | Curious | *I get a pick in seconds* |
| 3 | Skeptical | *It uses what I already have* |
| 4 | Exploring | *It knows Indian food* |
| 5 | Practical | *It fits my busy day* |
| 6 | Trusting | *It connects to Blinkit/Zepto* |
| 7 | Emotional | *I'll stress less* |
| 8 | Ready | *Download now* |

### Reference blend

| Frame | Closest reference |
|-------|-------------------|
| 1, 2, 6 | Jamvanu |
| 3 | Blinkit |
| 4 | Swiggy |
| 5 | Zepto |
| 7 | Zomato |
| 8 | Duolingo CTA close |

### Motion (optional video preview)

- Screen 1→2: push card slides in  
- Screen 3: match % counts up to 92  
- Screen 7: notification timeline fades in sequence  

---

# TYPOGRAPHY

| Role | Font | Size | Weight | Color |
|------|------|------|--------|-------|
| Headline | Inter | 84px | 800 | `#FFFFFF` (in band) |
| Tagline | Inter | 34px | 500 | `rgba(255,255,255,0.92)` |
| In-device title | Inter | 20–22px | 800 | `#1A1A2E` |
| In-device body | Inter | 12–15px | 500–600 | `#6B7280` |
| Chips | Inter | 22px | 600 | `#1A1A2E` on white |
| CTA button | Inter | 28px | 700 | `#FFFFFF` on `#FF6B35` |

**Rules:**
- Max **4 words per headline line**
- Max **2 lines** supporting text
- Left-align headlines (72px inset)
- High contrast on saffron — white only, no yellow-on-orange

---

# COLOR PALETTE

| Token | Hex | Use |
|-------|-----|-----|
| Saffron top | `#FF9933` | Band gradient start |
| Orange primary | `#FF6B35` | Band end, CTA, brand |
| Cream body | `#FFF9F6` | Lower 70% all screens |
| Green proof | `#00A86B` | Match %, FREE badge, ✓ |
| Charcoal | `#1A1A2E` | CTA alt, dark lifestyle zone |
| White | `#FFFFFF` | Headlines, cards |

**Avoid:** Blue gradients · neon purple · stock-photo beige · Western food tones

---

# ASO CONVERSION RECOMMENDATIONS

### App Store (iOS)

| Element | Recommendation |
|---------|----------------|
| **Screenshot 1** | Must read at thumbnail — *Aaj Kya Banaye?* |
| **Subtitle** | `Dinner decided from your pantry` |
| **Keywords** | Indian recipes, dinner ideas, pantry, Gujarati, meal planner → use *meal picks* not planner |
| **First 3 screens** | Hook + Decided + Pantry — highest install impact |
| **Localization** | Hindi subtitle optional for India storefront |

### Google Play Store (Android — priority)

| Element | Recommendation |
|---------|----------------|
| **Feature graphic** | 1024×500 — `Aaj Kya Banaye?` + kadai + phone with tonight's pick |
| **Short description** | `Decide dinner from your pantry. 1,200+ Indian recipes. 15 cuisines.` |
| **Screenshot order** | Same 8 — Play allows reorder A/B via experiments |
| **First screenshot** | Identical to iOS hook — brand recognition across ads + store |

### A/B tests to run

1. Screen 1: `Aaj Kya Banaye?` vs `Dinner, Decided.`  
2. Screen 3: `92% Match` stat in headline vs `Cook From Your Pantry`  
3. Screen 7: Notification timeline vs family kitchen photo  

### Conversion copy rules

| ✅ Use | ❌ Avoid |
|--------|---------|
| Dinner decided in seconds | AI-powered meal planner |
| Cook from your pantry | Revolutionary cooking |
| 1,200+ Indian recipes | 4,000+ (inconsistent) |
| 15 regional cuisines | Best app ever |
| Order missing ingredients | Everything free |

---

# EXPORT RECOMMENDATIONS

### iPhone App Store

| Asset | Size | Notes |
|-------|------|-------|
| Screenshots 6.7" | **1290 × 2796** | Primary — generate from `screenshots/` |
| Screenshots 6.5" | 1284 × 2778 | Scale from master |
| Screenshots 5.5" | 1242 × 2208 | Optional legacy |
| App Preview video | 1290 × 2796, 15–30s | Screens 1→3→7 motion |

### Google Play Store

| Asset | Size | Notes |
|-------|------|-------|
| Phone screenshots | **1080 × 1920** min | Scale/crop from 1290×2796 (centre-weighted) |
| 7" tablet | 1200 × 1920 | Optional |
| 10" tablet | 1600 × 2560 | Optional |
| Feature graphic | **1024 × 500** | `play-store-feature-graphic.png` in `assets/store/` |
| Promo graphic | 180 × 120 | Icon + Rasoi wordmark |

### Export workflow

```bash
cd rasoi_mobile/screenshots
npm install
npm run dev          # Preview http://localhost:5199
npm run generate     # → rasoi_mobile/app-store-assets/
```

### File naming

```
01-hero.png
02-todays-picks.png
03-pantry-match.png
04-indian-regions.png
05-smart-filters.png
06-cook-shop-order.png
07-personalization.png   # lifestyle / notifications frame
08-final.png
```

### Quality checklist before upload

- [ ] All 8 PNGs sRGB, no compression artefacts  
- [ ] Headlines readable at 25% zoom (search thumbnail)  
- [ ] No AI chat, weekly calendar, or fake ratings  
- [ ] Partner screen labels Plus/trial honestly  
- [ ] **1,200+** consistent across frames  
- [ ] Logo position identical every screen  
- [ ] Hindi hook *Aaj Kya Banaye?* on Screen 1  

---

# PLAY STORE vs APP STORE ORDER

Both platforms: **use identical order** for brand consistency with Instagram ads.

| Order | File | Why this position |
|-------|------|-------------------|
| 1 | hero | Hook / scroll-stop |
| 2 | todays-picks | Problem → solution |
| 3 | pantry-match | Strongest differentiator |
| 4 | indian-regions | Depth + SEO keywords |
| 5 | smart-filters | Lifestyle fit |
| 6 | cook-shop-order | Trust + partners |
| 7 | personalization | Emotion / notifications |
| 8 | final | CTA close |

---

*Quality bar: comparable to top 1% food & lifestyle apps. Preview in `rasoi_mobile/screenshots` before export.*
