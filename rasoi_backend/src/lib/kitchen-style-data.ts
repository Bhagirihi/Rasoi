import { kitchenStyleHeroUrl } from '@/lib/image-urls';
import { RECIPE_REGIONS } from '@/lib/recipe-filters';

export type KitchenStyleRecord = {
  id: string;
  label: string;
  tagline: string;
  mood: string;
  region: string;
  heroImage: string;
  active: boolean;
  sortOrder: number;
};

export const DEFAULT_KITCHEN_STYLES: KitchenStyleRecord[] = [
  {
    id: 'gujarati',
    label: 'Gujarati Home',
    tagline: 'Light, sweet-savoury everyday thali vibes',
    mood: 'Comfort',
    region: 'West',
    heroImage: kitchenStyleHeroUrl('photo-1585937421612-70a008356fbe'),
    active: true,
    sortOrder: 10,
  },
  {
    id: 'street',
    label: 'Street Food',
    tagline: 'Pav bhaji, chaat & late-evening cravings',
    mood: 'Bold',
    region: 'West',
    heroImage: kitchenStyleHeroUrl('photo-1525351484163-7529414344d8'),
    active: true,
    sortOrder: 20,
  },
  {
    id: 'south',
    label: 'South Indian',
    tagline: 'Crisp dosas, sambar & coconut-led flavours',
    mood: 'Fresh',
    region: 'South',
    heroImage: kitchenStyleHeroUrl('photo-1582878826629-29b7ad1cdc43'),
    active: true,
    sortOrder: 30,
  },
  {
    id: 'north',
    label: 'North Indian',
    tagline: 'Rich gravies, tandoori warmth & parathas',
    mood: 'Hearty',
    region: 'North',
    heroImage: kitchenStyleHeroUrl('photo-1631452180519-c014fe946bc7'),
    active: true,
    sortOrder: 40,
  },
  {
    id: 'punjabi',
    label: 'Punjabi',
    tagline: 'Butter-laden dal, tandoori & hearty sarson ka saag',
    mood: 'Hearty',
    region: 'North',
    heroImage: kitchenStyleHeroUrl('photo-1601050690597-df0568f70950'),
    active: true,
    sortOrder: 50,
  },
  {
    id: 'rajasthani',
    label: 'Rajasthani',
    tagline: 'Dal baati, gatte ki sabzi & desert spice warmth',
    mood: 'Royal',
    region: 'West',
    heroImage: kitchenStyleHeroUrl('photo-1565557623262-b51c2513a641'),
    active: true,
    sortOrder: 60,
  },
  {
    id: 'bengali',
    label: 'Bengali',
    tagline: 'Mustard fish, mishti & subtle layered flavours',
    mood: 'Delicate',
    region: 'East',
    heroImage: kitchenStyleHeroUrl('photo-1555939594-58d7cb561ad1'),
    active: true,
    sortOrder: 70,
  },
  {
    id: 'maharashtrian',
    label: 'Maharashtrian',
    tagline: 'Poha, vada pav & bold Kolhapuri heat',
    mood: 'Spicy',
    region: 'West',
    heroImage: kitchenStyleHeroUrl('photo-1565299624946-b28f40a0ae38'),
    active: true,
    sortOrder: 80,
  },
  {
    id: 'hyderabadi',
    label: 'Hyderabadi',
    tagline: 'Biryani royalty, haleem & slow-cooked gravies',
    mood: 'Rich',
    region: 'South',
    heroImage: kitchenStyleHeroUrl('photo-1563379091339-03b21ab4a4f8'),
    active: true,
    sortOrder: 90,
  },
  {
    id: 'goan',
    label: 'Goan',
    tagline: 'Coconut curries, seafood & Portuguese spice',
    mood: 'Coastal',
    region: 'West',
    heroImage: kitchenStyleHeroUrl('photo-1555939594-58d7cb561ad1'),
    active: true,
    sortOrder: 100,
  },
  {
    id: 'kerala',
    label: 'Kerala',
    tagline: 'Appam, avial & coconut-forward coastal meals',
    mood: 'Coastal',
    region: 'South',
    heroImage: kitchenStyleHeroUrl('photo-1585937421612-70a008356fbe'),
    active: true,
    sortOrder: 110,
  },
  {
    id: 'chinese',
    label: 'Indo-Chinese',
    tagline: 'Hakka noodles, manchurian & wok-tossed comfort',
    mood: 'Fusion',
    region: 'West',
    heroImage: kitchenStyleHeroUrl('photo-1567620905732-2d1ec7ab7445'),
    active: true,
    sortOrder: 120,
  },
  {
    id: 'assamese',
    label: 'Assamese',
    tagline: 'Smoked fish, bamboo shoot & earthy Northeast plates',
    mood: 'Earthy',
    region: 'East',
    heroImage: kitchenStyleHeroUrl('photo-1546069901-ba9599a7e63c'),
    active: true,
    sortOrder: 130,
  },
  {
    id: 'kashmiri',
    label: 'Kashmiri',
    tagline: 'Rogan josh, saffron rice & aromatic wazwan',
    mood: 'Aromatic',
    region: 'North',
    heroImage: kitchenStyleHeroUrl('photo-1504674900247-0877df9cc836'),
    active: true,
    sortOrder: 140,
  },
  {
    id: 'chettinad',
    label: 'Chettinad',
    tagline: 'Fiery pepper masala & bold Tamil Nadu spice',
    mood: 'Fiery',
    region: 'South',
    heroImage: kitchenStyleHeroUrl('photo-1596797038530-2c107229654b'),
    active: true,
    sortOrder: 150,
  },
];

export const KITCHEN_STYLE_REGIONS = [...RECIPE_REGIONS];
