export const colors = {
  primary: '#FF6B35',
  green: '#00A86B',
  cream: '#FAFAFA',
  saffron: '#FF9933',
  egg: '#F4C430',
  danger: '#E53935',
  charcoal: '#1A1A2E',
  muted: '#6B7280',
  white: '#FFFFFF',
  border: '#E5E7EB',
  placeholder: '#9CA3AF',
  dark: {
    bg: '#0A0908',
    card: '#1C1714',
    cardSelected: '#2A2218',
    surface: '#14110F',
    text: '#F5F0E8',
    textMuted: '#9A9590',
    buttonDisabled: '#2A2218',
    buttonDisabledText: '#6B6560',
    accentGreen: '#1A3D2E',
    accentRed: '#3D1A1A',
    accentOrange: '#3D2A14',
    accentEgg: '#3D3514',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  pill: 999,
} as const;

export const layout = {
  screenPadding: 16,
  tabBarExtra: 32,
} as const;

/** Hide native scrollbars; vertical scroll hint uses animated floating pill. */
export const scrollIndicator = {
  showsVerticalScrollIndicator: false,
  showsHorizontalScrollIndicator: false,
  persistentScrollbar: false,
} as const;

export const shadows = {
  card: {
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  cardLifted: {
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  cta: {
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 8,
  },
} as const;

export const gradients = {
  header: ['#FF6B35', '#FF9933'] as const,
  cta: ['#C44A00', '#FF6B35', '#FF9933'] as const,
};

export const CUISINE_OPTIONS = [
  {
    id: 'gujarati',
    label: 'Gujarati Home',
    tagline: 'Light, sweet-savoury everyday thali vibes',
    mood: 'Comfort',
    region: 'West',
    heroImage:
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80',
  },
  {
    id: 'street',
    label: 'Street Food',
    tagline: 'Pav bhaji, chaat & late-evening cravings',
    mood: 'Bold',
    region: 'West',
    heroImage:
      'https://images.unsplash.com/photo-1626700051175-6818013e1d2f?w=400&q=80',
  },
  {
    id: 'south',
    label: 'South Indian',
    tagline: 'Crisp dosas, sambar & coconut-led flavours',
    mood: 'Fresh',
    region: 'South',
    heroImage:
      'https://images.unsplash.com/photo-1630384060427-c20d1e256a5e?w=400&q=80',
  },
  {
    id: 'north',
    label: 'North Indian',
    tagline: 'Rich gravies, tandoori warmth & parathas',
    mood: 'Hearty',
    region: 'North',
    heroImage:
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80',
  },
  {
    id: 'punjabi',
    label: 'Punjabi',
    tagline: 'Butter-laden dal, tandoori & hearty sarson ka saag',
    mood: 'Hearty',
    region: 'North',
    heroImage:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80',
  },
  {
    id: 'rajasthani',
    label: 'Rajasthani',
    tagline: 'Dal baati, gatte ki sabzi & desert spice warmth',
    mood: 'Royal',
    region: 'West',
    heroImage:
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80',
  },
  {
    id: 'bengali',
    label: 'Bengali',
    tagline: 'Mustard fish, mishti & subtle layered flavours',
    mood: 'Delicate',
    region: 'East',
    heroImage:
      'https://images.unsplash.com/photo-1589302160288-aecb502ff3b5?w=400&q=80',
  },
  {
    id: 'maharashtrian',
    label: 'Maharashtrian',
    tagline: 'Poha, vada pav & bold Kolhapuri heat',
    mood: 'Spicy',
    region: 'West',
    heroImage:
      'https://images.unsplash.com/photo-1606491956689-2ea866880ad6?w=400&q=80',
  },
  {
    id: 'hyderabadi',
    label: 'Hyderabadi',
    tagline: 'Biryani royalty, haleem & slow-cooked gravies',
    mood: 'Rich',
    region: 'South',
    heroImage:
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80',
  },
  {
    id: 'goan',
    label: 'Goan',
    tagline: 'Coconut curries, seafood & Portuguese spice',
    mood: 'Coastal',
    region: 'West',
    heroImage:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
  },
  {
    id: 'kerala',
    label: 'Kerala',
    tagline: 'Appam, avial & coconut-forward coastal meals',
    mood: 'Coastal',
    region: 'South',
    heroImage:
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80',
  },
  {
    id: 'chinese',
    label: 'Indo-Chinese',
    tagline: 'Hakka noodles, manchurian & wok-tossed comfort',
    mood: 'Fusion',
    region: 'West',
    heroImage:
      'https://images.unsplash.com/photo-1563379926893-7c9e0c4e0b0e?w=400&q=80',
  },
  {
    id: 'assamese',
    label: 'Assamese',
    tagline: 'Smoked fish, bamboo shoot & earthy Northeast plates',
    mood: 'Earthy',
    region: 'East',
    heroImage:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
  },
  {
    id: 'kashmiri',
    label: 'Kashmiri',
    tagline: 'Rogan josh, saffron rice & aromatic wazwan',
    mood: 'Aromatic',
    region: 'North',
    heroImage:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
  },
  {
    id: 'chettinad',
    label: 'Chettinad',
    tagline: 'Fiery pepper masala & bold Tamil Nadu spice',
    mood: 'Fiery',
    region: 'South',
    heroImage:
      'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80',
  },
] as const;

export type CuisineId = string;
export type KitchenStyleOption = (typeof CUISINE_OPTIONS)[number];
export type DietChoice = 'Veg' | 'Egg' | 'Non-Veg' | 'Jain';

export const DIET_CHOICE_LABELS: Record<DietChoice, string> = {
  Veg: 'Veg',
  Egg: 'Eggitarian',
  'Non-Veg': 'Non-Veg',
  Jain: 'Jain',
};
