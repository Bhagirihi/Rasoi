# Rasoi — Brand Brief for Conversion Creative

**Purpose:** Hand this to designers, ad agencies, or content creators to build ads that convert installs and registrations.
**Product:** Rasoi — Indian home-cooking companion (pantry match, regional recipes, partner checkout).
**Market:** India-first, Android-first.
**Date:** June 2026

**Related docs:**

| Doc                                                                         | Focus                                         |
| --------------------------------------------------------------------------- | --------------------------------------------- |
| [`SOCIAL_BRANDING_PLAN.md`](../SOCIAL_BRANDING_PLAN.md)                     | Social presence, content series, engagement   |
| [`RASOI_APP_STORE_DESIGN_SYSTEM.md`](../RASOI_APP_STORE_DESIGN_SYSTEM.md)   | Store screenshots, colors, 8-frame storyboard |
| [`GROWTH_PLAN_1000_USERS_30_DAYS.md`](../GROWTH_PLAN_1000_USERS_30_DAYS.md) | Paid ads, install funnel, channel mix         |
| [`social-posts-30.md`](./social-posts-30.md)                                | Ready-to-post captions                        |

---

## 1. Brand Positioning

### Recommended answer

**Primary:** Meal decision-making from what you already have at home.

**Not the lead message:** AI chat, generic recipe discovery, weekly meal planner (not built or explicitly excluded from store creative).

### Positioning statement

> Rasoi helps Indian home cooks decide what to cook tonight — based on what's already in their kitchen.

### Category

Everyday Indian kitchen companion — not a celebrity chef channel, not a YouTube replacement, not an AI chatbot.

### Hierarchy of value (in order)

1. **Tonight's dinner decided** — "Aaj kya banaye?"
2. **Pantry-to-recipe matching** — cook with what you have (% match shown in app)
3. **Personalized Indian recipes** — diet (Veg / Jain / Egg / Non-Veg) + 15 regional cuisines
4. **Cook → shop → order** — missing ingredients via Blinkit, Zepto, Instamart, Swiggy, Zomato
5. Recipe library depth (1,200+ in store copy; 4,000+ in README — pick one number and stick to it)

### What Rasoi is NOT

- A recipe library dump
- YouTube / Google replacement
- Generic Western cooking app
- AI chat assistant (not implemented)

### What Rasoi IS

- Personal **meal decision maker**
- **Indian kitchen companion** (15 cuisines)
- **Pantry-to-recipe** assistant
- **Cook → shop → order** in one flow

---

## 2. Target Audience

### Recommended primary + secondary

| Priority      | Segment                                                         | Why                                                                                 |
| ------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Primary**   | Working professionals & busy parents (25–40) cooking at home    | Onboarding, notifications, and copy target the daily "what's for dinner?" stress    |
| **Secondary** | Indian families (decision-maker = usually the person who cooks) | Regional cuisine picker, family meal slots, thali-style content                     |
| **Tertiary**  | Students / bachelors                                            | "Hostel cooking", leftovers, quick filters — good for Reels, not primary ad persona |

### Creative implication

Lead with a **28–35-year-old woman or couple in an Indian kitchen at 6–7 PM or House wifes or working house wifes** — not a fitness influencer, not a premium gourmet aesthetic.

### Market

India-first, Android-first.

---

## 3. Unique Selling Proposition (USP)

### What to claim vs. avoid

| ✅ Say this                                           | ❌ Don't say this                                       |
| ----------------------------------------------------- | ------------------------------------------------------- |
| Personalized dinner picks from your pantry            | "AI-powered" / chat assistant (not implemented)         |
| 92% pantry match, "Cook from what you have"           | Weekly meal planner calendar (not built)                |
| 15 Indian cuisines, regional flavours                 | "Revolutionary" / generic startup hype                  |
| 5 daily meal nudges (8am, 12:30pm, 4pm, 7pm, 10pm)    | YouTube/Google replacement framing                      |
| Order missing items in one tap (Blinkit, Zepto, etc.) | Every feature is free (partner checkout = trial / Plus) |
| Less food waste, fewer "missing ingredient" surprises |                                                         |

### One-line USP for ads

> Rasoi tells you what to cook today from what you already have — and helps you get what's missing.

### vs. YouTube / Google

YouTube teaches one recipe; Rasoi **decides** from your pantry, diet, region, and time of day — in seconds, without scrolling.

---

## 4. App Screenshots

### What exists and what to show

8-frame store storyboard lives in `rasoi_mobile/screenshots/` and [`RASOI_APP_STORE_DESIGN_SYSTEM.md`](../RASOI_APP_STORE_DESIGN_SYSTEM.md).

For **conversion ads**, prioritize these real screens:

