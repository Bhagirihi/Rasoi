/**
 * Generates 100 batch4 recipe titles per cuisine (ids 85–184), avoiding existing catalog titles.
 * Run: npx tsx scripts/generate-batch4-catalog.ts
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { ALL_CATALOG_RECIPES } from './recipe-catalog';
import { buildBatch4Recipes, type Batch4CuisineConfig } from './recipe-catalog/batch4-shared';

type CuisineSeed = Omit<Batch4CuisineConfig, 'titles'> & {
  bases: readonly string[];
  prefixes: readonly string[];
};

const existingTitles = new Set(
  ALL_CATALOG_RECIPES.map((recipe) => recipe.title.trim().toLowerCase()),
);

function generateTitles(bases: readonly string[], prefixes: readonly string[]): string[] {
  const titles: string[] = [];
  const seen = new Set<string>();

  const tryAdd = (title: string) => {
    const key = title.trim().toLowerCase();
    if (seen.has(key) || existingTitles.has(key)) return;
    seen.add(key);
    titles.push(title.trim());
  };

  for (const base of bases) {
    tryAdd(base);
    if (titles.length >= 100) return titles;
    for (const prefix of prefixes) {
      tryAdd(`${prefix} ${base}`);
      if (titles.length >= 100) return titles;
    }
  }

  if (titles.length < 100) {
    throw new Error(`Could only generate ${titles.length} unique titles`);
  }

  return titles.slice(0, 100);
}

const CUISINE_SEEDS: CuisineSeed[] = [
  {
    kitchenStyleId: 'gujarati',
    region: 'West',
    descriptionPrefix: 'a Gujarati home-style dish with sweet-savoury balance and comforting thali flavours.',
    defaultProtein: 'Tuver dal',
    bases: [
      'Mag ni Dal', 'Val ni Dal', 'Khatti Dal', 'Gujarati Khichdi', 'Bajra Rotla', 'Jowar Rotla',
      'Bajri Dhebra', 'Methi Dhebra', 'Palak Dhebra', 'Bajri Vada', 'Lilva Kachori', 'Methi Kachori',
      'Dal Kachori', 'Ghughra', 'Gol Papdi', 'Kansar', 'Mohanthal', 'Dudhpak', 'Kopra Pak', 'Sukhdi',
      'Adadiya Pak', 'Kachariyu', 'Kharek na Ladoo', 'Chorafali', 'Farsi Puri', 'Khajli', 'Ghughra Roll',
      'Ponk Bhel', 'Tuver Lilva Pulao', 'Papdi no Lot', 'Surti Papdi Shaak', 'Kobi Muthia', 'Cabbage Sambharo',
      'Bateta nu Shaak', 'Kobi Bateta nu Shaak', 'Ringan nu Shaak', 'Dudhi nu Shaak', 'Turiya nu Shaak',
      'Karela nu Shaak', 'Fansi nu Shaak', 'Mag nu Shaak', 'Val papdi nu Shaak', 'Sev Tameta', 'Tameta nu Shaak',
      'Bharela Ringan', 'Bharela Tameta', 'Stuffed Bhindi Gujarati', 'Kadhi Pakoda', 'Gujarati Rasawala Bateta',
      'Dhokla Sandwich', 'Khaman Dhokla Roll', 'Handvo Slice', 'Patra Roll', 'Methi na Muthia Fry',
      'Dudhi Muthia', 'Palak Muthia', 'Khaman Dhokla Chaat', 'Sev Usal Pav', 'Locho Chaat', 'Khichu Masala',
      'Rajgara Puri', 'Singdana Chutney Roti', 'Thepla Wrap', 'Masala Khakhra Chaat', 'Bhusu Mix',
      'Makai no Chevdo', 'Papdi Gathiya Chaat', 'Fafda Jalebi Bowl', 'Undhiyu Paratha', 'Mag Khichu',
      'Tuver ni Khichdi', 'Val ni Khichdi', 'Bajra Khichdi', 'Gehu ni Khichdi', 'Doodhi Handvo',
      'Methi Handvo', 'Palak Handvo', 'Tomato Handvo', 'Surti Undhiyu Bowl', 'Winter Undhiyu',
      'Kathiawadi Shaak', 'Surti Shaak', 'Gujarati Dal Fry', 'Sweet Gujarati Dal', 'Khatta Meetha Dal',
      'Mag Dal Fry', 'Val Dal Tadka', 'Moong Dal Halwa Cup', 'Sheero', 'Badam Sheero', 'Gajar Halwa Gujarati',
      'Doodhi Halwa', 'Kaju Katli Roll', 'Mawa Ghughra', 'Dry Fruit Ghughra', 'Coconut Ghughra',
      'Methi Gota Chaat', 'Bhajiya Marcha Plate', 'Mirchi Vada Roll', 'Dal Dhokli Bowl', 'Wheat Lapsi Cup',
      'Puran Poli Roll', 'Shrikhand Bowl', 'Basundi Cup', 'Chaas Masala', 'Masala Chaas', 'Gujarati Salad',
      'Kachumber Gujarati', 'Papaya Sambharo', 'Raw Mango Chhundo Bowl', 'Keri no Ras Bowl', 'Aam Ras Puri Plate',
    ],
    prefixes: ['Surti', 'Kathiawadi', 'Festive', 'Home-style', 'Monsoon', 'Winter', 'Jain', 'Quick', 'Smoky', 'Royal'],
  },
  {
    kitchenStyleId: 'street',
    region: 'West',
    descriptionPrefix: 'a bold street-style snack built for crunch, spice, and late-evening cravings.',
    defaultProtein: 'Aloo',
    bases: [
      'Masala Pav', 'Tawa Pulao', 'Chinese Bhel', 'Noodle Frankie', 'Egg Frankie', 'Paneer Frankie',
      'Aloo Frankie', 'Chicken Frankie', 'Keema Pav', 'Keema Roll', 'Egg Roll Kolkata', 'Double Egg Roll',
      'Mutton Roll', 'Chicken Roll', 'Paneer Roll', 'Veg Roll', 'Schezwan Roll', 'Mayo Roll', 'Tandoori Roll',
      'Malai Roll', 'Kathi Roll', 'Kolkata Kathi Roll', 'Roomali Roll', 'Tandoori Momo', 'Steamed Momo Chaat',
      'Fried Momo Chaat', 'Tandoori Momo Chaat', 'Chilli Momo', 'Garlic Momo', 'Soup Momo Bowl',
      'Ram Ladoo Chaat', 'Aloo Tikki Chaat', 'Shahi Aloo Tikki', 'Hara Bhara Tikki', 'Corn Tikki Chaat',
      'Paneer Tikki Chaat', 'Chole Tikki Chaat', 'Ragda Pattice Bowl', 'Dahi Batata Puri', 'Sev Puri Plate',
      'Bhel Puri Bowl', 'Jhalmuri Bowl', 'Churmur Bowl', 'Papdi Chaat Tower', 'Basket Chaat', 'Katori Chaat',
      'Samosa Chaat Bowl', 'Kachori Chaat Bowl', 'Dahi Kachori Chaat', 'Raj Kachori Mini', 'Bedmi Puri Plate',
      'Chole Bhature Plate', 'Amritsari Kulcha Plate', 'Stuffed Kulcha Plate', 'Paneer Kulcha Plate',
      'Aloo Kulcha Plate', 'Onion Kulcha Plate', 'Mix Kulcha Plate', 'Tandoori Naan Roll', 'Garlic Naan Roll',
      'Keema Naan Roll', 'Paneer Naan Roll', 'Chole Naan Roll', 'Masala Naan Roll', 'Butter Naan Roll',
      'Roomali Roti Roll', 'Tandoori Roti Roll', 'Laccha Paratha Roll', 'Malabar Paratha Roll', 'Egg Paratha Roll',
      'Paneer Paratha Roll', 'Aloo Paratha Roll', 'Mix Paratha Roll', 'Tawa Paratha Roll', 'Stuffed Paratha Roll',
      'Vada Pav Special', 'Misal Pav Bowl', 'Usal Pav Bowl', 'Pav Bhaji Plate', 'Cheese Pav Bhaji', 'Masala Pav Bhaji',
      'Jain Pav Bhaji', 'Khada Pav Bhaji', 'Tawa Idli Chaat', 'Masala Idli Fry', 'Chilli Idli', 'Garlic Idli Fry',
      'Schezwan Idli', 'Manchurian Idli', 'Bread Pakoda Chaat', 'Samosa Sandwich', 'Vada Sandwich', 'Grilled Sandwich',
      'Bombay Sandwich', 'Club Sandwich Street', 'Omelette Sandwich', 'Egg Bhurji Pav', 'Anda Bhurji Pav',
      'Keema Pav Bhaji', 'Mutton Keema Pav', 'Chicken Keema Pav', 'Fish Fry Roll', 'Prawn Roll', 'Egg Bhurji Roll',
      'Paneer Bhurji Roll', 'Chilli Chicken Roll', 'Chilli Paneer Roll', 'Chilli Potato Roll', 'Honey Chilli Potato',
      'Crispy Corn Chaat', 'Masala Corn Cup', 'Sweet Corn Chaat', 'Boiled Egg Chaat', ' Anda Chaat',
      'Peanut Chaat', 'Sprout Chaat', 'Fruit Chaat Cup', 'Masala Soda', 'Jaljeera Soda', 'Nimbu Soda',
    ],
    prefixes: ['Mumbai', 'Delhi', 'Kolkata', 'Hyderabadi', 'Spicy', 'Crispy', 'Loaded', 'Double', 'Classic', 'Late-night'],
  },
  {
    kitchenStyleId: 'south',
    region: 'South',
    descriptionPrefix: 'a South Indian classic with coconut, curry leaf, and tamarind-led freshness.',
    defaultProtein: 'Urad dal',
    bases: [
      'Masala Dosa', 'Mysore Masala Dosa', 'Rava Dosa', 'Onion Rava Dosa', 'Ghee Roast Dosa', 'Paper Dosa',
      'Set Dosa', 'Neer Dosa', 'Pesarattu', 'Adai Dosa', 'Kuzhi Paniyaram', 'Masala Paniyaram', 'Sweet Paniyaram',
      'Idli Sambar', 'Rava Idli', 'Kanchipuram Idli', 'Thatte Idli', 'Button Idli', 'Mini Idli Sambar',
      'Medu Vada Sambar', 'Masala Vada', 'Keerai Vada', 'Paruppu Vada', 'Uddina Vada', 'Curd Vada',
      'Thayir Vada', 'Sambar Vada', 'Rasam Vada', 'Uttapam Onion', 'Uttapam Tomato', 'Uttapam Mixed Veg',
      'Onion Uttapam', 'Tomato Uttapam', 'Vegetable Uttapam', 'Cheese Uttapam', 'Podi Idli', 'Ghee Podi Idli',
      'Lemon Rice', 'Tamarind Rice', 'Coconut Rice', 'Curd Rice', 'Tomato Rice', 'Mint Rice', 'Bisi Bele Bath',
      'Puliyogare', 'Chitranna', 'Vangi Bath', 'Capsicum Rice', 'Beetroot Rice', 'Carrot Rice', 'Sambar Rice',
      'Rasam Rice', 'Dal Rice South', 'Vegetable Sambar', 'Drumstick Sambar', 'Radish Sambar', 'Brinjal Sambar',
      'Tomato Rasam', 'Pepper Rasam', 'Garlic Rasam', 'Jeera Rasam', 'Lemon Rasam', 'Dal Rasam', 'Pineapple Rasam',
      'Avial', 'Poriyal Beans', 'Poriyal Cabbage', 'Carrot Beans Poriyal', 'Beetroot Poriyal', 'Cabbage Poriyal',
      'Kootu Spinach', 'Kootu Cabbage', 'Kootu Snake Gourd', 'Pachadi Cucumber', 'Pachadi Beetroot', 'Pachadi Mango',
      'Thogayal Coconut', 'Thogayal Curry Leaf', 'Tomato Chutney', 'Coconut Chutney', 'Peanut Chutney',
      'Onion Chutney', 'Ginger Chutney', 'Mint Chutney', 'Coriander Chutney', 'Gunpowder Idli', 'Podi Dosa',
      'Appam Stew', 'Vegetable Stew', 'Ishtu', 'Kerala Parotta', 'Malabar Parotta', 'Chapati Kurma',
      'Poori Kurma', 'Masala Poori', 'Ven Pongal', 'Khara Pongal', 'Sweet Pongal', 'Rava Kesari', 'Kesari Bath',
      'Payasam Ada', 'Semiya Payasam', 'Paruppu Payasam', 'Moong Dal Payasam', 'Rava Upma', 'Vegetable Upma',
      'Tomato Upma', 'Bread Upma', 'Vegetable Kootu', 'Mixed Veg Poriyal', 'Drumstick Leaves Poriyal',
      'Snake Gourd Kootu', 'Ash Gourd Kootu', 'Raw Banana Poriyal', 'Yam Poriyal', 'Cluster Beans Poriyal',
    ],
    prefixes: ['Chennai', 'Bangalore', 'Mysore', 'Tamil', 'Andhra', 'Karnataka', 'Temple', 'Hotel-style', 'Ghee', 'Crispy'],
  },
  {
    kitchenStyleId: 'north',
    region: 'North',
    descriptionPrefix: 'a North Indian favourite with rich gravies, tandoori warmth, and homely spice.',
    defaultProtein: 'Paneer',
    bases: [
      'Paneer Butter Masala', 'Shahi Paneer', 'Kadai Paneer', 'Palak Paneer', 'Matar Paneer', 'Paneer Lababdar',
      'Paneer Tikka Masala', 'Paneer Bhurji', 'Paneer Pasanda', 'Paneer Korma', 'Paneer Do Pyaza', 'Paneer Jalfrezi',
      'Paneer Kolhapuri', 'Paneer Handi', 'Paneer Makhani', 'Malai Kofta', 'Lauki Kofta', 'Banana Kofta',
      'Mix Veg Kofta', 'Aloo Gobi', 'Aloo Matar', 'Aloo Jeera', 'Aloo Tamatar', 'Aloo Methi', 'Aloo Palak',
      'Aloo Baingan', 'Aloo Capsicum', 'Aloo Chana', 'Aloo Paneer', 'Gobi Matar', 'Gobi Aloo', 'Gobi Masala',
      'Bhindi Masala', 'Bhindi Do Pyaza', 'Bhindi Amchoor', 'Baingan Bharta', 'Baingan Masala', 'Baingan Ka Bharta',
      'Lauki Chana Dal', 'Lauki Tamatar', 'Turai Masala', 'Kaddu Ki Sabzi', 'Arbi Masala', 'Arbi Fry',
      'Chana Masala', 'Chole Masala', 'Rajma Masala', 'Dal Makhani', 'Dal Tadka', 'Dal Fry', 'Dal Palak',
      'Moong Dal Tadka', 'Masoor Dal', 'Toor Dal Tadka', 'Mix Dal', 'Jeera Rice', 'Peas Pulao', 'Veg Pulao',
      'Kashmiri Pulao', 'Tawa Pulao North', 'Biryani Veg', 'Tehri', 'Khichdi North', 'Moong Khichdi',
      'Roti Tawa', 'Tawa Roti', 'Missi Roti', 'Besan Roti', 'Makki Roti', 'Bajra Roti', 'Tandoori Roti',
      'Naan Plain', 'Butter Naan', 'Garlic Naan', 'Laccha Paratha', 'Aloo Paratha', 'Gobi Paratha', 'Methi Paratha',
      'Paneer Paratha', 'Mix Paratha', 'Stuffed Paratha', 'Bedmi Puri', 'Aloo Puri', 'Chole Puri', 'Halwa Puri',
      'Kachori Aloo', 'Bedmi Aloo', 'Kachori Sabzi', 'Raita Boondi', 'Cucumber Raita', 'Mix Veg Raita',
      'Onion Raita', 'Pineapple Raita', 'Mint Raita', 'Salad Kachumber', 'Onion Salad', 'Green Chutney',
      'Imli Chutney', 'Pickle Plate', 'Papad Fry', 'Masala Papad', 'Shahi Tukda', 'Rabri', 'Kheer North',
      'Gajar Halwa', 'Moong Dal Halwa', 'Besan Halwa', 'Suji Halwa', 'Aate Ka Halwa', 'Jalebi Rabri',
    ],
    prefixes: ['Dhaba', 'Home-style', 'Tawa', 'Smoky', 'Royal', 'Old Delhi', 'Lucknowi', 'Punjabi-style', 'Mughlai', 'Festive'],
  },
  {
    kitchenStyleId: 'punjabi',
    region: 'North',
    descriptionPrefix: 'a hearty Punjabi dish with robust masala, tandoori notes, and dhaba-style comfort.',
    defaultProtein: 'Paneer',
    bases: [
      'Sarson Da Saag', 'Makki Di Roti', 'Amritsari Kulcha', 'Chole Bhature', 'Pindi Chole', 'Amritsari Chole',
      'Lahori Chole', 'Chole Kulche', 'Paneer Tikka', 'Paneer Malai Tikka', 'Paneer Achari Tikka', 'Tandoori Paneer',
      'Mushroom Tikka', 'Aloo Tikka', 'Tandoori Aloo', 'Bhatti Da Murgh', 'Tandoori Chicken', 'Chicken Tikka',
      'Malai Chicken Tikka', 'Achari Chicken Tikka', 'Chicken Curry Punjabi', 'Butter Chicken', 'Chicken Lababdar',
      'Chicken Rara', 'Chicken Keema Matar', 'Mutton Curry Punjabi', 'Mutton Keema', 'Mutton Rara', 'Mutton Rogan Josh',
      'Fish Amritsari', 'Fish Tikka Punjabi', 'Amritsari Fish Fry', 'Tandoori Fish', 'Egg Curry Punjabi',
      'Anda Bhurji Punjabi', 'Anda Masala', 'Egg Keema', 'Tandoori Roti Punjabi', 'Missi Roti Punjabi', 'Makki Roti Sarson',
      'Laccha Paratha Punjabi', 'Aloo Paratha Punjabi', 'Gobi Paratha Punjabi', 'Methi Paratha Punjabi', 'Paneer Paratha Punjabi',
      'Stuffed Kulcha', 'Aloo Kulcha Punjabi', 'Paneer Kulcha Punjabi', 'Onion Kulcha', 'Mix Kulcha', 'Naan Punjabi',
      'Garlic Naan Punjabi', 'Butter Naan Punjabi', 'Dal Makhani Punjabi', 'Maa Ki Dal', 'Kali Dal', 'Dal Tadka Punjabi',
      'Rajma Punjabi', 'Chana Dal Punjabi', 'Moong Dal Punjabi', 'Palak Dal', 'Dal Palak Punjabi', 'Jeera Rice Punjabi',
      'Peas Pulao Punjabi', 'Veg Pulao Punjabi', 'Tawa Pulao Punjabi', 'Khichdi Punjabi', 'Kadhi Pakora Punjabi',
      'Pakora Kadhi', 'Paneer Pakora', 'Aloo Pakora', 'Onion Pakora', 'Mix Pakora', 'Bread Pakora', 'Mirchi Pakora',
      'Samosa Punjabi', 'Aloo Samosa', 'Paneer Samosa', 'Keema Samosa', 'Gobi Pakora', 'Paneer Bhurji Pav',
      'Chole Rice Bowl', 'Rajma Rice Bowl', 'Dal Rice Punjabi', 'Lassi Sweet', 'Lassi Salted', 'Chaas Punjabi',
      'Raita Punjabi', 'Boondi Raita', 'Onion Raita Punjabi', 'Green Salad Punjabi', 'Gajar Shalgam Achar',
      'Shalgam Pickle', 'Gobhi Shalgam', 'Pinni', 'Panjiri', 'Atta Ladoo', 'Besan Ladoo', 'Pinni Punjabi',
      'Gur Paratha', 'Meetha Paratha', 'Halwa Karah', 'Karah Prashad', 'Kheer Punjabi', 'Phirni Punjabi',
      'Gajar Halwa Punjabi', 'Moong Dal Halwa Punjabi', 'Suji Halwa Punjabi', 'Jalebi Punjabi', 'Gulab Jamun Punjabi',
    ],
    prefixes: ['Amritsari', 'Dhaba', 'Tandoori', 'Bhatti', 'Patiala', 'Lahori', 'Smoky', 'Makhan', 'Degi', 'Home-style'],
  },
  {
    kitchenStyleId: 'rajasthani',
    region: 'West',
    descriptionPrefix: 'a Rajasthani recipe with desert spice warmth, ghee richness, and royal thali character.',
    defaultProtein: 'Besan',
    bases: [
      'Dal Baati Churma', 'Baati Churma', 'Panchmel Dal', 'Dal Dhokli Rajasthani', 'Gatte Ki Sabzi', 'Shahi Gatte',
      'Gatte Ka Pulao', 'Gatte Ki Khichdi', 'Besan Gatte Curry', 'Papad Ki Sabzi', 'Papad Mangodi', 'Mangodi Ki Sabzi',
      'Ker Sangri', 'Sangri Sabzi', 'Ker Pickle Sabzi', 'Gunda Pickle Sabzi', 'Haldi Sabzi', 'Haldi Ki Sabzi',
      'Kachri Ki Sabzi', 'Kair Sangri', 'Lehsun Ki Chutney', 'Mirchi Vada Rajasthani', 'Pyaz Kachori', 'Mawa Kachori',
      'Dal Kachori Rajasthani', 'Heeng Ki Kachori', 'Bikaneri Bhujia Bowl', 'Besan Chilla Rajasthani', 'Missi Roti Rajasthani',
      'Bajra Roti Rajasthani', 'Makki Roti Rajasthani', 'Gehun Roti', 'Tawa Roti Rajasthani', 'Khoba Roti',
      'Bajra Khichdi', 'Gehun Khichdi', 'Moong Dal Khichdi', 'Masala Khichdi Rajasthani', 'Bajra Raab',
      'Raab Rajasthani', 'Ghevar', 'Malpua Rajasthani', 'Imarti', 'Moong Dal Halwa Rajasthani', 'Besan Halwa Rajasthani',
      'Aate Ka Halwa Rajasthani', 'Churma Laddu', 'Balushahi', 'Gond Ladoo', 'Atta Ladoo Rajasthani', 'Besan Ladoo Rajasthani',
      'Methi Bajra Thepla', 'Bajra Thepla', 'Gehun Thepla', 'Masala Thepla', 'Methi Thepla Rajasthani', 'Aloo Pyaz Sabzi',
      'Aloo Tamatar Sabzi', 'Aloo Methi Sabzi', 'Aloo Gobi Rajasthani', 'Gobi Masala Rajasthani', 'Lauki Ki Sabzi',
      'Turai Ki Sabzi', 'Kaddu Ki Sabzi Rajasthani', 'Arbi Masala Rajasthani', 'Bhindi Masala Rajasthani', 'Baingan Ki Sabzi',
      'Kadhi Rajasthani', 'Pakora Kadhi Rajasthani', 'Boondi Kadhi', 'Rajasthani Kadhi', 'Masala Chaas Rajasthani',
      'Lassi Rajasthani', 'Raita Rajasthani', 'Boondi Raita Rajasthani', 'Cucumber Raita Rajasthani', 'Salad Rajasthani',
      'Panchmel Sabzi', 'Mix Veg Rajasthani', 'Paneer Rajasthani', 'Paneer Lababdar Rajasthani', 'Malai Kofta Rajasthani',
      'Lauki Kofta Rajasthani', 'Banana Kofta Rajasthani', 'Chana Masala Rajasthani', 'Chole Rajasthani', 'Rajma Rajasthani',
      'Moong Dal Tadka Rajasthani', 'Toor Dal Rajasthani', 'Masoor Dal Rajasthani', 'Jeera Rice Rajasthani', 'Veg Pulao Rajasthani',
      'Bajra Pulao', 'Khichda Rajasthani', 'Safed Maas Veg', 'Laal Maas Veg', 'Jungli Maas Veg', 'Ker Pickle',
      'Sangri Pickle', 'Garlic Chutney Rajasthani', 'Mirchi Chutney', 'Green Chutney Rajasthani', 'Papad Rajasthani',
      'Masala Papad Rajasthani', 'Fry Papad', 'Roasted Papad', 'Dal Tadka Rajasthani', 'Dal Fry Rajasthani',
    ],
    prefixes: ['Marwari', 'Mewari', 'Bikaneri', 'Jodhpuri', 'Jaipuri', 'Desert', 'Royal', 'Festive', 'Smoky', 'Home-style'],
  },
  {
    kitchenStyleId: 'bengali',
    region: 'East',
    descriptionPrefix: 'a Bengali classic with mustard oil, subtle sweetness, and layered regional flavour.',
    defaultProtein: 'Aloo',
    bases: [
      'Shukto', 'Labra', 'Chorchori', 'Ghonto', 'Dalna', 'Jhol', 'Kaliya', 'Kosha', 'Chingri Malai Curry',
      'Chingri Bhapa', 'Chingri Paturi', 'Chingri Macher Malai Curry', 'Ilish Bhapa', 'Ilish Paturi', 'Ilish Jhol',
      'Ilish Tel Jhol', 'Rui Macher Kalia', 'Rui Macher Jhol', 'Katla Kalia', 'Bhetki Paturi', 'Bhetki Fry',
      'Macher Jhol', 'Macher Kalia', 'Macher Tok', 'Macher Dim Bhaja', 'Dim Kosha', 'Dim Curry', 'Dim Bhuna',
      'Dim Deviled Bengali', 'Chicken Kosha', 'Mutton Kosha', 'Kosha Mangsho', 'Mangshor Jhol', 'Mutton Rezala',
      'Chicken Rezala', 'Chicken Chaap', 'Kolkata Biryani', 'Mutton Biryani Bengali', 'Chicken Biryani Bengali',
      'Polao Bengali', 'Veg Polao', 'Ghee Bhat', 'Bhaja Muger Dal', 'Muger Dal', 'Masoor Dal Bengali', 'Cholar Dal',
      'Kanchkolar Kofta', 'Enchorer Dalna', 'Echor Dalna', 'Mocha Ghonto', 'Thor Ghonto', 'Potol Dolma',
      'Potol Posto', 'Jhinge Posto', 'Alu Posto', 'Chingri Posto', 'Kumro Chhokka', 'Kumro Torkari', 'Labra Mixed Veg',
      'Pui Shaak Chingri', 'Palong Shaak', 'Lau Shaak', 'Data Shaak', 'Kochu Shaak', 'Methi Shaak', 'Begun Bhaja',
      'Aloo Bhaja', 'Uchhe Bhaja', 'Kumro Bhaja', 'Potol Bhaja', 'Phulkopi Bhaja', 'Macher Chop', 'Vegetable Chop',
      'Aloo Chop', 'Mocha Chop', 'Fish Fry Kolkata', 'Chicken Cutlet', 'Kabiraji Cutlet', 'Deviled Egg Bengali',
      'Luchi Aloor Dom', 'Luchi Cholar Dal', 'Radhaballavi', 'Kochuri Aloor Dom', 'Kochuri Cholar Dal', 'Dhakai Paratha',
      'Kolkata Roll Veg', 'Kolkata Roll Egg', 'Kolkata Roll Chicken', 'Telebhaja Mix', 'Beguni', 'Phuluri',
      'Piyaji', 'Muri Ghonto', 'Panta Bhat', 'Aloo Bhate', 'Begun Bhate', 'Dim Bhate', 'Tomato Chatni',
      'Khejur Chatni', 'Aam Chatni', 'Kacha Aamer Chatni', 'Posto Bora', 'Begun Pora', 'Shorshe Bata',
      'Mishti Doi', 'Rasgulla', 'Sandesh', 'Kalakand', 'Chomchom', 'Ras Malai', 'Payesh', 'Nolen Gurer Payesh',
      'Patishapta', 'Pithe Puli', 'Malpua Bengali', 'Goja', 'Langcha', 'Ledikeni', 'Kheer Kadam',
    ],
    prefixes: ['Kolkata', 'Dhakai', 'Nadia', 'Home-style', 'Festive', 'Smoky', 'Mustard', 'Nolen Gur', 'Winter', 'Monsoon'],
  },
  {
    kitchenStyleId: 'maharashtrian',
    region: 'West',
    descriptionPrefix: 'a Maharashtrian recipe with peanut, coconut, and bold everyday comfort.',
    defaultProtein: 'Toor dal',
    bases: [
      'Misal Pav', 'Usal Pav', 'Kolhapuri Misal', 'Puneri Misal', 'Nashik Misal', 'Matki Usal', 'Moong Usal',
      'Mixed Usal', 'Misal Tarri', 'Pav Misal', 'Vada Pav', 'Batata Vada', 'Sabudana Vada', 'Kanda Bhaji',
      'Mirchi Bhaji', 'Bread Pakoda Maharashtrian', 'Thalipeeth', 'Bhajaniche Thalipeeth', 'Sabudana Thalipeeth',
      'Zunka Bhakri', 'Pitla Bhakri', 'Pitla', 'Zunka', 'Bharli Vangi', 'Vangi Bhat', 'Masale Bhat', 'Tendli Bhat',
      'Tomato Saar', 'Katachi Amti', 'Varan Bhat', 'Amti', 'Dal Fry Maharashtrian', 'Moong Dal Maharashtrian',
      'Toor Dal Amti', 'Kadhi Maharashtrian', 'Pakoda Kadhi Maharashtrian', 'Bharli Mirchi', 'Stuffed Mirchi',
      'Baigan Bharit', 'Palkachi Bhaji', 'Batata Bhaji', 'Vangi Bhaji', 'Cabbage Bhaji', 'Gobi Bhaji',
      'Beans Bhaji', 'Carrot Bhaji', 'Beetroot Bhaji', 'Pumpkin Bhaji', 'Dudhi Bhaji', 'Turai Bhaji',
      'Kaddu Bhaji', 'Arbi Bhaji', 'Methi Bhaji', 'Shevga Bhaji', 'Alu Wadi', 'Patwadi Rassa', 'Patwadi Bhaji',
      'Kothimbir Vadi', 'Sabudana Khichdi', 'Sabudana Thalipeeth', 'Upit', 'Sheera Maharashtrian', 'Shrikhand Maharashtrian',
      'Puran Poli Maharashtrian', 'Modak Ukadiche', 'Modak Fried', 'Karachi Halwa', 'Basundi Maharashtrian',
      'Kheer Maharashtrian', 'Shrikhand Poori', 'Puran Poli Amti', 'Masala Bhat', 'Masale Bhat Kolhapuri',
      'Kolhapuri Tambda Rassa', 'Pandhra Rassa', 'Taambda Rassa Veg', 'Pandhra Rassa Veg', 'Kolhapuri Veg Rassa',
      'Sol Kadhi', 'Kokum Kadhi', 'Taak', 'Mattha', 'Koshimbir Khamang Kakdi', 'Khamang Kakdi', 'Koshimbir',
      'Onion Koshimbir', 'Tomato Koshimbir', 'Cucumber Koshimbir', 'Thecha Green', 'Thecha Red', 'Lasun Chutney',
      'Dry Coconut Chutney', 'Green Chutney Maharashtrian', 'Poha Maharashtrian', 'Kanda Poha', 'Batata Poha',
      'Indori Poha Style', 'Pohe Cutlet', 'Pohe Appe', 'Pohe Idli', 'Pohe Chivda', 'Chivda Maharashtrian',
      'Shankarpali', 'Chakli', 'Chivda Mix', 'Laddu Maharashtrian', 'Besan Ladoo Maharashtrian', 'Rava Ladoo',
      'Anarsa', 'Shankarpali Sweet', 'Karanji', 'Gulachi Poli', 'Gul Poli', 'Puranachi Poli', 'Bhakri Jowar',
      'Bhakri Bajra', 'Bhakri Rice', 'Amboli', 'Ghavan', 'Sandan', 'Tandulachi Bhakri', 'Masala Papad Maharashtrian',
    ],
    prefixes: ['Kolhapuri', 'Puneri', 'Nashik', 'Malvani-style', 'Home-style', 'Festive', 'Gavran', 'Spicy', 'Konkani-style', 'Winter'],
  },
  {
    kitchenStyleId: 'hyderabadi',
    region: 'South',
    descriptionPrefix: 'a Hyderabadi dish with dum cooking, fried onions, and Nizami depth.',
    defaultProtein: 'Basmati rice',
    bases: [
      'Hyderabadi Biryani', 'Chicken Dum Biryani', 'Mutton Dum Biryani', 'Egg Biryani', 'Veg Biryani Hyderabadi',
      'Paneer Biryani', 'Kacchi Biryani', 'Pakki Biryani', 'Dum Biryani', 'Zafrani Biryani', 'Mirchi Ka Salan',
      'Bagara Baingan', 'Tamatar Ka Salan', 'Dahi Ka Salan', 'Gosht Ka Salan', 'Chicken Ka Salan', 'Ande Ka Salan',
      'Hyderabadi Haleem', 'Chicken Haleem', 'Mutton Haleem', 'Veg Haleem', 'Nihari Hyderabadi', 'Paya Nihari',
      'Kheema Khichda', 'Khichda Hyderabadi', 'Hyderabadi Khichdi', 'Dalcha', 'Mutton Dalcha', 'Chicken Dalcha',
      'Veg Dalcha', 'Hyderabadi Marag', 'Chicken Marag', 'Mutton Marag', 'Shorba Hyderabadi', 'Mutton Shorba',
      'Chicken Shorba', 'Tomato Shorba', 'Hyderabadi Korma', 'Chicken Korma Hyderabadi', 'Mutton Korma Hyderabadi',
      'Paneer Korma Hyderabadi', 'Hyderabadi Pasanda', 'Chicken Pasanda', 'Mutton Pasanda', 'Hyderabadi Keema',
      'Keema Curry Hyderabadi', 'Keema Matar Hyderabadi', 'Keema Khichdi', 'Hyderabadi Kheema', 'Kheema Samosa',
      'Hyderabadi Cutlet', 'Shami Kabab Hyderabadi', 'Galouti Kabab Style', 'Seekh Kabab Hyderabadi', 'Boti Kabab',
      'Chicken 65 Hyderabadi', 'Paneer 65', 'Mushroom 65', 'Gobi 65', 'Hyderabadi Fried Chicken', 'Chicken Fry Hyderabadi',
      'Apollo Fish', 'Hyderabadi Fish Curry', 'Fish Biryani Hyderabadi', 'Prawn Biryani', 'Egg Curry Hyderabadi',
      'Anda Curry Hyderabadi', 'Anda Masala Hyderabadi', 'Hyderabadi Paratha', 'Rumali Roti Hyderabadi', 'Sheermal Hyderabadi',
      'Naan Hyderabadi', 'Tandoori Roti Hyderabadi', 'Roomali Roti', 'Khichda', 'Hyderabadi Pulao', 'Mutton Pulao',
      'Chicken Pulao', 'Veg Pulao Hyderabadi', 'Zafrani Pulao', 'Bagara Rice', 'Tomato Bath Hyderabadi', 'Tamarind Rice Hyderabadi',
      'Curd Rice Hyderabadi', 'Khatti Dal Hyderabadi', 'Tomato Dal Hyderabadi', 'Palak Dal Hyderabadi', 'Mix Dal Hyderabadi',
      'Hyderabadi Raita', 'Onion Raita Hyderabadi', 'Cucumber Raita Hyderabadi', 'Bagara Baingan Rice Bowl',
      'Biryani Rice Bowl', 'Salan Rice Bowl', 'Haleem Bowl', 'Marag Soup Bowl', 'Shorba Bowl', 'Keema Pav Hyderabadi',
      'Irani Chai Pairing Halwa', 'Double Ka Meetha', 'Qubani Ka Meetha', 'Sheer Khurma Hyderabadi', 'Khubani Ka Meetha',
      'Hyderabadi Shahi Tukda', 'Falooda Hyderabadi', 'Badam Milk Hyderabadi', 'Lassi Hyderabadi', 'Chai Biscuit Plate',
      'Osmania Biscuit Chai', 'Hyderabadi Lukhmi', 'Keema Samosa Hyderabadi', 'Chicken Samosa Hyderabadi', 'Paneer Samosa Hyderabadi',
    ],
    prefixes: ['Nizami', 'Old City', 'Dum', 'Zafrani', 'Royal', 'Irani', 'Home-style', 'Festive', 'Smoky', 'Classic'],
  },
  {
    kitchenStyleId: 'goan',
    region: 'West',
    descriptionPrefix: 'a Goan coastal dish with coconut vinegar, kokum, and Portuguese-Indian warmth.',
    defaultProtein: 'Prawns',
    bases: [
      'Fish Curry Goan', 'Prawn Curry Goan', 'Crab Xec Xec', 'Prawn Balchao', 'Fish Recheado', 'Prawn Recheado',
      'Chicken Xacuti', 'Mutton Xacuti', 'Veg Xacuti', 'Chicken Cafreal', 'Fish Cafreal', 'Prawn Cafreal',
      'Chicken Vindaloo', 'Pork Vindaloo', 'Fish Vindaloo', 'Mutton Vindaloo', 'Veg Vindaloo', 'Chicken Balchao',
      'Pork Balchao', 'Fish Balchao', 'Prawn Balchao Masala', 'Goan Fish Fry', 'Rava Fried Fish', 'Kingfish Fry',
      'Pomfret Fry Goan', 'Mackerel Curry', 'Sardine Curry', 'Bangda Curry', 'Surmai Curry', 'Prawn Masala Goan',
      'Crab Masala Goan', 'Squid Masala Goan', 'Clam Xacuti', 'Mussel Curry', 'Oyster Fry Goan', 'Prawn Pulao Goan',
      'Fish Pulao Goan', 'Chicken Pulao Goan', 'Goan Sausage Pulao', 'Sorpotel', 'Pork Sorpotel', 'Chicken Sorpotel',
      'Feijoada Goan', 'Goan Chorizo Curry', 'Sausage Curry Goan', 'Pork Assado', 'Chicken Assado', 'Beef Roast Goan',
      'Pork Roast Goan', 'Chicken Roast Goan', 'Goan Bread Pudding', 'Bebinca', 'Dodol', 'Bolinhas', 'Doce',
      'Kulkul', 'Neureos', 'Patoleo', 'Sannas', 'Poi Bread', 'Goan Pao', 'Pao Com Chourico', 'Pao Bhaji Goan',
      'Xacuti Rice Bowl', 'Vindaloo Rice Bowl', 'Fish Thali Goan', 'Prawn Thali Goan', 'Chicken Thali Goan',
      'Goan Veg Thali', 'Sol Kadhi Goan', 'Kokum Curry', 'Kokum Drink', 'Feni Cocktail Mock', 'Coconut Feni Mock',
      'Goan Salad', 'Onion Salad Goan', 'Cucumber Salad Goan', 'Pickled Onion Goan', 'Goan Pickle', 'Lime Pickle Goan',
      'Mango Pickle Goan', 'Fish Pickle Goan', 'Prawn Pickle Goan', 'Recheado Masala Paste', 'Xacuti Masala Paste',
      'Vindaloo Masala Paste', 'Cafreal Masala Paste', 'Balchao Masala Paste', 'Goan Green Masala', 'Red Recheado Fish',
      'Green Cafreal Chicken', 'Yellow Fish Curry', 'White Fish Curry', 'Ambot Tik', 'Sour Curry Prawn', 'Tamarind Fish Curry',
      'Coconut Fish Curry', 'Kokum Fish Curry', 'Prawn Koliwada', 'Fish Koliwada', 'Chicken Koliwada', 'Paneer Recheado',
      'Mushroom Cafreal', 'Cauliflower Cafreal', 'Potato Vindaloo', 'Pumpkin Xacuti', 'Brinjal Recheado', 'Okra Goan Masala',
      'Drumstick Curry Goan', 'Raw Mango Curry Goan', 'Jackfruit Curry Goan', 'Breadfruit Curry Goan', 'Colocasia Curry Goan',
      'Yam Curry Goan', 'Plantain Curry Goan', 'Coconut Rice Goan', 'Jeera Rice Goan', 'Lemon Rice Goan', 'Tomato Rice Goan',
    ],
    prefixes: ['Coastal', 'Old Goa', 'Konkan', 'Catholic', 'Home-style', 'Festive', 'Smoky', 'Tangy', 'Spicy', 'Beach-style'],
  },
  {
    kitchenStyleId: 'kerala',
    region: 'South',
    descriptionPrefix: 'a Kerala dish with coconut oil, curry leaves, and Malabar coastal comfort.',
    defaultProtein: 'Coconut',
    bases: [
      'Appam Stew Kerala', 'Vegetable Stew Kerala', 'Chicken Stew Kerala', 'Mutton Stew Kerala', 'Egg Stew Kerala',
      'Ishtu Kerala', 'Appam Curry', 'Idiyappam Stew', 'Idiyappam Curry', 'Puttu Kadala', 'Puttu Payar', 'Puttu Egg',
      'Puttu Chicken', 'Puttu Beef Mock Veg', 'Kerala Parotta', 'Malabar Parotta', 'Porotta Beef Mock Veg',
      'Kerala Biryani', 'Malabar Biryani', 'Thalassery Biryani', 'Chicken Biryani Kerala', 'Mutton Biryani Kerala',
      'Fish Biryani Kerala', 'Prawn Biryani Kerala', 'Egg Biryani Kerala', 'Veg Biryani Kerala', 'Avial Kerala',
      'Sambar Kerala', 'Rasam Kerala', 'Pulissery', 'Moru Curry', 'Kaalan', 'Olan', 'Erissery', 'Thoran Beans',
      'Thoran Cabbage', 'Thoran Carrot', 'Thoran Beetroot', 'Thoran Spinach', 'Mezhukkupuratti', 'Upperi Banana',
      'Upperi Yam', 'Upperi Raw Banana', 'Pachadi Pineapple', 'Pachadi Mango Kerala', 'Pachadi Beetroot Kerala',
      'Kootu Curry', 'Avial Mixed Veg', 'Varutharacha Sambar', 'Parippu Curry', 'Dal Curry Kerala', 'Cherupayar Curry',
      'Payar Thoran', 'Cherupayar Thoran', 'Chena Mezhukkupuratti', 'Koorka Mezhukkupuratti', 'Kappa Mezhukkupuratti',
      'Tapioca Mezhukkupuratti', 'Kappa Puzhukku', 'Kappa Beef Mock Veg', 'Kappa Fish Curry', 'Meen Curry Kerala',
      'Meen Pollichathu', 'Meen Moilee', 'Fish Moilee', 'Prawn Moilee', 'Crab Curry Kerala', 'Squid Roast Kerala',
      'Kerala Fish Fry', 'Karimeen Fry', 'Karimeen Pollichathu', 'Neymeen Curry', 'Ayala Curry', 'Mathi Curry',
      'Chicken Curry Kerala', 'Kozhi Curry', 'Chicken Roast Kerala', 'Nadan Kozhi Curry', 'Mutton Curry Kerala',
      'Beef Fry Kerala Mock Veg', 'Egg Roast Kerala', 'Mutta Roast', 'Egg Curry Kerala', 'Mutta Curry',
      'Kerala Porotta Beef Mock', 'Chilli Chicken Kerala', 'Chilli Beef Mock Kerala', 'Pepper Chicken Kerala',
      'Ginger Chicken Kerala', 'Coconut Chicken Curry', 'Malabar Chicken Curry', 'Malabar Fish Curry', 'Thenga Choru',
      'Coconut Rice Kerala', 'Lemon Rice Kerala', 'Tomato Rice Kerala', 'Ghee Rice Kerala', 'Jeera Rice Kerala',
      'Payasam Ada Pradhaman', 'Palada Payasam', 'Parippu Payasam Kerala', 'Semiya Payasam Kerala', 'Neyyappam',
      'Unniyappam', 'Achappam', 'Kozhukattai', 'Elayada', 'Banana Fritters Kerala', 'Pazham Pori', 'Ethakka Appam',
      'Sulaimani Tea', 'Kerala Chai', 'Filter Coffee Kerala', 'Sambharam', 'Spiced Buttermilk Kerala', 'Sol Kadhi Kerala',
    ],
    prefixes: ['Malabar', 'Nadan', 'Thalassery', 'Coastal', 'Syrian Christian-style', 'Home-style', 'Festive', 'Temple', 'Smoky', 'Monsoon'],
  },
  {
    kitchenStyleId: 'chinese',
    region: 'North',
    descriptionPrefix: 'an Indo-Chinese favourite with wok heat, soy-garlic punch, and street-side crunch.',
    defaultProtein: 'Cabbage',
    bases: [
      'Veg Manchurian', 'Gobi Manchurian', 'Paneer Manchurian', 'Mushroom Manchurian', 'Baby Corn Manchurian',
      'Chilli Gobi', 'Chilli Paneer', 'Chilli Mushroom', 'Chilli Baby Corn', 'Chilli Potato', 'Honey Chilli Potato Bowl',
      'Crispy Corn', 'Crispy Lotus Stem', 'Spring Roll Veg', 'Spring Roll Paneer', 'Spring Roll Chicken', 'Spring Roll Egg',
      'Veg Hakka Noodles', 'Chicken Hakka Noodles', 'Egg Hakka Noodles', 'Schezwan Noodles', 'Garlic Noodles',
      'Singapore Noodles Veg', 'Chow Mein Veg', 'Chow Mein Chicken', 'American Chopsuey Veg', 'Chinese Chopsuey Veg',
      'Fried Rice Veg', 'Fried Rice Egg', 'Chicken Fried Rice', 'Schezwan Fried Rice', 'Garlic Fried Rice',
      'Triple Schezwan Rice', 'Triple Fried Rice', 'Combination Fried Rice', 'Burnt Garlic Fried Rice', 'Mushroom Fried Rice',
      'Paneer Fried Rice', 'Veg Schezwan Rice', 'Chicken Schezwan Rice', 'Egg Schezwan Rice', 'Thai Fried Rice Veg',
      'Thai Basil Fried Rice', 'Lemon Coriander Soup', 'Hot and Sour Soup', 'Sweet Corn Soup', 'Manchow Soup Veg',
      'Manchow Soup Chicken', 'Talumein Soup', 'Clear Soup Veg', 'Chicken Clear Soup', 'Wonton Soup Veg',
      'Veg Momo Steamed', 'Veg Momo Fried', 'Paneer Momo', 'Chicken Momo', 'Schezwan Momo', 'Tandoori Momo Veg',
      'Chilli Momo Veg', 'Chilli Momo Chicken', 'Soup Momo Veg', 'Kothey Momo Veg', 'Pan Fried Momo Veg',
      'Veg Manchow Noodle Bowl', 'Schezwan Noodle Bowl', 'Hakka Noodle Bowl', 'Chilli Garlic Noodle Bowl',
      'Paneer Chilli Garlic Noodles', 'Chicken Chilli Garlic Noodles', 'Dragon Chicken', 'Dragon Paneer', 'Dragon Gobi',
      'Szechuan Chicken', 'Szechuan Paneer', 'Kung Pao Paneer', 'Kung Pao Chicken', 'Black Pepper Chicken',
      'Black Pepper Paneer', 'Garlic Chicken Indo Chinese', 'Garlic Paneer Indo Chinese', 'Lollipop Chicken',
      'Chicken Lollipop Dry', 'Chicken Lollipop Gravy', 'Crispy Chicken', 'Crispy Paneer', 'Salt and Pepper Mushroom',
      'Salt and Pepper Paneer', 'Salt and Pepper Baby Corn', 'Paneer 65 Chinese', 'Chicken 65 Chinese', 'Gobi 65 Chinese',
      'Schezwan Dosa Roll', 'Noodle Dosa Roll', 'Manchurian Dosa Roll', 'Chinese Frankie Veg', 'Chinese Frankie Paneer',
      'Chinese Frankie Chicken', 'Chinese Bhel Veg', 'Chinese Bhel Paneer', 'Chinese Bhel Noodle', 'Paneer Chilli Bowl',
      'Chicken Chilli Bowl', 'Veg Chilli Bowl', 'Schezwan Fried Rice Bowl', 'Hakka Noodle Bowl', 'Manchurian Gravy Bowl',
      'Dry Manchurian Bowl', 'Triple Rice Bowl', 'Combination Noodle Bowl', 'Garlic Fried Rice Bowl', 'Schezwan Soup Bowl',
    ],
    prefixes: ['Schezwan', 'Garlic', 'Crispy', 'Spicy', 'Street-style', 'Restaurant-style', 'Dry', 'Gravy', 'Smoky', 'Classic'],
  },
  {
    kitchenStyleId: 'assamese',
    region: 'East',
    descriptionPrefix: 'an Assamese recipe with mustard, bamboo shoot, and subtle river-valley flavour.',
    defaultProtein: 'Masoor dal',
    bases: [
      'Masor Tenga', 'Ou Tenga Masor Jhol', 'Kharoli Fish Curry', 'Patot Diya Maach', 'Patot Diya Murghi',
      'Patot Diya Paneer', 'Patot Diya Koni', 'Khar', 'Kharoli', 'Ou Khar', 'Papaya Khar', 'Raw Papaya Khar',
      'Bhogali Jalpan', 'Jolpan', 'Doi Jolpan', 'Chira Doi', 'Chira Gur', 'Chira Cream', 'Pitha Til Pitha',
      'Tekeli Pitha', 'Ghila Pitha', 'Sunga Pitha', 'Narikol Pitha', 'Rice Pitha', 'Til Pitha', 'Pitha Assamese',
      'Duck Curry Assamese Mock Veg', 'Koni Mangxo Mock Veg', 'Chicken Khorika Mock Veg', 'Fish Khorika', 'Pork Khorika Mock Veg',
      'Masor Khorika', 'Chicken Curry Assamese', 'Mutton Curry Assamese', 'Fish Curry Assamese', 'Small Fish Curry',
      'Rohu Curry Assamese', 'Catla Curry Assamese', 'Prawn Curry Assamese', 'Crab Curry Assamese', 'Snail Curry Mock Veg',
      'Bamboo Shoot Curry', 'Bamboo Shoot Fry', 'Bamboo Shoot Pickle', 'Bamboo Shoot with Fish', 'Bamboo Shoot with Pork Mock Veg',
      'Ou Tenga Dal', 'Masoor Dal Assamese', 'Moong Dal Assamese', 'Black Dal Assamese', 'Matidali', 'Matir Dal',
      'Alu Pitika', 'Aloo Pitika', 'Begun Pitika', 'Tomato Pitika', 'Raw Banana Pitika', 'Fish Pitika', 'Egg Pitika',
      'Pitika Plate', 'Mixed Pitika', 'Kharoli Pitika', 'Pigeon Pea Curry', 'Black Gram Curry', 'Green Gram Curry',
      'Lentil Soup Assamese', 'Rice Payas Assamese', 'Sticky Rice', 'Bora Saul', 'Joha Rice', 'Komal Saul',
      'Rice with Til', 'Rice with Ghee', 'Rice with Dal', 'Rice with Fish', 'Rice with Chicken', 'Rice with Egg',
      'Rice with Bamboo Shoot', 'Rice with Khar', 'Rice with Pitika', 'Rice with Pickle', 'Rice with Chutney',
      'Rice with Salad', 'Rice with Fry', 'Rice with Curry', 'Rice with Stew', 'Rice with Soup', 'Rice with Veg',
      'Rice with Dal Fry', 'Rice with Fish Fry', 'Rice with Chicken Fry', 'Rice with Egg Fry', 'Rice with Veg Fry',
      'Rice with Bamboo Fry', 'Rice with Khar Fry', 'Rice with Pitika Fry', 'Rice with Pickle Fry', 'Rice with Chutney Fry',
      'Rice with Salad Fry', 'Rice with Soup Fry', 'Rice with Stew Fry', 'Rice with Curry Fry', 'Rice with Veg Curry',
      'Rice with Dal Curry', 'Rice with Fish Curry', 'Rice with Chicken Curry', 'Rice with Egg Curry', 'Rice with Bamboo Curry',
      'Rice with Khar Curry', 'Rice with Pitika Curry', 'Rice with Pickle Curry', 'Rice with Chutney Curry',
      'Rice with Salad Curry', 'Rice with Soup Curry', 'Rice with Stew Curry', 'Rice with Fry Curry', 'Rice with Veg Stew',
    ],
    prefixes: ['Axomiya', 'Home-style', 'Bihu', 'Winter', 'Monsoon', 'River-side', 'Smoky', 'Mustard', 'Bamboo', 'Festive'],
  },
  {
    kitchenStyleId: 'kashmiri',
    region: 'North',
    descriptionPrefix: 'a Kashmiri dish with saffron, fennel, and Wazwan-inspired warmth.',
    defaultProtein: 'Paneer',
    bases: [
      'Rogan Josh Kashmiri', 'Yakhni Kashmiri', 'Gushtaba', 'Rista', 'Tabak Maaz Mock Veg', 'Korma Kashmiri',
      'Shab Deg', 'Dum Aloo Kashmiri', 'Chaman Kaliya', 'Paneer Kaliya', 'Paneer Chaman', 'Paneer Yakhni',
      'Paneer Rogan Josh', 'Paneer Korma Kashmiri', 'Paneer Gushtaba Style', 'Paneer Rista Style', 'Paneer Tabak Maaz Style',
      'Haak Saag', 'Monji Haak', 'Monji Haak Saag', 'Nadir Yakhni', 'Nadir Palak', 'Nadir Monji', 'Lotus Stem Curry',
      'Lotus Stem Yakhni', 'Lotus Stem Fry', 'Lotus Stem Pickle', 'Lotus Stem Salad', 'Lotus Stem Soup',
      'Mutton Yakhni', 'Chicken Yakhni', 'Fish Yakhni', 'Egg Yakhni', 'Veg Yakhni', 'Yakhni Pulao', 'Mutton Pulao Kashmiri',
      'Chicken Pulao Kashmiri', 'Veg Pulao Kashmiri', 'Zafrani Pulao Kashmiri', 'Kashmiri Pulao', 'Modur Pulao',
      'Sweet Pulao Kashmiri', 'Kashmiri Biryani', 'Mutton Biryani Kashmiri', 'Chicken Biryani Kashmiri', 'Fish Biryani Kashmiri',
      'Veg Biryani Kashmiri', 'Kashmiri Khichdi', 'Mutton Khichdi Kashmiri', 'Chicken Khichdi Kashmiri', 'Veg Khichdi Kashmiri',
      'Kashmiri Rajma', 'Kashmiri Chana', 'Kashmiri Dal', 'Kashmiri Moong Dal', 'Kashmiri Masoor Dal', 'Kashmiri Toor Dal',
      'Kashmiri Mix Dal', 'Kashmiri Kadhi', 'Kashmiri Pakora Kadhi', 'Kashmiri Raita', 'Kashmiri Boondi Raita',
      'Kashmiri Cucumber Raita', 'Kashmiri Onion Raita', 'Kashmiri Salad', 'Kashmiri Chutney', 'Kashmiri Pickle',
      'Kashmiri Papad', 'Kashmiri Roti', 'Kashmiri Naan', 'Kashmiri Paratha', 'Kashmiri Kulcha', 'Kashmiri Luchi',
      'Kashmiri Poori', 'Kashmiri Bhatura', 'Kashmiri Bedmi', 'Kashmiri Kachori', 'Kashmiri Samosa', 'Kashmiri Pakora',
      'Kashmiri Cutlet', 'Kashmiri Kabab Mock Veg', 'Kashmiri Tikka Mock Veg', 'Kashmiri Seekh Mock Veg', 'Kashmiri Boti Mock Veg',
      'Kashmiri Shami Mock Veg', 'Kashmiri Galouti Mock Veg', 'Kashmiri Reshmi Mock Veg', 'Kashmiri Malai Mock Veg',
      'Kashmiri Achari Mock Veg', 'Kashmiri Hariyali Mock Veg', 'Kashmiri Tandoori Mock Veg', 'Kashmiri Afghani Mock Veg',
      'Kashmiri Lazeez Mock Veg', 'Kashmiri Laziz Mock Veg', 'Kashmiri Laziz Paneer', 'Kashmiri Laziz Chicken Mock Veg',
      'Kashmiri Laziz Mutton Mock Veg', 'Kashmiri Laziz Fish Mock Veg', 'Kashmiri Laziz Egg', 'Kashmiri Laziz Veg',
      'Kashmiri Laziz Dal', 'Kashmiri Laziz Rice', 'Kashmiri Laziz Pulao', 'Kashmiri Laziz Biryani', 'Kashmiri Laziz Khichdi',
      'Kashmiri Laziz Kadhi', 'Kashmiri Laziz Raita', 'Kashmiri Laziz Salad', 'Kashmiri Laziz Chutney', 'Kashmiri Laziz Pickle',
      'Kashmiri Laziz Papad', 'Kashmiri Laziz Roti', 'Kashmiri Laziz Naan', 'Kashmiri Laziz Paratha', 'Kashmiri Laziz Kulcha',
      'Kashmiri Laziz Luchi', 'Kashmiri Laziz Poori', 'Kashmiri Laziz Bhatura', 'Kashmiri Laziz Bedmi', 'Kashmiri Laziz Kachori',
    ],
    prefixes: ['Wazwan', 'Saffron', 'Home-style', 'Winter', 'Festive', 'Smoky', 'Royal', 'Old Srinagar', 'Valley', 'Classic'],
  },
  {
    kitchenStyleId: 'chettinad',
    region: 'South',
    descriptionPrefix: 'a Chettinad dish with roasted spices, pepper heat, and Karaikudi depth.',
    defaultProtein: 'Chicken',
    bases: [
      'Chettinad Chicken Curry', 'Chettinad Mutton Curry', 'Chettinad Fish Curry', 'Chettinad Prawn Curry', 'Chettinad Crab Curry',
      'Chettinad Egg Curry', 'Chettinad Paneer Curry', 'Chettinad Mushroom Curry', 'Chettinad Vegetable Curry', 'Chettinad Mixed Veg',
      'Chettinad Chicken Fry', 'Chettinad Mutton Fry', 'Chettinad Fish Fry', 'Chettinad Prawn Fry', 'Chettinad Egg Fry',
      'Chettinad Paneer Fry', 'Chettinad Mushroom Fry', 'Chettinad Vegetable Fry', 'Chettinad Mixed Fry', 'Chettinad Chicken Roast',
      'Chettinad Mutton Roast', 'Chettinad Fish Roast', 'Chettinad Prawn Roast', 'Chettinad Egg Roast', 'Chettinad Paneer Roast',
      'Chettinad Mushroom Roast', 'Chettinad Vegetable Roast', 'Chettinad Mixed Roast', 'Chettinad Chicken Pepper Fry',
      'Chettinad Mutton Pepper Fry', 'Chettinad Fish Pepper Fry', 'Chettinad Prawn Pepper Fry', 'Chettinad Egg Pepper Fry',
      'Chettinad Paneer Pepper Fry', 'Chettinad Mushroom Pepper Fry', 'Chettinad Vegetable Pepper Fry', 'Chettinad Mixed Pepper Fry',
      'Chettinad Chicken Masala', 'Chettinad Mutton Masala', 'Chettinad Fish Masala', 'Chettinad Prawn Masala', 'Chettinad Egg Masala',
      'Chettinad Paneer Masala', 'Chettinad Mushroom Masala', 'Chettinad Vegetable Masala', 'Chettinad Mixed Masala',
      'Chettinad Chicken Biryani', 'Chettinad Mutton Biryani', 'Chettinad Fish Biryani', 'Chettinad Prawn Biryani', 'Chettinad Egg Biryani',
      'Chettinad Paneer Biryani', 'Chettinad Mushroom Biryani', 'Chettinad Vegetable Biryani', 'Chettinad Mixed Biryani',
      'Chettinad Chicken Pulao', 'Chettinad Mutton Pulao', 'Chettinad Fish Pulao', 'Chettinad Prawn Pulao', 'Chettinad Egg Pulao',
      'Chettinad Paneer Pulao', 'Chettinad Mushroom Pulao', 'Chettinad Vegetable Pulao', 'Chettinad Mixed Pulao',
      'Chettinad Chicken Rice', 'Chettinad Mutton Rice', 'Chettinad Fish Rice', 'Chettinad Prawn Rice', 'Chettinad Egg Rice',
      'Chettinad Paneer Rice', 'Chettinad Mushroom Rice', 'Chettinad Vegetable Rice', 'Chettinad Mixed Rice',
      'Chettinad Chicken Soup', 'Chettinad Mutton Soup', 'Chettinad Fish Soup', 'Chettinad Prawn Soup', 'Chettinad Egg Soup',
      'Chettinad Paneer Soup', 'Chettinad Mushroom Soup', 'Chettinad Vegetable Soup', 'Chettinad Mixed Soup',
      'Chettinad Chicken Stew', 'Chettinad Mutton Stew', 'Chettinad Fish Stew', 'Chettinad Prawn Stew', 'Chettinad Egg Stew',
      'Chettinad Paneer Stew', 'Chettinad Mushroom Stew', 'Chettinad Vegetable Stew', 'Chettinad Mixed Stew',
      'Chettinad Chicken Kuzhambu', 'Chettinad Mutton Kuzhambu', 'Chettinad Fish Kuzhambu', 'Chettinad Prawn Kuzhambu',
      'Chettinad Egg Kuzhambu', 'Chettinad Paneer Kuzhambu', 'Chettinad Mushroom Kuzhambu', 'Chettinad Vegetable Kuzhambu',
      'Chettinad Mixed Kuzhambu', 'Chettinad Chicken Varuval', 'Chettinad Mutton Varuval', 'Chettinad Fish Varuval', 'Chettinad Prawn Varuval',
    ],
    prefixes: ['Karaikudi', 'Pepper', 'Roasted', 'Home-style', 'Festive', 'Smoky', 'Spicy', 'Classic', 'Royal', 'Temple-style'],
  },
];

const configs: Batch4CuisineConfig[] = CUISINE_SEEDS.map((seed) => {
  const titles = generateTitles(seed.bases, seed.prefixes);
  const { bases: _b, prefixes: _p, ...rest } = seed;
  return { ...rest, titles };
});

const allRecipes = configs.flatMap((config) => buildBatch4Recipes(config));

console.log('Generated batch4 recipes:', allRecipes.length);
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
  throw new Error(`Duplicate batch4 titles: ${dupTitles.slice(0, 5).join(', ')}`);
}

const outPath = join(__dirname, 'recipe-catalog/all-cuisines-batch4.ts');
const file = `import type { RecipeCatalogEntry } from './types';
import { buildBatch4Recipes, type Batch4CuisineConfig } from './batch4-shared';

const BATCH4_CONFIGS: Batch4CuisineConfig[] = ${JSON.stringify(configs, null, 2)};

export const ALL_CUISINES_BATCH4_RECIPES: RecipeCatalogEntry[] = BATCH4_CONFIGS.flatMap((config) =>
  buildBatch4Recipes(config),
);
`;

writeFileSync(outPath, file);
console.log(`Wrote ${outPath}`);
