# Rasoi — 1,000+ Users in 30 Days (Growth Plan)

> **Building brand first?** See [`SOCIAL_BRANDING_PLAN.md`](./SOCIAL_BRANDING_PLAN.md) — social presence, content series, and engagement with **no install targets**. Use this growth doc when you are ready to convert attention into downloads.

**Goal:** 1,000+ app installs (or registered users) within 30 days of launch.  
**Product:** Rasoi — personalized Indian recipe app with pantry matching, 1,200 recipes, 15 cuisines, partner checkout (Blinkit/Zepto/Swiggy/Zomato), Rasoi Plus trial.  
**Market:** India (primary), Android-first.  
**Date drafted:** June 2026

---

## 1. Define “1,000 users” (pick one primary metric)

| Metric | What it means | Recommended? |
|--------|---------------|--------------|
| **Play Store installs** | Total download count | Easiest to track |
| **Registered users** | Email/phone OTP completed | Better quality signal |
| **Weekly active users (WAU)** | Opened app + viewed ≥1 recipe in 7 days | Best for retention focus |

**Recommendation:** Target **1,000 Play Store installs** + **400 registered users** (40% signup rate) in 30 days.

---

## 2. Math — what you need daily

| Target | Daily average |
|--------|---------------|
| 1,000 installs / 30 days | **~34 installs/day** |
| 400 signups @ 40% | **~13 signups/day** |

Without paid ads, organic alone rarely hits 34/day for a new app. Plan for **60% paid / 40% organic**.

---

## 3. Prerequisites (Week 0 — before Day 1)

Complete these before spending on growth:

- [ ] **EAS production build** + **Google Play listing** (closed test → open testing → production)
- [ ] **Privacy policy URL** (required for Play + AdMob + affiliates)
- [ ] **Firebase Analytics** + **Play Install Referrer** (track channel)
- [ ] **Deep links** (`rasoi://` + web fallback) for WhatsApp sharing
- [ ] **Store assets:** 8 screenshots, feature graphic, short + full description (Hindi optional)
- [ ] **AdMob** + **affiliate links** live (monetization proof for investors/partners)
- [ ] **OTP login** tested on real devices (your QA gap)

---

## 4. Platform stack — what to use

### Tier 1 — Must use (70% of effort)

| Platform | Role | Why for Rasoi |
|----------|------|---------------|
| **Google Play Store** | Distribution | 95%+ of Indian Android users |
| **Google UAC (App Campaigns)** | Paid installs | Best CPI for Android in India (₹25–80/install) |
| **Instagram Reels** | Organic + paid | Recipe video = native content; homemaker audience |
| **WhatsApp** | Referral + groups | India’s #1 sharing channel; “tonight’s dinner” forwards |
| **Meta Ads (Facebook/Instagram)** | Paid + retargeting | Interest: cooking, meal planning, grocery apps |

### Tier 2 — High value (25% of effort)

| Platform | Role | Why |
|----------|------|-----|
| **YouTube Shorts** | Organic recipe clips | SEO + discovery; reuse Reels content |
| **Firebase / Google Analytics** | Attribution | Which channel converts to signup |
| **Google Search / ASO** | Long-term | Keywords: “dinner recipes”, “Gujarati recipes”, city names |
| **ShareChat / Moj** | Regional reach | Gujarati, Marathi, Tamil hooks if you localize content |
| **Micro-influencers (10–50k)** | Trust | 5–10 food creators @ ₹2k–8k per Reel |

### Tier 3 — Optional / later

| Platform | Role | Notes |
|----------|------|-------|
| **Apple App Store** | iOS users | Smaller India volume; do after Android traction |
| **Twitter/X** | Tech + food Twitter | Low volume but cheap experiments |
| **Reddit** (r/IndianFood, r/india) | Authentic posts | No spam; share “I built an app for…” story |
| **Product Hunt** | Launch buzz | Mostly global tech; bonus 50–200 visits |
| **Telegram food channels** | Cross-post | Partner with existing recipe channels |
| **Cuelinks / Admitad** | Affiliate + content | Monetize blog/Reels links to partners |

### Tools to run the operation

| Tool | Purpose |
|------|---------|
| **Notion or Google Sheet** | Content calendar + KPI dashboard |
| **Canva** | Reels thumbnails, Play screenshots |
| **Linktree / custom landing** | Single link for bio |
| **Bitly / Firebase Dynamic Links** | Track WhatsApp referral sources |
| **PostHog or Mixpanel** | Funnel: install → onboarding → trial → partner tap |
| **Play Console** | Store experiments, crash rates, reviews |

---

## 5. 30-day execution plan

### Week 1 — Launch foundation (Days 1–7)  
**Target: 120 installs**

| Day | Action |
|-----|--------|
| 1–2 | Publish Play Store **open testing**; share with 50 friends/family for first reviews |
| 2 | Submit **AdMob** + verify ads in release build |
| 3 | Post **3 Instagram Reels** (15 sec): “3 ingredients dinner”, pantry match demo, partner checkout |
| 4 | Set up **Google UAC** at ₹500/day cap; creatives = Reels + screenshot carousel |
| 5 | Launch **WhatsApp share** on recipe detail: “Cook this tonight” + deep link |
| 6 | Join 5 Facebook groups (“Indian home cooking”, regional cuisine); helpful posts, not spam |
| 7 | Review analytics: CPI, onboarding completion %, fix top crash |

**Content themes:** “What’s for dinner?”, regional cuisine (Gujarati, South, Punjabi), “cook with what’s in your pantry”.