| Screen                                | What it shows                                | Ad hook                 |
| ------------------------------------- | -------------------------------------------- | ----------------------- |
| **Home** (`index.tsx`)                | Tonight's top pick, greeting, pantry match % | "Dinner, decided."      |
| **Pantry** (`pantry.tsx`)             | Have / need grid, match %                    | "Cook from your pantry" |
| **Recipe detail** (`recipe/[id].tsx`) | Steps, ingredients, missing items            | Real app credibility    |
| **Tonight's picks**                   | Meal-slot ranked recipes                     | "5 daily meal picks"    |
| **Partner checkout**                  | Blinkit / Zepto / Swiggy grid                | "Shop. Order. Eat."     |
| **Onboarding**                        | Diet + cuisine picker                        | Personalization proof   |

### Do NOT show in ads

- AI chat UI
- Weekly calendar
- Social feed

(These would mislead users and hurt conversion.)

### Assets

| Asset                  | Path                                                     |
| ---------------------- | -------------------------------------------------------- |
| Screenshot preview app | `rasoi_mobile/screenshots/` (`npm run dev` → export)     |
| Logo                   | Kadai illustration + **RASOI** wordmark                  |
| Store frame colours    | Saffron band `#FF9933` → `#FF6B35`, cream body `#FFF9F6` |

### 8-frame store story (v2)

| #   | Headline                | Pattern borrowed                            |
| --- | ----------------------- | ------------------------------------------- |
| 01  | Aaj Kya Banaye?         | Jamvanu band + cream lockup + Taco Bell CTA |
| 02  | Dinner, Decided.        | Jamvanu hero pick + floating push           |
| 03  | Cook From Your Pantry   | Blinkit Have/Need grid + match %            |
| 04  | 1,200+ Recipes          | Swiggy number in headline                   |
| 05  | Shop. Order. Eat.       | Plat partners + Zepto minimal               |
| 06  | 5 Daily Meal Picks      | Jamvanu notification timeline               |
| 07  | Fuel Your Kitchen       | Zomato emotion + food spread                |
| 08  | Cook Smarter With Rasoi | Credibility grid + Download CTA             |

---

## 5. Brand Personality

### Recommended: B + C blend

| Style                     | Fit for Rasoi                                             |
| ------------------------- | --------------------------------------------------------- |
| A. Premium (Apple)        | ❌ Too cold for "aaj kya banaye?"                         |
| **B. Friendly (Swiggy)**  | ✅ Primary — fast, warm, practical                        |
| **C. Traditional Indian** | ✅ Secondary — regional food, family kitchen, real plates |
| D. AI Futuristic          | ❌ Product isn't an AI assistant; would feel inauthentic  |

### Voice & tone

| Do                                                        | Don't                                                |
| --------------------------------------------------------- | ---------------------------------------------------- |
| Warm, practical, like a helpful neighbour                 | Hype-y startup speak ("revolutionary", "disrupting") |
| Short Hindi-English mix where natural                     | Forced Hinglish on every line                        |
| Celebrate regional food (15 cuisines)                     | One-cuisine default (e.g. only North Indian)         |
| Show real home cooking (messy counter OK)                 | Over-produced studio food only                       |
| Honest about shortcuts (frozen, tinned, partner delivery) | Pretend every meal is from scratch                   |

### Visual references (from design system)

- **Jamvanu** — orange band + headline
- **Swiggy** — numbers in headline
- **Blinkit** — pantry grid
- **Plat / Zepto** — partner screen

---

## 6. Color Preferences

### Brand palette (from codebase)

| Token          | Hex                   | Use                            |
| -------------- | --------------------- | ------------------------------ |
| Primary orange | `#FF6B35`             | CTAs, gradients                |
| Saffron        | `#FF9933`             | Header bands, brand warmth     |
| Cream          | `#FFF9F6` / `#FAFAFA` | Backgrounds                    |
| Green          | `#00A86B`             | Success, veg, match checkmarks |
| Charcoal       | `#1A1A2E`             | Text on light backgrounds      |
| Egg yellow     | `#F4C430`             | Accent                         |

### Layout formula (store / social)

~30% orange band (headline) + ~70% cream body (phone mockup overlapping band).

### Typography

- Bold headlines
- Readable subtitles
- Bilingual on Reels (many watch muted)

### Logo usage

Kadai illustration + wordmark **RASOI** — top-left, consistent position.
Do **not** use the orange rounded-square app icon frame on blue backgrounds.

---

## 7. Primary Conversion Goal

### By funnel stage

| Stage                        | Goal                                      | CTA copy                            |
| ---------------------------- | ----------------------------------------- | ----------------------------------- |
| **Cold ads (Meta / Google)** | Install app                               | "Download free" / "Get Rasoi"       |
| **Post-install**             | Complete registration (OTP)               | Target ~40% install → signup        |
| **Post-signup**              | Enable notifications + set diet / cuisine | "Never ask what's for dinner again" |
| **Monetization**             | Start 3-day Rasoi Plus trial              | Partner checkout unlocked           |

### Recommendation for paid creative

Lead with **Install**, not Register — registration is in-app friction optimized separately.

### Current distribution

