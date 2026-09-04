/**
 * Generates scripts/recipe-catalog/all-cuisines-batch7.ts (100 curated dishes, ids 292+).
 * Run: npx tsx scripts/generate-batch7-catalog.ts
 */
import { writeFileSync } from 'fs';
import { join } from 'path';

type Dish = {
  title: string;
  dietType?: 'Veg' | 'Egg' | 'Non-Veg';
  prepTime: number;
  calories: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  imageKeyword: string;
  tags: Array<'under20' | 'leftover' | 'kids' | 'quick' | 'festive'>;
  ingredients: Array<{ name: string; isStaple: boolean }>;
};

type CuisineBlock = {
  kitchenStyleId: string;
  region: string;
  dishes: Dish[];
};

const START_ID = 292;

const CUISINES: CuisineBlock[] = [
  {
    kitchenStyleId: 'gujarati',
    region: 'West',
    dishes: [
      dish('Khandvi', 30, 260, 'Medium', 'Silky gram-flour rolls tempered with mustard and coconut — a delicate Gujarati snack.', 'khandvi', ['quick', 'festive'], staples('Besan', 'Dahi', 'Hing', 'Rai', 'Nariyal', 'Tel')),
      dish('Dabeli', 25, 380, 'Easy', 'Spicy potato filling in a butter-toasted pav with sev, peanuts, and tamarind chutney.', 'dabeli', ['quick', 'under20'], [...hero('Dabeli masala'), ...staples('Bateta', 'Pav', 'Sev', 'Mungfali', 'Imli chutney', 'Tel')]),
      dish('Locho', 22, 300, 'Easy', 'Steamed surti gram-flour cake topped with oil, sev, and coriander — a Surat street classic.', 'locho', ['under20', 'quick'], staples('Besan', 'Hing', 'Tel', 'Sev', 'Dhania', 'Namak')),
      dish('Dal Dhokli', 45, 420, 'Medium', 'Wheat flour dumplings simmered in sweet-spicy tuvar dal — one-pot Gujarati comfort food.', 'dal-dhokli', ['festive', 'kids'], [...hero('Tuver dal'), ...staples('Atta', 'Gud', 'Hing', 'Haldi', 'Tel', 'Dhania')]),
      dish('Mohanthal', 55, 480, 'Hard', 'Rich gram-flour fudge with ghee, mawa, and cardamom — a festive mithai from Gujarat.', 'mohanthal', ['festive', 'leftover'], [...hero('Besan'), ...staples('Ghee', 'Gud', 'Elaichi', 'Kesar', 'Mawa', 'Badam')]),
      dish('Sukhdi', 20, 390, 'Easy', 'Whole wheat, ghee, and jaggery squares set in a tray — quick winter sweet in minutes.', 'sukhdi', ['under20', 'festive'], staples('Atta', 'Ghee', 'Gud', 'Elaichi', 'Badam', 'Namak')),
      dish('Chakri', 40, 350, 'Medium', 'Crisp spiral snacks from rice and gram flour — Diwali favourite with chaat masala.', 'chakri', ['festive', 'kids'], staples('Chawal ka atta', 'Besan', 'Ajwain', 'Hing', 'Tel', 'Lal mirch')),
    ],
  },
  {
    kitchenStyleId: 'street',
    region: 'North',
    dishes: [
      dish('Egg Bhurji Pav', 15, 360, 'Easy', 'Fluffy scrambled eggs with onion and masala stuffed in buttered pav.', 'egg-bhurji-pav', ['under20', 'quick'], [...hero('Anda'), ...staples('Pav', 'Pyaaz', 'Tamatar', 'Hari mirch', 'Masala', 'Tel')], 'Egg'),
      dish('Bread Pakora', 20, 340, 'Easy', 'Spiced potato-stuffed bread slices dipped in besan batter and deep-fried until crisp.', 'bread-pakora', ['under20', 'quick'], [...hero('Bread'), ...staples('Besan', 'Bateta', 'Haldi', 'Tel', 'Hari mirch', 'Namak')]),
      dish('Ragda Pattice', 35, 400, 'Medium', 'Crisp potato patties topped with white pea ragda, chutneys, and sev.', 'ragda-pattice', ['festive', 'quick'], [...hero('Bateta'), ...staples('Ragda', 'Sev', 'Dahi', 'Imli chutney', 'Chaat masala', 'Dhania')]),
      dish('Dahi Samosa Chaat', 25, 380, 'Easy', 'Crushed samosa layered with spiced yogurt, chutneys, and crunchy sev.', 'dahi-samosa-chaat', ['quick', 'under20'], [...hero('Samosa'), ...staples('Dahi', 'Imli chutney', 'Hari chutney', 'Sev', 'Pyaaz', 'Chaat masala')]),
      dish('Amritsari Kulcha', 40, 450, 'Medium', 'Stuffed leavened bread from Amritsar baked with potato and served with chole.', 'amritsari-kulcha', ['festive', 'leftover'], [...hero('Atta'), ...staples('Bateta', 'Dahi', 'Baking soda', 'Ghee', 'Ajwain', 'Namak')]),
      dish('Keema Pav', 35, 470, 'Medium', 'Spiced minced meat cooked dry and served in soft pav with onion and lemon.', 'keema-pav', ['quick', 'festive'], [...hero('Keema'), ...staples('Pav', 'Pyaaz', 'Adrak', 'Lasun', 'Garam masala', 'Tel')], 'Non-Veg'),
      dish('Kathi Roll', 25, 420, 'Easy', 'Paratha wrapped around spiced filling with onion, chutney, and a squeeze of lemon.', 'kathi-roll', ['under20', 'quick'], [...hero('Paratha'), ...staples('Paneer', 'Pyaaz', 'Hari chutney', 'Masala', 'Dhania', 'Tel')]),
    ],
  },
  {
    kitchenStyleId: 'south',
    region: 'South',
    dishes: [
      dish('Bisi Bele Bath', 50, 440, 'Medium', 'Hot lentil-rice melange with vegetables and aromatic masala — Karnataka one-pot meal.', 'bisi-bele-bath', ['festive', 'leftover'], [...hero('Toor dal'), ...staples('Chawal', 'Bisi bele powder', 'Sabzi mix', 'Tamarind', 'Ghee', 'Namak')]),
      dish('Lemon Rice', 22, 320, 'Easy', 'Tempered rice with lemon juice, peanuts, and curry leaves — tangy tiffin classic.', 'lemon-rice', ['under20', 'quick'], staples('Chawal', 'Nimbu', 'Rai', 'Kadi patta', 'Mungfali', 'Tel')),
      dish('Curd Rice', 20, 300, 'Easy', 'Cooling yogurt rice tempered with mustard, urad dal, and ginger — South Indian comfort.', 'curd-rice', ['under20', 'kids'], staples('Chawal', 'Dahi', 'Rai', 'Urad dal', 'Kadi patta', 'Namak')),
      dish('Ven Pongal', 30, 360, 'Easy', 'Ghee-rich rice and moong dal khara pongal with pepper and cumin — breakfast staple.', 'ven-pongal', ['quick', 'festive'], staples('Chawal', 'Moong dal', 'Ghee', 'Kali mirch', 'Jeera', 'Kadi patta')),
      dish('Medu Vada', 35, 340, 'Medium', 'Crisp urad dal donuts with fluffy centres — served with sambar and coconut chutney.', 'medu-vada', ['festive', 'quick'], [...hero('Urad dal'), ...staples('Rai', 'Kadi patta', 'Hing', 'Tel', 'Namak', 'Hari mirch')]),
      dish('Mysore Pak', 45, 520, 'Hard', 'Ghee-laden gram-flour fudge that melts in the mouth — iconic Karnataka sweet.', 'mysore-pak', ['festive', 'leftover'], staples('Besan', 'Ghee', 'Sugar', 'Elaichi', 'Namak', 'Pani')),
      dish('Puliyodharai', 28, 330, 'Easy', 'Tamarind rice with roasted peanuts and spice powder — travel-friendly temple prasad style.', 'puliyodharai', ['quick', 'leftover'], staples('Chawal', 'Tamarind', 'Peanuts', 'Puliyodharai powder', 'Tel', 'Namak')),
    ],
  },
  {
    kitchenStyleId: 'north',
    region: 'North',
    dishes: [
      dish('Kadhi Pakora', 40, 390, 'Medium', 'Yogurt-based curry with besan fritters — tangy, comforting North Indian lunch.', 'kadhi-pakora', ['festive', 'kids'], [...hero('Dahi'), ...staples('Besan', 'Pyaaz', 'Rai', 'Methi dana', 'Haldi', 'Tel')]),
      dish('Dum Aloo', 45, 380, 'Medium', 'Baby potatoes slow-cooked in rich Kashmiri-style yogurt gravy.', 'dum-aloo', ['festive', 'leftover'], [...hero('Baby aloo'), ...staples('Dahi', 'Fennel powder', 'Ginger powder', 'Garam masala', 'Tel', 'Tamatar')]),
      dish('Baingan Bharta', 35, 320, 'Medium', 'Smoky roasted aubergine mashed with onion, tomato, and spices.', 'baingan-bharta', ['quick', 'leftover'], [...hero('Baingan'), ...staples('Pyaaz', 'Tamatar', 'Adrak', 'Lasun', 'Dhania', 'Tel')]),
      dish('Aloo Paratha', 35, 420, 'Medium', 'Stuffed potato flatbread roasted with ghee until golden — Punjabi breakfast icon.', 'aloo-paratha', ['festive', 'kids'], [...hero('Atta'), ...staples('Bateta', 'Ghee', 'Ajwain', 'Lal mirch', 'Dhania', 'Namak')]),
      dish('Chole Bhature', 50, 520, 'Medium', 'Puffy fried bread with spiced chickpea curry — Delhi weekend favourite.', 'chole-bhature', ['festive', 'leftover'], [...hero('Chana'), ...staples('Maida', 'Dahi', 'Chole masala', 'Adrak', 'Tel', 'Bhatura')]),
      dish('Rajma Masala', 45, 410, 'Medium', 'Kidney beans in thick tomato-onion gravy — best with steamed basmati rice.', 'rajma-masala', ['festive', 'leftover'], [...hero('Rajma'), ...staples('Tamatar', 'Pyaaz', 'Adrak', 'Rajma masala', 'Tel', 'Dhania')]),
      dish('Malai Kofta', 55, 480, 'Hard', 'Cottage cheese dumplings in creamy tomato-cashew gravy — restaurant-style treat.', 'malai-kofta', ['festive', 'leftover'], [...hero('Paneer'), ...staples('Makhan', 'Cream', 'Cashew', 'Tamatar', 'Garam masala', 'Tel')]),
    ],
  },
  {
    kitchenStyleId: 'punjabi',
    region: 'North',
    dishes: [
      dish('Sarson da Saag', 50, 360, 'Medium', 'Mustard greens slow-cooked and finished with white butter — winter Punjabi classic.', 'sarson-da-saag', ['festive', 'leftover'], [...hero('Sarson'), ...staples('Makki atta', 'Makhan', 'Adrak', 'Lasun', 'Ghee', 'Namak')]),
      dish('Makki di Roti', 30, 340, 'Medium', 'Yellow corn flatbreads roasted on tawa — traditional pair for sarson saag.', 'makki-di-roti', ['festive', 'quick'], staples('Makki atta', 'Ghee', 'Namak', 'Pani', 'Atta', 'Tel')),
      dish('Amritsari Fish', 35, 420, 'Medium', 'Gram-flour coated fish fried until crisp with carom seeds — Amritsar speciality.', 'amritsari-fish', ['quick', 'festive'], [...hero('Fish'), ...staples('Besan', 'Ajwain', 'Lal mirch', 'Tel', 'Namak', 'Nimbu')], 'Non-Veg'),
      dish('Pinni', 40, 510, 'Medium', 'Whole wheat, khoya, and dry fruit laddoos bound with ghee — winter energy bites.', 'pinni', ['festive', 'leftover'], staples('Atta', 'Khoya', 'Ghee', 'Gud', 'Badam', 'Elaichi')),
      dish('Rajma Chawal', 40, 430, 'Easy', 'Red kidney bean curry served over steamed rice — everyday Punjabi comfort meal.', 'rajma-chawal', ['quick', 'kids'], [...hero('Rajma'), ...staples('Chawal', 'Tamatar', 'Pyaaz', 'Rajma masala', 'Tel', 'Dhania')]),
      dish('Tandoori Roti', 25, 280, 'Easy', 'Whole wheat flatbread with smoky tandoor char — essential with dal makhani.', 'tandoori-roti', ['under20', 'quick'], staples('Atta', 'Namak', 'Pani', 'Ghee', 'Yeast', 'Tel')),
      dish('Paneer Tikka', 35, 390, 'Medium', 'Marinated cottage cheese cubes grilled with capsicum and onion.', 'paneer-tikka', ['festive', 'quick'], [...hero('Paneer'), ...staples('Dahi', 'Tikka masala', 'Capsicum', 'Pyaaz', 'Tel', 'Kasuri methi')]),
    ],
  },
  {
    kitchenStyleId: 'rajasthani',
    region: 'West',
    dishes: [
      dish('Gatte ki Sabzi', 45, 380, 'Medium', 'Gram-flour dumplings in spiced yogurt gravy — Rajasthani desert classic.', 'gatte-ki-sabzi', ['festive', 'leftover'], [...hero('Besan'), ...staples('Dahi', 'Rai', 'Hing', 'Lal mirch', 'Tel', 'Dhania')]),
      dish('Ker Sangri', 50, 340, 'Hard', 'Desert beans and berries slow-cooked with masala — iconic Marwari sabzi.', 'ker-sangri', ['festive', 'leftover'], [...hero('Ker Sangri'), ...staples('Hing', 'Amchur', 'Lal mirch', 'Tel', 'Namak', 'Dhania')]),
      dish('Bajra Khichda', 55, 400, 'Medium', 'Pearl millet and lentil porridge cooked with ghee — warming winter one-pot.', 'bajra-khichda', ['festive', 'kids'], [...hero('Bajra'), ...staples('Moong dal', 'Ghee', 'Jeera', 'Hing', 'Namak', 'Pani')]),
      dish('Mohan Maas', 60, 520, 'Hard', 'Royal meat curry cooked in milk and mild spices — rich Rajasthani feast dish.', 'mohan-maas', ['festive', 'leftover'], [...hero('Mutton'), ...staples('Dahi', 'Milk', 'Ghee', 'Elaichi', 'Kesar', 'Garam masala')], 'Non-Veg'),
      dish('Mirchi Vada', 30, 360, 'Medium', 'Large green chillies stuffed with potato, coated in besan and fried.', 'mirchi-vada', ['quick', 'festive'], [...hero('Mirchi'), ...staples('Besan', 'Bateta', 'Tel', 'Hing', 'Namak', 'Chutney')]),
      dish('Pyaaz Kachori', 40, 420, 'Medium', 'Flaky pastry filled with spiced onion and fried until golden — Jodhpur snack.', 'pyaaz-kachori', ['festive', 'quick'], [...hero('Maida'), ...staples('Pyaaz', 'Besan', 'Saunf', 'Tel', 'Namak', 'Imli chutney')]),
    ],
  },
  {
    kitchenStyleId: 'bengali',
    region: 'East',
    dishes: [
      dish('Luchi Alur Dom', 35, 410, 'Medium', 'Puffy fried bread with slow-cooked spiced potatoes — Bengali breakfast favourite.', 'luchi-alur-dom', ['festive', 'kids'], [...hero('Maida'), ...staples('Bateta', 'Ghee', 'Panch phoron', 'Tel', 'Namak', 'Dhania')]),
      dish('Shukto', 40, 320, 'Medium', 'Mild mixed vegetable stew with bitter gourd and milk — traditional first course.', 'shukto', ['festive', 'leftover'], [...hero('Karela'), ...staples('Baingan', 'Drumstick', 'Milk', 'Panch phoron', 'Tel', 'Bori')]),
      dish('Chingri Malai Curry', 45, 460, 'Medium', 'Prawns in coconut-milk gravy with gentle spices — celebratory Bengali curry.', 'chingri-malai', ['festive', 'leftover'], [...hero('Prawns'), ...staples('Nariyal', 'Nariyal milk', 'Panch phoron', 'Tel', 'Haldi', 'Namak')], 'Non-Veg'),
      dish('Kosha Mangsho', 75, 540, 'Hard', 'Slow-braised mutton in dark onion-spice gravy — Durga Puja special.', 'kosha-mangsho', ['festive', 'leftover'], [...hero('Mutton'), ...staples('Pyaaz', 'Adrak', 'Garam masala', 'Mustard oil', 'Yogurt', 'Tel')], 'Non-Veg'),
      dish('Aloo Posto', 30, 310, 'Easy', 'Potatoes in poppy seed paste — simple, nutty Bengali everyday sabzi.', 'aloo-posto', ['quick', 'kids'], [...hero('Bateta'), ...staples('Posto', 'Kali mirch', 'Green chilli', 'Mustard oil', 'Namak', 'Tel')]),
      dish('Mishti Doi', 45, 280, 'Easy', 'Caramelized jaggery yogurt set in earthen pots — iconic Bengali sweet.', 'mishti-doi', ['festive', 'kids'], staples('Dahi', 'Gud', 'Full cream milk', 'Elaichi', 'Namak', 'Sugar')),
      dish('Bhetki Fry', 30, 390, 'Medium', 'Marinated barramundi fillets shallow-fried until crisp — Kolkata fish fry style.', 'bhetki-fry', ['quick', 'festive'], [...hero('Bhetki'), ...staples('Besan', 'Lal mirch', 'Nimbu', 'Mustard oil', 'Namak', 'Tel')], 'Non-Veg'),
    ],
  },
  {
    kitchenStyleId: 'maharashtrian',
    region: 'West',
    dishes: [
      dish('Misal Pav', 40, 430, 'Medium', 'Spicy sprout curry topped with farsan and served with pav — Kolhapuri breakfast.', 'misal-pav', ['festive', 'quick'], [...hero('Matki'), ...staples('Misal rassa', 'Pav', 'Farsan', 'Pyaaz', 'Nimbu', 'Dhania')]),
      dish('Bharli Vangi', 45, 360, 'Medium', 'Baby brinjals stuffed with coconut-peanut masala and slow-cooked.', 'bharli-vangi', ['festive', 'leftover'], [...hero('Vangi'), ...staples('Mungfali', 'Nariyal', 'Goda masala', 'Tel', 'Pyaaz', 'Namak')]),
      dish('Thalipeeth', 35, 380, 'Medium', 'Multigrain spiced flatbread roasted with oil — nutritious Maharashtrian breakfast.', 'thalipeeth', ['quick', 'festive'], staples('Bhajani flour', 'Pyaaz', 'Dhania', 'Tel', 'Namak', 'Ghee')),
      dish('Ukadiche Modak', 55, 420, 'Hard', 'Steamed rice-flour dumplings filled with jaggery-coconut — Ganesh Chaturthi prasad.', 'modak', ['festive', 'leftover'], [...hero('Modak filling'), ...staples('Rice flour', 'Nariyal', 'Gud', 'Elaichi', 'Ghee', 'Namak')]),
      dish('Puran Poli', 50, 450, 'Hard', 'Sweet lentil-stuffed flatbread with ghee — festive Maharashtrian classic.', 'puran-poli', ['festive', 'leftover'], [...hero('Chana dal'), ...staples('Atta', 'Gud', 'Elaichi', 'Ghee', 'Namak', 'Tel')]),
      dish('Pithla Bhakri', 30, 390, 'Easy', 'Gram-flour curry with rustic jowar flatbread — farmer\'s lunch combo.', 'pithla-bhakri', ['quick', 'kids'], [...hero('Besan'), ...staples('Jowar atta', 'Hing', 'Haldi', 'Tel', 'Lasun', 'Mirchi')]),
      dish('Sol Kadhi', 15, 180, 'Easy', 'Pink kokum-coconut drink that aids digestion — served chilled with rice meals.', 'sol-kadhi', ['under20', 'quick'], staples('Kokum', 'Nariyal milk', 'Lasun', 'Hing', 'Namak', 'Dhania')),
    ],
  },
  {
    kitchenStyleId: 'hyderabadi',
    region: 'South',
    dishes: [
      dish('Mirchi ka Salan', 40, 340, 'Medium', 'Long green chillies in peanut-sesame gravy — classic biryani accompaniment.', 'mirchi-ka-salan', ['festive', 'leftover'], [...hero('Mirchi'), ...staples('Mungfali', 'Til', 'Tamarind', 'Ginger garlic', 'Tel', 'Masala')]),
      dish('Hyderabadi Haleem', 90, 520, 'Hard', 'Slow-pounded wheat and meat porridge with fried onions — Ramadan speciality.', 'haleem', ['festive', 'leftover'], [...hero('Mutton'), ...staples('Gehu', 'Chana dal', 'Fried onion', 'Ghee', 'Shahi jeera', 'Adrak')], 'Non-Veg'),
      dish('Shikampuri Kebab', 45, 410, 'Medium', 'Minced meat patties stuffed with hung yogurt and herbs — royal Hyderabadi starter.', 'shikampuri-kebab', ['festive', 'quick'], [...hero('Keema'), ...staples('Hung curd', 'Pudina', 'Dhania', 'Garam masala', 'Tel', 'Namak')], 'Non-Veg'),
      dish('Bagara Baingan', 40, 360, 'Medium', 'Baby brinjals in nutty tamarind-coconut gravy — vegetarian Hyderabadi classic.', 'bagara-baingan', ['festive', 'leftover'], [...hero('Baingan'), ...staples('Nariyal', 'Til', 'Mungfali', 'Tamarind', 'Tel', 'Masala')]),
      dish('Double ka Meetha', 45, 480, 'Medium', 'Bread pudding soaked in saffron milk and nuts — Hyderabadi dessert.', 'double-ka-meetha', ['festive', 'leftover'], [...hero('Bread'), ...staples('Milk', 'Sugar', 'Kesar', 'Badam', 'Ghee', 'Elaichi')]),
      dish('Khubani ka Meetha', 35, 420, 'Easy', 'Apricot compote topped with cream — wedding feast dessert.', 'khubani-ka-meetha', ['festive', 'kids'], [...hero('Khubani'), ...staples('Sugar', 'Cream', 'Kesar', 'Badam', 'Pani', 'Elaichi')]),
    ],
  },
  {
    kitchenStyleId: 'goan',
    region: 'West',
    dishes: [
      dish('Fish Recheado', 40, 420, 'Medium', 'Whole fish stuffed with tangy recheado masala and pan-fried — Goan Catholic classic.', 'fish-recheado', ['festive', 'quick'], [...hero('Fish'), ...staples('Recheado masala', 'Vinegar', 'Tel', 'Lasun', 'Namak', 'Nimbu')], 'Non-Veg'),
      dish('Goan Pork Vindaloo', 60, 510, 'Hard', 'Tangy vinegar-chilli pork curry with Portuguese roots — Goan feast dish.', 'pork-vindaloo', ['festive', 'leftover'], [...hero('Pork'), ...staples('Vinegar', 'Kashmiri mirch', 'Lasun', 'Adrak', 'Tel', 'Masala')], 'Non-Veg'),
      dish('Bebinca', 90, 540, 'Hard', 'Layered coconut-egg pudding baked until caramelized — Goan Christmas dessert.', 'bebinca', ['festive', 'leftover'], staples('Nariyal milk', 'Anda', 'Sugar', 'Ghee', 'Maida', 'Elaichi'), 'Egg'),
      dish('Goan Sannas', 35, 340, 'Medium', 'Sweet fermented rice cakes steamed until fluffy — pair with sorpotel or curry.', 'sannas', ['festive', 'kids'], staples('Chawal', 'Toddy', 'Sugar', 'Yeast', 'Namak', 'Tel')),
      dish('Goan Fish Curry', 35, 400, 'Medium', 'Tamarind-coconut fish curry with kokum — everyday Goan coastal meal.', 'goan-fish-curry', ['quick', 'festive'], [...hero('Fish'), ...staples('Nariyal', 'Tamarind', 'Kokum', 'Tel', 'Haldi', 'Mirchi')], 'Non-Veg'),
      dish('Chicken Cafreal', 45, 460, 'Medium', 'Green coriander-chilli marinated chicken roasted until charred and juicy.', 'chicken-cafreal', ['festive', 'quick'], [...hero('Chicken'), ...staples('Pudina', 'Dhania', 'Hari mirch', 'Tel', 'Lasun', 'Masala')], 'Non-Veg'),
    ],
  },
  {
    kitchenStyleId: 'kerala',
    region: 'South',
    dishes: [
      dish('Appam with Stew', 45, 380, 'Medium', 'Lacy fermented rice pancakes with mild coconut vegetable stew.', 'appam-stew', ['festive', 'kids'], [...hero('Appam batter'), ...staples('Nariyal milk', 'Sabzi', 'Elaichi', 'Kali mirch', 'Tel', 'Namak')]),
      dish('Puttu Kadala', 40, 410, 'Medium', 'Steamed rice cylinders with black chickpea curry — Kerala breakfast duo.', 'puttu-kadala', ['festive', 'quick'], [...hero('Puttu'), ...staples('Kadala', 'Nariyal', 'Shallots', 'Curry leaves', 'Tel', 'Masala')]),
      dish('Erissery', 35, 360, 'Easy', 'Pumpkin and beans in coconut gravy with roasted coconut — Onam sadya dish.', 'erissery', ['festive', 'leftover'], [...hero('Mathanga'), ...staples('Vanpayar', 'Nariyal', 'Jeera', 'Curry leaves', 'Tel', 'Namak')]),
      dish('Fish Moilee', 35, 400, 'Medium', 'Mild coconut milk fish curry with turmeric — Syrian Christian Kerala classic.', 'fish-moilee', ['quick', 'festive'], [...hero('Fish'), ...staples('Nariyal milk', 'Nimbu', 'Haldi', 'Curry leaves', 'Tel', 'Shallots')], 'Non-Veg'),
      dish('Malabar Parotta', 40, 440, 'Medium', 'Flaky layered flatbread from Malabar — torn and dipped in curry.', 'malabar-parotta', ['festive', 'quick'], staples('Maida', 'Tel', 'Milk', 'Namak', 'Sugar', 'Ghee')),
      dish('Avial', 35, 330, 'Easy', 'Mixed vegetables in coarse coconut-yogurt sauce — essential Onam side.', 'avial', ['festive', 'leftover'], [...hero('Mixed veg'), ...staples('Nariyal', 'Dahi', 'Curry leaves', 'Coconut oil', 'Jeera', 'Namak')]),
      dish('Kerala Egg Roast', 25, 370, 'Easy', 'Boiled eggs in peppery onion-tomato masala — tea-shop favourite.', 'kerala-egg-roast', ['under20', 'quick'], [...hero('Anda'), ...staples('Pyaaz', 'Tamatar', 'Kali mirch', 'Curry leaves', 'Tel', 'Masala')], 'Egg'),
    ],
  },
  {
    kitchenStyleId: 'chinese',
    region: 'North',
    dishes: [
      dish('Veg Manchurian', 30, 360, 'Easy', 'Crisp vegetable balls in tangy garlic-soy gravy — Indo-Chinese favourite.', 'veg-manchurian', ['under20', 'quick'], [...hero('Manchurian balls'), ...staples('Soya sauce', 'Lasun', 'Adrak', 'Spring onion', 'Tel', 'Cornflour')]),
      dish('Hakka Noodles', 25, 390, 'Easy', 'Wok-tossed noodles with vegetables and soy on high flame.', 'hakka-noodles', ['under20', 'quick'], [...hero('Noodles'), ...staples('Capsicum', 'Cabbage', 'Soya sauce', 'Spring onion', 'Tel', 'Lasun')]),
      dish('Chicken Fried Rice', 30, 430, 'Easy', 'Day-old rice stir-fried with egg, chicken, and soy — quick one-wok meal.', 'chicken-fried-rice', ['under20', 'quick'], [...hero('Chicken'), ...staples('Chawal', 'Anda', 'Soya sauce', 'Spring onion', 'Tel', 'Carrot')], 'Non-Veg'),
      dish('Chilli Chicken', 35, 420, 'Medium', 'Crisp fried chicken tossed in spicy soy-chilli sauce with capsicum.', 'chilli-chicken', ['quick', 'festive'], [...hero('Chicken'), ...staples('Soya sauce', 'Chilli sauce', 'Capsicum', 'Lasun', 'Tel', 'Cornflour')], 'Non-Veg'),
      dish('Veg Spring Rolls', 35, 340, 'Medium', 'Crisp pastry rolls filled with shredded vegetables — party starter classic.', 'spring-rolls', ['festive', 'quick'], [...hero('Spring roll sheet'), ...staples('Cabbage', 'Carrot', 'Soya sauce', 'Tel', 'Cornflour', 'Lasun')]),
      dish('Schezwan Paneer', 28, 400, 'Easy', 'Paneer cubes in fiery schezwan sauce with bell peppers.', 'schezwan-paneer', ['under20', 'quick'], [...hero('Paneer'), ...staples('Schezwan sauce', 'Capsicum', 'Lasun', 'Spring onion', 'Tel', 'Soya sauce')]),
    ],
  },
  {
    kitchenStyleId: 'assamese',
    region: 'East',
    dishes: [
      dish('Masor Tenga', 35, 380, 'Medium', 'Tangy tomato-fish curry that refreshes the palate — Assamese lunch staple.', 'masor-tenga', ['quick', 'festive'], [...hero('Rui maach'), ...staples('Tamatar', 'Nimbu', 'Panch phoron', 'Mustard oil', 'Haldi', 'Namak')], 'Non-Veg'),
      dish('Assamese Duck Roast', 70, 520, 'Hard', 'Whole duck slow-roasted with whole spices and potatoes — festive Assamese centrepiece.', 'duck-roast', ['festive', 'leftover'], [...hero('Duck'), ...staples('Aloo', 'Whole spices', 'Mustard oil', 'Adrak', 'Lasun', 'Namak')], 'Non-Veg'),
      dish('Khar', 40, 300, 'Medium', 'Unique alkaline curry with raw papaya — traditional Assamese first course.', 'khar', ['festive', 'leftover'], [...hero('Papaya'), ...staples('Kharoli', 'Panch phoron', 'Mustard oil', 'Namak', 'Pani', 'Mirchi')]),
      dish('Assamese Pitha', 45, 360, 'Medium', 'Steamed rice flour dumplings filled with jaggery-coconut — Bihu festival sweet.', 'assamese-pitha', ['festive', 'kids'], [...hero('Rice flour'), ...staples('Gud', 'Nariyal', 'Elaichi', 'Namak', 'Pani', 'Tel')]),
      dish('Ou Tenga Maas', 40, 390, 'Medium', 'Fish cooked with elephant apple for sourness — signature Assamese flavour.', 'ou-tenga-maas', ['festive', 'quick'], [...hero('Fish'), ...staples('Ou tenga', 'Mustard oil', 'Panch phoron', 'Haldi', 'Mirchi', 'Namak')], 'Non-Veg'),
      dish('Aloo Pitika', 20, 280, 'Easy', 'Mashed potato with mustard oil, onion, and green chilli — simple side dish.', 'aloo-pitika', ['under20', 'quick'], [...hero('Bateta'), ...staples('Mustard oil', 'Pyaaz', 'Hari mirch', 'Dhania', 'Namak', 'Nimbu')]),
      dish('Komolar Kheer', 35, 340, 'Easy', 'Orange-infused rice pudding — light Assamese dessert after meals.', 'komolar-kheer', ['festive', 'kids'], [...hero('Chawal'), ...staples('Orange', 'Milk', 'Sugar', 'Elaichi', 'Kesar', 'Badam')]),
    ],
  },
  {
    kitchenStyleId: 'kashmiri',
    region: 'North',
    dishes: [
      dish('Kashmiri Rogan Josh', 75, 520, 'Hard', 'Aromatic red lamb curry with fennel and dry ginger — Wazwan classic.', 'rogan-josh', ['festive', 'leftover'], [...hero('Mutton'), ...staples('Rogan josh masala', 'Dahi', 'Ghee', 'Saunf', 'Elaichi', 'Tel')], 'Non-Veg'),
      dish('Yakhni', 60, 440, 'Medium', 'Mild yogurt-based mutton broth with whole spices — delicate Kashmiri curry.', 'yakhni', ['festive', 'leftover'], [...hero('Mutton'), ...staples('Dahi', 'Saunf', 'Dhania powder', 'Ghee', 'Elaichi', 'Namak')], 'Non-Veg'),
      dish('Dum Olav', 45, 360, 'Medium', 'Baby potatoes cooked in yogurt gravy with Kashmiri spices.', 'dum-olav', ['festive', 'leftover'], [...hero('Baby aloo'), ...staples('Dahi', 'Ginger powder', 'Fennel', 'Ghee', 'Elaichi', 'Namak')]),
      dish('Kashmiri Pulao', 50, 460, 'Medium', 'Saffron rice with nuts and dried fruits — celebratory vegetarian pulao.', 'kashmiri-pulao', ['festive', 'leftover'], [...hero('Basmati chawal'), ...staples('Kesar', 'Badam', 'Kishmish', 'Ghee', 'Elaichi', 'Dalchini')]),
      dish('Lyodur Tschaman', 35, 390, 'Easy', 'Cottage cheese in golden turmeric yogurt gravy — Kashmiri pandit classic.', 'lyodur-tschaman', ['quick', 'festive'], [...hero('Paneer'), ...staples('Dahi', 'Haldi', 'Saunf', 'Ghee', 'Elaichi', 'Namak')]),
      dish('Shufta', 30, 420, 'Easy', 'Dry fruit and paneer sweet with saffron — Kashmiri festival dessert.', 'shufta', ['festive', 'kids'], [...hero('Paneer'), ...staples('Badam', 'Kishmish', 'Sugar', 'Kesar', 'Ghee', 'Elaichi')]),
    ],
  },
  {
    kitchenStyleId: 'chettinad',
    region: 'South',
    dishes: [
      dish('Chettinad Aattu Kari', 55, 480, 'Medium', 'Mutton curry with roasted Chettinad spices and coconut — fiery and aromatic.', 'aattu-kari', ['festive', 'leftover'], [...hero('Mutton'), ...staples('Chettinad masala', 'Nariyal', 'Curry leaves', 'Tel', 'Shallots', 'Tamarind')], 'Non-Veg'),
      dish('Chettinad Veg Kurma', 40, 360, 'Medium', 'Mixed vegetables in coconut-spice gravy — vegetarian Chettinad staple.', 'chettinad-veg-kurma', ['festive', 'quick'], [...hero('Mixed veg'), ...staples('Chettinad masala', 'Nariyal', 'Curry leaves', 'Tel', 'Shallots', 'Namak')]),
      dish('Seeraga Samba Biryani', 65, 510, 'Hard', 'Short-grain seeraga samba rice layered with spiced meat — Chettinad biryani style.', 'seeraga-samba-biryani', ['festive', 'leftover'], [...hero('Mutton'), ...staples('Seeraga samba rice', 'Chettinad masala', 'Curry leaves', 'Ghee', 'Onion', 'Tel')], 'Non-Veg'),
      dish('Milagu Kozhi', 45, 440, 'Medium', 'Black pepper chicken roast with fennel and curry leaves.', 'milagu-kozhi', ['festive', 'quick'], [...hero('Chicken'), ...staples('Kali mirch', 'Saunf', 'Curry leaves', 'Tel', 'Shallots', 'Chettinad masala')], 'Non-Veg'),
      dish('Kothamalli Chicken', 40, 420, 'Medium', 'Coriander-heavy green chicken curry — fresh and peppery Chettinad style.', 'kothamalli-chicken', ['quick', 'festive'], [...hero('Chicken'), ...staples('Dhania', 'Hari mirch', 'Curry leaves', 'Tel', 'Shallots', 'Chettinad masala')], 'Non-Veg'),
      dish('Chettinad Ven Pongal', 30, 350, 'Easy', 'Pepper-cumin rice-lentil pongal with ghee — Chettinad breakfast.', 'chettinad-ven-pongal', ['under20', 'quick'], staples('Chawal', 'Moong dal', 'Ghee', 'Kali mirch', 'Jeera', 'Curry leaves')),
      dish('Kara Kuzhi Paniyaram', 35, 330, 'Easy', 'Spicy fermented batter dumplings cooked in paniyaram pan until crisp.', 'kara-kuzhi-paniyaram', ['quick', 'kids'], [...hero('Idli batter'), ...staples('Pyaaz', 'Curry leaves', 'Rai', 'Tel', 'Hari mirch', 'Namak')]),
    ],
  },
];

