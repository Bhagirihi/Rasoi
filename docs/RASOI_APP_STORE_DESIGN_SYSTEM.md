# Rasoi — App Store Design System

**Version:** 1.0  
**Canvas:** 1290 × 2796 px (iPhone 6.7" App Store)  
**Style reference:** TerriTool, CoachCraft — premium SaaS App Store screenshots  
**Date:** June 2026

---

## 1. Product positioning (design must sell this)

### User problem
Every day: **"Aaj kya banaye?"** — deciding what to cook is harder than cooking.

### Rasoi is NOT
- A recipe library dump
- YouTube replacement
- Generic Western cooking app
- AI chat assistant (not implemented)

### Rasoi IS
- Personal **meal decision maker**
- **Indian kitchen companion** (15 cuisines)
- **Pantry-to-recipe** assistant
- **Cook → shop → order** in one flow

### One-line USP (use on Screen 1 & 8)
> Rasoi tells you what to cook today from what you already have — and helps you get missing ingredients.

---

## 2. Brand assets (from codebase)

| Asset | Path |
|-------|------|
| App icon (source) | `rasoi_mobile/assets/store/rasoi-app-icon-source.png` |
| Kadai logo (transparent) | `rasoi_mobile/assets/store/rasoi-kadai-transparent.png` |
| Screenshot preview app | `rasoi_mobile/screenshots/` |
| Premium PNG output | `rasoi_mobile/app-store-assets/` (after export approval) |

**Logo usage:** Kadai illustration + wordmark **RASOI** — top-left, same position every screen.  
**Do not** use the orange rounded-square app icon frame on blue backgrounds.

---

## 3. Brand colors

### Store screenshot palette (Jamvanu-style — NOT blue)

| Token | Hex | Use |
|-------|-----|-----|
| `store.band.top` | `#FF9933` | Orange band top (saffron) |
| `store.band.bottom` | `#FF6B35` | Orange band bottom (primary) |
| `store.body` | `#FFF9F6` | Cream lower zone |
| `store.text.primary` | `#FFFFFF` | Headlines in orange band |
| `store.text.tagline` | `rgba(255,255,255,0.92)` | Hero tagline only |

### Layout (Jamvanu formula)

| Zone | ~% height | Content |
|------|-----------|---------|
| Orange band | ~30% (840px) | Headline only (+ kadai mark on screen 1, glass lockup on screen 8) |
| Cream body | ~70% | Large flat phone overlapping band by ~128px |

**Rule:** No full-gradient backgrounds. Phone mockup is **680×1380**, centred, no tilt. Logo on **screen 1** (kadai mark) and **screen 8** (full lockup + in-phone branding).

---

## 4. Typography

| Role | Font | Size | Weight | Color |
|------|------|------|--------|-------|
| Headline | Inter | 84px | 800 | White (in orange band) |
| Headline line height | — | — | — | max 2–4 words per line |
| Benefit (bottom) | Inter | 34px | 500 | White 82% |
| Logo wordmark | Inter | ~28px | 800 | White, letter-spacing 0.12em |
| In-device title | Inter | 20–22px | 800 | Charcoal |
| In-device body | Inter | 12–15px | 500–600 | Charcoal 50–100% |
| Floating chip | Inter | 22px | 600 | Charcoal on white |

**Headline rules:**
- Left-aligned, `72px` from left edge
- Break lines for impact ("Aaj Kya\nBanaye?")
- Optional white glass highlight on one word (sparingly)

---

## 5. Spacing & layout system

```
Canvas:     1290 × 2796
Margin X:   72px
Top:        120px (logo at ~80px)
Headline:   starts ~176px from top
Middle:     520px – 2516px (device + floating UI)
Benefit:    96px from bottom
```

### Vertical zones

| Zone | Y range | Content |
|------|---------|---------|
| Brand | 80–160px | Logo + RASOI |
| Headline | 176–480px | 1–2 line headline |
| Hero | 520–2200px | Device mockup + floating cards |
| Benefit | bottom 96px | One sentence value prop |

### Device mockup

- Frame: ~420×860px screen, 14px bezel, 52px radius
- Dynamic Island: centered, 118×34px
- Rotation: −6° to +6° (varies per screen, consistent shadow)
- Shadow: `drop-shadow(0 40px 80px rgba(0,0,0,0.45))`

---

## 6. Component design rules

| Component | Rule |
|-----------|------|
| **GradientBackground** | Same blue gradient on all 8 screens — never change per screen |
| **LogoHeader** | Kadai + RASOI, top-left, 72px inset |
| **FeatureHeadline** | White, bold, 2 lines max |
| **DeviceMockup** | Marketing UI inside — not raw app exports |
| **FloatingCard** | White or glass, 20–24px radius, soft shadow |
| **RecipeCard** | Image + title + diet/cuisine/time tags |
| **CuisineCard** | Regional name + food photo |
| **IngredientMatchCard** | Checkmarks + match % + missing count |

### Visual style
- Glassmorphism on stat pills and hero cards
- Rounded corners (16–24px)
- Minimal text — sell benefit, not feature list
- Indian food photography (warm, real plates)
- No fake AI labels, no weekly calendar, no chat UI

---

## 7. Feature mapping (implemented only)

| Screen | Feature in codebase | Key files |
|--------|---------------------|-----------|
| 01 Hero | Tonight picks, personalization | `app/(tabs)/index.tsx` |
| 02 Today's picks | Meal slots + ranked recipes | `utils/mealTime.ts`, `utils/recipes.ts` |
| 03 Pantry match | Pantry toggle + match % | `app/(tabs)/pantry.tsx` |
| 04 Indian regions | 1,200 recipes, 15 cuisines | `constants/theme.ts` CUISINE_OPTIONS, API |
| 05 Smart filters | under20, leftover, kids + diet | `app/(tabs)/index.tsx` QUICK_FILTERS |
| 06 Cook/shop/order | Blinkit, Zepto, Instamart, Swiggy, Zomato | `constants/partners.ts`, `utils/affiliate.ts` |
| 07 Personalization | Diet + cuisine onboarding | `app/(auth)/onboarding.tsx` |
| 08 Final CTA | Free start, 1,200 recipes, brand | `constants/plans.ts` |

### Do NOT show
- AI chat / GPT assistant
- Weekly meal planner calendar
- Social feed / user posts
- Features gated as "free" that require Plus without labeling (partner checkout = trial/Plus)

---

## 8. Screenshot storyboard (8 screens)

| # | File | Headline | Bottom benefit |
|---|------|----------|----------------|
| 01 | `01-hero.png` | Aaj Kya Banaye? | Never struggle with deciding your next meal. |
| 02 | `02-todays-picks.png` | Your Meal, Decided | Know what to cook today in seconds. |
| 03 | `03-pantry-match.png` | Cook With What You Have | Turn your pantry into delicious meals. |
| 04 | `04-indian-region-recipes.png` | Explore Indian Regions | Your favourite regional flavours in one app. |
| 05 | `05-smart-filters.png` | Find What Fits Today | Cook according to your time and lifestyle. |
| 06 | `06-cook-shop-order.png` | Cook. Shop. Order. | From recipe to ready meal. |
| 07 | `07-personalization.png` | Made For Your Kitchen | Recipes that match your taste. |
| 08 | `08-final.png` | Cook Smarter With Rasoi | Your everyday Indian kitchen companion. |

---

## 9. Preview & export workflow

### Step 1 — Preview (approve designs)
```bash
cd rasoi_mobile/screenshots
npm install
npm run dev
```
Open **http://localhost:5199** — gallery lists all 8 screens.  
Click any screen or use `?screen=hero`, `?screen=pantry-match`, etc.

### Step 2 — Export PNGs (after approval)
```bash
cd rasoi_mobile/screenshots
npm run generate
```
Outputs to `rasoi_mobile/app-store-assets/`.

### Screen query params
`hero` · `todays-picks` · `pantry-match` · `indian-regions` · `smart-filters` · `cook-shop-order` · `personalization` · `final`

---

## 10. Designer handoff checklist

If hiring an external designer, send them:

- [ ] This document
- [ ] `rasoi-kadai-transparent.png`
- [ ] `docs/SOCIAL_BRANDING_PLAN.md` (voice & hooks)
- [ ] Reference: [TerriTool App Store](https://apps.apple.com/us/app/territool-ai-field-sales/id1399506362)
- [ ] 8 headlines + benefit lines from §8
- [ ] Canvas: **1290×2796**, PNG, sRGB
- [ ] **Marketing illustrations** — not raw app screenshots
- [ ] Feature list from §7 only — no invented features

---

## 10. Competitor screenshot analysis (June 2026)

### What top apps do

| App | Screenshot pattern | What converts |
|-----|-------------------|---------------|
| **Zomato** | Emotion-first frame 1 ("Fuel Your Hustle"), food spread not phone, dark + cream split | Lifestyle identity, not feature list |
| **Swiggy** | Light UI, speed, minimal copy, performance clarity | Fast decision, no clutter |
| **Blinkit** | Bold product imagery, yellow brand, urgency, one-tap messaging | Speed + action |
| **Zepto** | Ultra-minimal, purple brand, reorder shortcuts, no banner clutter | Fewer steps = higher conversion |
| **Instamart** | Orange Swiggy family, grocery grid, delivery promise | Brand colour consistency |
| **Jamvanu** | Orange band + short headline + large content, notification-first story | "Dinner decided" — direct competitor |
| **Plat / Toing** | Phone mockup + caption per feature, partner integration screen | Feature credibility |
| **Taco Bell** | Bold headline, food hero shots, appetite appeal | High-contrast food photography |

### Rules we applied to Rasoi (v2 — full competitor rebuild)

1. **Jamvanu split layout** — Orange band **900px** (~32%) for headline + tagline; cream body `#FFF9F6` with **72px overlap** (no phones).
2. **Search zone** — Headline + tagline must work in App Store search crop.
3. **Caption-first** — Max 8 words per headline line. Benefit verbs: *Decided*, *Cook*, *Shop*, *Order*.
4. **Screen 1** — Jamvanu orange hook + cream brand lockup + Taco Bell clarity (icon, FREE badge, Download CTA).
5. **Screen 7** — Zomato dark emotion top + food spread bottom (unchanged pattern).
6. **Numbers lead** — "1,200+" in headline (screen 04), "92% match", "5 Daily Meal Picks".
7. **Partner screen** — Plat real brand colours; Zepto-minimal grid on cream.
8. **Notifications** — Jamvanu timeline push cards on cream.
9. **Backup** — Pre-v2 copy at `rasoi_mobile/screenshots-backup-pre-v2/`.

### Rasoi 8-frame story (v2)

| # | Headline | Pattern borrowed |
|---|----------|------------------|
| 01 | Aaj Kya Banaye? | Jamvanu band + cream lockup + Taco Bell CTA |
| 02 | Dinner, Decided. | Jamvanu hero pick + floating push |
| 03 | Cook From Your Pantry | Blinkit Have/Need grid + match % |
| 04 | 1,200+ Recipes | Swiggy number in headline |
| 05 | Shop. Order. Eat. | Plat partners + Zepto minimal |
| 06 | 5 Daily Meal Picks | Jamvanu notification timeline |
| 07 | Fuel Your Kitchen | Zomato emotion + food spread |
| 08 | Cook Smarter With Rasoi | Credibility grid + Download CTA |

---

*Next step: Preview at `npm run dev` → approve → `npm run generate`.*
