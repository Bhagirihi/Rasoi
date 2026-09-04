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
    { name: "Hari mirch", isStaple: true },
    { name: "Masala", isStaple: true },
  ];

  if (dietType === "Egg") {
    ingredients[0] = { name: "Anda", isStaple: false };
  }

  return ingredients;
}

function buildSteps(title: string): string[] {
  return [
    `Prepare and chop ingredients for ${title}.`,
    "Cook the base tempering until aromatic and balanced.",
    `Add the main components and cook on medium heat until the dish comes together.`,
    "Finish with garnish and serve hot.",
  ];
}

const GUJARATI_BATCH2_SEEDS: RecipeSeed[] = [
  { title: "Khandvi", prepTime: 32, calories: 250, dietType: "Veg", difficulty: "Medium", description: "Soft gram flour rolls with tempered mustard and curry leaves.", imageKeyword: "khandvi", tags: ["kids", "quick"], coreIngredient: "Besan" },
  { title: "Gujarati Dal", prepTime: 34, calories: 280, dietType: "Veg", difficulty: "Easy", description: "Sweet-spicy lentil dal with peanuts and kokum for a classic Gujarati meal.", imageKeyword: "gujarati-dal", tags: ["leftover", "quick"], coreIngredient: "Toor dal" },
  { title: "Methi na Gota", prepTime: 26, calories: 320, dietType: "Veg", difficulty: "Easy", description: "Fenugreek fritters that are fluffy inside and crisp outside.", imageKeyword: "methi-gota", tags: ["quick", "festive"], coreIngredient: "Methi" },
  { title: "Sev Usal", prepTime: 30, calories: 360, dietType: "Veg", difficulty: "Medium", description: "Spiced peas curry finished with crunchy sev and onions.", imageKeyword: "sev-usal", tags: ["quick", "kids"], coreIngredient: "Safed matar" },
  { title: "Bajri no Vada", prepTime: 35, calories: 340, dietType: "Veg", difficulty: "Medium", description: "Pearl millet patties pan-fried with ginger and green chilli.", imageKeyword: "bajri-vada", tags: ["festive", "leftover"], coreIngredient: "Bajra atta" },
  { title: "Chorafali", prepTime: 40, calories: 380, dietType: "Veg", difficulty: "Hard", description: "Crisp festive strips made with urad and gram flour dough.", imageKeyword: "chorafali", tags: ["festive", "kids"], coreIngredient: "Urad dal flour" },
  { title: "Farsi Puri", prepTime: 36, calories: 390, dietType: "Veg", difficulty: "Medium", description: "Layered crunchy puris flavored with pepper and ajwain.", imageKeyword: "farsi-puri", tags: ["festive", "quick"], coreIngredient: "Maida" },
  { title: "Khajli", prepTime: 42, calories: 410, dietType: "Veg", difficulty: "Hard", description: "Deep-fried flaky spirals enjoyed during festive snack platters.", imageKeyword: "khajli", tags: ["festive", "kids"], coreIngredient: "Maida" },
  { title: "Gol Papdi", prepTime: 20, calories: 300, dietType: "Veg", difficulty: "Easy", description: "Whole wheat jaggery fudge with rich ghee aroma.", imageKeyword: "gol-papdi", tags: ["under20", "kids"], coreIngredient: "Gahu atta" },
  { title: "Kopra Pak", prepTime: 28, calories: 330, dietType: "Veg", difficulty: "Easy", description: "Coconut fudge cooked with milk and cardamom.", imageKeyword: "kopra-pak", tags: ["festive", "kids"], coreIngredient: "Nariyal" },
  { title: "Sukhdi", prepTime: 18, calories: 290, dietType: "Veg", difficulty: "Easy", description: "Quick jaggery-wheat squares made in one pan.", imageKeyword: "sukhdi", tags: ["under20", "kids"], coreIngredient: "Gahu atta" },
  { title: "Kansar", prepTime: 22, calories: 310, dietType: "Veg", difficulty: "Easy", description: "Steamed wheat crumble sweetened with jaggery and ghee.", imageKeyword: "kansar", tags: ["quick", "festive"], coreIngredient: "Coarse wheat flour" },
  { title: "Mohanthal", prepTime: 45, calories: 420, dietType: "Veg", difficulty: "Hard", description: "Rich besan fudge slow-cooked with ghee and saffron.", imageKeyword: "mohanthal", tags: ["festive", "kids"], coreIngredient: "Besan" },
  { title: "Dudhpak", prepTime: 35, calories: 320, dietType: "Veg", difficulty: "Medium", description: "Cardamom saffron milk pudding with rice and nuts.", imageKeyword: "dudhpak", tags: ["festive", "kids"], coreIngredient: "Doodh" },
  { title: "Ghughra", prepTime: 50, calories: 430, dietType: "Veg", difficulty: "Hard", description: "Stuffed festive pastry with coconut and dry fruit filling.", imageKeyword: "ghughra", tags: ["festive", "kids"], coreIngredient: "Maida" },
  { title: "Ponk Bhel", prepTime: 16, calories: 240, dietType: "Veg", difficulty: "Easy", description: "Tender sorghum kernels tossed in spicy-surti bhel style.", imageKeyword: "ponk-bhel", tags: ["under20", "quick"], coreIngredient: "Ponk" },
  { title: "Tuver Lilva Pulao", prepTime: 32, calories: 350, dietType: "Veg", difficulty: "Medium", description: "Seasonal pigeon peas pulao with whole spices and herbs.", imageKeyword: "lilva-pulao", tags: ["leftover", "festive"], coreIngredient: "Lilva" },
  { title: "Papdi no Lot", prepTime: 24, calories: 270, dietType: "Veg", difficulty: "Easy", description: "Steamed broad bean flour mash with garlic tempering.", imageKeyword: "papdi-no-lot", tags: ["quick", "leftover"], coreIngredient: "Papdi flour" },
  { title: "Surti Papdi Lilva Shaak", prepTime: 34, calories: 300, dietType: "Veg", difficulty: "Medium", description: "Winter vegetable medley cooked with mild Gujarati masala.", imageKeyword: "papdi-lilva-shaak", tags: ["festive", "leftover"], coreIngredient: "Surti papdi" },
  { title: "Kobi Muthia", prepTime: 30, calories: 280, dietType: "Veg", difficulty: "Medium", description: "Steamed cabbage dumplings tempered with sesame and mustard.", imageKeyword: "kobi-muthia", tags: ["kids", "leftover"], coreIngredient: "Kobi" },
  { title: "Cabbage Sambharo", prepTime: 15, calories: 170, dietType: "Veg", difficulty: "Easy", description: "Quick stir-fried cabbage with sesame and lemon.", imageKeyword: "cabbage-sambharo", tags: ["under20", "quick"], coreIngredient: "Patta gobhi" },
  { title: "Bateta nu Shaak", prepTime: 22, calories: 260, dietType: "Veg", difficulty: "Easy", description: "Light potato curry often paired with puri and farsan.", imageKeyword: "bateta-shaak", tags: ["quick", "kids"], coreIngredient: "Aloo" },
  { title: "Chhundo Thepla Roll", prepTime: 18, calories: 290, dietType: "Veg", difficulty: "Easy", description: "Leftover thepla rolled with sweet mango chhundo and masala.", imageKeyword: "thepla-roll", tags: ["leftover", "under20"], coreIngredient: "Thepla" },
  { title: "Dabeli", prepTime: 25, calories: 360, dietType: "Veg", difficulty: "Medium", description: "Kutchi pav snack with spicy potato, chutneys, and peanuts.", imageKeyword: "dabeli", tags: ["quick", "kids"], coreIngredient: "Pav", kitchenStyleIds: ["gujarati", "street"] },
  { title: "Kutchi Kadhi", prepTime: 26, calories: 240, dietType: "Veg", difficulty: "Easy", description: "Light yogurt-based kadhi with ginger and curry leaf notes.", imageKeyword: "kutchi-kadhi", tags: ["quick", "leftover"], coreIngredient: "Dahi" },
  { title: "Khaman Handvo", prepTime: 40, calories: 330, dietType: "Veg", difficulty: "Medium", description: "Savory lentil cake with crisp top and soft interior.", imageKeyword: "khaman-handvo", tags: ["festive", "leftover"], coreIngredient: "Mixed dal batter" },
  { title: "Tuver Dal ni Khichdi", prepTime: 28, calories: 320, dietType: "Veg", difficulty: "Easy", description: "Comfort rice-lentil one-pot with mild Gujarati spicing.", imageKeyword: "tuver-khichdi", tags: ["leftover", "quick"], coreIngredient: "Tuver dal" },
  { title: "Ringan no Olo", prepTime: 27, calories: 250, dietType: "Veg", difficulty: "Medium", description: "Smoky mashed eggplant cooked with garlic and spices.", imageKeyword: "ringan-olo", tags: ["quick", "leftover"], coreIngredient: "Ringan" },
  { title: "Surti Locho", prepTime: 38, calories: 310, dietType: "Veg", difficulty: "Medium", description: "Steamed gram-lentil batter snack topped with sev and chutney.", imageKeyword: "locho", tags: ["kids", "festive"], coreIngredient: "Chana dal", kitchenStyleIds: ["gujarati", "street"] },
  { title: "Khichu", prepTime: 19, calories: 220, dietType: "Veg", difficulty: "Easy", description: "Soft rice flour dough snack with chilli oil drizzle.", imageKeyword: "khichu", tags: ["under20", "quick"], coreIngredient: "Rice flour" },
  { title: "Rajgara no Sheero", prepTime: 20, calories: 280, dietType: "Veg", difficulty: "Easy", description: "Amaranth flour halwa cooked in ghee and milk.", imageKeyword: "rajgara-sheero", tags: ["under20", "festive"], coreIngredient: "Rajgira atta" },
  { title: "Dudhi na Kofta", prepTime: 38, calories: 340, dietType: "Veg", difficulty: "Medium", description: "Bottle gourd dumplings simmered in tomato-cashew gravy.", imageKeyword: "dudhi-kofta", tags: ["festive", "kids"], coreIngredient: "Dudhi" },
  { title: "Bharela Tameta", prepTime: 30, calories: 260, dietType: "Veg", difficulty: "Medium", description: "Stuffed tomatoes with peanut-coconut masala cooked gently.", imageKeyword: "bharela-tameta", tags: ["quick", "festive"], coreIngredient: "Tamatar" },
  { title: "Kela Methi nu Shaak", prepTime: 24, calories: 270, dietType: "Veg", difficulty: "Easy", description: "Raw banana and fenugreek curry with sweet-spicy Gujarati balance.", imageKeyword: "kela-methi-shaak", tags: ["quick", "leftover"], coreIngredient: "Kaccha kela" },
  { title: "Vaghareli Rotli", prepTime: 15, calories: 260, dietType: "Veg", difficulty: "Easy", description: "Leftover rotli strips tossed in onion and masala tempering.", imageKeyword: "vaghareli-rotli", tags: ["leftover", "under20"], coreIngredient: "Rotli" },
  { title: "Masala Bhakhri", prepTime: 22, calories: 300, dietType: "Veg", difficulty: "Easy", description: "Spiced whole wheat flatbread roasted till crisp.", imageKeyword: "masala-bhakhri", tags: ["quick", "kids"], coreIngredient: "Gahu atta" },
  { title: "Suki Bhajiya Marcha", prepTime: 17, calories: 190, dietType: "Veg", difficulty: "Easy", description: "Fried green chillies tossed in dry garlic masala.", imageKeyword: "bhajiya-marcha", tags: ["under20", "quick"], coreIngredient: "Bhavnagri mirch" },
  { title: "Makai no Chevdo", prepTime: 23, calories: 300, dietType: "Veg", difficulty: "Easy", description: "Crunchy corn flake mix with curry leaves and peanuts.", imageKeyword: "makai-chevdo", tags: ["kids", "quick"], coreIngredient: "Makai poha" },
  { title: "Ghau no Lapsi", prepTime: 29, calories: 330, dietType: "Veg", difficulty: "Medium", description: "Broken wheat sweet cooked in ghee and jaggery syrup.", imageKeyword: "lapsi", tags: ["festive", "kids"], coreIngredient: "Fada" },
  { title: "Keri no Ras ane Puri", prepTime: 35, calories: 380, dietType: "Veg", difficulty: "Medium", description: "Mango pulp served with soft fried puris in summer style.", imageKeyword: "keri-ras-puri", tags: ["festive", "kids"], coreIngredient: "Keri" },
  { title: "Kachariyu", prepTime: 18, calories: 260, dietType: "Veg", difficulty: "Easy", description: "Winter laddoo mix of sesame, peanuts, and jaggery.", imageKeyword: "kachariyu", tags: ["under20", "festive"], coreIngredient: "Til" },
  { title: "Kharek na Ladoo", prepTime: 22, calories: 290, dietType: "Veg", difficulty: "Easy", description: "Date and dry-fruit laddoos with warming spices.", imageKeyword: "kharek-ladoo", tags: ["quick", "kids"], coreIngredient: "Kharek" },
  { title: "Adadiya Pak", prepTime: 32, calories: 360, dietType: "Veg", difficulty: "Medium", description: "Traditional winter sweet made from urad flour and ghee.", imageKeyword: "adadiya-pak", tags: ["festive", "kids"], coreIngredient: "Urad flour" },
  { title: "Surti Ghari", prepTime: 55, calories: 460, dietType: "Veg", difficulty: "Hard", description: "Rich mawa-stuffed festive pastry from Surat.", imageKeyword: "ghari", tags: ["festive", "kids"], coreIngredient: "Mawa" },
  { title: "Bhusu", prepTime: 14, calories: 230, dietType: "Veg", difficulty: "Easy", description: "Crumbled khakhra snack mixed with oil and masala.", imageKeyword: "bhusu", tags: ["under20", "leftover"], coreIngredient: "Khakhra" },
  { title: "Tameta ni Sev", prepTime: 21, calories: 280, dietType: "Veg", difficulty: "Easy", description: "Tangy tomato curry topped with thick sev at serving.", imageKeyword: "tameta-sev", tags: ["quick", "kids"], coreIngredient: "Tamatar" },
  { title: "Methi Muthia Curry", prepTime: 33, calories: 320, dietType: "Veg", difficulty: "Medium", description: "Fenugreek dumplings simmered in mild yogurt gravy.", imageKeyword: "methi-muthia-curry", tags: ["leftover", "festive"], coreIngredient: "Methi" },
  { title: "Surti Anda Pattice", prepTime: 31, calories: 360, dietType: "Egg", difficulty: "Medium", description: "Spiced egg and potato patties served with chutney.", imageKeyword: "anda-pattice", tags: ["quick", "kids"], coreIngredient: "Anda", kitchenStyleIds: ["gujarati", "street"] },
  { title: "Kolmi Bateta nu Shaak", prepTime: 38, calories: 390, dietType: "Non-Veg", difficulty: "Medium", description: "Prawn-potato curry cooked with coastal Gujarati masala.", imageKeyword: "kolmi-shaak", tags: ["festive", "quick"], coreIngredient: "Kolmi" },
  { title: "Kheema Bateta nu Shaak", prepTime: 36, calories: 410, dietType: "Non-Veg", difficulty: "Hard", description: "Minced meat and potato curry with robust Kathiawadi notes.", imageKeyword: "kheema-bateta-shaak", tags: ["leftover", "festive"], coreIngredient: "Mutton kheema" },
];

export const GUJARATI_BATCH2_RECIPES: RecipeCatalogEntry[] = GUJARATI_BATCH2_SEEDS.map((seed, index) => ({
  id: `gujarati-${index + 31}`,
  kitchenStyleId: "gujarati",
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
