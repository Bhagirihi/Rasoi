/**
 * Generates 100 batch5 recipe titles per cuisine (ids 185–284), avoiding existing catalog titles.
 * Run: npx tsx scripts/generate-batch5-catalog.ts
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { ALL_CATALOG_RECIPES } from './recipe-catalog';
import { buildBatch4Recipes, type Batch4CuisineConfig } from './recipe-catalog/batch4-shared';

type CuisineSeed = Omit<Batch4CuisineConfig, 'titles' | 'startId'> & {
  bases: readonly string[];
  prefixes: readonly string[];
  suffixes: readonly string[];
};

const existingTitles = new Set(
  ALL_CATALOG_RECIPES.map((recipe) => recipe.title.trim().toLowerCase()),
);

const batch5Titles = new Set<string>();

function generateTitles(
  bases: readonly string[],
  prefixes: readonly string[],
  suffixes: readonly string[],
): string[] {
  const titles: string[] = [];

  const tryAdd = (title: string) => {
    const key = title.trim().toLowerCase();
    if (batch5Titles.has(key) || existingTitles.has(key)) return;
    batch5Titles.add(key);
    titles.push(title.trim());
  };

  for (const base of bases) {
    tryAdd(base);
    if (titles.length >= 100) return titles.slice(0, 100);
    for (const prefix of prefixes) {
      tryAdd(`${prefix} ${base}`);
      if (titles.length >= 100) return titles.slice(0, 100);
    }
    for (const suffix of suffixes) {
      tryAdd(`${base} ${suffix}`);
      if (titles.length >= 100) return titles.slice(0, 100);
    }
  }

  if (titles.length < 100) {
    throw new Error(`Could only generate ${titles.length} unique titles`);
  }

  return titles.slice(0, 100);
}

const BATCH5_SUFFIXES = [
  'Bowl',
  'Platter',
  'Thali',
  'Express',
  'Special',
  'Deluxe',
  'Mini',
  'Family',
  'Combo',
  'Classic',
] as const;

const CUISINE_SEEDS: CuisineSeed[] = [
  {
    kitchenStyleId: 'gujarati',
    region: 'West',
    descriptionPrefix: 'a Gujarati specialty with homely flavours and regional pantry staples.',
    defaultProtein: 'Tuver dal',
    prefixes: ['Grand', 'Chef', 'Tawa', 'Handi', 'Rustic', 'Village', 'Spicy', 'Mild', 'Weekend', 'Everyday'],
    suffixes: BATCH5_SUFFIXES,
    bases: [
      'Rotlo Shaak', 'Bajra Raab', 'Gehu Raab', 'Doodhi Muthia Fry', 'Palak Muthia Fry', 'Val ni Khichdi',
      'Mag ni Khichdi', 'Chana Dal Fry', 'Moong Dal Fry', 'Urad Dal Fry', 'Masala Khichdi', 'Vaghareli Khichdi',
      'Tameta Shing', 'Ringan Shing', 'Fansi Shing', 'Karela Shing', 'Dudhi Shing', 'Turiya Shing',
      'Kobi Shing', 'Bateta Shing', 'Papdi Shing', 'Lilva Shing', 'Val Shing', 'Mag Shing',
      'Thepla Wrap Bowl', 'Methi Thepla Roll', 'Palak Thepla Roll', 'Bajra Thepla Roll', 'Jowar Thepla Roll',
      'Khakhra Chaat Bowl', 'Methi Khakhra Chaat', 'Masala Khakhra Bowl', 'Bhusu Chaat', 'Chevdo Bowl',
      'Fafda Bowl', 'Jalebi Bowl', 'Gathiya Bowl', 'Papdi Chaat Bowl', 'Sev Mamra Bowl',
      'Undhiyu Bowl', 'Handvo Bowl', 'Dhokla Bowl', 'Khaman Bowl', 'Patra Bowl',
      'Mohanthal Slice', 'Kopra Slice', 'Sukhdi Slice', 'Gol Papdi Slice', 'Kansar Bowl',
      'Dudhpak Bowl', 'Basundi Bowl', 'Shrikhand Bowl', 'Chaas Bowl', 'Masala Chaas Bowl',
      'Ker no Ras Bowl', 'Aam Ras Bowl', 'Chhundo Bowl', 'Pickle Roti Roll', 'Rotli Shaak Bowl',
      'Dal Bhat Bowl', 'Khichdi Kadhi Bowl', 'Kadhi Rice Bowl', 'Dal Rice Bowl', 'Roti Dal Bowl',
      'Bajra Rotla Bowl', 'Jowar Rotla Bowl', 'Gehu Rotla Bowl', 'Bhakri Bowl', 'Paratha Bowl',
      'Stuffed Paratha Bowl', 'Methi Paratha Bowl', 'Aloo Paratha Bowl', 'Gobi Paratha Bowl', 'Paneer Paratha Bowl',
    ],
  },
  {
    kitchenStyleId: 'street',
    region: 'West',
    descriptionPrefix: 'a street-food favourite with bold spice, crunch, and grab-and-go energy.',
    defaultProtein: 'Aloo',
    prefixes: ['Loaded', 'Double', 'Triple', 'Extra', 'Mega', 'Mini', 'Spicy', 'Crispy', 'Butter', 'Masala'],
    suffixes: BATCH5_SUFFIXES,
    bases: [
      'Pav Sandwich', 'Grilled Sandwich Bowl', 'Bombay Sandwich Bowl', 'Club Sandwich Bowl', 'Veg Sandwich Roll',
      'Paneer Sandwich Roll', 'Egg Sandwich Roll', 'Chicken Sandwich Roll', 'Tandoori Sandwich Roll', 'Cheese Sandwich Roll',
      'Frankie Roll Bowl', 'Kathi Roll Bowl', 'Roomali Roll Bowl', 'Keema Roll Bowl', 'Egg Roll Bowl',
      'Momo Chaat Bowl', 'Steamed Momo Bowl', 'Fried Momo Bowl', 'Tandoori Momo Bowl', 'Chilli Momo Bowl',
      'Noodle Bowl', 'Hakka Bowl', 'Schezwan Bowl', 'Manchurian Bowl', 'Fried Rice Bowl',
      'Chilli Bowl', 'Garlic Bowl', 'Crispy Bowl', 'Honey Chilli Bowl', 'Dragon Bowl',
      'Tikki Bowl', 'Aloo Tikki Bowl', 'Hara Bhara Bowl', 'Paneer Tikki Bowl', 'Chole Tikki Bowl',
      'Chaat Bowl', 'Bhel Bowl', 'Sev Puri Bowl', 'Papdi Bowl', 'Kachori Bowl',
      'Samosa Bowl', 'Vada Bowl', 'Pav Bhaji Bowl', 'Misal Bowl', 'Usal Bowl',
      'Kulcha Bowl', 'Naan Roll Bowl', 'Paratha Roll Bowl', 'Roti Roll Bowl', 'Tawa Pulao Bowl',
      'Chole Bowl', 'Rajma Bowl', 'Dal Bowl', 'Rice Bowl', 'Combo Bowl',
      'Lassi Bowl', 'Chaas Bowl', 'Jaljeera Bowl', 'Nimbu Soda Bowl', 'Masala Soda Bowl',
      'Corn Bowl', 'Sprout Bowl', 'Peanut Bowl', 'Fruit Bowl', 'Egg Bowl',
      'Pakora Bowl', 'Bhajiya Bowl', 'Mirchi Bowl', 'Bread Pakora Bowl', 'Cutlet Bowl',
      'Cutlet Pav Bowl', 'Keema Pav Bowl', 'Egg Pav Bowl', 'Paneer Pav Bowl', 'Vada Pav Bowl',
    ],
  },
  {
    kitchenStyleId: 'south',
    region: 'South',
    descriptionPrefix: 'a South Indian dish with coconut, tamarind, and fresh regional character.',
    defaultProtein: 'Urad dal',
    prefixes: ['Temple', 'Hotel', 'Grand', 'Mini', 'Spicy', 'Ghee', 'Crispy', 'Soft', 'Family', 'Chef'],
    suffixes: BATCH5_SUFFIXES,
    bases: [
      'Dosa Bowl', 'Masala Dosa Bowl', 'Rava Dosa Bowl', 'Ghee Dosa Bowl', 'Paper Dosa Bowl',
      'Idli Bowl', 'Rava Idli Bowl', 'Kanchipuram Idli Bowl', 'Podi Idli Bowl', 'Mini Idli Bowl',
      'Vada Bowl', 'Medu Vada Bowl', 'Masala Vada Bowl', 'Curd Vada Bowl', 'Sambar Vada Bowl',
      'Uttapam Bowl', 'Onion Uttapam Bowl', 'Tomato Uttapam Bowl', 'Mixed Uttapam Bowl', 'Cheese Uttapam Bowl',
      'Paniyaram Bowl', 'Sweet Paniyaram Bowl', 'Masala Paniyaram Bowl', 'Pesarattu Bowl', 'Adai Bowl',
      'Sambar Bowl', 'Rasam Bowl', 'Avial Bowl', 'Poriyal Bowl', 'Kootu Bowl',
      'Thoran Bowl', 'Pachadi Bowl', 'Thogayal Bowl', 'Chutney Bowl', 'Podi Bowl',
      'Rice Bowl', 'Lemon Rice Bowl', 'Tamarind Rice Bowl', 'Coconut Rice Bowl', 'Curd Rice Bowl',
      'Bisi Bele Bowl', 'Puliyogare Bowl', 'Chitranna Bowl', 'Vangi Bath Bowl', 'Tomato Rice Bowl',
      'Pongal Bowl', 'Ven Pongal Bowl', 'Khara Pongal Bowl', 'Sweet Pongal Bowl', 'Upma Bowl',
      'Kesari Bowl', 'Payasam Bowl', 'Appam Bowl', 'Stew Bowl', 'Parotta Bowl',
      'Poori Bowl', 'Kurma Bowl', 'Filter Coffee Pair', 'Chai Pair', 'Meals Plate',
      'Mini Meals', 'Full Meals', 'Banana Leaf Meals', 'Curry Leaf Rice', 'Sambar Rice Bowl',
      'Rasam Rice Bowl', 'Dal Rice Bowl', 'Curd Rice Plate', 'Pickle Rice Bowl', 'Papad Rice Bowl',
    ],
  },
  {
    kitchenStyleId: 'north',
    region: 'North',
    descriptionPrefix: 'a North Indian classic with rich masala, tandoori warmth, and homely comfort.',
    defaultProtein: 'Paneer',
    prefixes: ['Dhaba', 'Tawa', 'Handi', 'Royal', 'Grand', 'Smoky', 'Spicy', 'Mild', 'Home', 'Chef'],
    suffixes: BATCH5_SUFFIXES,
    bases: [
      'Paneer Bowl', 'Palak Paneer Bowl', 'Kadai Paneer Bowl', 'Matar Paneer Bowl', 'Shahi Paneer Bowl',
      'Dal Bowl', 'Dal Makhani Bowl', 'Dal Tadka Bowl', 'Dal Fry Bowl', 'Mix Dal Bowl',
      'Chana Bowl', 'Chole Bowl', 'Rajma Bowl', 'Kadhi Bowl', 'Kofta Bowl',
      'Malai Kofta Bowl', 'Lauki Kofta Bowl', 'Aloo Bowl', 'Aloo Gobi Bowl', 'Aloo Matar Bowl',
      'Bhindi Bowl', 'Baingan Bowl', 'Gobi Bowl', 'Lauki Bowl', 'Turai Bowl',
      'Kaddu Bowl', 'Arbi Bowl', 'Mix Veg Bowl', 'Jeera Rice Bowl', 'Pulao Bowl',
      'Biryani Bowl', 'Veg Biryani Bowl', 'Tehri Bowl', 'Khichdi Bowl', 'Roti Bowl',
      'Naan Bowl', 'Paratha Bowl', 'Kulcha Bowl', 'Poori Bowl', 'Bedmi Bowl',
      'Raita Bowl', 'Salad Bowl', 'Chutney Bowl', 'Pickle Bowl', 'Papad Bowl',
      'Halwa Bowl', 'Kheer Bowl', 'Gajar Halwa Bowl', 'Moong Halwa Bowl', 'Suji Halwa Bowl',
      'Jalebi Bowl', 'Rabri Bowl', 'Shahi Tukda Bowl', 'Lassi Bowl', 'Chaas Bowl',
      'Tandoori Bowl', 'Tikka Bowl', 'Seekh Bowl', 'Kabab Bowl', 'Curry Bowl',
      'Masala Bowl', 'Jalfrezi Bowl', 'Do Pyaza Bowl', 'Lababdar Bowl', 'Handi Bowl',
    ],
  },
  {
    kitchenStyleId: 'punjabi',
    region: 'North',
    descriptionPrefix: 'a Punjabi dish with robust masala, tandoori notes, and dhaba-style heartiness.',
    defaultProtein: 'Paneer',
    prefixes: ['Amritsari', 'Patiala', 'Lahori', 'Bhatti', 'Tandoori', 'Dhaba', 'Makhan', 'Smoky', 'Grand', 'Chef'],
    suffixes: BATCH5_SUFFIXES,
    bases: [
      'Saag Bowl', 'Makki Roti Bowl', 'Kulcha Bowl', 'Chole Bowl', 'Bhature Bowl',
      'Paneer Tikka Bowl', 'Paneer Masala Bowl', 'Paneer Bhurji Bowl', 'Tandoori Paneer Bowl', 'Malai Paneer Bowl',
      'Chicken Tikka Bowl', 'Butter Chicken Bowl', 'Chicken Curry Bowl', 'Chicken Masala Bowl', 'Chicken Fry Bowl',
      'Mutton Curry Bowl', 'Mutton Keema Bowl', 'Mutton Rara Bowl', 'Fish Fry Bowl', 'Fish Curry Bowl',
      'Egg Curry Bowl', 'Anda Bhurji Bowl', 'Egg Masala Bowl', 'Dal Makhani Bowl', 'Kali Dal Bowl',
      'Rajma Bowl', 'Chana Dal Bowl', 'Moong Dal Bowl', 'Palak Dal Bowl', 'Khichdi Bowl',
      'Kadhi Bowl', 'Pakora Bowl', 'Samosa Bowl', 'Paratha Bowl', 'Naan Bowl',
      'Roti Bowl', 'Missi Roti Bowl', 'Makki Roti Bowl', 'Laccha Paratha Bowl', 'Stuffed Kulcha Bowl',
      'Lassi Bowl', 'Chaas Bowl', 'Raita Bowl', 'Salad Bowl', 'Pickle Bowl',
      'Pinni Bowl', 'Panjiri Bowl', 'Ladoo Bowl', 'Halwa Bowl', 'Kheer Bowl',
      'Gajar Halwa Bowl', 'Moong Halwa Bowl', 'Jalebi Bowl', 'Phirni Bowl', 'Karah Bowl',
      'Tawa Bowl', 'Seekh Bowl', 'Kabab Bowl', 'Curry Bowl', 'Masala Bowl',
    ],
  },
  {
    kitchenStyleId: 'rajasthani',
    region: 'West',
    descriptionPrefix: 'a Rajasthani recipe with desert spice, ghee richness, and royal thali warmth.',
    defaultProtein: 'Besan',
    prefixes: ['Marwari', 'Mewari', 'Bikaneri', 'Jodhpuri', 'Jaipuri', 'Desert', 'Royal', 'Rustic', 'Festive', 'Chef'],
    suffixes: BATCH5_SUFFIXES,
    bases: [
      'Dal Baati Bowl', 'Baati Bowl', 'Churma Bowl', 'Panchmel Dal Bowl', 'Gatte Bowl',
      'Gatte Ki Sabzi Bowl', 'Gatte Pulao Bowl', 'Gatte Khichdi Bowl', 'Papad Sabzi Bowl', 'Mangodi Bowl',
      'Ker Sangri Bowl', 'Sangri Bowl', 'Ker Bowl', 'Haldi Sabzi Bowl', 'Kachri Bowl',
      'Mirchi Vada Bowl', 'Pyaz Kachori Bowl', 'Mawa Kachori Bowl', 'Dal Kachori Bowl', 'Bhujia Bowl',
      'Missi Roti Bowl', 'Bajra Roti Bowl', 'Makki Roti Bowl', 'Khoba Roti Bowl', 'Thepla Bowl',
      'Khichdi Bowl', 'Raab Bowl', 'Ghevar Bowl', 'Malpua Bowl', 'Imarti Bowl',
      'Halwa Bowl', 'Ladoo Bowl', 'Churma Ladoo Bowl', 'Balushahi Bowl', 'Gond Ladoo Bowl',
      'Aloo Sabzi Bowl', 'Gobi Sabzi Bowl', 'Lauki Sabzi Bowl', 'Turai Sabzi Bowl', 'Kaddu Sabzi Bowl',
      'Arbi Sabzi Bowl', 'Bhindi Sabzi Bowl', 'Baingan Sabzi Bowl', 'Kadhi Bowl', 'Pakora Kadhi Bowl',
      'Boondi Kadhi Bowl', 'Chaas Bowl', 'Lassi Bowl', 'Raita Bowl', 'Salad Bowl',
      'Chana Masala Bowl', 'Chole Bowl', 'Rajma Bowl', 'Dal Tadka Bowl', 'Dal Fry Bowl',
      'Jeera Rice Bowl', 'Pulao Bowl', 'Bajra Pulao Bowl', 'Khichda Bowl', 'Mix Veg Bowl',
    ],
  },
  {
    kitchenStyleId: 'bengali',
    region: 'East',
    descriptionPrefix: 'a Bengali dish with mustard oil, subtle sweetness, and layered regional flavour.',
    defaultProtein: 'Aloo',
    prefixes: ['Kolkata', 'Dhakai', 'Nadia', 'Mustard', 'Smoky', 'Grand', 'Home', 'Festive', 'River', 'Chef'],
    suffixes: BATCH5_SUFFIXES,
    bases: [
      'Shukto Bowl', 'Labra Bowl', 'Chorchori Bowl', 'Ghonto Bowl', 'Dalna Bowl',
      'Jhol Bowl', 'Kaliya Bowl', 'Kosha Bowl', 'Chingri Curry Bowl', 'Chingri Bhapa Bowl',
      'Fish Curry Bowl', 'Fish Fry Bowl', 'Ilish Bowl', 'Rui Bowl', 'Bhetki Bowl',
      'Dim Kosha Bowl', 'Dim Curry Bowl', 'Chicken Kosha Bowl', 'Mutton Kosha Bowl', 'Kosha Mangsho Bowl',
      'Biryani Bowl', 'Polao Bowl', 'Ghee Bhat Bowl', 'Dal Bowl', 'Cholar Dal Bowl',
      'Muger Dal Bowl', 'Masoor Dal Bowl', 'Potol Bowl', 'Posto Bowl', 'Begun Bowl',
      'Aloo Bowl', 'Kumro Bowl', 'Shaak Bowl', 'Bhaja Bowl', 'Chop Bowl',
      'Cutlet Bowl', 'Fish Chop Bowl', 'Vegetable Chop Bowl', 'Luchi Bowl', 'Kochuri Bowl',
      'Radhaballavi Bowl', 'Roll Bowl', 'Telebhaja Bowl', 'Beguni Bowl', 'Phuluri Bowl',
      'Piyaji Bowl', 'Muri Ghonto Bowl', 'Panta Bhat Bowl', 'Bhate Bowl', 'Chatni Bowl',
      'Mishti Doi Bowl', 'Rasgulla Bowl', 'Sandesh Bowl', 'Payesh Bowl', 'Malpua Bowl',
      'Patishapta Bowl', 'Pitha Bowl', 'Langcha Bowl', 'Chomchom Bowl', 'Ras Malai Bowl',
    ],
  },
  {
    kitchenStyleId: 'maharashtrian',
    region: 'West',
    descriptionPrefix: 'a Maharashtrian recipe with peanut, coconut, and bold everyday comfort.',
    defaultProtein: 'Toor dal',
    prefixes: ['Kolhapuri', 'Puneri', 'Nashik', 'Gavran', 'Konkani', 'Spicy', 'Grand', 'Home', 'Festive', 'Chef'],
    suffixes: BATCH5_SUFFIXES,
    bases: [
      'Misal Bowl', 'Usal Bowl', 'Vada Pav Bowl', 'Batata Vada Bowl', 'Sabudana Vada Bowl',
      'Kanda Bhaji Bowl', 'Mirchi Bhaji Bowl', 'Thalipeeth Bowl', 'Zunka Bowl', 'Pitla Bowl',
      'Bhakri Bowl', 'Bharli Vangi Bowl', 'Vangi Bhat Bowl', 'Masale Bhat Bowl', 'Tendli Bhat Bowl',
      'Saar Bowl', 'Amti Bowl', 'Varan Bhat Bowl', 'Dal Bowl', 'Kadhi Bowl',
      'Bharli Mirchi Bowl', 'Baigan Bharit Bowl', 'Bhaji Bowl', 'Alu Wadi Bowl', 'Patwadi Bowl',
      'Kothimbir Vadi Bowl', 'Sabudana Khichdi Bowl', 'Upit Bowl', 'Sheera Bowl', 'Shrikhand Bowl',
      'Puran Poli Bowl', 'Modak Bowl', 'Basundi Bowl', 'Kheer Bowl', 'Karachi Halwa Bowl',
      'Rassa Bowl', 'Taambda Rassa Bowl', 'Pandhra Rassa Bowl', 'Sol Kadhi Bowl', 'Taak Bowl',
      'Koshimbir Bowl', 'Thecha Bowl', 'Lasun Chutney Bowl', 'Poha Bowl', 'Kanda Poha Bowl',
      'Batata Poha Bowl', 'Chivda Bowl', 'Shankarpali Bowl', 'Chakli Bowl', 'Karanji Bowl',
      'Gul Poli Bowl', 'Ladoo Bowl', 'Besan Ladoo Bowl', 'Rava Ladoo Bowl', 'Anarsa Bowl',
    ],
  },
  {
    kitchenStyleId: 'hyderabadi',
    region: 'South',
    descriptionPrefix: 'a Hyderabadi dish with dum cooking, fried onions, and Nizami depth.',
    defaultProtein: 'Basmati rice',
    prefixes: ['Nizami', 'Old City', 'Dum', 'Zafrani', 'Irani', 'Royal', 'Grand', 'Smoky', 'Classic', 'Chef'],
    suffixes: BATCH5_SUFFIXES,
    bases: [
      'Biryani Bowl', 'Chicken Biryani Bowl', 'Mutton Biryani Bowl', 'Egg Biryani Bowl', 'Veg Biryani Bowl',
      'Paneer Biryani Bowl', 'Dum Biryani Bowl', 'Kacchi Biryani Bowl', 'Pakki Biryani Bowl', 'Zafrani Biryani Bowl',
      'Salan Bowl', 'Mirchi Salan Bowl', 'Bagara Baingan Bowl', 'Tamatar Salan Bowl', 'Dahi Salan Bowl',
      'Haleem Bowl', 'Nihari Bowl', 'Khichda Bowl', 'Dalcha Bowl', 'Marag Bowl',
      'Shorba Bowl', 'Korma Bowl', 'Pasanda Bowl', 'Keema Bowl', 'Cutlet Bowl',
      'Kabab Bowl', 'Seekh Bowl', 'Chicken 65 Bowl', 'Paneer 65 Bowl', 'Fish Fry Bowl',
      'Fish Curry Bowl', 'Prawn Biryani Bowl', 'Egg Curry Bowl', 'Paratha Bowl', 'Sheermal Bowl',
      'Naan Bowl', 'Roomali Roti Bowl', 'Pulao Bowl', 'Zafrani Pulao Bowl', 'Bagara Rice Bowl',
      'Dal Bowl', 'Raita Bowl', 'Double Ka Meetha Bowl', 'Qubani Ka Meetha Bowl', 'Sheer Khurma Bowl',
      'Shahi Tukda Bowl', 'Falooda Bowl', 'Badam Milk Bowl', 'Lassi Bowl', 'Chai Bowl',
      'Lukhmi Bowl', 'Keema Samosa Bowl', 'Chicken Samosa Bowl', 'Paneer Samosa Bowl', 'Rice Bowl',
    ],
  },
  {
    kitchenStyleId: 'goan',
    region: 'West',
    descriptionPrefix: 'a Goan coastal dish with coconut vinegar, kokum, and Portuguese-Indian warmth.',
    defaultProtein: 'Prawns',
    prefixes: ['Coastal', 'Old Goa', 'Konkan', 'Beach', 'Tangy', 'Spicy', 'Smoky', 'Grand', 'Home', 'Chef'],
    suffixes: BATCH5_SUFFIXES,
    bases: [
      'Fish Curry Bowl', 'Prawn Curry Bowl', 'Crab Curry Bowl', 'Fish Fry Bowl', 'Prawn Fry Bowl',
      'Recheado Bowl', 'Balchao Bowl', 'Xacuti Bowl', 'Cafreal Bowl', 'Vindaloo Bowl',
      'Sorpotel Bowl', 'Chorizo Bowl', 'Sausage Bowl', 'Pulao Bowl', 'Fish Pulao Bowl',
      'Prawn Pulao Bowl', 'Chicken Pulao Bowl', 'Sannas Bowl', 'Poi Bowl', 'Bread Bowl',
      'Bebinca Bowl', 'Dodol Bowl', 'Bolinhas Bowl', 'Doce Bowl', 'Kulkul Bowl',
      'Sol Kadhi Bowl', 'Kokum Curry Bowl', 'Salad Bowl', 'Pickle Bowl', 'Rice Bowl',
      'Coconut Rice Bowl', 'Jeera Rice Bowl', 'Lemon Rice Bowl', 'Tomato Rice Bowl', 'Ambot Tik Bowl',
      'Moilee Bowl', 'Pollichathu Bowl', 'Koliwada Bowl', 'Masala Fry Bowl', 'Roast Bowl',
      'Assado Bowl', 'Feijoada Bowl', 'Stew Bowl', 'Curry Bowl', 'Fry Bowl',
      'Squid Bowl', 'Mussel Bowl', 'Clam Bowl', 'Oyster Bowl', 'Kingfish Bowl',
      'Pomfret Bowl', 'Mackerel Bowl', 'Sardine Bowl', 'Surmai Bowl', 'Bangda Bowl',
    ],
  },
  {
    kitchenStyleId: 'kerala',
    region: 'South',
    descriptionPrefix: 'a Kerala dish with coconut oil, curry leaves, and Malabar coastal comfort.',
    defaultProtein: 'Coconut',
    prefixes: ['Malabar', 'Nadan', 'Thalassery', 'Coastal', 'Syrian', 'Temple', 'Grand', 'Home', 'Festive', 'Chef'],
    suffixes: BATCH5_SUFFIXES,
    bases: [
      'Appam Bowl', 'Stew Bowl', 'Idiyappam Bowl', 'Puttu Bowl', 'Kadala Bowl',
      'Parotta Bowl', 'Biryani Bowl', 'Malabar Biryani Bowl', 'Thalassery Biryani Bowl', 'Fish Biryani Bowl',
      'Avial Bowl', 'Sambar Bowl', 'Rasam Bowl', 'Pulissery Bowl', 'Moru Curry Bowl',
      'Kaalan Bowl', 'Olan Bowl', 'Erissery Bowl', 'Thoran Bowl', 'Mezhukkupuratti Bowl',
      'Upperi Bowl', 'Pachadi Bowl', 'Kootu Curry Bowl', 'Parippu Curry Bowl', 'Cherupayar Bowl',
      'Kappa Bowl', 'Meen Curry Bowl', 'Meen Pollichathu Bowl', 'Meen Moilee Bowl', 'Fish Fry Bowl',
      'Karimeen Bowl', 'Neymeen Bowl', 'Chicken Curry Bowl', 'Kozhi Curry Bowl', 'Egg Roast Bowl',
      'Coconut Rice Bowl', 'Ghee Rice Bowl', 'Jeera Rice Bowl', 'Lemon Rice Bowl', 'Tomato Rice Bowl',
      'Payasam Bowl', 'Palada Payasam Bowl', 'Neyyappam Bowl', 'Unniyappam Bowl', 'Achappam Bowl',
      'Pazham Pori Bowl', 'Sulaimani Bowl', 'Chai Bowl', 'Filter Coffee Bowl', 'Sambharam Bowl',
      'Sol Kadhi Bowl', 'Rice Bowl', 'Meals Bowl', 'Banana Leaf Meals', 'Curry Leaf Rice Bowl',
    ],
  },
  {
    kitchenStyleId: 'chinese',
    region: 'North',
    descriptionPrefix: 'an Indo-Chinese favourite with wok heat, soy-garlic punch, and street-side crunch.',
    defaultProtein: 'Cabbage',
    prefixes: ['Schezwan', 'Garlic', 'Crispy', 'Spicy', 'Dry', 'Gravy', 'Street', 'Restaurant', 'Smoky', 'Chef'],
    suffixes: BATCH5_SUFFIXES,
    bases: [
      'Manchurian Bowl', 'Gobi Manchurian Bowl', 'Paneer Manchurian Bowl', 'Mushroom Manchurian Bowl', 'Baby Corn Manchurian Bowl',
      'Chilli Bowl', 'Chilli Gobi Bowl', 'Chilli Paneer Bowl', 'Chilli Mushroom Bowl', 'Chilli Potato Bowl',
      'Honey Chilli Bowl', 'Crispy Corn Bowl', 'Spring Roll Bowl', 'Hakka Noodle Bowl', 'Schezwan Noodle Bowl',
      'Chow Mein Bowl', 'Fried Rice Bowl', 'Schezwan Rice Bowl', 'Garlic Rice Bowl', 'Triple Rice Bowl',
      'Combination Rice Bowl', 'Burnt Garlic Rice Bowl', 'Mushroom Rice Bowl', 'Paneer Rice Bowl', 'Egg Rice Bowl',
      'Chicken Rice Bowl', 'Soup Bowl', 'Hot Sour Soup Bowl', 'Sweet Corn Soup Bowl', 'Manchow Soup Bowl',
      'Momo Bowl', 'Steamed Momo Bowl', 'Fried Momo Bowl', 'Schezwan Momo Bowl', 'Chilli Momo Bowl',
      'Dragon Bowl', 'Szechuan Bowl', 'Kung Pao Bowl', 'Black Pepper Bowl', 'Garlic Chicken Bowl',
      'Garlic Paneer Bowl', 'Lollipop Bowl', 'Crispy Chicken Bowl', 'Crispy Paneer Bowl', 'Salt Pepper Bowl',
      'Frankie Bowl', 'Bhel Bowl', 'Noodle Roll Bowl', 'Manchurian Roll Bowl', 'Schezwan Roll Bowl',
      'Chilli Garlic Bowl', 'Paneer Chilli Bowl', 'Chicken Chilli Bowl', 'Veg Chilli Bowl', 'Triple Bowl',
    ],
  },
  {
    kitchenStyleId: 'assamese',
    region: 'East',
    descriptionPrefix: 'an Assamese recipe with mustard, bamboo shoot, and river-valley flavour.',
    defaultProtein: 'Masoor dal',
    prefixes: ['Axomiya', 'Bihu', 'River', 'Mustard', 'Bamboo', 'Smoky', 'Grand', 'Home', 'Festive', 'Chef'],
    suffixes: BATCH5_SUFFIXES,
    bases: [
      'Masor Tenga Bowl', 'Ou Tenga Bowl', 'Patot Diya Maach Bowl', 'Khar Bowl', 'Kharoli Bowl',
      'Ou Khar Bowl', 'Papaya Khar Bowl', 'Jolpan Bowl', 'Doi Jolpan Bowl', 'Chira Bowl',
      'Pitha Bowl', 'Til Pitha Bowl', 'Tekeli Pitha Bowl', 'Ghila Pitha Bowl', 'Sunga Pitha Bowl',
      'Fish Curry Bowl', 'Fish Fry Bowl', 'Rohu Bowl', 'Catla Bowl', 'Prawn Curry Bowl',
      'Chicken Curry Bowl', 'Mutton Curry Bowl', 'Bamboo Shoot Bowl', 'Bamboo Fry Bowl', 'Bamboo Pickle Bowl',
      'Ou Tenga Dal Bowl', 'Masoor Dal Bowl', 'Moong Dal Bowl', 'Matidali Bowl', 'Matir Dal Bowl',
      'Alu Pitika Bowl', 'Begun Pitika Bowl', 'Tomato Pitika Bowl', 'Fish Pitika Bowl', 'Egg Pitika Bowl',
      'Mixed Pitika Bowl', 'Pigeon Pea Bowl', 'Black Gram Bowl', 'Green Gram Bowl', 'Lentil Soup Bowl',
      'Sticky Rice Bowl', 'Bora Saul Bowl', 'Joha Rice Bowl', 'Komal Saul Bowl', 'Rice Plate Bowl',
      'Dal Rice Plate', 'Fish Rice Plate', 'Chicken Rice Plate', 'Egg Rice Plate', 'Veg Rice Plate',
      'Pickle Rice Bowl', 'Salad Rice Bowl', 'Soup Rice Bowl', 'Stew Rice Bowl', 'Curry Rice Bowl',
    ],
  },
  {
    kitchenStyleId: 'kashmiri',
    region: 'North',
    descriptionPrefix: 'a Kashmiri dish with saffron, fennel, and Wazwan-inspired warmth.',
    defaultProtein: 'Paneer',
    prefixes: ['Wazwan', 'Saffron', 'Valley', 'Royal', 'Smoky', 'Grand', 'Home', 'Winter', 'Festive', 'Chef'],
    suffixes: BATCH5_SUFFIXES,
    bases: [
      'Rogan Josh Bowl', 'Yakhni Bowl', 'Gushtaba Bowl', 'Rista Bowl', 'Korma Bowl',
      'Dum Aloo Bowl', 'Chaman Bowl', 'Paneer Kaliya Bowl', 'Paneer Yakhni Bowl', 'Paneer Rogan Josh Bowl',
      'Haak Bowl', 'Monji Haak Bowl', 'Nadir Bowl', 'Lotus Stem Bowl', 'Lotus Fry Bowl',
      'Yakhni Pulao Bowl', 'Mutton Pulao Bowl', 'Chicken Pulao Bowl', 'Veg Pulao Bowl', 'Zafrani Pulao Bowl',
      'Modur Pulao Bowl', 'Biryani Bowl', 'Khichdi Bowl', 'Rajma Bowl', 'Chana Bowl',
      'Dal Bowl', 'Moong Dal Bowl', 'Masoor Dal Bowl', 'Mix Dal Bowl', 'Kadhi Bowl',
      'Raita Bowl', 'Salad Bowl', 'Chutney Bowl', 'Pickle Bowl', 'Papad Bowl',
      'Roti Bowl', 'Naan Bowl', 'Paratha Bowl', 'Kulcha Bowl', 'Poori Bowl',
      'Samosa Bowl', 'Pakora Bowl', 'Cutlet Bowl', 'Kabab Bowl', 'Tikka Bowl',
      'Seekh Bowl', 'Curry Bowl', 'Masala Bowl', 'Stew Bowl', 'Soup Bowl',
      'Rice Bowl', 'Pulao Bowl', 'Biryani Plate', 'Wazwan Plate', 'Feast Plate',
    ],
  },
  {
    kitchenStyleId: 'chettinad',
    region: 'South',
    descriptionPrefix: 'a Chettinad dish with roasted spices, pepper heat, and Karaikudi depth.',
    defaultProtein: 'Chicken',
    prefixes: ['Karaikudi', 'Pepper', 'Roasted', 'Spicy', 'Grand', 'Home', 'Festive', 'Smoky', 'Temple', 'Chef'],
    suffixes: BATCH5_SUFFIXES,
    bases: [
      'Chicken Curry Bowl', 'Mutton Curry Bowl', 'Fish Curry Bowl', 'Prawn Curry Bowl', 'Egg Curry Bowl',
      'Paneer Curry Bowl', 'Mushroom Curry Bowl', 'Veg Curry Bowl', 'Mixed Curry Bowl', 'Chicken Fry Bowl',
      'Mutton Fry Bowl', 'Fish Fry Bowl', 'Prawn Fry Bowl', 'Egg Fry Bowl', 'Paneer Fry Bowl',
      'Chicken Roast Bowl', 'Mutton Roast Bowl', 'Fish Roast Bowl', 'Prawn Roast Bowl', 'Egg Roast Bowl',
      'Chicken Pepper Bowl', 'Mutton Pepper Bowl', 'Fish Pepper Bowl', 'Prawn Pepper Bowl', 'Egg Pepper Bowl',
      'Chicken Masala Bowl', 'Mutton Masala Bowl', 'Fish Masala Bowl', 'Prawn Masala Bowl', 'Egg Masala Bowl',
      'Chicken Biryani Bowl', 'Mutton Biryani Bowl', 'Fish Biryani Bowl', 'Prawn Biryani Bowl', 'Egg Biryani Bowl',
      'Chicken Pulao Bowl', 'Mutton Pulao Bowl', 'Fish Pulao Bowl', 'Prawn Pulao Bowl', 'Egg Pulao Bowl',
      'Chicken Rice Bowl', 'Mutton Rice Bowl', 'Fish Rice Bowl', 'Prawn Rice Bowl', 'Egg Rice Bowl',
      'Chicken Soup Bowl', 'Mutton Soup Bowl', 'Fish Soup Bowl', 'Prawn Soup Bowl', 'Egg Soup Bowl',
      'Chicken Stew Bowl', 'Mutton Stew Bowl', 'Fish Stew Bowl', 'Prawn Stew Bowl', 'Egg Stew Bowl',
      'Chicken Kuzhambu Bowl', 'Mutton Kuzhambu Bowl', 'Fish Kuzhambu Bowl', 'Prawn Kuzhambu Bowl', 'Egg Kuzhambu Bowl',
    ],
  },
];

const configs: Batch4CuisineConfig[] = CUISINE_SEEDS.map((seed) => {
  const titles = generateTitles(seed.bases, seed.prefixes, seed.suffixes);
  const { bases: _b, prefixes: _p, suffixes: _s, ...rest } = seed;
  return { ...rest, titles, startId: 185 };
});

const allRecipes = configs.flatMap((config) => buildBatch4Recipes(config));

console.log('Generated batch5 recipes:', allRecipes.length);
for (const config of configs) {
  console.log(`  ${config.kitchenStyleId}: ${config.titles.length}`);
}

const duplicates = new Set<string>();
const dupTitles: string[] = [];
for (const recipe of allRecipes) {
  const key = recipe.title.toLowerCase();
  if (duplicates.has(key)) dupTitles.push(recipe.title);
  duplicates.add(key);
}
if (dupTitles.length > 0) {
  throw new Error(`Duplicate batch5 titles: ${dupTitles.slice(0, 5).join(', ')}`);
}

const outPath = join(__dirname, 'recipe-catalog/all-cuisines-batch5.ts');
const file = `import type { RecipeCatalogEntry } from './types';
import { buildBatch4Recipes, type Batch4CuisineConfig } from './batch4-shared';

const BATCH5_CONFIGS: Batch4CuisineConfig[] = ${JSON.stringify(configs, null, 2)};

export const ALL_CUISINES_BATCH5_RECIPES: RecipeCatalogEntry[] = BATCH5_CONFIGS.flatMap((config) =>
  buildBatch4Recipes(config),
);
`;

writeFileSync(outPath, file);
console.log(`Wrote ${outPath}`);
