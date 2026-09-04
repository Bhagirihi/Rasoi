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
  "Haldi",
  "Til tel",
  "Nariyal tel",
  "Sambar pyaaz",
  "Pyaaz",
  "Adrak",
  "Lahsun",
  "Kadi patta",
  "Kali mirch",
  "Saunf",
  "Jeera",
  "Tamatar",
  "Dahi",
  "Rai",
  "Methi dana",
  "Sukhi lal mirch",
  "Nimbu ras",
  "Dhania patta",
  "Pudina",
]);

function buildSteps(title: string, dietType: RecipeCatalogEntry["dietType"]): string[] {
  const coreLine =
    dietType === "Veg"
      ? "Roast whole spices, cook vegetables on medium heat, and keep the masala bold."
      : dietType === "Egg"
        ? "Cook shallot-spice base first, then add eggs and finish quickly."
        : "Sear the protein in hot oil, then simmer with Chettinad masala till aromatic.";

  return [
    `Prepare ingredients for ${title} and grind the required spice mix.`,
    coreLine,
    "Adjust salt and consistency, then cook until oil starts releasing at the edges.",
    "Finish with curry leaves and serve hot with rice, dosa, or parotta.",
  ];
}

const CHETTINAD_BATCH2_SEEDS: Batch2Seed[] = [
  { number: 31, title: "Kozhi Puli Milagu Kuzhambu", prepTime: 38, calories: 410, dietType: "Non-Veg", difficulty: "Medium", description: "Chicken in tamarind-pepper gravy with a classic Chettinad punch.", imageKeyword: "kozhi-puli-milagu-kuzhambu", tags: ["quick", "festive"], ingredients: ["Chicken", "Imli pulp", "Kali mirch", "Sambar pyaaz", "Lahsun", "Nariyal tel", "Kadi patta"] },
  { number: 32, title: "Eral Thokku Seeraga", prepTime: 30, calories: 345, dietType: "Non-Veg", difficulty: "Easy", description: "Prawn thokku with cumin and curry leaves for fast weeknight meals.", imageKeyword: "eral-thokku-seeraga", tags: ["quick", "leftover"], ingredients: ["Prawns", "Jeera", "Tamatar", "Sambar pyaaz", "Lahsun", "Nariyal tel", "Namak"] },
  { number: 33, title: "Chettinad Vazhakkai Chops", prepTime: 26, calories: 255, dietType: "Veg", difficulty: "Easy", description: "Raw banana chops tossed in dry spice and curry leaf tempering.", imageKeyword: "chettinad-vazhakkai-chops", tags: ["quick", "kids"], ingredients: ["Raw banana", "Kali mirch", "Saunf", "Rai", "Kadi patta", "Til tel", "Namak"] },
  { number: 34, title: "Kollu Milagu Masiyal", prepTime: 24, calories: 230, dietType: "Veg", difficulty: "Easy", description: "Horse gram and pepper mash served warm as a rustic side.", imageKeyword: "kollu-milagu-masiyal", tags: ["quick", "under20"], ingredients: ["Kollu dal", "Kali mirch", "Jeera", "Lahsun", "Til tel", "Namak"] },
  { number: 35, title: "Muttai Kara Kuzhambu", prepTime: 25, calories: 275, dietType: "Egg", difficulty: "Easy", description: "Boiled eggs in fiery Chettinad onion-tamarind kuzhambu.", imageKeyword: "muttai-kara-kuzhambu", tags: ["quick", "kids"], ingredients: ["Anda", "Imli pulp", "Sambar pyaaz", "Kali mirch", "Kadi patta", "Til tel", "Namak"] },
  { number: 36, title: "Nandu Poondu Varuval", prepTime: 41, calories: 395, dietType: "Non-Veg", difficulty: "Hard", description: "Crab roast with garlic-heavy masala and black pepper heat.", imageKeyword: "nandu-poondu-varuval", tags: ["festive", "quick"], ingredients: ["Crab", "Lahsun", "Kali mirch", "Sambar pyaaz", "Kadi patta", "Nariyal tel", "Namak"] },
  { number: 37, title: "Kathirikai Milagu Roast", prepTime: 23, calories: 220, dietType: "Veg", difficulty: "Easy", description: "Brinjal roast with cracked pepper and curry leaves.", imageKeyword: "kathirikai-milagu-roast", tags: ["quick", "under20"], ingredients: ["Baingan", "Kali mirch", "Rai", "Kadi patta", "Til tel", "Namak"] },
  { number: 38, title: "Kambu Kozhukattai Kurma", prepTime: 34, calories: 300, dietType: "Veg", difficulty: "Medium", description: "Pearl millet dumplings in spicy coconut kurma.", imageKeyword: "kambu-kozhukattai-kurma", tags: ["leftover", "kids"], ingredients: ["Kambu flour", "Nariyal", "Saunf", "Sambar pyaaz", "Kadi patta", "Nariyal tel", "Namak"] },
  { number: 39, title: "Seeraga Samba Mutton Choru", prepTime: 46, calories: 470, dietType: "Non-Veg", difficulty: "Hard", description: "Chettinad mutton rice with seeraga samba and roasted masala.", imageKeyword: "seeraga-samba-mutton-choru", tags: ["festive", "leftover"], ingredients: ["Mutton", "Seeraga samba rice", "Sambar pyaaz", "Adrak", "Lahsun", "Nariyal tel", "Pudina"] },
  { number: 40, title: "Karuveppilai Paneer Pepper Fry", prepTime: 22, calories: 285, dietType: "Veg", difficulty: "Easy", description: "Paneer pepper fry loaded with fresh curry leaf flavor.", imageKeyword: "karuveppilai-paneer-pepper-fry", tags: ["quick", "kids"], ingredients: ["Paneer", "Kali mirch", "Kadi patta", "Sambar pyaaz", "Nariyal tel", "Namak"] },
  { number: 41, title: "Murungakkai Mutton Soup", prepTime: 39, calories: 360, dietType: "Non-Veg", difficulty: "Medium", description: "Drumstick and mutton broth with pepper-cumin warmth.", imageKeyword: "murungakkai-mutton-soup", tags: ["quick", "leftover"], ingredients: ["Mutton", "Drumstick", "Kali mirch", "Jeera", "Lahsun", "Nariyal tel", "Namak"] },
  { number: 42, title: "Kadalai Urundai Kuzhambu", prepTime: 33, calories: 295, dietType: "Veg", difficulty: "Medium", description: "Chickpea dumplings simmered in tangy Chettinad kuzhambu.", imageKeyword: "kadalai-urundai-kuzhambu", tags: ["leftover", "kids"], ingredients: ["Chana", "Imli pulp", "Sambar pyaaz", "Kali mirch", "Rai", "Til tel", "Namak"] },
  { number: 43, title: "Pacha Milagai Chicken Roast", prepTime: 35, calories: 405, dietType: "Non-Veg", difficulty: "Medium", description: "Green-chilli chicken roast with shallots and curry leaves.", imageKeyword: "pacha-milagai-chicken-roast", tags: ["quick", "festive"], ingredients: ["Chicken", "Hari mirch", "Sambar pyaaz", "Lahsun", "Kadi patta", "Nariyal tel", "Namak"] },
  { number: 44, title: "Vazhaipoo Kozhi Cutlet", prepTime: 37, calories: 350, dietType: "Non-Veg", difficulty: "Medium", description: "Banana flower and chicken patties with pepper-spice crust.", imageKeyword: "vazhaipoo-kozhi-cutlet", tags: ["kids", "festive"], ingredients: ["Chicken mince", "Vazhaipoo", "Kali mirch", "Adrak", "Nariyal tel", "Namak"] },
  { number: 45, title: "Thakkali Milagu Rasam", prepTime: 16, calories: 145, dietType: "Veg", difficulty: "Easy", description: "Tomato-pepper rasam with garlic and curry leaves.", imageKeyword: "thakkali-milagu-rasam", tags: ["under20", "quick"], ingredients: ["Tamatar", "Kali mirch", "Jeera", "Lahsun", "Kadi patta", "Rai", "Namak"] },
  { number: 46, title: "Poondu Era Puli Curry", prepTime: 31, calories: 335, dietType: "Non-Veg", difficulty: "Medium", description: "Prawns in tamarind garlic curry with deep Chettinad spice.", imageKeyword: "poondu-era-puli-curry", tags: ["quick", "festive"], ingredients: ["Prawns", "Imli pulp", "Lahsun", "Sambar pyaaz", "Kadi patta", "Nariyal tel", "Namak"] },
  { number: 47, title: "Kola Urundai Pepper Masala", prepTime: 44, calories: 455, dietType: "Non-Veg", difficulty: "Hard", description: "Mutton kola balls in thick peppery Chettinad masala.", imageKeyword: "kola-urundai-pepper-masala", tags: ["festive", "leftover"], ingredients: ["Mutton keema", "Kali mirch", "Saunf", "Sambar pyaaz", "Lahsun", "Nariyal tel", "Namak"] },
  { number: 48, title: "Cabbage Chettinad Poriyal", prepTime: 21, calories: 200, dietType: "Veg", difficulty: "Easy", description: "Cabbage stir-fry with coconut, pepper, and curry leaves.", imageKeyword: "cabbage-chettinad-poriyal", tags: ["quick", "under20"], ingredients: ["Patta gobhi", "Nariyal", "Kali mirch", "Rai", "Kadi patta", "Til tel", "Namak"] },
  { number: 49, title: "Muttai Kari Dosa", prepTime: 19, calories: 295, dietType: "Egg", difficulty: "Easy", description: "Dosa topped with spiced egg curry crumble and curry leaves.", imageKeyword: "muttai-kari-dosa", tags: ["under20", "quick"], ingredients: ["Dosa batter", "Anda", "Sambar pyaaz", "Kali mirch", "Kadi patta", "Til tel", "Namak"] },
  { number: 50, title: "Nethili Podi Fry", prepTime: 20, calories: 305, dietType: "Non-Veg", difficulty: "Easy", description: "Anchovies coated with podi and pan-fried till crisp.", imageKeyword: "nethili-podi-fry", tags: ["quick", "under20"], ingredients: ["Nethili fish", "Idli podi", "Nimbu ras", "Nariyal tel", "Namak"] },
  { number: 51, title: "Chettinad Kaikari Kurma", prepTime: 29, calories: 280, dietType: "Veg", difficulty: "Easy", description: "Mixed vegetable kurma with roasted fennel-coconut paste.", imageKeyword: "chettinad-kaikari-kurma", tags: ["quick", "kids"], ingredients: ["Mixed vegetables", "Nariyal", "Saunf", "Sambar pyaaz", "Kadi patta", "Nariyal tel", "Namak"] },
  { number: 52, title: "Karaikudi Fish Kuzhambu", prepTime: 36, calories: 350, dietType: "Non-Veg", difficulty: "Medium", description: "Tangy fish curry in Karaikudi style with pepper and tamarind.", imageKeyword: "karaikudi-fish-kuzhambu", tags: ["quick", "leftover"], ingredients: ["Fish", "Imli pulp", "Sambar pyaaz", "Kali mirch", "Kadi patta", "Til tel", "Namak"] },
  { number: 53, title: "Uppu Kari Kozhi", prepTime: 34, calories: 395, dietType: "Non-Veg", difficulty: "Medium", description: "Dry salted chicken roast with shallots and black pepper.", imageKeyword: "uppu-kari-kozhi", tags: ["quick", "festive"], ingredients: ["Chicken", "Sambar pyaaz", "Kali mirch", "Lahsun", "Kadi patta", "Nariyal tel", "Namak"] },
  { number: 54, title: "Milagu Jeera Prawn Soup", prepTime: 24, calories: 260, dietType: "Non-Veg", difficulty: "Easy", description: "Prawn broth with cumin-pepper heat and garlic aroma.", imageKeyword: "milagu-jeera-prawn-soup", tags: ["quick", "kids"], ingredients: ["Prawns", "Kali mirch", "Jeera", "Lahsun", "Kadi patta", "Nariyal tel", "Namak"] },
  { number: 55, title: "Keerai Kadalai Masala", prepTime: 27, calories: 250, dietType: "Veg", difficulty: "Easy", description: "Leafy greens and chickpeas in thick Chettinad masala.", imageKeyword: "keerai-kadalai-masala", tags: ["quick", "leftover"], ingredients: ["Keerai", "Chana", "Sambar pyaaz", "Kali mirch", "Kadi patta", "Til tel", "Namak"] },
  { number: 56, title: "Thengai Mutton Stew", prepTime: 45, calories: 440, dietType: "Non-Veg", difficulty: "Hard", description: "Mutton in coconut-based stew with robust Chettinad spice.", imageKeyword: "thengai-mutton-stew", tags: ["festive", "leftover"], ingredients: ["Mutton", "Nariyal doodh", "Sambar pyaaz", "Saunf", "Kali mirch", "Nariyal tel", "Namak"] },
  { number: 57, title: "Sambar Vengayam Egg Roast", prepTime: 23, calories: 265, dietType: "Egg", difficulty: "Easy", description: "Egg roast with shallot-heavy masala and curry leaf finish.", imageKeyword: "sambar-vengayam-egg-roast", tags: ["quick", "kids"], ingredients: ["Anda", "Sambar pyaaz", "Kali mirch", "Kadi patta", "Nariyal tel", "Namak"] },
  { number: 58, title: "Chettinad Kaalan Chops", prepTime: 28, calories: 240, dietType: "Veg", difficulty: "Easy", description: "Mushroom chops in pepper-fennel spice roast.", imageKeyword: "chettinad-kaalan-chops", tags: ["quick", "kids"], ingredients: ["Mushroom", "Kali mirch", "Saunf", "Sambar pyaaz", "Kadi patta", "Til tel", "Namak"] },
  { number: 59, title: "Seeraga Samba Lemon Rice", prepTime: 18, calories: 225, dietType: "Veg", difficulty: "Easy", description: "Tangy rice with seeraga samba grains and tempered spices.", imageKeyword: "seeraga-samba-lemon-rice", tags: ["under20", "quick"], ingredients: ["Seeraga samba rice", "Nimbu ras", "Rai", "Kadi patta", "Til tel", "Namak"] },
  { number: 60, title: "Chicken Kothamalli Chukka", prepTime: 33, calories: 390, dietType: "Non-Veg", difficulty: "Medium", description: "Dry chicken roast with coriander and black pepper.", imageKeyword: "chicken-kothamalli-chukka", tags: ["quick", "festive"], ingredients: ["Chicken", "Dhania patta", "Kali mirch", "Sambar pyaaz", "Lahsun", "Nariyal tel", "Namak"] },
  { number: 61, title: "Puli Inji Chettinad", prepTime: 20, calories: 180, dietType: "Veg", difficulty: "Easy", description: "Tamarind ginger relish with spice-heavy Chettinad profile.", imageKeyword: "puli-inji-chettinad", tags: ["under20", "quick"], ingredients: ["Adrak", "Imli pulp", "Gud", "Rai", "Kadi patta", "Til tel", "Namak"] },
  { number: 62, title: "Mutton Chinna Vengayam Thokku", prepTime: 42, calories: 435, dietType: "Non-Veg", difficulty: "Hard", description: "Mutton thokku cooked with pearl onions and peppery masala.", imageKeyword: "mutton-chinna-vengayam-thokku", tags: ["festive", "leftover"], ingredients: ["Mutton", "Sambar pyaaz", "Kali mirch", "Lahsun", "Kadi patta", "Nariyal tel", "Namak"] },
  { number: 63, title: "Paneer Milagai Masala", prepTime: 26, calories: 295, dietType: "Veg", difficulty: "Easy", description: "Paneer in green chilli masala with curry leaf tempering.", imageKeyword: "paneer-milagai-masala", tags: ["quick", "kids"], ingredients: ["Paneer", "Hari mirch", "Sambar pyaaz", "Kadi patta", "Nariyal tel", "Namak"] },
  { number: 64, title: "Karupatti Paal Paniyaram", prepTime: 30, calories: 275, dietType: "Veg", difficulty: "Medium", description: "Palm jaggery milk paniyaram inspired by Chettinad sweets.", imageKeyword: "karupatti-paal-paniyaram", tags: ["festive", "kids"], ingredients: ["Maida", "Karupatti", "Doodh", "Ghee", "Elaichi"] },
  { number: 65, title: "Vazhakkai Muttai Podimas", prepTime: 22, calories: 270, dietType: "Egg", difficulty: "Easy", description: "Raw banana and scrambled egg stir-fry with pepper.", imageKeyword: "vazhakkai-muttai-podimas", tags: ["quick", "kids"], ingredients: ["Raw banana", "Anda", "Kali mirch", "Sambar pyaaz", "Kadi patta", "Til tel", "Namak"] },
  { number: 66, title: "Eral Kuzhambu Kari Patta", prepTime: 32, calories: 340, dietType: "Non-Veg", difficulty: "Medium", description: "Prawn tamarind curry loaded with fresh curry leaves.", imageKeyword: "eral-kuzhambu-kari-patta", tags: ["quick", "festive"], ingredients: ["Prawns", "Imli pulp", "Kadi patta", "Sambar pyaaz", "Kali mirch", "Nariyal tel", "Namak"] },
  { number: 67, title: "Murungai Ilai Paruppu", prepTime: 25, calories: 225, dietType: "Veg", difficulty: "Easy", description: "Drumstick leaves and lentils in simple spiced mash.", imageKeyword: "murungai-ilai-paruppu", tags: ["quick", "leftover"], ingredients: ["Murungai ilai", "Toor dal", "Jeera", "Lahsun", "Til tel", "Namak"] },
  { number: 68, title: "Kaara Kollu Rasam", prepTime: 17, calories: 150, dietType: "Veg", difficulty: "Easy", description: "Spicy horse gram rasam with pepper, cumin, and garlic.", imageKeyword: "kaara-kollu-rasam", tags: ["under20", "quick"], ingredients: ["Kollu dal water", "Kali mirch", "Jeera", "Lahsun", "Rai", "Kadi patta", "Namak"] },
  { number: 69, title: "Chettinad South Coconut Adai", prepTime: 27, calories: 285, dietType: "Veg", difficulty: "Easy", description: "Lentil adai with coconut and pepper bridging Chettinad and South staples.", imageKeyword: "chettinad-south-coconut-adai", tags: ["quick", "kids"], ingredients: ["Adai batter", "Nariyal", "Kali mirch", "Kadi patta", "Til tel", "Namak"], kitchenStyleIds: ["chettinad", "south"] },
  { number: 70, title: "Nariyal Milagu Chicken", prepTime: 36, calories: 405, dietType: "Non-Veg", difficulty: "Medium", description: "Chicken roast with coconut, black pepper, and curry leaf aroma.", imageKeyword: "nariyal-milagu-chicken", tags: ["quick", "festive"], ingredients: ["Chicken", "Nariyal", "Kali mirch", "Sambar pyaaz", "Lahsun", "Nariyal tel", "Namak"] },
  { number: 71, title: "Kathirikai Kola Curry", prepTime: 40, calories: 365, dietType: "Non-Veg", difficulty: "Hard", description: "Brinjal curry with mutton kola balls in tamarind gravy.", imageKeyword: "kathirikai-kola-curry", tags: ["festive", "leftover"], ingredients: ["Mutton keema", "Baingan", "Imli pulp", "Sambar pyaaz", "Kali mirch", "Nariyal tel", "Namak"] },
  { number: 72, title: "Keema Paniyaram Masala", prepTime: 37, calories: 415, dietType: "Non-Veg", difficulty: "Medium", description: "Savory paniyaram tossed in spicy minced meat masala.", imageKeyword: "keema-paniyaram-masala", tags: ["festive", "quick"], ingredients: ["Mutton keema", "Paniyaram", "Sambar pyaaz", "Kali mirch", "Kadi patta", "Nariyal tel", "Namak"] },
  { number: 73, title: "Kambu Kozhi Kanji", prepTime: 34, calories: 350, dietType: "Non-Veg", difficulty: "Medium", description: "Pearl millet and chicken porridge with peppery Chettinad finish.", imageKeyword: "kambu-kozhi-kanji", tags: ["leftover", "kids"], ingredients: ["Kambu", "Chicken", "Kali mirch", "Jeera", "Lahsun", "Nariyal tel", "Namak"] },
  { number: 74, title: "Pepper Crab Kuzhambu", prepTime: 42, calories: 400, dietType: "Non-Veg", difficulty: "Hard", description: "Crab in fiery pepper-tamarind kuzhambu with bold coastal flavor.", imageKeyword: "pepper-crab-kuzhambu", tags: ["festive", "leftover"], ingredients: ["Crab", "Imli pulp", "Kali mirch", "Sambar pyaaz", "Kadi patta", "Nariyal tel", "Namak"] },
  { number: 75, title: "Chettinad Veg Pulao", prepTime: 28, calories: 305, dietType: "Veg", difficulty: "Easy", description: "Vegetable pulao with pepper-fennel roasted masala.", imageKeyword: "chettinad-veg-pulao", tags: ["quick", "kids"], ingredients: ["Chawal", "Mixed vegetables", "Saunf", "Kali mirch", "Ghee", "Namak"] },
  { number: 76, title: "Eggplant Seeraga Masala", prepTime: 24, calories: 235, dietType: "Veg", difficulty: "Easy", description: "Brinjal saute with cumin-rich Chettinad dry masala.", imageKeyword: "eggplant-seeraga-masala", tags: ["quick", "under20"], ingredients: ["Baingan", "Jeera", "Sambar pyaaz", "Kadi patta", "Til tel", "Namak"] },
  { number: 77, title: "Sukka Mutton Masiyal", prepTime: 43, calories: 445, dietType: "Non-Veg", difficulty: "Hard", description: "Dry mutton roast finished into coarse masiyal texture.", imageKeyword: "sukka-mutton-masiyal", tags: ["festive", "leftover"], ingredients: ["Mutton", "Kali mirch", "Saunf", "Sambar pyaaz", "Lahsun", "Nariyal tel", "Namak"] },
  { number: 78, title: "Prawn Thengai Roast", prepTime: 29, calories: 335, dietType: "Non-Veg", difficulty: "Medium", description: "Prawn roast with fresh coconut and cracked black pepper.", imageKeyword: "prawn-thengai-roast", tags: ["quick", "festive"], ingredients: ["Prawns", "Nariyal", "Kali mirch", "Sambar pyaaz", "Kadi patta", "Nariyal tel", "Namak"] },
  { number: 79, title: "Poondu Milagu Kuzhi Paniyaram", prepTime: 21, calories: 245, dietType: "Veg", difficulty: "Easy", description: "Garlic-pepper paniyaram with crisp edges and soft center.", imageKeyword: "poondu-milagu-kuzhi-paniyaram", tags: ["quick", "kids"], ingredients: ["Kuzhi paniyaram batter", "Lahsun", "Kali mirch", "Kadi patta", "Til tel", "Namak"] },
  { number: 80, title: "Karaikudi Tomato Rice", prepTime: 23, calories: 260, dietType: "Veg", difficulty: "Easy", description: "Tangy tomato rice in Karaikudi spice style for quick lunches.", imageKeyword: "karaikudi-tomato-rice", tags: ["quick", "leftover"], ingredients: ["Chawal", "Tamatar", "Sambar pyaaz", "Kadi patta", "Til tel", "Namak"] },
];

export const CHETTINAD_BATCH2_RECIPES: RecipeCatalogEntry[] = CHETTINAD_BATCH2_SEEDS.map((seed) => ({
  id: `chettinad-${seed.number}`,
  kitchenStyleId: "chettinad",
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
  ingredients: seed.ingredients.map((name) => ({ name, isStaple: STAPLES.has(name) })),
  steps: buildSteps(seed.title, seed.dietType),
}));
