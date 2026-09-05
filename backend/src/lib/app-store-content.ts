/**
 * Marketing copy sourced from Rasoi/App Play Console store listing.
 * Keep in sync with App/store/play-console/manifest.json → storeListing.
 */
export const APP_STORE_LISTING = {
  title: 'Rasoi App: Aaj Kya Banaye?',
  shortDescription:
    'Indian recipe app — Aaj kya banaye? Pantry match %, Veg & Jain. 1,200+ dishes.',
  heroEyebrow: 'Every evening, the same question: Aaj kya banaye?',
  heroLead: "Rasoi — India's home cooking companion.",
  heroBody:
    'Dinner ideas from your pantry — match %, Veg & Jain filters, and 1,200+ regional recipes.',
  heroTrust: 'On Google Play · 1,200+ Indian recipes',
  liveBadge: 'Free on Google Play for Android',
  whyChoose: [
    {
      title: "Tonight's picks",
      body: 'Personalised suggestions for breakfast, lunch, dinner & late-night.',
    },
    {
      title: 'Cook from your pantry',
      body: 'Add ingredients at home and see recipe match % instantly.',
    },
    {
      title: '1,200+ Indian recipes',
      body: 'Gujarati, Punjabi, South Indian, Bengali, Maharashtrian & more.',
    },
    {
      title: 'Diet filters',
      body: 'Veg, Jain, Egg & Non-Veg so every household eats right.',
    },
    {
      title: 'Regional cuisines',
      body: '15 kitchen styles including Kathiyawadi, Surti, North & South Indian.',
    },
    {
      title: 'Quick filters',
      body: 'Under 20 minutes, kid-friendly, leftover-friendly & budget picks.',
    },
  ],
  /** Grouped feature themes for the landing page (from Rasoi/App). */
  featureThemes: [
    {
      theme: 'Decide',
      title: 'Tonight, decided',
      items: [
        {
          title: "Tonight's picks",
          body: 'Personalised breakfast, lunch, dinner & late-night suggestions.',
        },
        {
          title: 'Diet filters',
          body: 'Veg, Jain, Eggitarian or Non-Veg for every household.',
        },
        {
          title: 'Quick filters',
          body: 'Under 20 mins, Kids, Leftover, Budget & small servings.',
        },
      ],
    },
    {
      theme: 'Pantry',
      title: 'Cook from what’s home',
      items: [
        {
          title: 'Cook from pantry',
          body: 'Add what’s at home and see recipe match % instantly.',
        },
        {
          title: '1,200+ Indian recipes',
          body: 'Gujarati, Punjabi, South Indian, Bengali, Maharashtrian & more.',
        },
        {
          title: 'Regional kitchen styles',
          body: '15 styles including Kathiyawadi, Surti, North & South Indian.',
        },
      ],
    },
    {
      theme: 'Plan',
      title: 'Make dinner a habit',
      items: [
        {
          title: 'Daily meal reminders',
          body: 'Gentle nudges with personalized picks across meal slots.',
        },
        {
          title: '3-day meal planner',
          body: 'Plan Today, Tomorrow & the day after with pantry-ready counts.',
        },
        {
          title: 'Save favourites',
          body: 'Bookmark go-to dishes and re-cook favourites in one tap.',
        },
      ],
    },
    {
      theme: 'Plus',
      title: 'Optional Rasoi Plus',
      items: [
        {
          title: 'Ad-free + delivery links',
          body: 'Blinkit, Zepto, Instamart, Zomato & Swiggy when you need what’s missing.',
        },
      ],
    },
  ],
  howItWorks: [
    {
      n: '1',
      title: 'Set your kitchen',
      body: 'Choose diet, region, and favourite cuisines during onboarding.',
    },
    {
      n: '2',
      title: 'Add your pantry',
      body: 'Dal, rice, paneer, sabzi, masalas — what’s already at home.',
    },
    {
      n: '3',
      title: 'Get daily picks',
      body: 'Suggestions matched to your kitchen and preferences.',
    },
    {
      n: '4',
      title: 'Cook tonight',
      body: 'Cook the dish — or explore 1,200+ everyday Indian recipes.',
    },
  ],
  perfectFor: [
    'Homemakers tired of deciding what to cook every day',
    'Working professionals who want quick, practical dinner ideas',
    'New cooks learning regional family recipes',
    'Jain & pure-veg households needing safe, filtered suggestions',
    'Anyone who has ever opened the fridge and thought — aaj kya banaye?',
  ],
  plusNote:
    'Upgrade for an ad-free experience and one-tap grocery & food delivery links via Blinkit, Zepto, Instamart, Zomato & Swiggy. Core recipes, pantry matching, and daily picks are free to start.',
  closing: 'Download the Rasoi app today — stop wondering what to cook. Start cooking.',
} as const;
