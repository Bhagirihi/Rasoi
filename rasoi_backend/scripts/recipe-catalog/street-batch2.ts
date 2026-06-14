import type { RecipeCatalogEntry } from "./types";

type AllowedTag = "under20" | "leftover" | "kids" | "quick" | "festive";

type RecipeSeed = {
  title: string;
  prepTime: number;
  calories: number;
  dietType: RecipeCatalogEntry["dietType"];
  difficulty: RecipeCatalogEntry["difficulty"];
  description: string;
  imageKeyword: string;
  tags: [AllowedTag, AllowedTag];
  coreIngredient: string;
  kitchenStyleIds?: string[];
};

function buildIngredients(coreIngredient: string, dietType: RecipeCatalogEntry["dietType"]) {
  const ingredients = [
    { name: coreIngredient, isStaple: true },
    { name: "Pyaaz", isStaple: true },
    { name: "Tamatar", isStaple: true },
    { name: "Hari chutney", isStaple: false },
    { name: "Nimbu ras", isStaple: true },
    { name: "Masala", isStaple: true },
  ];

  if (dietType === "Egg") {
    ingredients[0] = { name: "Anda", isStaple: false };
  }

  return ingredients;
}

function buildSteps(title: string): string[] {
  return [
    `Prep all toppings and components for ${title}.`,
    "Cook or toast the main base on a hot tawa until flavorful.",
    "Assemble with chutneys, masala, and texture components.",
    "Serve immediately for best street-style taste.",
  ];
}

