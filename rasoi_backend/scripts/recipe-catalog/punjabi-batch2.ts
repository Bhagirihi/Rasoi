import type { RecipeCatalogEntry } from "./types";

type DietType = RecipeCatalogEntry["dietType"];
type Difficulty = RecipeCatalogEntry["difficulty"];

const PUNJABI_BATCH2_TITLES = [
  "Lahore Style Chole Kulcha",
  "Dhaba Paneer Tawa Masala",
  "Punjabi Soya Chaap Curry",
  "Palak Chana Punjabi",
  "Stuffed Gobhi Paratha",
  "Ajwaini Aloo Kulcha",
  "Makkhan Wali Mutter Paneer",
  "Dhabewali Kali Dal Fry",
  "Tandoori Broccoli Punjabi",
  "Lehsuni Palak Corn",
  "Punjabi Kadak Bhindi",
  "Masala Tawa Mushroom",
  "Pindi Kala Chana",
  "Punjabi Karela Pyaz",
  "Achari Aloo Mutter",
  "Degi Mirch Paneer",
  "Dhungar Paneer Kali Mirch",
  "Punjabi Masala Khichdi",
  "Chur Chur Naan Thali",
  "Tawa Soya Keema",
  "Anda Tawa Bhurji Masala",
  "Punjabi Egg Bhuna",
  "Amritsari Anda Kulcha Pocket",
  "Masala Omelette Curry",
  "Smoked Egg Keema",
  "Murgh Achari Tikka Masala",
  "Punjabi Chicken Keema Kaleji",
  "Dhaba Chicken Kali Mirch",
  "Methi Malai Chicken",
  "Punjabi Chicken Chaap Roast",
  "Tandoori Mutton Chaap",
  "Peshawari Mutton Curry",
  "Punjabi Fish Tikka Masala",
  "Ajwaini Fish Fry Punjabi",
  "Sarson Fish Curry",
  "Patiala Chicken Korma",
  "Punjabi Mutton Kofta Curry",
  "Makkhani Soya Matar",
  "Punjabi Corn Capsicum Masala",
  "Tandoori Veg Seekh Curry",
  "Gurh Wali Kaddu Sabzi",
  "Punjabi Arbi Masala Fry",
  "Dal Palak Punjabi Tadka",
  "Punjabi Lauki Kofta",
  "Paneer Methi Chaman",
  "Punjabi Chana Palak Rice Bowl",
  "Dhaba Veg Jalfrezi",
  "Punjabi Egg Tikka Masala",
  "Murgh Methi Malai",
  "Amritsari Fish Pepper Masala",
] as const;

function toImageKeyword(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function inferDietType(title: string): DietType {
  const lower = title.toLowerCase();
  if (lower.includes("egg") || lower.includes("anda") || lower.includes("omelette")) return "Egg";
  if (lower.includes("chicken") || lower.includes("murgh") || lower.includes("mutton") || lower.includes("fish") || lower.includes("kaleji") || lower.includes("keema")) {
    return "Non-Veg";
  }
  return "Veg";
}

function inferDifficulty(index: number): Difficulty {
  if (index % 10 === 0) return "Hard";
  if (index % 2 === 0) return "Medium";
  return "Easy";
}

function inferTags(index: number, prepTime: number): string[] {
  if (prepTime <= 20) return ["under20", "quick"];
  if (index % 4 === 0) return ["festive", "kids"];
  if (index % 3 === 0) return ["quick", "leftover"];
  return ["quick", "kids"];
}

function inferProtein(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("fish")) return "Fish fillet";
  if (lower.includes("mutton")) return "Mutton";
  if (lower.includes("chicken") || lower.includes("murgh")) return "Chicken";
  if (lower.includes("kaleji")) return "Chicken liver";
  if (lower.includes("keema")) return "Chicken keema";
  if (lower.includes("egg") || lower.includes("anda") || lower.includes("omelette")) return "Anda";
  if (lower.includes("paneer")) return "Paneer";
  if (lower.includes("chana")) return "Kabuli chana";
  return "Aloo";
}

function ingredientsFor(title: string, dietType: DietType): Array<{ name: string; isStaple: boolean }> {
  const hero = inferProtein(title);
  const base = [
    { name: "Pyaaz", isStaple: true },
    { name: "Tamatar", isStaple: true },
    { name: "Adrak", isStaple: true },
    { name: "Lahsun", isStaple: true },
    { name: "Kasuri methi", isStaple: true },
    { name: "Garam masala", isStaple: true },
  ];
  if (dietType === "Non-Veg") return [{ name: hero, isStaple: false }, ...base];
  return [{ name: hero, isStaple: true }, ...base];
}

function stepsFor(title: string): string[] {
  return [
    `Prepare ingredients and spice mix for ${title.toLowerCase()}.`,
    "Cook onion, ginger, and garlic until aromatic and lightly golden.",
    "Add hero ingredients with spices and cook until rich and well coated.",
    "Finish with garnish and serve hot with naan, roti, or jeera rice.",
  ];
}

function multiCuisineIds(id: number): string[] | undefined {
  if (id === 38) return ["punjabi", "north"];
  if (id === 57) return ["punjabi", "street"];
  if (id === 76) return ["punjabi", "rajasthani"];
  return undefined;
}

export const PUNJABI_BATCH2_RECIPES: RecipeCatalogEntry[] = PUNJABI_BATCH2_TITLES.map((title, idx) => {
  const idNumber = idx + 31;
  const dietType = inferDietType(title);
  const prepTime = 21 + (idx % 9) * 4;
  return {
    id: `punjabi-${idNumber}`,
    kitchenStyleId: "punjabi",
    kitchenStyleIds: multiCuisineIds(idNumber),
    title,
    prepTime,
    calories: 285 + (idx % 10) * 30,
    region: "North",
    dietType,
    difficulty: inferDifficulty(idNumber),
    description: `${title} is a Punjabi-style recipe with robust masala and dhaba-inspired flavor.`,
    imageKeyword: toImageKeyword(title),
    tags: inferTags(idNumber, prepTime),
    ingredients: ingredientsFor(title, dietType),
    steps: stepsFor(title),
  };
});
