export type PantryEssentialItem = {
  id: string;
  label: string;
  aliases: string[];
};

export type PantryEssentialSection = {
  title: string;
  items: PantryEssentialItem[];
};

/** Canonical essentials — one chip per real pantry item; recipe variants map via aliases. */
export const PANTRY_ESSENTIAL_SECTIONS: PantryEssentialSection[] = [
  {
    title: 'Staples',
    items: [
      { id: 'chawal', label: 'Chawal / Rice', aliases: ['chawal', 'rice', 'basmati chawal', 'basmati rice', 'brown rice', 'kolam rice'] },
      { id: 'atta', label: 'Atta', aliases: ['atta', 'wheat flour', 'gehun atta'] },
      { id: 'besan', label: 'Besan', aliases: ['besan', 'gram flour'] },
      { id: 'namak', label: 'Namak', aliases: ['namak', 'salt'] },
      { id: 'haldi', label: 'Haldi', aliases: ['haldi', 'turmeric'] },
      { id: 'jeera', label: 'Jeera', aliases: ['jeera', 'cumin', 'cumin seeds'] },
      { id: 'rai', label: 'Rai', aliases: ['rai', 'mustard seeds'] },
      { id: 'garam-masala', label: 'Garam masala', aliases: ['garam masala'] },
      { id: 'sugar', label: 'Sugar', aliases: ['sugar', 'cheeni'] },
    ],
  },
  {
    title: 'Pulses',
    items: [
      { id: 'moong-dal', label: 'Moong dal', aliases: ['moong dal', 'mung dal', 'yellow moong dal'] },
      { id: 'masoor-dal', label: 'Masoor dal', aliases: ['masoor dal', 'red lentil', 'masoor'] },
      { id: 'toor-dal', label: 'Toor dal', aliases: ['toor dal', 'arhar dal', 'tuvar dal'] },
      { id: 'chana-dal', label: 'Chana dal', aliases: ['chana dal', 'split bengal gram'] },
      { id: 'urad-dal', label: 'Urad dal', aliases: ['urad dal', 'black urad dal'] },
      { id: 'rajma', label: 'Rajma', aliases: ['rajma', 'kidney beans'] },
      { id: 'chana', label: 'Chana', aliases: ['chana', 'chickpea', 'kabuli chana'] },
    ],
  },
  {
    title: 'Oils & fats',
    items: [
      {
        id: 'cooking-oil',
        label: 'Cooking oil',
        aliases: ['oil', 'tel', 'refined oil', 'vegetable oil', 'sunflower oil', 'cooking oil'],
      },
      { id: 'sarson-tel', label: 'Sarson tel', aliases: ['sarson tel', 'mustard oil'] },
      { id: 'ghee', label: 'Ghee', aliases: ['ghee', 'desi ghee'] },
    ],
  },
  {
    title: 'Veggies',
    items: [
      { id: 'pyaaz', label: 'Pyaaz', aliases: ['pyaaz', 'onion'] },
      { id: 'tamatar', label: 'Tamatar', aliases: ['tamatar', 'tomato'] },
      { id: 'aloo', label: 'Aloo', aliases: ['aloo', 'potato'] },
      { id: 'adrak', label: 'Adrak', aliases: ['adrak', 'ginger'] },
      { id: 'lahsun', label: 'Lahsun', aliases: ['lahsun', 'garlic'] },
      { id: 'mirch', label: 'Mirch', aliases: ['mirch', 'hari mirch', 'green chilli', 'green chili', 'chilli', 'chili'] },
      { id: 'palak', label: 'Palak', aliases: ['palak', 'spinach'] },
      { id: 'gobi', label: 'Gobi', aliases: ['gobi', 'cauliflower'] },
      { id: 'bhindi', label: 'Bhindi', aliases: ['bhindi', 'okra'] },
      { id: 'matar', label: 'Matar', aliases: ['matar', 'peas', 'green peas'] },
    ],
  },
  {
    title: 'Dairy',
    items: [
      { id: 'paneer', label: 'Paneer', aliases: ['paneer'] },
      { id: 'dahi', label: 'Dahi', aliases: ['dahi', 'yogurt', 'curd'] },
      { id: 'milk', label: 'Milk', aliases: ['milk', 'doodh'] },
      { id: 'butter', label: 'Butter', aliases: ['butter', 'makhan'] },
      { id: 'cream', label: 'Cream', aliases: ['cream', 'malai', 'fresh cream'] },
      { id: 'eggs', label: 'Eggs', aliases: ['eggs', 'egg', 'anda'] },
    ],
  },
];
