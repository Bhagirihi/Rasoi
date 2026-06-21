export type DietType = 'Veg' | 'Egg' | 'Non-Veg';

export type RecipeDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface RecipeIngredient {
  name: string;
  isStaple: boolean;
  recommendedBrand?: {
    name: string;
    logo: string;
  };
}

export interface Recipe {
  id: string;
  title: string;
  prepTime: number;
  calories: number;
  region: string;
  kitchenStyleId?: string;
  kitchenStyleIds?: string[];
  dietType: DietType;
  difficulty: RecipeDifficulty;
  description: string;
  imageUrl: string;
  tags: Array<'under20' | 'leftover' | 'kids' | 'quick' | 'festive'>;
  ingredients: RecipeIngredient[];
  steps?: string[];
}

export const REGIONAL_CUISINES = [
  'All India',
  'North',
  'South',
  'East',
  'West',
  'Central',
] as const;

export const PANTRY_SECTIONS = [
  {
    title: 'Staples',
    items: ['Atta', 'Rice', 'Dal', 'Besan', 'Jeera', 'Haldi', 'Namak', 'Oil', 'Chawal'],
  },
  {
    title: 'Veggies',
    items: ['Aloo', 'Pyaaz', 'Tamatar', 'Gobi', 'Bhindi', 'Palak', 'Matar', 'Mirch', 'Adrak'],
  },
  {
    title: 'Dairy',
    items: ['Paneer', 'Dahi', 'Milk', 'Ghee', 'Butter', 'Cream', 'Eggs'],
  },
] as const;

