import type { RecipeCatalogEntry } from "./types";

type Batch2Seed = {
  number: number;
  title: string;
  prepTime: number;
  calories: number;
  dietType: RecipeCatalogEntry["dietType"];
  difficulty: RecipeCatalogEntry["difficulty"];
  description: string;
  imageKeyword: string;
  tags: string[];
  ingredients: string[];
  kitchenStyleIds?: string[];
};

const STAPLES = new Set([
  "Namak",
  "Kashmiri mirch",
  "Saunf powder",
  "Sonth powder",
  "Sarson tel",
  "Ghee",
  "Dahi",
  "Adrak",
  "Lahsun",
  "Pyaaz",
  "Tamatar",
  "Hari elaichi",
  "Dalchini",
  "Tej patta",
  "Haldi",
  "Jeera",
  "Hing",
  "Dhania patta",
  "Nimbu ras",
]);

function buildSteps(title: string, dietType: RecipeCatalogEntry["dietType"]): string[] {
  const middleStep =
    dietType === "Veg"
      ? "Cook the vegetables or paneer in fennel-ginger spice base on low heat."
      : dietType === "Egg"
        ? "Build a smooth yogurt-spice gravy, then add eggs and simmer briefly."
        : "Sear protein first, then simmer in yogurt-fennel gravy till tender.";

  return [
    `Prepare ingredients for ${title} and keep dry spice powders measured.`,
    middleStep,
    "Adjust consistency with warm water and cook till flavors deepen.",
    "Finish with a little ghee and serve hot with rice or flatbread.",
  ];
}

