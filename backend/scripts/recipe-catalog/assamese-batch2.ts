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
  "Sarson tel",
  "Pyaaz",
  "Adrak",
  "Lahsun",
  "Hari mirch",
  "Dhania patta",
  "Jeera",
  "Kali mirch",
  "Dahi",
  "Nimbu ras",
  "Tej patta",
  "Hing",
  "Ghee",
  "Tamatar",
  "Chawal",
  "Gud",
  "Nariyal",
  "Panch phoron",
  "Rai",
]);

function buildSteps(title: string, dietType: RecipeCatalogEntry["dietType"]): string[] {
  const cookLine =
    dietType === "Veg"
      ? "Saute aromatics, add vegetables, and cook on medium heat till tender."
      : dietType === "Egg"
        ? "Cook the masala base first, then fold in eggs so the texture stays soft."
        : "Sear the protein first, then simmer gently with spices till fully cooked.";

  return [
    `Prep ingredients for ${title} and keep the spice mix ready.`,
    cookLine,
    "Adjust salt, add a splash of warm water if needed, and let flavors blend.",
    "Finish with fresh herbs and serve hot with steamed rice.",
  ];
}

const ASSAMESE_BATCH2_SEEDS: Batch2Seed[] = [
  { number: 31, title: "Kharoli Diya Borali", prepTime: 35, calories: 355, dietType: "Non-Veg", difficulty: "Medium", description: "Borali fish simmered in pungent kharoli paste for a sharp Assamese coastal profile.", imageKeyword: "kharoli-diya-borali", tags: ["quick", "leftover"], ingredients: ["Borali fish", "Kharoli paste", "Pyaaz", "Adrak", "Haldi", "Sarson tel", "Hari mirch"] },
  { number: 32, title: "Mati Dali Aru Kosu Xaak", prepTime: 29, calories: 265, dietType: "Veg", difficulty: "Easy", description: "Whole urad and colocasia greens cook into a comforting, earthy dal from Assamese homes.", imageKeyword: "mati-dali-kosu-xaak", tags: ["leftover", "kids"], ingredients: ["Sabut urad", "Kosu xaak", "Adrak", "Jeera", "Hing", "Ghee", "Namak"] },
  { number: 33, title: "Til Pora Bilahi Maas", prepTime: 33, calories: 340, dietType: "Non-Veg", difficulty: "Medium", description: "Toasted sesame and tomato bring nutty depth to this light Assamese fish curry.", imageKeyword: "til-pora-bilahi-maas", tags: ["quick", "festive"], ingredients: ["Rohu machh", "Til", "Tamatar", "Adrak", "Haldi", "Sarson tel", "Namak"] },
  { number: 34, title: "Hahor Logot Lai Xaak", prepTime: 47, calories: 435, dietType: "Non-Veg", difficulty: "Hard", description: "Duck and mustard greens are braised together for a rustic winter-style Assamese curry.", imageKeyword: "hahor-logot-lai-xaak", tags: ["festive", "leftover"], ingredients: ["Duck", "Lai xaak", "Pyaaz", "Adrak", "Lahsun", "Kali mirch", "Sarson tel"] },
  { number: 35, title: "Koni Posola Bhurta", prepTime: 20, calories: 230, dietType: "Egg", difficulty: "Easy", description: "Boiled eggs and banana stem mash with mustard oil make a quick Assamese side.", imageKeyword: "koni-posola-bhurta", tags: ["under20", "quick"], ingredients: ["Anda", "Banana stem", "Pyaaz", "Hari mirch", "Sarson tel", "Nimbu ras", "Namak"] },
  { number: 36, title: "Joha Saul Bhapa Pitha", prepTime: 31, calories: 255, dietType: "Veg", difficulty: "Medium", description: "Fragrant joha rice flour dumplings are steamed with coconut and jaggery filling.", imageKeyword: "joha-saul-bhapa-pitha", tags: ["festive", "kids"], ingredients: ["Joha rice flour", "Nariyal", "Gud", "Ghee", "Namak", "Pani"] },
  { number: 37, title: "Bhetki Khar Tenga", prepTime: 30, calories: 315, dietType: "Non-Veg", difficulty: "Medium", description: "Bhetki in alkaline khar and sour notes gives a clean, bright Assamese fish broth.", imageKeyword: "bhetki-khar-tenga", tags: ["quick", "leftover"], ingredients: ["Bhetki", "Khar water", "Ou tenga", "Adrak", "Haldi", "Sarson tel", "Namak"] },
  { number: 38, title: "Kumura Aru Mator Ghonto Axomiya", prepTime: 24, calories: 210, dietType: "Veg", difficulty: "Easy", description: "Pumpkin and peas are lightly spiced for a sweet-savory Assamese ghar ka khana.", imageKeyword: "kumura-mator-ghonto-axomiya", tags: ["quick", "kids"], ingredients: ["Kumura", "Matar", "Adrak", "Panch phoron", "Sarson tel", "Hari mirch", "Namak"] },
  { number: 39, title: "Masor Tenga Jolokia", prepTime: 34, calories: 325, dietType: "Non-Veg", difficulty: "Hard", description: "Tangy fish tenga with a hint of bhut jolokia for smoky heat and depth.", imageKeyword: "masor-tenga-jolokia", tags: ["festive", "quick"], ingredients: ["River fish", "Ou tenga", "Bhoot jolokia", "Tamatar", "Adrak", "Sarson tel", "Namak"] },
  { number: 40, title: "Narikol Boror Curry", prepTime: 27, calories: 275, dietType: "Veg", difficulty: "Easy", description: "Moong fritters simmer in coconut-based gravy for a soft and mildly sweet curry.", imageKeyword: "narikol-boror-curry", tags: ["leftover", "kids"], ingredients: ["Moong dal bora", "Nariyal", "Pyaaz", "Adrak", "Hari mirch", "Sarson tel", "Namak"] },
  { number: 41, title: "Pura Bilahi Pitika", prepTime: 16, calories: 165, dietType: "Veg", difficulty: "Easy", description: "Flame-roasted tomatoes mashed with mustard oil create a classic Assamese pitika.", imageKeyword: "pura-bilahi-pitika", tags: ["under20", "quick"], ingredients: ["Tamatar", "Pyaaz", "Hari mirch", "Sarson tel", "Dhania patta", "Namak"] },
  { number: 42, title: "Aloo Bengena Khar", prepTime: 22, calories: 205, dietType: "Veg", difficulty: "Easy", description: "Potato and brinjal in gentle khar gravy offer a light everyday Assamese meal.", imageKeyword: "aloo-bengena-khar", tags: ["quick", "under20"], ingredients: ["Aloo", "Baingan", "Khar water", "Adrak", "Rai", "Sarson tel", "Namak"] },
  { number: 43, title: "Xaak Murgi Jool", prepTime: 38, calories: 395, dietType: "Non-Veg", difficulty: "Medium", description: "Chicken and leafy greens cook into a thin, herb-forward Assamese jool.", imageKeyword: "xaak-murgi-jool", tags: ["quick", "festive"], ingredients: ["Chicken", "Xaak", "Pyaaz", "Adrak", "Lahsun", "Sarson tel", "Namak"] },
  { number: 44, title: "Koldil Aru Chana Bhaji", prepTime: 28, calories: 255, dietType: "Veg", difficulty: "Easy", description: "Banana flower and chana stir-fried with mustard oil make a hearty side dish.", imageKeyword: "koldil-aru-chana-bhaji", tags: ["leftover", "quick"], ingredients: ["Koldil", "Chana", "Pyaaz", "Adrak", "Hari mirch", "Sarson tel", "Namak"] },
  { number: 45, title: "Magur Maach Jhal Axomiya", prepTime: 36, calories: 345, dietType: "Non-Veg", difficulty: "Medium", description: "Catfish curry with pepper and ginger gives a rich, warm Assamese profile.", imageKeyword: "magur-maach-jhal-axomiya", tags: ["festive", "leftover"], ingredients: ["Magur fish", "Tamatar", "Adrak", "Kali mirch", "Haldi", "Sarson tel", "Namak"] },
  { number: 46, title: "Bhoot Jolokia Anda Jhol", prepTime: 24, calories: 245, dietType: "Egg", difficulty: "Medium", description: "Boiled eggs in thin spicy broth with ghost chilli for a fiery Assamese touch.", imageKeyword: "bhoot-jolokia-anda-jhol", tags: ["quick", "under20"], ingredients: ["Anda", "Bhoot jolokia", "Pyaaz", "Tamatar", "Adrak", "Sarson tel", "Namak"] },
  { number: 47, title: "Ou Diya Mati Mah", prepTime: 39, calories: 295, dietType: "Veg", difficulty: "Medium", description: "Whole black urad and elephant apple combine in a tangy, protein-rich Assamese dal.", imageKeyword: "ou-diya-mati-mah", tags: ["leftover", "kids"], ingredients: ["Sabut urad", "Ou tenga", "Adrak", "Jeera", "Hing", "Ghee", "Namak"] },
  { number: 48, title: "Boror Jool Khar", prepTime: 23, calories: 225, dietType: "Veg", difficulty: "Easy", description: "Lentil dumplings in mild khar broth are comforting and very Assamese in spirit.", imageKeyword: "boror-jool-khar", tags: ["quick", "under20"], ingredients: ["Moong bora", "Khar water", "Adrak", "Panch phoron", "Sarson tel", "Hari mirch", "Namak"] },
  { number: 49, title: "Lau Aru Til Bhaji", prepTime: 19, calories: 185, dietType: "Veg", difficulty: "Easy", description: "Bottle gourd sauteed with toasted sesame seeds for a light and nutty side.", imageKeyword: "lau-aru-til-bhaji", tags: ["under20", "quick"], ingredients: ["Lauki", "Til", "Pyaaz", "Hari mirch", "Sarson tel", "Namak"] },
  { number: 50, title: "Pani Hamuk Tenga", prepTime: 42, calories: 335, dietType: "Non-Veg", difficulty: "Hard", description: "Water snails in sour broth with ginger and herbs preserve old Assamese flavors.", imageKeyword: "pani-hamuk-tenga", tags: ["festive", "leftover"], ingredients: ["Pani hamuk", "Ou tenga", "Pyaaz", "Adrak", "Kali mirch", "Sarson tel", "Namak"] },
  { number: 51, title: "Kachu Xaak Diya Maas", prepTime: 37, calories: 350, dietType: "Non-Veg", difficulty: "Medium", description: "Fish curry with colocasia greens and mild spice for a hearty Assamese lunch.", imageKeyword: "kachu-xaak-diya-maas", tags: ["quick", "leftover"], ingredients: ["Fish", "Kachu xaak", "Adrak", "Tamatar", "Haldi", "Sarson tel", "Namak"] },
  { number: 52, title: "Koldil Narikol Pitika", prepTime: 18, calories: 175, dietType: "Veg", difficulty: "Easy", description: "Mashed banana flower with fresh coconut and mustard oil is smoky and fresh.", imageKeyword: "koldil-narikol-pitika", tags: ["under20", "quick"], ingredients: ["Koldil", "Nariyal", "Pyaaz", "Hari mirch", "Sarson tel", "Nimbu ras", "Namak"] },
  { number: 53, title: "Ada Morich Murgi", prepTime: 32, calories: 385, dietType: "Non-Veg", difficulty: "Medium", description: "Ginger-chilli chicken curry with clean flavors and a light Assamese gravy.", imageKeyword: "ada-morich-murgi", tags: ["quick", "festive"], ingredients: ["Chicken", "Adrak", "Hari mirch", "Pyaaz", "Haldi", "Sarson tel", "Namak"] },
  { number: 54, title: "Joha Saulor Kheer Pitha", prepTime: 34, calories: 290, dietType: "Veg", difficulty: "Medium", description: "Joha rice cakes soaked in sweet milk reduce to a festive Assamese dessert.", imageKeyword: "joha-saulor-kheer-pitha", tags: ["festive", "kids"], ingredients: ["Joha rice", "Doodh", "Gud", "Elaichi", "Ghee", "Nariyal"] },
  { number: 55, title: "Kosu Dhekia Bhaja", prepTime: 21, calories: 195, dietType: "Veg", difficulty: "Easy", description: "Colocasia stem and fiddlehead fern stir-fry brings earthy Assamese texture.", imageKeyword: "kosu-dhekia-bhaja", tags: ["quick", "under20"], ingredients: ["Kosu stem", "Dhekia xaak", "Panch phoron", "Adrak", "Sarson tel", "Namak"] },
  { number: 56, title: "Bohag Bilahi Muror Tenga", prepTime: 40, calories: 310, dietType: "Non-Veg", difficulty: "Hard", description: "Fish head and spring tomatoes simmer in tangy broth for festive Bohag meals.", imageKeyword: "bohag-bilahi-muror-tenga", tags: ["festive", "leftover"], ingredients: ["Fish head", "Tamatar", "Pyaaz", "Adrak", "Haldi", "Sarson tel", "Namak"] },
  { number: 57, title: "Koni Kharoli Bhurji", prepTime: 17, calories: 235, dietType: "Egg", difficulty: "Easy", description: "Scrambled egg with fermented mustard paste is quick, punchy, and addictive.", imageKeyword: "koni-kharoli-bhurji", tags: ["under20", "quick"], ingredients: ["Anda", "Kharoli paste", "Pyaaz", "Hari mirch", "Sarson tel", "Namak"] },
  { number: 58, title: "Til Gos Maangxo", prepTime: 44, calories: 455, dietType: "Non-Veg", difficulty: "Hard", description: "Mutton braised with sesame and black pepper in a rich Assamese festive style.", imageKeyword: "til-gos-maangxo", tags: ["festive", "leftover"], ingredients: ["Mutton", "Til", "Pyaaz", "Adrak", "Lahsun", "Kali mirch", "Sarson tel"] },
  { number: 59, title: "Aloo Ou Pitika", prepTime: 15, calories: 175, dietType: "Veg", difficulty: "Easy", description: "Potato and elephant apple mash with mustard oil gives smoky sour balance.", imageKeyword: "aloo-ou-pitika", tags: ["under20", "quick"], ingredients: ["Aloo", "Ou tenga", "Pyaaz", "Hari mirch", "Sarson tel", "Namak"] },
  { number: 60, title: "Baanhgajor Duck Stew", prepTime: 46, calories: 445, dietType: "Non-Veg", difficulty: "Hard", description: "Duck and bamboo shoot slow-cooked till deeply aromatic and tender.", imageKeyword: "baanhgajor-duck-stew", tags: ["festive", "leftover"], ingredients: ["Duck", "Bamboo shoot", "Pyaaz", "Adrak", "Lahsun", "Sarson tel", "Namak"] },
  { number: 61, title: "Dhekia Xaak Chingri", prepTime: 31, calories: 320, dietType: "Non-Veg", difficulty: "Medium", description: "Fiddlehead greens and prawns stir-fried for a monsoon Assamese delicacy.", imageKeyword: "dhekia-xaak-chingri", tags: ["quick", "festive"], ingredients: ["Prawns", "Dhekia xaak", "Adrak", "Lahsun", "Hari mirch", "Sarson tel", "Namak"] },
  { number: 62, title: "Narikol Bilahi Koni", prepTime: 22, calories: 255, dietType: "Egg", difficulty: "Easy", description: "Eggs in coconut-tomato gravy keep the curry mellow and home-style.", imageKeyword: "narikol-bilahi-koni", tags: ["quick", "kids"], ingredients: ["Anda", "Nariyal", "Tamatar", "Adrak", "Sarson tel", "Namak"] },
  { number: 63, title: "Borali Maach Pani Khar", prepTime: 35, calories: 340, dietType: "Non-Veg", difficulty: "Medium", description: "Borali fish in thin alkaline broth tastes clean and lightly spiced.", imageKeyword: "borali-maach-pani-khar", tags: ["quick", "leftover"], ingredients: ["Borali fish", "Khar water", "Adrak", "Pyaaz", "Haldi", "Sarson tel", "Namak"] },
  { number: 64, title: "Muga Xaakor Bora Curry", prepTime: 26, calories: 245, dietType: "Veg", difficulty: "Easy", description: "Leafy green fritters simmer in a delicate curry for an Assamese family meal.", imageKeyword: "muga-xaakor-bora-curry", tags: ["leftover", "kids"], ingredients: ["Muga xaak", "Besan", "Pyaaz", "Adrak", "Sarson tel", "Namak"] },
  { number: 65, title: "Haah Aloo Jol", prepTime: 43, calories: 420, dietType: "Non-Veg", difficulty: "Hard", description: "Duck and potatoes in thin spiced broth deliver cozy festive Assamese flavors.", imageKeyword: "haah-aloo-jol", tags: ["festive", "leftover"], ingredients: ["Duck", "Aloo", "Pyaaz", "Adrak", "Lahsun", "Kali mirch", "Sarson tel"] },
  { number: 66, title: "Kumura Khar Dal", prepTime: 24, calories: 215, dietType: "Veg", difficulty: "Easy", description: "Pumpkin and lentils with khar create a gentle and nourishing Assamese bowl.", imageKeyword: "kumura-khar-dal", tags: ["quick", "kids"], ingredients: ["Moong dal", "Kumura", "Khar water", "Adrak", "Ghee", "Namak"] },
  { number: 67, title: "Maah Proxad Bhaji", prepTime: 20, calories: 195, dietType: "Veg", difficulty: "Easy", description: "Black gram and greens saute make a simple temple-style Assamese side.", imageKeyword: "maah-proxad-bhaji", tags: ["under20", "quick"], ingredients: ["Sabut urad", "Xaak", "Jeera", "Hing", "Sarson tel", "Namak"] },
  { number: 68, title: "Posola Til Chutney", prepTime: 18, calories: 170, dietType: "Veg", difficulty: "Easy", description: "Banana stem and sesame chutney gives nutty freshness to rice meals.", imageKeyword: "posola-til-chutney", tags: ["under20", "quick"], ingredients: ["Banana stem", "Til", "Hari mirch", "Nimbu ras", "Sarson tel", "Namak"] },
  { number: 69, title: "Mati Mahor Tenga Dal", prepTime: 33, calories: 285, dietType: "Veg", difficulty: "Medium", description: "Whole urad dal in tangy broth with elephant apple is hearty and balanced.", imageKeyword: "mati-mahor-tenga-dal", tags: ["leftover", "kids"], ingredients: ["Sabut urad", "Ou tenga", "Adrak", "Jeera", "Ghee", "Namak"] },
  { number: 70, title: "Kothal Guti Maas", prepTime: 39, calories: 360, dietType: "Non-Veg", difficulty: "Medium", description: "Fish cooked with jackfruit seeds adds creamy texture and earthy flavor.", imageKeyword: "kothal-guti-maas", tags: ["quick", "leftover"], ingredients: ["Fish", "Jackfruit seeds", "Tamatar", "Adrak", "Haldi", "Sarson tel", "Namak"] },
  { number: 71, title: "Khorisa Diya Kukura", prepTime: 36, calories: 395, dietType: "Non-Veg", difficulty: "Medium", description: "Chicken curry with fermented bamboo shoot and ginger is intensely aromatic.", imageKeyword: "khorisa-diya-kukura", tags: ["festive", "quick"], ingredients: ["Chicken", "Khorisa", "Pyaaz", "Adrak", "Lahsun", "Sarson tel", "Namak"] },
  { number: 72, title: "Pura Aloo Khar", prepTime: 19, calories: 185, dietType: "Veg", difficulty: "Easy", description: "Roasted potatoes in light khar gravy make a clean and comforting side.", imageKeyword: "pura-aloo-khar", tags: ["under20", "quick"], ingredients: ["Aloo", "Khar water", "Rai", "Adrak", "Sarson tel", "Namak"] },
  { number: 73, title: "Bhapot Koni Paturi", prepTime: 29, calories: 260, dietType: "Egg", difficulty: "Medium", description: "Steamed egg parcels in mustard-coconut paste inspired by Assamese and Bengali kitchens.", imageKeyword: "bhapot-koni-paturi", tags: ["festive", "quick"], ingredients: ["Anda", "Sarson paste", "Nariyal", "Hari mirch", "Banana leaf", "Sarson tel", "Namak"], kitchenStyleIds: ["assamese", "bengali"] },
  { number: 74, title: "Xaakor Tenga Soup", prepTime: 17, calories: 150, dietType: "Veg", difficulty: "Easy", description: "Leafy greens and tomato broth form a light, tangy Assamese soup.", imageKeyword: "xaakor-tenga-soup", tags: ["under20", "quick"], ingredients: ["Xaak", "Tamatar", "Adrak", "Hari mirch", "Sarson tel", "Namak"] },
  { number: 75, title: "Rohu Narikol Jhol", prepTime: 32, calories: 330, dietType: "Non-Veg", difficulty: "Medium", description: "Rohu fish in thin coconut gravy stays mild, aromatic, and family-friendly.", imageKeyword: "rohu-narikol-jhol", tags: ["quick", "kids"], ingredients: ["Rohu machh", "Nariyal", "Tamatar", "Adrak", "Sarson tel", "Namak"] },
  { number: 76, title: "Koldil Matar Khar", prepTime: 25, calories: 225, dietType: "Veg", difficulty: "Easy", description: "Banana flower and peas in khar broth make a clean Assamese vegetarian curry.", imageKeyword: "koldil-matar-khar", tags: ["quick", "leftover"], ingredients: ["Koldil", "Matar", "Khar water", "Adrak", "Rai", "Sarson tel", "Namak"] },
  { number: 77, title: "Joha Saul Chicken Pulao Axomiya", prepTime: 41, calories: 440, dietType: "Non-Veg", difficulty: "Hard", description: "Fragrant joha rice pulao with chicken and whole spices for Assamese gatherings.", imageKeyword: "joha-saul-chicken-pulao-axomiya", tags: ["festive", "leftover"], ingredients: ["Chicken", "Joha rice", "Pyaaz", "Tej patta", "Elaichi", "Ghee", "Namak"] },
  { number: 78, title: "Til Dhania Anda Fry", prepTime: 18, calories: 240, dietType: "Egg", difficulty: "Easy", description: "Sesame-crusted eggs with coriander and mustard oil make a quick protein side.", imageKeyword: "til-dhania-anda-fry", tags: ["under20", "quick"], ingredients: ["Anda", "Til", "Dhania patta", "Hari mirch", "Sarson tel", "Namak"] },
  { number: 79, title: "Ou Khar Aru Chana", prepTime: 23, calories: 230, dietType: "Veg", difficulty: "Easy", description: "Elephant apple and chickpeas in khar gravy create sour, earthy balance.", imageKeyword: "ou-khar-aru-chana", tags: ["quick", "leftover"], ingredients: ["Ou tenga", "Chana", "Khar water", "Adrak", "Sarson tel", "Namak"] },
  { number: 80, title: "Pitika Trio Axomiya", prepTime: 20, calories: 200, dietType: "Veg", difficulty: "Easy", description: "A platter of potato, eggplant, and tomato pitika celebrates Assamese simplicity.", imageKeyword: "pitika-trio-axomiya", tags: ["under20", "kids"], ingredients: ["Aloo", "Baingan", "Tamatar", "Pyaaz", "Sarson tel", "Hari mirch", "Namak"] },
];

export const ASSAMESE_BATCH2_RECIPES: RecipeCatalogEntry[] = ASSAMESE_BATCH2_SEEDS.map((seed) => ({
  id: `assamese-${seed.number}`,
  kitchenStyleId: "assamese",
  ...(seed.kitchenStyleIds ? { kitchenStyleIds: seed.kitchenStyleIds } : {}),
  title: seed.title,
  prepTime: seed.prepTime,
  calories: seed.calories,
  region: "East",
  dietType: seed.dietType,
  difficulty: seed.difficulty,
  description: seed.description,
  imageKeyword: seed.imageKeyword,
  tags: seed.tags,
  ingredients: seed.ingredients.map((name) => ({ name, isStaple: STAPLES.has(name) })),
  steps: buildSteps(seed.title, seed.dietType),
}));
