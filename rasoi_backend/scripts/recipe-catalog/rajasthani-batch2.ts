import type { RecipeCatalogEntry } from "./types";

type DietType = RecipeCatalogEntry["dietType"];
type Difficulty = RecipeCatalogEntry["difficulty"];

const RAJASTHANI_BATCH2_TITLES = [
  "Jodhpuri Kabuli Pulao",
  "Besan Gatta Pulao",
  "Mangodi Aloo Rasawala",
  "Rajasthani Aam Ki Launji",
  "Kachri Ki Chutney",
  "Lasun Ki Chutney Tadka",
  "Jaisalmeri Chana",
  "Bajra Methi Roti",
  "Chana Dal Parantha Marwari",
  "Kairi Pyaz Ki Sabzi",
  "Marwari Aloo Gatte",
  "Rajasthani Papad Mangodi Curry",
  "Til Methi Bajra Khichdi",
  "Sangri Aloo Fry",
  "Bajra Raabdi Namkeen",
  "Jodhpuri Mawa Kachori",
  "Methi Dana Aloo",
  "Rajasthani Chane Ka Saag",
  "Ker Dahi Masala",
  "Moth Dal Tadka",
  "Marwari Besan Mirchi",
  "Bajre Ki Khichri Lehsuni",
  "Bikaneri Aloo Bhujia Curry",
  "Rajasthani Tamatar Sev",
  "Jaipuri Gatte Pulao",
  "Rajasthani Egg Mirchi Curry",
  "Rajputana Anda Masala",
  "Desert Style Egg Bhurji",
  "Mathania Chicken Curry",
  "Jodhpuri Chicken Sukha",
  "Marwari Chicken Korma",
  "Rajasthani Mutton Jungli",
  "Jaisalmeri Mutton Curry",
  "Mathania Fish Fry",
  "Rajasthani Fish Jhol",
  "Desert Chili Paneer",
  "Bajra Kofta Curry",
  "Moong Mangodi Palak",
  "Marwari Kaddu Panchphoran",
  "Rajasthani Chilli Garlic Tinda",
  "Ker Sangri Pulao",
  "Bajra Corn Handvo Rajasthani",
  "Marwari Chole Gatta",
  "Rajasthani Soya Aloo",
  "Lehsun Methi Paneer",
  "Rajwadi Veg Korma",
  "Rajasthani Onion Mirch Pakoda Curry",
  "Desert Egg Tikka Masala",
  "Jungli Murgh Tawa",
  "Marwari Fish Masala",
] as const;

function toImageKeyword(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function inferDietType(title: string): DietType {
  const lower = title.toLowerCase();
  if (lower.includes("egg") || lower.includes("anda")) return "Egg";
  if (lower.includes("chicken") || lower.includes("murgh") || lower.includes("mutton") || lower.includes("fish")) {
    return "Non-Veg";
  }
  return "Veg";
}

function inferDifficulty(index: number): Difficulty {
  if (index % 11 === 0) return "Hard";
  if (index % 2 === 0) return "Medium";
  return "Easy";
}

function inferTags(index: number, prepTime: number): string[] {
  if (prepTime <= 20) return ["under20", "quick"];
  if (index % 5 === 0) return ["festive", "quick"];
  if (index % 3 === 0) return ["leftover", "quick"];
  return ["quick", "kids"];
}

function inferProtein(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("fish")) return "Fish fillet";
  if (lower.includes("mutton")) return "Mutton";
  if (lower.includes("chicken") || lower.includes("murgh")) return "Chicken";
  if (lower.includes("egg") || lower.includes("anda")) return "Anda";
  if (lower.includes("paneer")) return "Paneer";
  if (lower.includes("chole") || lower.includes("chana")) return "Kabuli chana";
  return "Aloo";
}

function ingredientsFor(title: string, dietType: DietType): Array<{ name: string; isStaple: boolean }> {
  const hero = inferProtein(title);
  const base = [
    { name: "Pyaaz", isStaple: true },
    { name: "Tamatar", isStaple: true },
    { name: "Lahsun", isStaple: true },
    { name: "Mathania mirch", isStaple: false },
    { name: "Dhania powder", isStaple: true },
    { name: "Ghee", isStaple: true },
  ];
  if (dietType === "Non-Veg") return [{ name: hero, isStaple: false }, ...base];
  return [{ name: hero, isStaple: true }, ...base];
}

function stepsFor(title: string): string[] {
  return [
    `Prepare pantry ingredients and hero components for ${title.toLowerCase()}.`,
    "Cook aromatics in ghee or oil until fragrant and lightly caramelized.",
    "Add hero ingredients with spices and simmer to desired texture.",
    "Finish with fresh garnish and serve hot with roti, bajra bread, or rice.",
  ];
}

function multiCuisineIds(id: number): string[] | undefined {
  if (id === 36) return ["rajasthani", "gujarati"];
  if (id === 58) return ["rajasthani", "punjabi"];
  if (id === 75) return ["rajasthani", "street"];
  return undefined;
}

export const RAJASTHANI_BATCH2_RECIPES: RecipeCatalogEntry[] = RAJASTHANI_BATCH2_TITLES.map(
  (title, idx) => {
    const idNumber = idx + 31;
    const dietType = inferDietType(title);
    const prepTime = 23 + (idx % 9) * 4;
    return {
      id: `rajasthani-${idNumber}`,
      kitchenStyleId: "rajasthani",
      kitchenStyleIds: multiCuisineIds(idNumber),
      title,
      prepTime,
      calories: 275 + (idx % 10) * 27,
      region: "West",
      dietType,
      difficulty: inferDifficulty(idNumber),
      description: `${title} is a Rajasthani-style dish with desert-spice character and hearty flavor.`,
      imageKeyword: toImageKeyword(title),
      tags: inferTags(idNumber, prepTime),
      ingredients: ingredientsFor(title, dietType),
      steps: stepsFor(title),
    };
  },
);
