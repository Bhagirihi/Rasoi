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
    { name: "Adrak", isStaple: true },
    { name: "Kadi patta", isStaple: true },
    { name: "Masala", isStaple: true },
  ];

  if (dietType === "Egg") {
    ingredients[0] = { name: "Anda", isStaple: false };
  }

  return ingredients;
}

function buildSteps(title: string): string[] {
  return [
    `Prep all ingredients needed for ${title}.`,
    "Cook the masala or batter base until aromatic.",
    `Add the main component and simmer or roast until cooked through.`,
    "Finish with garnish and serve hot with a side.",
  ];
}

const SOUTH_BATCH2_SEEDS: RecipeSeed[] = [
  { title: "Set Dosa", prepTime: 26, calories: 300, dietType: "Veg", difficulty: "Easy", description: "Soft fluffy dosa served in a stack with chutney.", imageKeyword: "set-dosa", tags: ["quick", "kids"], coreIngredient: "Dosa batter" },
  { title: "Benne Dosa", prepTime: 24, calories: 330, dietType: "Veg", difficulty: "Easy", description: "Buttery crisp dosa from Karnataka tiffin counters.", imageKeyword: "benne-dosa", tags: ["quick", "kids"], coreIngredient: "Dosa batter" },
  { title: "Podi Idli", prepTime: 18, calories: 260, dietType: "Veg", difficulty: "Easy", description: "Mini idlis tossed with ghee and spiced podi.", imageKeyword: "podi-idli", tags: ["under20", "kids"], coreIngredient: "Idli" },
  { title: "Thatte Idli", prepTime: 30, calories: 280, dietType: "Veg", difficulty: "Medium", description: "Plate-sized soft idli with mild fermented flavor.", imageKeyword: "thatte-idli", tags: ["quick", "leftover"], coreIngredient: "Idli batter" },
  { title: "Kanchipuram Idli", prepTime: 34, calories: 290, dietType: "Veg", difficulty: "Medium", description: "Spiced temple-style idli with pepper and cumin.", imageKeyword: "kanchipuram-idli", tags: ["festive", "kids"], coreIngredient: "Idli batter" },
  { title: "Ragi Dosa", prepTime: 22, calories: 240, dietType: "Veg", difficulty: "Easy", description: "Nutritious finger millet dosa with crisp edges.", imageKeyword: "ragi-dosa", tags: ["quick", "under20"], coreIngredient: "Ragi flour" },
  { title: "Adai", prepTime: 28, calories: 320, dietType: "Veg", difficulty: "Medium", description: "Protein-rich mixed lentil dosa with chilli and curry leaf.", imageKeyword: "adai", tags: ["quick", "leftover"], coreIngredient: "Mixed dal" },
  { title: "Keerai Masiyal", prepTime: 20, calories: 190, dietType: "Veg", difficulty: "Easy", description: "Mashed spinach greens tempered in simple south style.", imageKeyword: "keerai-masiyal", tags: ["under20", "quick"], coreIngredient: "Keerai" },
  { title: "Vatha Kuzhambu", prepTime: 30, calories: 250, dietType: "Veg", difficulty: "Medium", description: "Tangy tamarind gravy with sundakkai and spices.", imageKeyword: "vatha-kuzhambu", tags: ["leftover", "quick"], coreIngredient: "Imli" },
  { title: "Mor Kuzhambu", prepTime: 24, calories: 220, dietType: "Veg", difficulty: "Easy", description: "Yogurt-based gravy with coconut and cumin flavors.", imageKeyword: "mor-kuzhambu", tags: ["quick", "leftover"], coreIngredient: "Dahi" },
  { title: "Vendhaya Kuzhambu", prepTime: 26, calories: 230, dietType: "Veg", difficulty: "Medium", description: "Fenugreek-forward tamarind curry with deep south notes.", imageKeyword: "vendhaya-kuzhambu", tags: ["leftover", "quick"], coreIngredient: "Methi dana" },
  { title: "Paruppu Urundai Kuzhambu", prepTime: 40, calories: 340, dietType: "Veg", difficulty: "Hard", description: "Steamed lentil dumplings simmered in spicy gravy.", imageKeyword: "paruppu-urundai-kuzhambu", tags: ["festive", "leftover"], coreIngredient: "Chana dal" },
  { title: "Puli Inji", prepTime: 22, calories: 180, dietType: "Veg", difficulty: "Easy", description: "Ginger-tamarind relish balancing sweet, spicy, and sour.", imageKeyword: "puli-inji", tags: ["under20", "leftover"], coreIngredient: "Adrak" },
  { title: "Thayir Vadai", prepTime: 25, calories: 300, dietType: "Veg", difficulty: "Medium", description: "Soft lentil vadai soaked in seasoned curd.", imageKeyword: "thayir-vadai", tags: ["kids", "festive"], coreIngredient: "Urad dal vada" },
  { title: "Curd Semiya", prepTime: 17, calories: 250, dietType: "Veg", difficulty: "Easy", description: "Cooled vermicelli mixed with curd and tempering.", imageKeyword: "curd-semiya", tags: ["under20", "quick"], coreIngredient: "Semiya" },
  { title: "Coconut Sevai", prepTime: 19, calories: 260, dietType: "Veg", difficulty: "Easy", description: "Steamed rice sevai tossed with fresh coconut.", imageKeyword: "coconut-sevai", tags: ["under20", "quick"], coreIngredient: "Rice sevai" },
  { title: "Lemon Sevai", prepTime: 16, calories: 240, dietType: "Veg", difficulty: "Easy", description: "Tangy lemon rice-sevai with mustard and peanuts.", imageKeyword: "lemon-sevai", tags: ["under20", "quick"], coreIngredient: "Rice sevai" },
  { title: "Tamarind Sevai", prepTime: 20, calories: 250, dietType: "Veg", difficulty: "Easy", description: "Puliyodarai-style sevai with tamarind and spices.", imageKeyword: "tamarind-sevai", tags: ["quick", "leftover"], coreIngredient: "Rice sevai" },
  { title: "Kothamalli Sadam", prepTime: 18, calories: 270, dietType: "Veg", difficulty: "Easy", description: "Coriander rice with green masala and sesame aroma.", imageKeyword: "kothamalli-sadam", tags: ["under20", "leftover"], coreIngredient: "Cooked rice" },
  { title: "Ellu Sadam", prepTime: 20, calories: 280, dietType: "Veg", difficulty: "Easy", description: "Sesame rice mixed with roasted spice powder.", imageKeyword: "ellu-sadam", tags: ["quick", "leftover"], coreIngredient: "Cooked rice" },
  { title: "Akki Roti", prepTime: 24, calories: 300, dietType: "Veg", difficulty: "Medium", description: "Rustic rice flour flatbread with onion and herbs.", imageKeyword: "akki-roti", tags: ["quick", "kids"], coreIngredient: "Rice flour" },
  { title: "Mangalore Buns", prepTime: 35, calories: 340, dietType: "Veg", difficulty: "Medium", description: "Banana-fermented soft fried bread from coastal Karnataka.", imageKeyword: "mangalore-buns", tags: ["kids", "festive"], coreIngredient: "Maida" },
  { title: "Udupi Sambar", prepTime: 30, calories: 260, dietType: "Veg", difficulty: "Medium", description: "Balanced lentil stew with coconut and jaggery hints.", imageKeyword: "udupi-sambar", tags: ["leftover", "quick"], coreIngredient: "Toor dal" },
  { title: "Drumstick Sambar", prepTime: 28, calories: 250, dietType: "Veg", difficulty: "Easy", description: "Classic sambar featuring tender drumsticks and tamarind.", imageKeyword: "drumstick-sambar", tags: ["leftover", "quick"], coreIngredient: "Drumstick" },
  { title: "Beetroot Poriyal", prepTime: 18, calories: 200, dietType: "Veg", difficulty: "Easy", description: "Simple beetroot stir-fry with coconut and mustard.", imageKeyword: "beetroot-poriyal", tags: ["under20", "quick"], coreIngredient: "Beetroot" },
  { title: "Beans Paruppu Usili", prepTime: 32, calories: 300, dietType: "Veg", difficulty: "Medium", description: "French beans mixed with crumbled steamed lentil mixture.", imageKeyword: "beans-usili", tags: ["leftover", "festive"], coreIngredient: "Beans" },
  { title: "Chow Chow Kootu", prepTime: 24, calories: 230, dietType: "Veg", difficulty: "Easy", description: "Chayote and lentils cooked in coconut-cumin base.", imageKeyword: "chow-chow-kootu", tags: ["quick", "leftover"], coreIngredient: "Chow chow" },
  { title: "Poosanikai Kootu", prepTime: 25, calories: 240, dietType: "Veg", difficulty: "Easy", description: "Ash gourd kootu with moong dal and coconut paste.", imageKeyword: "poosanikai-kootu", tags: ["quick", "leftover"], coreIngredient: "Poosanikai" },
  { title: "Tomato Gotsu", prepTime: 19, calories: 210, dietType: "Veg", difficulty: "Easy", description: "Tangy tomato relish served with pongal or dosa.", imageKeyword: "tomato-gotsu", tags: ["under20", "quick"], coreIngredient: "Tamatar" },
  { title: "Brinjal Gotsu", prepTime: 23, calories: 230, dietType: "Veg", difficulty: "Medium", description: "Smoky brinjal-tamarind relish with tempered spices.", imageKeyword: "brinjal-gotsu", tags: ["quick", "leftover"], coreIngredient: "Baingan" },
  { title: "Onion Uttapam", prepTime: 20, calories: 290, dietType: "Veg", difficulty: "Easy", description: "Thick dosa topped with onions and green chillies.", imageKeyword: "onion-uttapam", tags: ["quick", "kids"], coreIngredient: "Dosa batter" },
  { title: "Egg Uttapam", prepTime: 21, calories: 320, dietType: "Egg", difficulty: "Easy", description: "Uttapam finished with beaten egg and pepper.", imageKeyword: "egg-uttapam", tags: ["quick", "kids"], coreIngredient: "Dosa batter" },
  { title: "Kalaki", prepTime: 12, calories: 260, dietType: "Egg", difficulty: "Easy", description: "Madurai-style soft scrambled eggs with pepper masala.", imageKeyword: "kalaki", tags: ["under20", "quick"], coreIngredient: "Anda" },
  { title: "Muttai Dosai", prepTime: 18, calories: 330, dietType: "Egg", difficulty: "Easy", description: "Crisp dosa topped with spicy egg spread.", imageKeyword: "muttai-dosai", tags: ["under20", "quick"], coreIngredient: "Dosa batter" },
  { title: "Chicken Chukka", prepTime: 34, calories: 420, dietType: "Non-Veg", difficulty: "Medium", description: "Dry roasted chicken in peppery Chettinad-style masala.", imageKeyword: "chicken-chukka", tags: ["festive", "quick"], coreIngredient: "Chicken", kitchenStyleIds: ["south", "chettinad"] },
  { title: "Nethili Fry", prepTime: 24, calories: 360, dietType: "Non-Veg", difficulty: "Easy", description: "Crispy anchovy fry with chilli and curry leaf.", imageKeyword: "nethili-fry", tags: ["quick", "kids"], coreIngredient: "Nethili" },
  { title: "Vanjaram Fry", prepTime: 27, calories: 390, dietType: "Non-Veg", difficulty: "Medium", description: "King fish steaks marinated and pan-fried south style.", imageKeyword: "vanjaram-fry", tags: ["quick", "festive"], coreIngredient: "Vanjaram" },
  { title: "Kozhi Varutharachathu", prepTime: 40, calories: 430, dietType: "Non-Veg", difficulty: "Hard", description: "Kerala-style roasted coconut chicken curry.", imageKeyword: "kozhi-varutharachathu", tags: ["festive", "leftover"], coreIngredient: "Chicken", kitchenStyleIds: ["south", "kerala"] },
  { title: "Prawn Thokku", prepTime: 30, calories: 410, dietType: "Non-Veg", difficulty: "Medium", description: "Spicy prawn masala reduced to thick tawa-style thokku.", imageKeyword: "prawn-thokku", tags: ["quick", "festive"], coreIngredient: "Prawn" },
  { title: "Crab Masala South Style", prepTime: 42, calories: 440, dietType: "Non-Veg", difficulty: "Hard", description: "Crab simmered in robust coastal south Indian masala.", imageKeyword: "crab-masala", tags: ["festive", "quick"], coreIngredient: "Crab" },
  { title: "Mutton Chops Fry", prepTime: 38, calories: 450, dietType: "Non-Veg", difficulty: "Hard", description: "Bone-in mutton chops roasted with pepper and fennel.", imageKeyword: "mutton-chops-fry", tags: ["festive", "leftover"], coreIngredient: "Mutton chops" },
  { title: "Kongunadu Pepper Chicken", prepTime: 33, calories: 420, dietType: "Non-Veg", difficulty: "Medium", description: "Black pepper forward dry chicken from Kongu region.", imageKeyword: "pepper-chicken", tags: ["quick", "festive"], coreIngredient: "Chicken" },
  { title: "Pallipalayam Chicken", prepTime: 36, calories: 430, dietType: "Non-Veg", difficulty: "Medium", description: "Dry red chilli coconut chicken with curry leaves.", imageKeyword: "pallipalayam-chicken", tags: ["festive", "quick"], coreIngredient: "Chicken" },
  { title: "Egg Korma South", prepTime: 26, calories: 350, dietType: "Egg", difficulty: "Medium", description: "Boiled eggs in coconut-cashew korma gravy.", imageKeyword: "egg-korma", tags: ["quick", "festive"], coreIngredient: "Anda", kitchenStyleIds: ["south", "hyderabadi"] },
  { title: "Kori Rotti", prepTime: 37, calories: 440, dietType: "Non-Veg", difficulty: "Hard", description: "Mangalorean chicken curry served with crisp rice rotti.", imageKeyword: "kori-rotti", tags: ["festive", "kids"], coreIngredient: "Chicken" },
  { title: "Mangalore Chicken Ghee Roast", prepTime: 39, calories: 460, dietType: "Non-Veg", difficulty: "Hard", description: "Fiery roasted chicken in ghee and byadgi chilli paste.", imageKeyword: "chicken-ghee-roast", tags: ["festive", "quick"], coreIngredient: "Chicken" },
  { title: "Kudal Curry", prepTime: 45, calories: 470, dietType: "Non-Veg", difficulty: "Hard", description: "South style spiced mutton intestine curry with coconut.", imageKeyword: "kudal-curry", tags: ["festive", "leftover"], coreIngredient: "Kudal" },
  { title: "Nei Appam", prepTime: 22, calories: 300, dietType: "Veg", difficulty: "Easy", description: "Ghee-fried jaggery banana appams with soft center.", imageKeyword: "nei-appam", tags: ["kids", "festive"], coreIngredient: "Rice flour" },
  { title: "Pesarattu", prepTime: 24, calories: 270, dietType: "Veg", difficulty: "Easy", description: "Green gram dosa with ginger and cumin flavor.", imageKeyword: "pesarattu", tags: ["quick", "leftover"], coreIngredient: "Moong dal" },
  { title: "Ragi Puttu", prepTime: 26, calories: 280, dietType: "Veg", difficulty: "Medium", description: "Steamed ragi-coconut cylinders served with banana.", imageKeyword: "ragi-puttu", tags: ["quick", "kids"], coreIngredient: "Ragi flour" },
];

export const SOUTH_BATCH2_RECIPES: RecipeCatalogEntry[] = SOUTH_BATCH2_SEEDS.map((seed, index) => ({
  id: `south-${index + 31}`,
  kitchenStyleId: "south",
  ...(seed.kitchenStyleIds ? { kitchenStyleIds: seed.kitchenStyleIds } : {}),
  title: seed.title,
  prepTime: seed.prepTime,
  calories: seed.calories,
  region: "South",
  dietType: seed.dietType,
  difficulty: seed.difficulty,
  description: seed.description,
  imageKeyword: seed.imageKeyword,
  tags: seed.tags,
  ingredients: buildIngredients(seed.coreIngredient, seed.dietType),
  steps: buildSteps(seed.title),
}));
