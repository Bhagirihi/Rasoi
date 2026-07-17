import type { DietChoice } from '@/constants/theme';

export type PantryEssentialItem = {
  id: string;
  label: string;
  aliases: string[];
  /** Hide for these diets (e.g. eggs for Veg/Jain). */
  excludedDiets?: DietChoice[];
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
      {
        id: 'chawal',
        label: 'Chawal',
        aliases: ['chawal', 'rice', 'basmati chawal', 'basmati rice', 'brown rice', 'kolam rice'],
      },
      {
        id: 'basmati-chawal',
        label: 'Basmati Chawal',
        aliases: ['basmati chawal', 'basmati rice'],
      },
      {
        id: 'gehu-atta',
        label: 'Gehu Atta',
        aliases: ['atta', 'wheat flour', 'gehun atta', 'gahu atta', 'gehu atta'],
      },
      { id: 'besan', label: 'Besan', aliases: ['besan', 'gram flour'] },
      { id: 'namak', label: 'Namak', aliases: ['namak', 'salt'] },
      { id: 'haldi', label: 'Haldi', aliases: ['haldi', 'turmeric'] },
      { id: 'jeera', label: 'Jeera', aliases: ['jeera', 'cumin', 'cumin seeds'] },
      { id: 'rai', label: 'Rai', aliases: ['rai', 'mustard seeds'] },
      {
        id: 'lal-mirch-powder',
        label: 'Lal Mirch Powder',
        aliases: ['lal mirch powder', 'red chilli powder', 'laal mirch', 'red chili powder'],
      },
      { id: 'dhania-powder', label: 'Dhania Powder', aliases: ['dhania powder', 'coriander powder'] },
      { id: 'hing', label: 'Hing', aliases: ['hing', 'heeng', 'asafoetida'] },
      { id: 'garam-masala', label: 'Garam Masala', aliases: ['garam masala'] },
      { id: 'chini', label: 'Chini', aliases: ['sugar', 'cheeni', 'chini'] },
    ],
  },
  {
    title: 'Pulses',
    items: [
      {
        id: 'moong-dal',
        label: 'Moong Dal',
        aliases: ['moong dal', 'mung dal', 'yellow moong dal', 'split moong dal'],
      },
      {
        id: 'masoor-dal',
        label: 'Masoor Dal',
        aliases: ['masoor dal', 'red lentil', 'masoor', 'red lentils'],
      },
      {
        id: 'tuver-dal',
        label: 'Tuver Dal',
        aliases: ['toor dal', 'arhar dal', 'tuvar dal', 'tuver dal'],
      },
      { id: 'chana-dal', label: 'Chana dal', aliases: ['chana dal', 'split bengal gram'] },
      {
        id: 'urad-dal',
        label: 'Urad Dal',
        aliases: ['urad dal', 'black urad dal', 'whole urad dal'],
      },
      { id: 'rajma', label: 'Rajma', aliases: ['rajma', 'kidney beans'] },
      { id: 'chana', label: 'Chana', aliases: ['chana', 'chickpea', 'kabuli chana', 'chickpeas'] },
    ],
  },
  {
    title: 'Oils & fats',
    items: [
      {
        id: 'tel',
        label: 'Tel',
        aliases: ['oil', 'tel', 'refined oil', 'vegetable oil', 'sunflower oil', 'cooking oil'],
      },
      { id: 'sarson-tel', label: 'Sarson tel', aliases: ['sarson tel', 'mustard oil'] },
      { id: 'ghee', label: 'Ghee', aliases: ['ghee', 'desi ghee'] },
    ],
  },
  {
    title: 'Veggies',
    items: [
      { id: 'pyaaz', label: 'Pyaaz', aliases: ['pyaaz', 'onion', 'pyaz'] },
      { id: 'tamatar', label: 'Tamatar', aliases: ['tamatar', 'tomato'] },
      { id: 'aloo', label: 'Aloo', aliases: ['aloo', 'potato', 'bateta'] },
      { id: 'adrak', label: 'Adrak', aliases: ['adrak', 'ginger'] },
      { id: 'lahsun', label: 'Lahsun', aliases: ['lahsun', 'garlic', 'lasan', 'lasun', 'lassan'] },
      {
        id: 'hari-mirch',
        label: 'Hari Mirch',
        aliases: [
          'hari mirch',
          'hari mirchi',
          'green chilli',
          'green chili',
          'green chillies',
          'green chilies',
          'mirch',
          'mirchi',
        ],
      },
      { id: 'palak', label: 'Palak', aliases: ['palak', 'spinach'] },
      { id: 'gobhi', label: 'Gobhi', aliases: ['gobhi', 'gobi', 'cauliflower'] },
      { id: 'bhindi', label: 'Bhindi', aliases: ['bhindi', 'okra'] },
      { id: 'matar', label: 'Matar', aliases: ['matar', 'peas', 'green peas'] },
    ],
  },
  {
    title: 'Dairy',
    items: [
      { id: 'paneer', label: 'Paneer', aliases: ['paneer'] },
      { id: 'dahi', label: 'Dahi', aliases: ['dahi', 'yogurt', 'curd'] },
      { id: 'doodh', label: 'Doodh', aliases: ['milk', 'doodh'] },
      { id: 'butter', label: 'Butter', aliases: ['butter', 'makhan'] },
      { id: 'cream', label: 'Cream', aliases: ['cream', 'malai', 'fresh cream'] },
      {
        id: 'eggs',
        label: 'Eggs',
        aliases: ['eggs', 'egg', 'anda'],
        excludedDiets: ['Veg', 'Jain'],
      },
    ],
  },
];
