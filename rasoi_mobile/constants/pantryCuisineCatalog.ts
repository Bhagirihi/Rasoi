import type { DietChoice } from '@/constants/theme';

import type { PantryEssentialItem, PantryEssentialSection } from './pantryEssentials';

export type PantryCatalogItem = PantryEssentialItem & {
  /** Hide for these diets (e.g. eggs for Veg/Jain, meat for Veg). */
  excludedDiets?: DietChoice[];
};

export type PantryCuisineSection = {
  cuisineId: string;
  title: string;
  items: PantryCatalogItem[];
};

/** Extra staples shown only for Non-Veg diets. */
export const PANTRY_DIET_SECTIONS: PantryEssentialSection[] = [
  {
    title: 'Protein',
    items: [
      {
        id: 'chicken',
        label: 'Chicken',
        aliases: ['chicken', 'murgh', 'chicken breast'],
        excludedDiets: ['Veg', 'Jain', 'Egg'],
      },
      {
        id: 'mutton',
        label: 'Mutton',
        aliases: ['mutton', 'lamb', 'gosht'],
        excludedDiets: ['Veg', 'Jain', 'Egg'],
      },
      {
        id: 'fish',
        label: 'Fish',
        aliases: ['fish', 'machli', 'pomfret', 'rohu'],
        excludedDiets: ['Veg', 'Jain', 'Egg'],
      },
      {
        id: 'prawns',
        label: 'Prawns',
        aliases: ['prawns', 'shrimp', 'jhinga'],
        excludedDiets: ['Veg', 'Jain', 'Egg'],
      },
    ],
  },
];