const STREET_BATCH2_SEEDS: RecipeSeed[] = [
  { title: "Pani Puri", prepTime: 20, calories: 260, dietType: "Veg", difficulty: "Easy", description: "Crispy puris filled with spiced water and potato mix.", imageKeyword: "pani-puri", tags: ["under20", "kids"], coreIngredient: "Puri" },
  { title: "Raj Kachori", prepTime: 30, calories: 420, dietType: "Veg", difficulty: "Medium", description: "Large crisp kachori loaded with sprouts, curd, and chutneys.", imageKeyword: "raj-kachori", tags: ["festive", "kids"], coreIngredient: "Kachori shell" },
  { title: "Papdi Chaat", prepTime: 18, calories: 280, dietType: "Veg", difficulty: "Easy", description: "Crunchy papdi layered with curd, chutneys, and sev.", imageKeyword: "papdi-chaat", tags: ["under20", "quick"], coreIngredient: "Papdi" },
  { title: "Palak Patta Chaat", prepTime: 24, calories: 300, dietType: "Veg", difficulty: "Medium", description: "Crisp spinach fritters topped with tangy chaat elements.", imageKeyword: "palak-patta-chaat", tags: ["quick", "festive"], coreIngredient: "Palak" },
  { title: "Moong Dal Chilla Chaat", prepTime: 22, calories: 290, dietType: "Veg", difficulty: "Easy", description: "Savory lentil crepe cut and topped in chaat style.", imageKeyword: "moong-dal-chilla", tags: ["quick", "kids"], coreIngredient: "Moong dal" },
  { title: "Anda Tawa Pulao", prepTime: 26, calories: 390, dietType: "Egg", difficulty: "Medium", description: "Street tawa rice tossed with eggs and pav bhaji masala.", imageKeyword: "anda-tawa-pulao", tags: ["quick", "leftover"], coreIngredient: "Cooked rice" },
  { title: "Surti Locho Chaat", prepTime: 28, calories: 320, dietType: "Veg", difficulty: "Medium", description: "Locho topped with chutneys, onions, and nylon sev.", imageKeyword: "locho-chaat", tags: ["kids", "festive"], coreIngredient: "Locho", kitchenStyleIds: ["street", "gujarati"] },
  { title: "Dabeli Masala Pav", prepTime: 24, calories: 370, dietType: "Veg", difficulty: "Medium", description: "Buttered pav stuffed with spicy potato and sweet chutney.", imageKeyword: "dabeli", tags: ["quick", "kids"], coreIngredient: "Pav", kitchenStyleIds: ["street", "gujarati"] },
  { title: "Cheese Dabeli", prepTime: 22, calories: 410, dietType: "Veg", difficulty: "Easy", description: "Dabeli finished with melted cheese for modern street twist.", imageKeyword: "cheese-dabeli", tags: ["kids", "quick"], coreIngredient: "Pav" },
  { title: "Matar Kulcha", prepTime: 27, calories: 360, dietType: "Veg", difficulty: "Easy", description: "Soft kulcha served with spicy white peas curry.", imageKeyword: "matar-kulcha", tags: ["quick", "leftover"], coreIngredient: "Safed matar" },
  { title: "Chole Kulche", prepTime: 30, calories: 380, dietType: "Veg", difficulty: "Medium", description: "Street staple of tangy chickpeas and fluffy kulche.", imageKeyword: "chole-kulche", tags: ["quick", "festive"], coreIngredient: "Kabuli chana" },
  { title: "Chana Kulcha Chaat", prepTime: 21, calories: 340, dietType: "Veg", difficulty: "Easy", description: "Chopped kulcha tossed with chana and chutney dressings.", imageKeyword: "chana-kulcha-chaat", tags: ["quick", "leftover"], coreIngredient: "Kulcha" },
  { title: "Bread Omelette", prepTime: 14, calories: 300, dietType: "Egg", difficulty: "Easy", description: "Egg omelette folded in toasted bread slices.", imageKeyword: "bread-omelette", tags: ["under20", "quick"], coreIngredient: "Bread" },
  { title: "Masala Omelette Pav", prepTime: 16, calories: 330, dietType: "Egg", difficulty: "Easy", description: "Spicy omelette stuffed inside buttered pav.", imageKeyword: "omelette-pav", tags: ["under20", "kids"], coreIngredient: "Pav" },
  { title: "Keema Kaleji Pav", prepTime: 34, calories: 430, dietType: "Non-Veg", difficulty: "Hard", description: "Rich minced meat and liver masala served with pav.", imageKeyword: "keema-kaleji-pav", tags: ["festive", "quick"], coreIngredient: "Kaleji" },
  { title: "Bheja Fry Pav", prepTime: 30, calories: 420, dietType: "Non-Veg", difficulty: "Hard", description: "Spiced brain fry mopped up with toasted pav.", imageKeyword: "bheja-fry-pav", tags: ["quick", "festive"], coreIngredient: "Bheja" },
  { title: "Bhurji Bun", prepTime: 15, calories: 310, dietType: "Egg", difficulty: "Easy", description: "Soft bun filled with tawa-style egg bhurji masala.", imageKeyword: "bhurji-bun", tags: ["under20", "quick"], coreIngredient: "Bun" },
  { title: "Chinese Bhel", prepTime: 18, calories: 290, dietType: "Veg", difficulty: "Easy", description: "Crispy noodles tossed in spicy Indo-Chinese sauces.", imageKeyword: "chinese-bhel", tags: ["quick", "kids"], coreIngredient: "Fried noodles", kitchenStyleIds: ["street", "chinese"] },
  { title: "Triple Schezwan Rice", prepTime: 28, calories: 410, dietType: "Egg", difficulty: "Medium", description: "Layered fried rice and noodles with schezwan gravy.", imageKeyword: "triple-schezwan-rice", tags: ["quick", "festive"], coreIngredient: "Rice" },
  { title: "Veg Manchurian Roll", prepTime: 24, calories: 350, dietType: "Veg", difficulty: "Medium", description: "Spicy veg manchurian wrapped in roomali style roll.", imageKeyword: "manchurian-roll", tags: ["kids", "quick"], coreIngredient: "Veg manchurian" },
  { title: "Chilli Paneer Frankie", prepTime: 22, calories: 360, dietType: "Veg", difficulty: "Medium", description: "Paneer strips in chilli sauce wrapped in street frankie.", imageKeyword: "chilli-paneer-frankie", tags: ["quick", "kids"], coreIngredient: "Paneer" },
  { title: "Chicken Lollipop Masala", prepTime: 32, calories: 430, dietType: "Non-Veg", difficulty: "Medium", description: "Fried chicken lollipops tossed in spicy masala glaze.", imageKeyword: "chicken-lollipop", tags: ["festive", "quick"], coreIngredient: "Chicken wings" },
  { title: "Afghani Chicken Momos", prepTime: 36, calories: 400, dietType: "Non-Veg", difficulty: "Hard", description: "Steamed chicken momos coated with creamy afghani sauce.", imageKeyword: "chicken-momos", tags: ["festive", "kids"], coreIngredient: "Momos" },
  { title: "Kurkure Momos", prepTime: 30, calories: 360, dietType: "Veg", difficulty: "Medium", description: "Fried crunchy momos served with fiery red chutney.", imageKeyword: "kurkure-momos", tags: ["kids", "quick"], coreIngredient: "Veg momos" },
  { title: "Soya Chaap Roll", prepTime: 24, calories: 340, dietType: "Veg", difficulty: "Medium", description: "Smoky soy chaap strips wrapped in buttery paratha.", imageKeyword: "soya-chaap-roll", tags: ["quick", "festive"], coreIngredient: "Soya chaap" },
  { title: "Paneer Kathi Roll", prepTime: 20, calories: 350, dietType: "Veg", difficulty: "Easy", description: "Classic street roll with paneer tikka masala filling.", imageKeyword: "paneer-kathi-roll", tags: ["quick", "kids"], coreIngredient: "Paneer" },
  { title: "Tandoori Chaap Tikka", prepTime: 34, calories: 370, dietType: "Veg", difficulty: "Medium", description: "Tandoori-marinated soya chaap grilled and finished with chaat masala.", imageKeyword: "tandoori-chaap", tags: ["festive", "quick"], coreIngredient: "Soya chaap" },
  { title: "Aloo Tawa Sandwich", prepTime: 17, calories: 310, dietType: "Veg", difficulty: "Easy", description: "Buttered tawa sandwich with spicy mashed potato filling.", imageKeyword: "aloo-tawa-sandwich", tags: ["under20", "kids"], coreIngredient: "Bread" },
  { title: "Mumbai Masala Toast", prepTime: 14, calories: 280, dietType: "Veg", difficulty: "Easy", description: "Crisp toast spread with chutney and masala potato.", imageKeyword: "masala-toast", tags: ["under20", "quick"], coreIngredient: "Bread" },
  { title: "Jam Cheese Chilli Toast", prepTime: 12, calories: 300, dietType: "Veg", difficulty: "Easy", description: "Sweet-spicy grilled toast with cheese melt finish.", imageKeyword: "jam-cheese-toast", tags: ["under20", "kids"], coreIngredient: "Bread" },
  { title: "Anda Ghotala Pav", prepTime: 21, calories: 360, dietType: "Egg", difficulty: "Medium", description: "Butter-rich egg scramble with grated yolk and masala.", imageKeyword: "anda-ghotala", tags: ["quick", "festive"], coreIngredient: "Anda" },
  { title: "Bohri Chicken Naan Roll", prepTime: 33, calories: 430, dietType: "Non-Veg", difficulty: "Medium", description: "Spiced shredded chicken wrapped in soft naan.", imageKeyword: "chicken-naan-roll", tags: ["quick", "festive"], coreIngredient: "Chicken" },
  { title: "Nalli Nihari Kulcha", prepTime: 48, calories: 470, dietType: "Non-Veg", difficulty: "Hard", description: "Slow-cooked marrow curry served with fluffy kulcha.", imageKeyword: "nihari-kulcha", tags: ["festive", "leftover"], coreIngredient: "Nalli" },
  { title: "Bhuna Mutton Kathi Roll", prepTime: 35, calories: 440, dietType: "Non-Veg", difficulty: "Hard", description: "Bhuna mutton filling in paratha with onion and chutney.", imageKeyword: "mutton-kathi-roll", tags: ["quick", "festive"], coreIngredient: "Mutton" },
  { title: "Fish Koliwada", prepTime: 29, calories: 390, dietType: "Non-Veg", difficulty: "Medium", description: "Mumbai-style batter fried fish with chilli and lemon.", imageKeyword: "fish-koliwada", tags: ["quick", "festive"], coreIngredient: "Fish fillet" },
  { title: "Bombil Fry Pav", prepTime: 27, calories: 380, dietType: "Non-Veg", difficulty: "Medium", description: "Bombay duck fry tucked into buttered pav.", imageKeyword: "bombil-fry", tags: ["quick", "kids"], coreIngredient: "Bombil" },
  { title: "Prawn Koliwada Roll", prepTime: 31, calories: 410, dietType: "Non-Veg", difficulty: "Medium", description: "Spiced fried prawns rolled with salad and sauce.", imageKeyword: "prawn-koliwada-roll", tags: ["festive", "quick"], coreIngredient: "Prawn" },
  { title: "Crispy Corn Chaat", prepTime: 16, calories: 270, dietType: "Veg", difficulty: "Easy", description: "Fried corn kernels tossed in tangy street masala.", imageKeyword: "crispy-corn-chaat", tags: ["under20", "kids"], coreIngredient: "Sweet corn" },
  { title: "Corn Cheese Chaat", prepTime: 15, calories: 290, dietType: "Veg", difficulty: "Easy", description: "Butter-sauteed corn with cheese and chaat seasoning.", imageKeyword: "corn-cheese-chaat", tags: ["under20", "kids"], coreIngredient: "Sweet corn" },
  { title: "Kala Chana Chaat", prepTime: 18, calories: 260, dietType: "Veg", difficulty: "Easy", description: "Boiled black chickpeas tossed with onion and spices.", imageKeyword: "kala-chana-chaat", tags: ["under20", "quick"], coreIngredient: "Kala chana" },
  { title: "Soya Keema Pav", prepTime: 24, calories: 340, dietType: "Veg", difficulty: "Medium", description: "Plant-based keema masala served with buttered pav.", imageKeyword: "soya-keema-pav", tags: ["quick", "leftover"], coreIngredient: "Soya granules" },
  { title: "Chicken Shawarma Tawa", prepTime: 30, calories: 420, dietType: "Non-Veg", difficulty: "Medium", description: "Street-style spiced chicken tossed on tawa and wrapped.", imageKeyword: "chicken-shawarma", tags: ["quick", "kids"], coreIngredient: "Chicken" },
  { title: "Malai Broccoli Roll", prepTime: 22, calories: 320, dietType: "Veg", difficulty: "Easy", description: "Creamy charred broccoli filling in paratha roll.", imageKeyword: "broccoli-roll", tags: ["quick", "kids"], coreIngredient: "Broccoli" },
  { title: "Tawa Soya Chaap", prepTime: 26, calories: 360, dietType: "Veg", difficulty: "Medium", description: "Soya chaap seared on tawa with smoky masala.", imageKeyword: "tawa-soya-chaap", tags: ["quick", "festive"], coreIngredient: "Soya chaap" },
  { title: "Bhaji Cone", prepTime: 14, calories: 250, dietType: "Veg", difficulty: "Easy", description: "Crunchy onion fritters served in cone with chutney.", imageKeyword: "bhaji-cone", tags: ["under20", "quick"], coreIngredient: "Pyaaz" },
  { title: "Sabudana Vada Chaat", prepTime: 23, calories: 330, dietType: "Veg", difficulty: "Medium", description: "Crisp sabudana vada topped with curd and chutneys.", imageKeyword: "sabudana-vada-chaat", tags: ["quick", "festive"], coreIngredient: "Sabudana" },
  { title: "Khaman Chaat", prepTime: 17, calories: 280, dietType: "Veg", difficulty: "Easy", description: "Soft khaman dressed up as chatpata street chaat.", imageKeyword: "khaman-chaat", tags: ["under20", "kids"], coreIngredient: "Khaman" },
  { title: "Aloo Laccha Tokri Chaat", prepTime: 28, calories: 350, dietType: "Veg", difficulty: "Hard", description: "Crisp potato basket filled with spicy chaat toppings.", imageKeyword: "aloo-tokri-chaat", tags: ["festive", "kids"], coreIngredient: "Aloo" },
  { title: "Rabdi Jalebi Cup", prepTime: 32, calories: 430, dietType: "Veg", difficulty: "Medium", description: "Warm jalebi topped with chilled saffron rabdi.", imageKeyword: "rabdi-jalebi", tags: ["festive", "kids"], coreIngredient: "Jalebi" },
  { title: "Malpua Rabdi Plate", prepTime: 36, calories: 450, dietType: "Veg", difficulty: "Medium", description: "Fried malpua pancakes served with rich cardamom rabdi.", imageKeyword: "malpua-rabdi", tags: ["festive", "kids"], coreIngredient: "Malpua" },
];

export const STREET_BATCH2_RECIPES: RecipeCatalogEntry[] = STREET_BATCH2_SEEDS.map((seed, index) => ({
  id: `street-${index + 31}`,
  kitchenStyleId: "street",
  ...(seed.kitchenStyleIds ? { kitchenStyleIds: seed.kitchenStyleIds } : {}),
  title: seed.title,
  prepTime: seed.prepTime,
  calories: seed.calories,
  region: "West",
  dietType: seed.dietType,
  difficulty: seed.difficulty,
  description: seed.description,
  imageKeyword: seed.imageKeyword,
  tags: seed.tags,
  ingredients: buildIngredients(seed.coreIngredient, seed.dietType),
  steps: buildSteps(seed.title),
}));
