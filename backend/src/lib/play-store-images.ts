/**
 * Marketing images synced from Rasoi/App store assets.
 * Source of truth: App/assets/store/final + play-store-* + marketing hero.
 */
export const PLAY_STORE_IMAGES = {
  /** Play Console 512 icon — App/assets/store/play-store-icon-512.png */
  icon: '/play-store/icon-512.png',
  /** App launcher icon — App/assets/images/icon.png */
  appIcon: '/play-store/app-icon.png',
  /** Feature graphic (= final/09) — App/assets/store/play-store-feature-graphic.png */
  featureGraphic: '/play-store/feature-graphic.png',
  /** Official marketing hero — App/store/play-console/marketing/rasoi-download-hero.png */
  downloadHero: '/play-store/download-hero.png',
  /**
   * Full-bleed lifestyle option — App/assets/store/final/06.png
   */
  heroBackground: '/play-store/hero-bg.png',
  /**
   * Real Rasoi Android home screen for phone mockup on the marketing site.
   */
  phoneHome: '/play-store/phone-home.jpeg?v=3',
  /**
   * Play Console promo frames from App/assets/store/final (1536×1024).
   */
  screens: [
    {
      src: '/play-store/09.png',
      alt: 'Rasoi — Aaj Kya Banaye? Dinner decided from your pantry',
      label: 'Aaj Kya Banaye?',
    },
    {
      src: '/play-store/04.png',
      alt: 'Rasoi — Dinner, decided with personalized picks',
      label: 'Dinner, decided',
    },
    {
      src: '/play-store/03.png',
      alt: 'Rasoi — cook from your pantry with match %',
      label: 'Cook from pantry',
    },
    {
      src: '/play-store/08.png',
      alt: 'Rasoi — My Pantry with match % and quick grocery links',
      label: 'Pantry match',
    },
    {
      src: '/play-store/02.png',
      alt: 'Rasoi — 1,200+ recipes across 15 regional cuisines',
      label: '1,200+ recipes',
    },
    {
      src: '/play-store/07.png',
      alt: 'Rasoi — explore Indian regional cuisines',
      label: 'Regional cuisines',
    },
    {
      src: '/play-store/01.png',
      alt: 'Rasoi Plus — shop ingredients via Blinkit, Zepto, Instamart',
      label: 'Shop & order',
    },
    {
      src: '/play-store/06.png',
      alt: 'Rasoi — five daily meal picks, less evening stress',
      label: '5 daily picks',
    },
    {
      src: '/play-store/05.png',
      alt: 'Rasoi — free AI kitchen companion on Google Play',
      label: 'Free on Play',
    },
  ],
} as const;

export const HERO_PHONE_IMAGE = {
  src: PLAY_STORE_IMAGES.phoneHome,
  alt: 'Rasoi Android app — evening snack pick, pantry match, and cook actions',
  label: 'Rasoi home',
} as const;

export const HERO_BG_IMAGE = {
  src: PLAY_STORE_IMAGES.heroBackground,
  alt: 'Rasoi — home cooking, daily picks, less evening stress',
} as const;