/** Cuisine boosters — shown when the user picks that kitchen style in onboarding. */
export const PANTRY_CUISINE_SECTIONS: PantryCuisineSection[] = [
  {
    cuisineId: 'gujarati',
    title: 'Gujarati staples',
    items: [
      { id: 'gud', label: 'Gud / Jaggery', aliases: ['gud', 'jaggery', 'gur'] },
      { id: 'kokum', label: 'Kokum', aliases: ['kokum', 'kokum agal'] },
      { id: 'dhana-jeera', label: 'Dhana-jeera powder', aliases: ['dhana jeera', 'dhana-jeera', 'coriander cumin powder'] },
      { id: 'peanut', label: 'Peanuts', aliases: ['peanut', 'peanuts', 'mungfali', 'singdana'] },
      { id: 'til', label: 'Sesame / Til', aliases: ['til', 'sesame', 'sesame seeds'] },
    ],
  },
  {
    cuisineId: 'street',
    title: 'Street food kit',
    items: [
      { id: 'pav', label: 'Pav buns', aliases: ['pav', 'pav buns', 'bread pav'] },
      { id: 'sev', label: 'Sev', aliases: ['sev', 'besan sev'] },
      { id: 'chaat-masala', label: 'Chaat masala', aliases: ['chaat masala'] },
      { id: 'imli', label: 'Imli / Tamarind', aliases: ['imli', 'tamarind', 'tamarind pulp'] },
      { id: 'pudina', label: 'Pudina / Mint', aliases: ['pudina', 'mint', 'mint leaves'] },
    ],
  },
  {
    cuisineId: 'south',
    title: 'South Indian staples',
    items: [
      { id: 'curry-leaves', label: 'Curry leaves', aliases: ['curry leaves', 'kadi patta'] },
      { id: 'coconut', label: 'Coconut', aliases: ['coconut', 'nariyal', 'fresh coconut', 'desiccated coconut'] },
      { id: 'sambar-powder', label: 'Sambar powder', aliases: ['sambar powder', 'sambhar masala'] },
      { id: 'rasam-powder', label: 'Rasam powder', aliases: ['rasam powder'] },
      { id: 'idli-rava', label: 'Idli rava', aliases: ['idli rava', 'idli rice', 'parboiled rice'] },
    ],
  },
  {
    cuisineId: 'north',
    title: 'North Indian staples',
    items: [
      { id: 'kasuri-methi', label: 'Kasuri methi', aliases: ['kasuri methi', 'dried fenugreek'] },
      { id: 'amchur', label: 'Amchur', aliases: ['amchur', 'dry mango powder'] },
      { id: 'chole-masala', label: 'Chole masala', aliases: ['chole masala', 'chana masala'] },
      { id: 'maida', label: 'Maida', aliases: ['maida', 'refined flour', 'all purpose flour'] },
    ],
  },
  {
    cuisineId: 'punjabi',
    title: 'Punjabi staples',
    items: [
      { id: 'kasuri-methi', label: 'Kasuri methi', aliases: ['kasuri methi', 'dried fenugreek'] },
      { id: 'chole-masala', label: 'Chole masala', aliases: ['chole masala', 'chana masala'] },
      { id: 'maida', label: 'Maida', aliases: ['maida', 'refined flour'] },
      { id: 'kasoori-dal-tadka', label: 'Dal tadka masala', aliases: ['dal tadka masala', 'tadka masala'] },
    ],
  },
  {
    cuisineId: 'rajasthani',
    title: 'Rajasthani staples',
    items: [
      { id: 'laal-mirch', label: 'Laal mirch powder', aliases: ['laal mirch', 'kashmiri chilli powder', 'red chilli powder'] },
      { id: 'heeng', label: 'Heeng / Asafoetida', aliases: ['heeng', 'hing', 'asafoetida'] },
      { id: 'gud', label: 'Gud / Jaggery', aliases: ['gud', 'jaggery'] },
    ],
  },
  {
    cuisineId: 'bengali',
    title: 'Bengali staples',
    items: [
      { id: 'panch-phoron', label: 'Panch phoron', aliases: ['panch phoron', 'panch phoran', 'five spice mix'] },
      { id: 'posto', label: 'Posto / Poppy seeds', aliases: ['posto', 'poppy seeds', 'khus khus'] },
      { id: 'mustard-paste', label: 'Mustard paste', aliases: ['mustard paste', 'sorshe bata'] },
    ],
  },
  {
    cuisineId: 'maharashtrian',
    title: 'Maharashtrian staples',
    items: [
      { id: 'goda-masala', label: 'Goda masala', aliases: ['goda masala', 'kala masala'] },
      { id: 'kokum', label: 'Kokum', aliases: ['kokum'] },
      { id: 'peanut', label: 'Peanuts', aliases: ['peanut', 'peanuts', 'mungfali'] },
      { id: 'poha', label: 'Poha / Flattened rice', aliases: ['poha', 'flattened rice', 'chivda rice'] },
    ],
  },
  {
    cuisineId: 'hyderabadi',
    title: 'Hyderabadi staples',
    items: [
      { id: 'biryani-masala', label: 'Biryani masala', aliases: ['biryani masala'] },
      { id: 'pudina', label: 'Pudina / Mint', aliases: ['pudina', 'mint', 'mint leaves'] },
      { id: 'birista', label: 'Fried onions / Birista', aliases: ['birista', 'fried onions', 'barista'] },
      { id: 'kesar', label: 'Kesar / Saffron', aliases: ['kesar', 'saffron'] },
    ],
  },
  {
    cuisineId: 'goan',
    title: 'Goan staples',
    items: [
      { id: 'coconut', label: 'Coconut', aliases: ['coconut', 'nariyal'] },
      { id: 'vinegar', label: 'Vinegar', aliases: ['vinegar', 'coconut vinegar'] },
      { id: 'kokum', label: 'Kokum', aliases: ['kokum'] },
      { id: 'imli', label: 'Imli / Tamarind', aliases: ['imli', 'tamarind'] },
    ],
  },
  {
    cuisineId: 'kerala',
    title: 'Kerala staples',
    items: [
      { id: 'coconut-oil', label: 'Coconut oil', aliases: ['coconut oil', 'nariyal tel'] },
      { id: 'curry-leaves', label: 'Curry leaves', aliases: ['curry leaves', 'kadi patta'] },
      { id: 'coconut-milk', label: 'Coconut milk', aliases: ['coconut milk'] },
    ],
  },
  {
    cuisineId: 'chinese',
    title: 'Chinese wok kit',
    items: [
      { id: 'soy-sauce', label: 'Soy sauce', aliases: ['soy sauce', 'soya sauce'] },
      { id: 'vinegar', label: 'Vinegar', aliases: ['vinegar', 'rice vinegar'] },
      { id: 'cornflour', label: 'Cornflour', aliases: ['cornflour', 'corn starch', 'cornstarch'] },
      { id: 'hakka-noodles', label: 'Hakka noodles', aliases: ['hakka noodles', 'noodles', 'chow mein noodles'] },
      { id: 'spring-onion', label: 'Spring onion', aliases: ['spring onion', 'scallion', 'green onion'] },
      { id: 'schezwan-sauce', label: 'Schezwan sauce', aliases: ['schezwan sauce', 'szechuan sauce'] },
    ],
  },
  {
    cuisineId: 'thai',
    title: 'Thai essentials',
    items: [
      { id: 'coconut-milk', label: 'Coconut milk', aliases: ['coconut milk'] },
      {
        id: 'fish-sauce',
        label: 'Fish sauce',
        aliases: ['fish sauce'],
        excludedDiets: ['Veg', 'Jain', 'Egg'],
      },
      { id: 'lemongrass', label: 'Lemongrass', aliases: ['lemongrass', 'lemon grass'] },
      { id: 'rice-noodles', label: 'Rice noodles', aliases: ['rice noodles', 'pad thai noodles'] },
      { id: 'thai-basil', label: 'Thai basil', aliases: ['thai basil'] },
    ],
  },
  {
    cuisineId: 'italian',
    title: 'Italian staples',
    items: [
      { id: 'pasta', label: 'Pasta', aliases: ['pasta', 'spaghetti', 'penne', 'macaroni'] },
      { id: 'olive-oil', label: 'Olive oil', aliases: ['olive oil'] },
      { id: 'oregano', label: 'Oregano', aliases: ['oregano', 'dried oregano'] },
      { id: 'tomato-puree', label: 'Tomato puree', aliases: ['tomato puree', 'tomato paste', 'passata'] },
    ],
  },
  {
    cuisineId: 'mexican',
    title: 'Mexican staples',
    items: [
      { id: 'tortillas', label: 'Tortillas', aliases: ['tortillas', 'tortilla wraps'] },
      { id: 'black-beans', label: 'Black beans', aliases: ['black beans'] },
      { id: 'jalapeno', label: 'Jalapeño', aliases: ['jalapeno', 'jalapeño', 'pickled jalapeno'] },
      { id: 'salsa', label: 'Salsa', aliases: ['salsa', 'tomato salsa'] },
    ],
  },
  {
    cuisineId: 'continental',
    title: 'Continental staples',
    items: [
      { id: 'olive-oil', label: 'Olive oil', aliases: ['olive oil'] },
      { id: 'herbs-mix', label: 'Mixed herbs', aliases: ['mixed herbs', 'italian herbs', 'herbs'] },
      { id: 'black-pepper', label: 'Black pepper', aliases: ['black pepper', 'kali mirch'] },
    ],
  },
  {
    cuisineId: 'jain',
    title: 'Jain pantry',
    items: [
      { id: 'sendha-namak', label: 'Sendha namak', aliases: ['sendha namak', 'rock salt'] },
      { id: 'peanut', label: 'Peanuts', aliases: ['peanut', 'peanuts', 'mungfali'] },
      { id: 'raw-banana', label: 'Raw banana', aliases: ['raw banana', 'kacha kela', 'green banana'] },
    ],
  },
  {
    cuisineId: 'assamese',
    title: 'Assamese staples',
    items: [
      { id: 'bamboo-shoot', label: 'Bamboo shoot', aliases: ['bamboo shoot', 'bamboo shoots'] },
      { id: 'joha-rice', label: 'Joha rice', aliases: ['joha rice', 'assam rice'] },
    ],
  },
  {
    cuisineId: 'kashmiri',
    title: 'Kashmiri staples',
    items: [
      { id: 'kesar', label: 'Kesar / Saffron', aliases: ['kesar', 'saffron'] },
      { id: 'saunf-powder', label: 'Fennel powder', aliases: ['fennel powder', 'saunf powder'] },
      { id: 'kashmiri-mirch', label: 'Kashmiri mirch', aliases: ['kashmiri mirch', 'kashmiri chilli'] },
      { id: 'badam', label: 'Almonds', aliases: ['almonds', 'badam'] },
    ],
  },
  {
    cuisineId: 'high-protein',
    title: 'High-protein add-ons',
    items: [
      { id: 'soya-chunks', label: 'Soya chunks', aliases: ['soya chunks', 'soy chunks', 'nutrela'] },
      { id: 'tofu', label: 'Tofu', aliases: ['tofu'] },
      {
        id: 'whey-protein',
        label: 'Protein powder',
        aliases: ['protein powder', 'whey protein'],
        excludedDiets: ['Veg', 'Jain'],
      },
    ],
  },
  {
    cuisineId: 'vegan',
    title: 'Vegan staples',
    items: [
      { id: 'tofu', label: 'Tofu', aliases: ['tofu'] },
      { id: 'soya-milk', label: 'Soya milk', aliases: ['soya milk', 'soy milk'] },
      { id: 'peanut-butter', label: 'Peanut butter', aliases: ['peanut butter'] },
    ],
  },
];

export function getAllPantryCatalogItems(): PantryCatalogItem[] {
  const base = PANTRY_DIET_SECTIONS.flatMap((section) => section.items) as PantryCatalogItem[];
  const cuisine = PANTRY_CUISINE_SECTIONS.flatMap((section) => section.items);
  return [...base, ...cuisine];
}