---

### Week 2 — Influencer + paid scale (Days 8–14)  
**Target: 280 cumulative (160 new)**

| Action | Detail |
|--------|--------|
| **10 micro-influencers** | ₹3k–5k each; brief: show app picking recipe + Blinkit/Swiggy tap |
| **Meta retargeting** | Pixel on landing page; retarget video viewers |
| **Referral hook** | “Share recipe → friend gets same pick” (track via link param) |
| **ASO update** | Add 1,200 recipes, 15 cuisines in description; keywords in Hindi |
| **YouTube Shorts** | Repost top 3 Reels |

**Budget:** ₹15,000–20,000 (ads + 3 influencers)

---

### Week 3 — Double down on winners (Days 15–21)  
**Target: 600 cumulative (320 new)**

| Action | Detail |
|--------|--------|
| **Scale best UAC ad set** | Kill CPI > ₹100; scale CPI < ₹60 |
| **5 more influencers** | Focus on cuisine matching your best signup region (check analytics) |
| **User-generated content** | Repost users’ dinner photos (with permission) |
| **Push trial** | In-app: “3-day free partner access” banner (you already have trial UX) |
| **PR pitch** | Email 5 Indian tech/food blogs (YourStory, Beebom food vertical) |

**Experiment:** Regional Reels in **one** language (Gujarati OR Hindi) if data shows West/North traction.

---

### Week 4 — Sprint to 1,000 (Days 22–30)  
**Target: 1,000+ cumulative (400+ new)**

| Action | Detail |
|--------|--------|
| **Increase ad spend** | ₹800–1,200/day if CPI holds |
| **Play Store feature request** | Apply via Play Console (long shot) |
| **Countdown social** | “1,000 home cooks on Rasoi” milestone post |
| **Review prompt** | After 2nd recipe view, ask for Play review (in-app) |
| **Retarget abandoners** | Users who installed but didn’t complete onboarding |

**Fallback if behind pace at Day 20:**  
- Flash **₹49/year** first-year offer for Rasoi Plus  
- Run **₹2k nano-influencer** burst (20 creators @ ₹2k)

---

## 6. Budget scenarios (INR, 30 days)

| Scenario | Ad spend | Influencers | Tools | Total | Expected installs |
|----------|----------|-------------|-------|-------|-------------------|
| **Lean** | ₹12,000 | ₹10,000 | ₹3,000 | **₹25,000** | 400–600 |
| **Target** | ₹30,000 | ₹20,000 | ₹5,000 | **₹55,000** | 800–1,200 |
| **Aggressive** | ₹60,000 | ₹35,000 | ₹5,000 | **₹1,00,000** | 1,500–2,500 |

*Assumes blended CPI ₹40–70 on Google UAC + Meta.*

---

## 7. Funnel KPIs to track weekly

| Stage | Target (30-day) | Tool |
|-------|-----------------|------|
| Store listing views | 15,000+ | Play Console |
| Installs | 1,000+ | Play Console |
| Onboarding completed | 70%+ of opens | Firebase |
| Registered (OTP) | 400+ | Supabase / backend |
| Trial started | 80+ (20% of registered) | App analytics |
| Partner link tapped | 50+ | AffiliateEvent table |
| Day-7 retention | 15%+ | Firebase |
| Play rating | 4.2+ (min 30 reviews) | Play Console |

---

## 8. Messaging that works for Rasoi

**One-liner:** “Rasoi tells you what to cook tonight — based on your pantry, diet, and cuisine.”

**Hooks for ads/Reels:**
- “Open fridge → get dinner recipe in 10 seconds”
- “Veg · Gujarati · 20 min — try Rasoi free”
- “Missing 2 items? Order on Blinkit from the recipe screen”

**Avoid:** Generic “best recipe app”; lead with **personalization + partners**.

---

## 9. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Expo Go only (no Play build) | **Blocker** — ship EAS APK/AAB first |
| High install, low signup | Simplify guest mode; delay OTP until partner tap |
| AdMob rejection | Privacy policy + “contains ads” declaration |
| Affiliate links not approved | Partners still work as deep links; revenue later |
| CPI too high | Shift budget to influencers + WhatsApp referrals |

---

## 10. Day-30 success checklist

- [ ] 1,000+ Play Store installs
- [ ] 400+ registered users
- [ ] 30+ Play Store reviews (4+ stars)
- [ ] 3+ acquisition channels with tracked CPI
- [ ] AdMob earning (even ₹500/month proves model)
- [ ] 1 affiliate network approved (Cuelinks/Admitad)
- [ ] Documented “what worked” for month 2

---

## 11. Commands & assets in this repo

| Item | Path |
|------|------|
| Production API | `https://rasoiapp.vercel.app` |
| Recipe catalog | 1,200 recipes in Supabase |
| Seed recipes | `npm run db:seed-recipes` (backend) |
| Mobile env | `rasoi_mobile/.env` |
| QA skill | `.cursor/skills/expo-mobile-qa/` |

---

## 12. Recommended first 7 days (copy-paste todo)

1. `eas build --platform android --profile production`
2. Create Play Console app + closed testing track
3. Connect Firebase to Expo app
4. Record 3 Reels (screen recording + voiceover)
5. Launch Google UAC with ₹500/day
6. Share app link in 3 WhatsApp family groups
7. DM 5 food micro-influencers with free Rasoi Plus trial

---

*Next review: Day 7 — check installs vs 120 target; adjust spend and content.*