const KASHMIRI_BATCH2_SEEDS: Batch2Seed[] = [
  { number: 31, title: "Rajma Gogji Yakhni", prepTime: 43, calories: 365, dietType: "Veg", difficulty: "Medium", description: "Rajma and turnip in a pale yogurt-fennel yakhni style curry.", imageKeyword: "rajma-gogji-yakhni", tags: ["leftover", "kids"], ingredients: ["Rajma", "Shalgam", "Dahi", "Saunf powder", "Sonth powder", "Ghee", "Namak"] },
  { number: 32, title: "Nadru Chaman Kaliya", prepTime: 37, calories: 340, dietType: "Veg", difficulty: "Medium", description: "Lotus stem and paneer simmer in rich Kashmiri kaliya masala.", imageKeyword: "nadru-chaman-kaliya", tags: ["festive", "kids"], ingredients: ["Nadru", "Paneer", "Dahi", "Saunf powder", "Kashmiri mirch", "Ghee", "Namak"] },
  { number: 33, title: "Tamatar Tschok Gaad", prepTime: 32, calories: 330, dietType: "Non-Veg", difficulty: "Medium", description: "Fish cooked in tangy tomato gravy with dry ginger and fennel.", imageKeyword: "tamatar-tschok-gaad", tags: ["quick", "leftover"], ingredients: ["Fish steak", "Tamatar", "Saunf powder", "Sonth powder", "Sarson tel", "Namak"] },
  { number: 34, title: "Haakh Anda Saag", prepTime: 22, calories: 245, dietType: "Egg", difficulty: "Easy", description: "Boiled eggs and Kashmiri greens in a light spiced broth.", imageKeyword: "haakh-anda-saag", tags: ["quick", "kids"], ingredients: ["Anda", "Haakh", "Adrak", "Saunf powder", "Sarson tel", "Namak"] },
  { number: 35, title: "Kashmiri Rogan Aloo", prepTime: 29, calories: 250, dietType: "Veg", difficulty: "Easy", description: "Baby potatoes in rogan-style red gravy with classic Kashmiri aroma.", imageKeyword: "kashmiri-rogan-aloo", tags: ["quick", "festive"], ingredients: ["Aloo", "Kashmiri mirch", "Saunf powder", "Sonth powder", "Sarson tel", "Namak"] },
  { number: 36, title: "Doodhi Yakhni Mutton", prepTime: 46, calories: 430, dietType: "Non-Veg", difficulty: "Hard", description: "Mutton and bottle gourd slow-cooked in soft yogurt yakhni gravy.", imageKeyword: "doodhi-yakhni-mutton", tags: ["festive", "leftover"], ingredients: ["Mutton", "Lauki", "Dahi", "Saunf powder", "Sonth powder", "Ghee", "Namak"] },
  { number: 37, title: "Ver Masala Tchaaman", prepTime: 35, calories: 345, dietType: "Veg", difficulty: "Medium", description: "Paneer in ver masala gravy with balanced heat and tang.", imageKeyword: "ver-masala-tchaaman", tags: ["festive", "quick"], ingredients: ["Paneer", "Ver masala", "Dahi", "Saunf powder", "Ghee", "Namak"] },
  { number: 38, title: "Turnip Mujh Yakhni", prepTime: 33, calories: 280, dietType: "Veg", difficulty: "Easy", description: "Turnip in thin yogurt gravy with fennel and dry ginger.", imageKeyword: "turnip-mujh-yakhni", tags: ["quick", "leftover"], ingredients: ["Shalgam", "Dahi", "Saunf powder", "Sonth powder", "Ghee", "Namak"] },
  { number: 39, title: "Kesar Badam Pulao Koshur", prepTime: 31, calories: 325, dietType: "Veg", difficulty: "Medium", description: "Saffron almond pulao with subtle Kashmiri spice and fragrance.", imageKeyword: "kesar-badam-pulao-koshur", tags: ["festive", "kids"], ingredients: ["Chawal", "Kesar", "Badam", "Ghee", "Hari elaichi", "Namak"] },
  { number: 40, title: "Marchwangan Anda", prepTime: 24, calories: 260, dietType: "Egg", difficulty: "Easy", description: "Boiled eggs in bright red Kashmiri chilli-fennel curry.", imageKeyword: "marchwangan-anda", tags: ["quick", "under20"], ingredients: ["Anda", "Kashmiri mirch", "Saunf powder", "Dahi", "Sarson tel", "Namak"] },
  { number: 41, title: "Nadru Palak Monje", prepTime: 28, calories: 240, dietType: "Veg", difficulty: "Easy", description: "Lotus stem and spinach fritter-style saute for a crisp-soft contrast.", imageKeyword: "nadru-palak-monje", tags: ["quick", "kids"], ingredients: ["Nadru", "Palak", "Besan", "Jeera", "Sarson tel", "Namak"] },
  { number: 42, title: "Chokh Wangun Gogji", prepTime: 30, calories: 255, dietType: "Veg", difficulty: "Easy", description: "Brinjal and turnip in tangy koshur masala gravy.", imageKeyword: "chokh-wangun-gogji", tags: ["quick", "leftover"], ingredients: ["Baingan", "Shalgam", "Kashmiri mirch", "Saunf powder", "Sarson tel", "Namak"] },
  { number: 43, title: "Kaliya Chicken Koshur", prepTime: 39, calories: 410, dietType: "Non-Veg", difficulty: "Medium", description: "Kashmiri chicken kaliya with yogurt and warm whole spices.", imageKeyword: "kaliya-chicken-koshur", tags: ["festive", "quick"], ingredients: ["Chicken", "Dahi", "Saunf powder", "Sonth powder", "Ghee", "Namak"] },
  { number: 44, title: "Walnut Haakh Paneer", prepTime: 27, calories: 300, dietType: "Veg", difficulty: "Easy", description: "Greens and paneer in walnut-thickened Kashmiri gravy.", imageKeyword: "walnut-haakh-paneer", tags: ["kids", "quick"], ingredients: ["Haakh", "Paneer", "Akhrot", "Adrak", "Ghee", "Namak"] },
  { number: 45, title: "Muji Chetin Chutney", prepTime: 15, calories: 150, dietType: "Veg", difficulty: "Easy", description: "Sharp radish chutney with walnut and curd for traditional Kashmiri meals.", imageKeyword: "muji-chetin-chutney", tags: ["under20", "quick"], ingredients: ["Mooli", "Akhrot", "Dahi", "Hari mirch", "Namak"] },
  { number: 46, title: "Kashmiri Dum Chole", prepTime: 38, calories: 350, dietType: "Veg", difficulty: "Medium", description: "Chickpeas cooked with Kashmiri spice profile and slow simmered gravy.", imageKeyword: "kashmiri-dum-chole", tags: ["leftover", "kids"], ingredients: ["Chole", "Kashmiri mirch", "Saunf powder", "Pyaaz", "Tamatar", "Ghee", "Namak"] },
  { number: 47, title: "Sonth Saunf Fish Curry", prepTime: 34, calories: 335, dietType: "Non-Veg", difficulty: "Medium", description: "Fish in aromatic dry-ginger and fennel gravy with light tang.", imageKeyword: "sonth-saunf-fish-curry", tags: ["quick", "leftover"], ingredients: ["Fish steak", "Saunf powder", "Sonth powder", "Dahi", "Sarson tel", "Namak"] },
  { number: 48, title: "Gogji Haakh Shorba", prepTime: 25, calories: 220, dietType: "Veg", difficulty: "Easy", description: "Turnip and greens in warming Kashmiri broth.", imageKeyword: "gogji-haakh-shorba", tags: ["quick", "kids"], ingredients: ["Shalgam", "Haakh", "Adrak", "Jeera", "Ghee", "Namak"] },
  { number: 49, title: "Kashmiri Mirch Paneer Korma", prepTime: 33, calories: 335, dietType: "Veg", difficulty: "Medium", description: "Paneer korma in red Kashmiri chilli gravy balanced by yogurt.", imageKeyword: "kashmiri-mirch-paneer-korma", tags: ["festive", "kids"], ingredients: ["Paneer", "Dahi", "Kashmiri mirch", "Saunf powder", "Ghee", "Namak"] },
  { number: 50, title: "Nadru Methi Pulao", prepTime: 30, calories: 315, dietType: "Veg", difficulty: "Easy", description: "Lotus stem and fenugreek rice pulao with gentle Kashmiri spices.", imageKeyword: "nadru-methi-pulao", tags: ["quick", "leftover"], ingredients: ["Nadru", "Methi", "Chawal", "Ghee", "Hari elaichi", "Namak"] },
  { number: 51, title: "Mutton Yakhni Kanti", prepTime: 45, calories: 445, dietType: "Non-Veg", difficulty: "Hard", description: "Mutton first cooked in yakhni notes, then reduced to kanti-like dry finish.", imageKeyword: "mutton-yakhni-kanti", tags: ["festive", "leftover"], ingredients: ["Mutton", "Dahi", "Saunf powder", "Sonth powder", "Ghee", "Namak"] },
  { number: 52, title: "Kesar Tsot Rice", prepTime: 22, calories: 240, dietType: "Veg", difficulty: "Easy", description: "Saffron-flavored rice inspired by festive Kashmiri breads and pulao aromas.", imageKeyword: "kesar-tsot-rice", tags: ["quick", "kids"], ingredients: ["Chawal", "Kesar", "Ghee", "Hari elaichi", "Namak"] },
  { number: 53, title: "Noon Chai Murg Tikka", prepTime: 36, calories: 390, dietType: "Non-Veg", difficulty: "Medium", description: "Chicken tikka marinated in pink tea-inspired spice and yogurt mix.", imageKeyword: "noon-chai-murg-tikka", tags: ["festive", "quick"], ingredients: ["Chicken", "Dahi", "Saunf powder", "Sonth powder", "Kashmiri mirch", "Ghee", "Namak"] },
  { number: 54, title: "Kashmiri Rajma Chut Gogji", prepTime: 41, calories: 370, dietType: "Veg", difficulty: "Medium", description: "Rajma and turnip in thick tangy gravy with Kashmiri pantry spices.", imageKeyword: "kashmiri-rajma-chut-gogji", tags: ["leftover", "kids"], ingredients: ["Rajma", "Shalgam", "Tamatar", "Saunf powder", "Sonth powder", "Ghee", "Namak"] },
  { number: 55, title: "Apricot Rogan Chicken", prepTime: 37, calories: 405, dietType: "Non-Veg", difficulty: "Medium", description: "Rogan-style chicken with dried apricot for fruity depth and mild sweetness.", imageKeyword: "apricot-rogan-chicken", tags: ["festive", "quick"], ingredients: ["Chicken", "Sukhi khubani", "Kashmiri mirch", "Dahi", "Ghee", "Namak"] },
  { number: 56, title: "Turnip Paneer Yemberzal", prepTime: 29, calories: 305, dietType: "Veg", difficulty: "Easy", description: "Turnip and paneer in saffron-yellow Kashmiri gravy.", imageKeyword: "turnip-paneer-yemberzal", tags: ["kids", "quick"], ingredients: ["Shalgam", "Paneer", "Kesar", "Doodh", "Saunf powder", "Ghee", "Namak"] },
  { number: 57, title: "Koshur Anda Pulav", prepTime: 27, calories: 290, dietType: "Egg", difficulty: "Easy", description: "Fragrant Kashmiri egg pulao with mild dry spice and cardamom.", imageKeyword: "koshur-anda-pulav", tags: ["quick", "kids"], ingredients: ["Anda", "Chawal", "Hari elaichi", "Ghee", "Saunf powder", "Namak"] },
  { number: 58, title: "Mujh Nadru Tarkari", prepTime: 31, calories: 250, dietType: "Veg", difficulty: "Easy", description: "Turnip and lotus stem curry with fennel and dry ginger.", imageKeyword: "mujh-nadru-tarkari", tags: ["quick", "leftover"], ingredients: ["Shalgam", "Nadru", "Saunf powder", "Sonth powder", "Sarson tel", "Namak"] },
  { number: 59, title: "Walnut Gushtaba Curry", prepTime: 47, calories: 460, dietType: "Non-Veg", difficulty: "Hard", description: "Meatball-style curry with walnut-yogurt sauce inspired by wazwan flavors.", imageKeyword: "walnut-gushtaba-curry", tags: ["festive", "leftover"], ingredients: ["Mutton keema", "Akhrot", "Dahi", "Saunf powder", "Ghee", "Namak"] },
  { number: 60, title: "Khatta Nadru Tschok", prepTime: 26, calories: 235, dietType: "Veg", difficulty: "Easy", description: "Tangy lotus stem curry with Kashmiri chilli and fennel.", imageKeyword: "khatta-nadru-tschok", tags: ["quick", "under20"], ingredients: ["Nadru", "Imli pulp", "Kashmiri mirch", "Saunf powder", "Sarson tel", "Namak"] },
  { number: 61, title: "Kashmiri Haakh Khichdi", prepTime: 24, calories: 260, dietType: "Veg", difficulty: "Easy", description: "Rice and lentils with greens in a soft, comforting Kashmiri one-pot meal.", imageKeyword: "kashmiri-haakh-khichdi", tags: ["quick", "kids"], ingredients: ["Chawal", "Moong dal", "Haakh", "Ghee", "Hing", "Namak"] },
  { number: 62, title: "Saffron Ver Chicken", prepTime: 38, calories: 410, dietType: "Non-Veg", difficulty: "Medium", description: "Chicken in ver masala and saffron yogurt gravy for festive tables.", imageKeyword: "saffron-ver-chicken", tags: ["festive", "quick"], ingredients: ["Chicken", "Ver masala", "Kesar", "Dahi", "Ghee", "Namak"] },
  { number: 63, title: "Daniwal Fish Kaliya", prepTime: 34, calories: 345, dietType: "Non-Veg", difficulty: "Medium", description: "Fish kaliya with fresh coriander notes and Kashmiri fennel balance.", imageKeyword: "daniwal-fish-kaliya", tags: ["quick", "leftover"], ingredients: ["Fish steak", "Dhania patta", "Dahi", "Saunf powder", "Ghee", "Namak"] },
  { number: 64, title: "Gucchi Pulao Koshur", prepTime: 35, calories: 320, dietType: "Veg", difficulty: "Medium", description: "Morel mushroom pulao with cardamom and saffron in Kashmiri style.", imageKeyword: "gucchi-pulao-koshur", tags: ["festive", "kids"], ingredients: ["Gucchi", "Chawal", "Kesar", "Ghee", "Hari elaichi", "Namak"] },
  { number: 65, title: "Shalgam Kebab Curry", prepTime: 39, calories: 355, dietType: "Non-Veg", difficulty: "Hard", description: "Mutton kebab dumplings simmered with turnip and Kashmiri spices.", imageKeyword: "shalgam-kebab-curry", tags: ["festive", "leftover"], ingredients: ["Mutton keema", "Shalgam", "Dahi", "Saunf powder", "Ghee", "Namak"] },
  { number: 66, title: "Kashmiri Methi Rogan Josh", prepTime: 44, calories: 435, dietType: "Non-Veg", difficulty: "Hard", description: "Rogan josh base enriched with fresh fenugreek for deeper aroma.", imageKeyword: "kashmiri-methi-rogan-josh", tags: ["festive", "leftover"], ingredients: ["Mutton", "Methi", "Dahi", "Kashmiri mirch", "Saunf powder", "Ghee", "Namak"] },
  { number: 67, title: "Monje Chana Korma", prepTime: 32, calories: 295, dietType: "Veg", difficulty: "Medium", description: "Kohlrabi fritters and chickpeas in mild Kashmiri korma gravy.", imageKeyword: "monje-chana-korma", tags: ["leftover", "kids"], ingredients: ["Knol khol", "Chana", "Dahi", "Saunf powder", "Ghee", "Namak"] },
  { number: 68, title: "Nadru Tamatar Yakhni", prepTime: 28, calories: 245, dietType: "Veg", difficulty: "Easy", description: "Lotus stem in yogurt-tomato yakhni gives tang and creaminess together.", imageKeyword: "nadru-tamatar-yakhni", tags: ["quick", "kids"], ingredients: ["Nadru", "Tamatar", "Dahi", "Saunf powder", "Ghee", "Namak"] },
  { number: 69, title: "Koshur Kesar Halwa", prepTime: 23, calories: 275, dietType: "Veg", difficulty: "Easy", description: "Saffron semolina halwa with dry fruits and mild Kashmiri sweetness.", imageKeyword: "koshur-kesar-halwa", tags: ["festive", "kids"], ingredients: ["Sooji", "Kesar", "Badam", "Ghee", "Cheeni"] },
  { number: 70, title: "Muji Gaad Fried Curry", prepTime: 35, calories: 340, dietType: "Non-Veg", difficulty: "Medium", description: "Fried fish and radish in thick Kashmiri masala gravy.", imageKeyword: "muji-gaad-fried-curry", tags: ["quick", "leftover"], ingredients: ["Fish steak", "Mooli", "Kashmiri mirch", "Saunf powder", "Sarson tel", "Namak"] },
  { number: 71, title: "Kanti Paneer Tikki", prepTime: 26, calories: 285, dietType: "Veg", difficulty: "Easy", description: "Paneer patties with kanti-style dry masala and fennel warmth.", imageKeyword: "kanti-paneer-tikki", tags: ["quick", "kids"], ingredients: ["Paneer", "Saunf powder", "Kashmiri mirch", "Adrak", "Ghee", "Namak"] },
  { number: 72, title: "Tschaman Matar Yakhni", prepTime: 30, calories: 300, dietType: "Veg", difficulty: "Easy", description: "Paneer and peas in mild yogurt yakhni curry.", imageKeyword: "tschaman-matar-yakhni", tags: ["quick", "kids"], ingredients: ["Paneer", "Matar", "Dahi", "Saunf powder", "Ghee", "Namak"] },
  { number: 73, title: "Kashmiri Punjabi Kebab Curry", prepTime: 40, calories: 420, dietType: "Non-Veg", difficulty: "Hard", description: "Kebab curry combining Kashmiri fennel notes with Punjabi-style onion body.", imageKeyword: "kashmiri-punjabi-kebab-curry", tags: ["festive", "leftover"], ingredients: ["Mutton keema", "Pyaaz", "Tamatar", "Saunf powder", "Garam masala", "Ghee", "Namak"], kitchenStyleIds: ["kashmiri", "punjabi"] },
  { number: 74, title: "Ver Masala Egg Curry", prepTime: 25, calories: 270, dietType: "Egg", difficulty: "Easy", description: "Boiled eggs in ver masala gravy with yogurt smoothness.", imageKeyword: "ver-masala-egg-curry", tags: ["quick", "kids"], ingredients: ["Anda", "Ver masala", "Dahi", "Saunf powder", "Ghee", "Namak"] },
  { number: 75, title: "Gogji Dum Aloo", prepTime: 31, calories: 260, dietType: "Veg", difficulty: "Easy", description: "Turnip and potato dum curry with Kashmiri spice warmth.", imageKeyword: "gogji-dum-aloo", tags: ["quick", "leftover"], ingredients: ["Shalgam", "Aloo", "Kashmiri mirch", "Saunf powder", "Ghee", "Namak"] },
  { number: 76, title: "Walnut Rajma Yakhni", prepTime: 42, calories: 375, dietType: "Veg", difficulty: "Medium", description: "Rajma in walnut-yogurt yakhni with rich body and mellow spice.", imageKeyword: "walnut-rajma-yakhni", tags: ["leftover", "kids"], ingredients: ["Rajma", "Akhrot", "Dahi", "Saunf powder", "Ghee", "Namak"] },
  { number: 77, title: "Kashmiri Lahsuni Haakh", prepTime: 20, calories: 190, dietType: "Veg", difficulty: "Easy", description: "Greens sauteed with plenty of garlic and mustard oil.", imageKeyword: "kashmiri-lahsuni-haakh", tags: ["under20", "quick"], ingredients: ["Haakh", "Lahsun", "Sarson tel", "Hing", "Namak"] },
  { number: 78, title: "Nadru Saffron Korma", prepTime: 34, calories: 315, dietType: "Veg", difficulty: "Medium", description: "Lotus stem korma finished with saffron milk and fennel.", imageKeyword: "nadru-saffron-korma", tags: ["festive", "kids"], ingredients: ["Nadru", "Dahi", "Kesar", "Saunf powder", "Ghee", "Namak"] },
  { number: 79, title: "Mutton Monje Stew", prepTime: 45, calories: 440, dietType: "Non-Veg", difficulty: "Hard", description: "Mutton and kohlrabi simmered into a deeply warming Kashmiri stew.", imageKeyword: "mutton-monje-stew", tags: ["festive", "leftover"], ingredients: ["Mutton", "Knol khol", "Dahi", "Saunf powder", "Sonth powder", "Ghee", "Namak"] },
  { number: 80, title: "Yakhni Prawn Koshur", prepTime: 33, calories: 350, dietType: "Non-Veg", difficulty: "Medium", description: "Prawns in light Kashmiri yogurt gravy with cardamom aroma.", imageKeyword: "yakhni-prawn-koshur", tags: ["quick", "festive"], ingredients: ["Prawns", "Dahi", "Saunf powder", "Hari elaichi", "Ghee", "Namak"] },
];

export const KASHMIRI_BATCH2_RECIPES: RecipeCatalogEntry[] = KASHMIRI_BATCH2_SEEDS.map((seed) => ({
  id: `kashmiri-${seed.number}`,
  kitchenStyleId: "kashmiri",
  ...(seed.kitchenStyleIds ? { kitchenStyleIds: seed.kitchenStyleIds } : {}),
  title: seed.title,
  prepTime: seed.prepTime,
  calories: seed.calories,
  region: "North",
  dietType: seed.dietType,
  difficulty: seed.difficulty,
  description: seed.description,
  imageKeyword: seed.imageKeyword,
  tags: seed.tags,
  ingredients: seed.ingredients.map((name) => ({ name, isStaple: STAPLES.has(name) })),
  steps: buildSteps(seed.title, seed.dietType),
}));