/** Screenshot-mode catalog only — production loads from Supabase via the API. */
export const SCREENSHOT_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Masala Dosa with Coconut Chutney',
    prepTime: 35,
    calories: 420,
    region: 'South',
    dietType: 'Veg',
    difficulty: 'Medium',
    description: 'Crispy fermented rice crepe with spiced potato filling and fresh coconut chutney.',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80',
    tags: ['festive'],
    ingredients: [
      { name: 'Rice', isStaple: true },
      { name: 'Besan', isStaple: true },
      { name: 'Aloo', isStaple: false },
      { name: 'Pyaaz', isStaple: false },
      { name: 'Oil', isStaple: true },
      { name: 'Namak', isStaple: true },
      { name: 'Jeera', isStaple: true },
    ],
  },
  {
    id: '2',
    title: 'Paneer Butter Masala',
    prepTime: 25,
    calories: 510,
    region: 'North',
    dietType: 'Veg',
    difficulty: 'Easy',
    description: 'Rich tomato-cashew gravy with soft paneer cubes — a North Indian classic.',
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80',
    tags: ['under20', 'kids'],
    ingredients: [
      {
        name: 'Paneer',
        isStaple: false,
        recommendedBrand: {
          name: 'Amul Paneer',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Amul_Logo.svg/120px-Amul_Logo.svg.png',
        },
      },
      { name: 'Tamatar', isStaple: false },
      { name: 'Pyaaz', isStaple: false },
      { name: 'Butter', isStaple: false, recommendedBrand: { name: 'Amul Butter', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Amul_Logo.svg/120px-Amul_Logo.svg.png' } },
      { name: 'Cream', isStaple: false },
      { name: 'Haldi', isStaple: true },
      { name: 'Mirch', isStaple: false },
    ],
  },
  {
    id: '3',
    title: 'Egg Bhurji Pav',
    prepTime: 15,
    calories: 380,
    region: 'West',
    dietType: 'Egg',
    difficulty: 'Easy',
    description: 'Spicy scrambled eggs with Mumbai-style pav — perfect street-food breakfast.',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80',
    tags: ['under20', 'quick', 'kids'],
    ingredients: [
      { name: 'Eggs', isStaple: false },
      { name: 'Pyaaz', isStaple: false },
      { name: 'Tamatar', isStaple: false },
      { name: 'Mirch', isStaple: false },
      { name: 'Oil', isStaple: true },
      { name: 'Namak', isStaple: true },
    ],
  },
  {
    id: '4',
    title: 'Chicken Biryani',
    prepTime: 55,
    calories: 620,
    region: 'South',
    dietType: 'Non-Veg',
    difficulty: 'Hard',
    description: 'Fragrant layered biryani with marinated chicken and saffron-infused basmati rice.',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
    tags: ['festive'],
    ingredients: [
      { name: 'Chicken', isStaple: false },
      { name: 'Rice', isStaple: true },
      { name: 'Dahi', isStaple: false },
      { name: 'Pyaaz', isStaple: false },
      { name: 'Adrak', isStaple: false },
      { name: 'Mirch', isStaple: false },
      { name: 'Ghee', isStaple: false },
    ],
  },
  {
    id: '5',
    title: 'Aloo Paratha with Dahi',
    prepTime: 20,
    calories: 440,
    region: 'North',
    dietType: 'Veg',
    difficulty: 'Easy',
    description: 'Stuffed whole-wheat flatbread with spiced potato — Punjabi comfort food.',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80',
    tags: ['under20', 'kids', 'leftover'],
    ingredients: [
      { name: 'Atta', isStaple: true },
      { name: 'Aloo', isStaple: false },
      { name: 'Jeera', isStaple: true },
      { name: 'Mirch', isStaple: false },
      { name: 'Dahi', isStaple: false },
      { name: 'Ghee', isStaple: false },
    ],
  },
  {
    id: '6',
    title: 'Dal Tadka with Jeera Rice',
    prepTime: 30,
    calories: 390,
    region: 'North',
    dietType: 'Veg',
    difficulty: 'Easy',
    description: 'Smoky tempered yellow dal paired with fragrant jeera rice.',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80',
    tags: ['kids', 'leftover'],
    ingredients: [
      { name: 'Dal', isStaple: true },
      { name: 'Rice', isStaple: true },
      { name: 'Tamatar', isStaple: false },
      { name: 'Pyaaz', isStaple: false },
      { name: 'Jeera', isStaple: true },
      { name: 'Haldi', isStaple: true },
      { name: 'Ghee', isStaple: false },
    ],
  },
  {
    id: '7',
    title: 'Poha with Peanuts',
    prepTime: 12,
    calories: 310,
    region: 'West',
    dietType: 'Veg',
    difficulty: 'Easy',
    description: 'Light flattened rice breakfast with peanuts, curry leaves, and lemon.',
    imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80',
    tags: ['under20', 'quick', 'kids'],
    ingredients: [
      { name: 'Poha', isStaple: true },
      { name: 'Pyaaz', isStaple: false },
      { name: 'Mirch', isStaple: false },
      { name: 'Oil', isStaple: true },
      { name: 'Namak', isStaple: true },
      { name: 'Jeera', isStaple: true },
    ],
  },
  {
    id: '8',
    title: 'Fish Curry with Steamed Rice',
    prepTime: 35,
    calories: 480,
    region: 'East',
    dietType: 'Non-Veg',
    difficulty: 'Medium',
    description: 'Mustard-kissed Bengali fish curry with tender ilish or rohu fillets.',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80',
    tags: ['festive'],
    ingredients: [
      { name: 'Fish', isStaple: false },
      { name: 'Rice', isStaple: true },
      { name: 'Mustard Oil', isStaple: true },
      { name: 'Tamatar', isStaple: false },
      { name: 'Haldi', isStaple: true },
      { name: 'Mirch', isStaple: false },
    ],
  },
  {
    id: '9',
    title: 'Palak Paneer Roti Bowl',
    prepTime: 22,
    calories: 460,
    region: 'North',
    dietType: 'Veg',
    difficulty: 'Easy',
    description: 'Creamy spinach gravy with paneer, served with hot phulka rotis.',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
    tags: ['under20', 'kids'],
    ingredients: [
      {
        name: 'Paneer',
        isStaple: false,
        recommendedBrand: { name: 'Amul Paneer', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Amul_Logo.svg/120px-Amul_Logo.svg.png' },
      },
      { name: 'Palak', isStaple: false },
      { name: 'Atta', isStaple: true },
      { name: 'Cream', isStaple: false },
      { name: 'Pyaaz', isStaple: false },
      { name: 'Mirch', isStaple: false },
    ],
  },
  {
    id: '10',
    title: 'Leftover Rice Lemon Pulao',
    prepTime: 14,
    calories: 340,
    region: 'Central',
    dietType: 'Veg',
    difficulty: 'Easy',
    description: 'Transform yesterday\'s rice into zesty lemon pulao with peanuts and curry leaves.',
    imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80',
    tags: ['under20', 'leftover', 'quick'],
    ingredients: [
      { name: 'Rice', isStaple: true },
      { name: 'Pyaaz', isStaple: false },
      { name: 'Mirch', isStaple: false },
      { name: 'Oil', isStaple: true },
      { name: 'Jeera', isStaple: true },
      { name: 'Namak', isStaple: true },
    ],
  },
  {
    id: '11',
    title: 'Egg Curry with Roti',
    prepTime: 25,
    calories: 430,
    region: 'East',
    dietType: 'Egg',
    difficulty: 'Medium',
    description: 'Boiled eggs simmered in a spiced onion-tomato gravy — a Bengali household staple.',
    imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80',
    tags: ['kids'],
    ingredients: [
      { name: 'Eggs', isStaple: false },
      { name: 'Tamatar', isStaple: false },
      { name: 'Pyaaz', isStaple: false },
      { name: 'Atta', isStaple: true },
      { name: 'Haldi', isStaple: true },
      { name: 'Mirch', isStaple: false },
      { name: 'Oil', isStaple: true },
    ],
  },
  {
    id: '12',
    title: 'Bhindi Masala with Dal',
    prepTime: 28,
    calories: 370,
    region: 'Central',
    dietType: 'Veg',
    difficulty: 'Easy',
    description: 'Crispy okra stir-fry with a side of homestyle moong dal.',
    imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80',
    tags: ['kids', 'leftover'],
    ingredients: [
      { name: 'Bhindi', isStaple: false },
      { name: 'Dal', isStaple: true },
      { name: 'Pyaaz', isStaple: false },
      { name: 'Tamatar', isStaple: false },
      { name: 'Jeera', isStaple: true },
      { name: 'Oil', isStaple: true },
    ],
  },
  {
    id: '13',
    title: 'Matar Paneer Curry',
    prepTime: 24,
    calories: 495,
    region: 'North',
    dietType: 'Veg',
    difficulty: 'Easy',
    description: 'Peas and paneer in a mildly spiced tomato-onion gravy.',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80',
    tags: ['under20', 'kids'],
    ingredients: [
      {
        name: 'Paneer',
        isStaple: false,
        recommendedBrand: { name: 'Amul Paneer', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Amul_Logo.svg/120px-Amul_Logo.svg.png' },
      },
      { name: 'Matar', isStaple: false },
      { name: 'Tamatar', isStaple: false },
      { name: 'Cream', isStaple: false },
      { name: 'Butter', isStaple: false },
      { name: 'Mirch', isStaple: false },
    ],
  },
  {
    id: '14',
    title: 'Chicken Tikka Wrap',
    prepTime: 18,
    calories: 520,
    region: 'North',
    dietType: 'Non-Veg',
    difficulty: 'Medium',
    description: 'Smoky tandoori chicken wrapped in roomali roti with mint chutney.',
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
    tags: ['under20', 'quick'],
    ingredients: [
      { name: 'Chicken', isStaple: false },
      { name: 'Atta', isStaple: true },
      { name: 'Dahi', isStaple: false },
      { name: 'Mirch', isStaple: false },
      { name: 'Adrak', isStaple: false },
      { name: 'Oil', isStaple: true },
    ],
  },
  {
    id: '15',
    title: 'Vegetable Upma',
    prepTime: 16,
    calories: 290,
    region: 'South',
    dietType: 'Veg',
    difficulty: 'Easy',
    description: 'Semolina upma with mixed veggies — a quick South Indian tiffin favourite.',
    imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80',
    tags: ['under20', 'quick', 'kids', 'leftover'],
    ingredients: [
      { name: 'Rava', isStaple: true },
      { name: 'Pyaaz', isStaple: false },
      { name: 'Tamatar', isStaple: false },
      { name: 'Matar', isStaple: false },
      { name: 'Oil', isStaple: true },
      { name: 'Jeera', isStaple: true },
    ],
  },
];

import { getRecipeSteps } from '@/utils/recipeSteps';

export function getScreenshotRecipeById(id: string): Recipe | undefined {
  const recipe = SCREENSHOT_RECIPES.find((item) => item.id === id);
  if (!recipe) return undefined;
  return { ...recipe, steps: getRecipeSteps(recipe.id, recipe.title) };
}