APK via [GitHub Releases](https://github.com/Bhagirihi/Rasoi/releases/latest). Play Store listing still in growth prerequisites.

---

## 8. Emotional Trigger

### Primary + supporting

| Priority   | Trigger                 | Copy examples                                           |
| ---------- | ----------------------- | ------------------------------------------------------- |
| **#1**     | Remove daily stress     | "Never ask 'What's for dinner?' again"                  |
| **#2**     | Save time / decide fast | "Dinner decided in 30 seconds"                          |
| **#3**     | Family happiness        | Regional thali, "tonight's pick for the family"         |
| Supporting | Reduce food waste       | "Cook with what you have"                               |
| Supporting | Smart cooking           | Pantry match %, quick filters (under 20 min, leftovers) |

### Hero hook for all platforms

**"Aaj kya banaye?"** — it's the problem, the brand, and the series name (`#AajKyaBanaye`).

---

## 9. Platform

### Creative specs by channel

| Platform              | Format                          | Content                                         | CTA             |
| --------------------- | ------------------------------- | ----------------------------------------------- | --------------- |
| **Instagram Reels**   | 9:16, 15–30s, hook in 2s        | Pantry → dinner pick screen record (3–5s UI)    | Link in bio     |
| **Instagram Story**   | 9:16, poll + "tonight's pick"   | Same Reels, add sticker CTAs                    | Swipe up / link |
| **Instagram Feed**    | 1:1 or 4:5 carousel             | Orange band + phone mockup (Jamvanu style)      | Download        |
| **Facebook**          | Cross-post Reels                | Longer captions OK                              | APK link        |
| **Google UAC**        | App campaigns                   | Real screenshots + "Indian recipes from pantry" | Install         |
| **Play Store**        | 8 screenshots + feature graphic | Use `screenshots/` 8-frame story                | —               |
| **WhatsApp forwards** | Short clip, no hard sell        | "Fridge mein sirf yeh hai — dinner sorted"      | APK link        |

### Reel shot list (batch once)

1. Open app → pantry → dinner in 10 sec
2. 3-ingredient dinner
3. One regional dish per week
4. Partner moment — "Missing dhaniya → Blinkit from recipe"
5. Diet filter — "Veg · 20 min · Gujarati"
6. Leftover upgrade
7. Weeknight — "Tuesday 8pm, nothing planned"
8. Carousel source — "5 dinners from atta, rice, dal, aloo, onion"

---

## 10. Tagline Options

Pick **one** for all bios; use others as sublines.

| Option                         | Best for                          |
| ------------------------------ | --------------------------------- |
| **"Aaj kya banaye?"**          | Brand recall, Reels, India-first  |
| **"Dinner, decided."**         | English ads, App Store headline   |
| **"Cook with what you have."** | Pantry / feature-focused creative |

**Recommendation:** **"Aaj kya banaye?"** as hero; **"Dinner, decided."** as English subline.

### Bio template (all platforms)

```
Rasoi 🍲
Aaj kya banaye? Personalized Indian recipes from your pantry.
15 cuisines · Veg & non-veg · Partner grocery links
[Link: Play Store / APK / Linktree]
```

---

## 11. Sample Creative Brief (one paragraph for a designer)

> Create Instagram Reels and Play Store assets for **Rasoi**, an Indian kitchen app that solves "Aaj kya banaye?" — not a recipe blog or AI chatbot. Target: busy Indian home cooks, 25–40, Android. Show real app screens: home tonight's pick, pantry match %, regional recipes, partner checkout. Style: friendly Swiggy energy + warm Indian kitchen (terracotta / saffron `#FF9933`–`#FF6B35`, cream `#FFF9F6`). Headlines max 8 words. Primary emotion: dinner stress removed. CTA: Download free. Do not show AI chat, weekly planner, or generic stock food only.

---

## 12. Open Decisions (your call)

1. **Recipe count in ads:** 1,200+ (store system) vs 4,000+ (README) — align before launch.
2. **Primary persona:** Working woman vs. family vs. couple — affects casting and photography.
3. **Lead tagline:** "Aaj kya banaye?" vs "Dinner, decided." for paid ads.
4. **Play Store live yet?** Ads should point to Play Store once listed; until then, APK / GitHub link adds friction.

---

## 13. Caption & Hashtag Bank

### Opening hooks (rotate)

- "Aaj kya banaye? 🤔"
- "Fridge mein sirf yeh hai — phir bhi dinner sorted."
- "20 minutes. 5 ingredients. Full dinner."
- "Gujarati / Punjabi / South — aapki rasoi, aapki choice."
- "No meal plan? No problem."

### Hashtags (mix 8–12 per post)

**Brand:** `#RasoiApp` `#AajKyaBanaye` `#RasoiRegional`
**Broad:** `#IndianFood` `#HomeCooking` `#DesiFood` `#IndianRecipes`
**Discovery:** `#RecipeReels` `#FoodReels` `#DinnerIdeas` `#QuickRecipes`
**Regional (swap per post):** `#GujaratiFood` `#SouthIndianFood` `#PunjabiFood` etc.

---

_Next step: Share this file + exported screenshots from `rasoi_mobile/screenshots/` with your designer or ad agency._