function hero(name: string) {
  return [{ name, isStaple: false }];
}

function staples(...names: string[]) {
  return names.map((name) => ({ name, isStaple: true }));
}

function dish(
  title: string,
  prepTime: number,
  calories: number,
  difficulty: Dish['difficulty'],
  description: string,
  imageKeyword: string,
  tags: Dish['tags'],
  ingredients: Array<{ name: string; isStaple: boolean }>,
  dietType?: Dish['dietType'],
): Dish {
  return { title, prepTime, calories, difficulty, description, imageKeyword, tags, ingredients, dietType };
}

const totalDishes = CUISINES.reduce((sum, c) => sum + c.dishes.length, 0);
if (totalDishes !== 100) {
  throw new Error(`Expected 100 dishes, got ${totalDishes}`);
}

const fileBody = `import { buildBatch6Recipes, type Batch6CuisineConfig } from './batch6-shared';
import type { RecipeCatalogEntry } from './types';

/** 100 curated recipes (7 per cuisine × 10 + 6 per cuisine × 5), ids \${START_ID}+ per cuisine. */
const START_ID = ${START_ID};

const BATCH7_CONFIGS: Batch6CuisineConfig[] = ${JSON.stringify(
  CUISINES.map((c) => ({
    kitchenStyleId: c.kitchenStyleId,
    region: c.region,
    startId: START_ID,
    dishes: c.dishes,
  })),
  null,
  2,
).replace(/"(\w+)":/g, '$1:')};

export const ALL_CUISINES_BATCH7_RECIPES: RecipeCatalogEntry[] = BATCH7_CONFIGS.flatMap((config) =>
  buildBatch6Recipes(config),
);

export const BATCH7_RECIPE_COUNT = ALL_CUISINES_BATCH7_RECIPES.length;
`;

const outPath = join(__dirname, 'recipe-catalog/all-cuisines-batch7.ts');
writeFileSync(outPath, fileBody);
console.log(`Wrote ${totalDishes} recipes to ${outPath}`);
