import type { RecipeCatalogEntry } from "./types";

type DietType = RecipeCatalogEntry["dietType"];
type Difficulty = RecipeCatalogEntry["difficulty"];

const NORTH_BATCH2_TITLES = [
  "Dhaba Style Chana Saag",
  "Delhi Paneer Lababdar",
  "Kasuri Malai Kofta",
  "Awadhi Tehri Pulao",
  "Banarasi Tamatar Chaat",
  "Lucknowi Matar Nimona",
  "Tandoori Soya Chaap Masala",
  "Pahadi Aloo Thechwani",
  "Hara Pyaz Paratha",
  "Bedmi Aloo",
  "Mathura Dubki Wale Aloo",
  "Kala Chana Kebab",
  "Dahi Ke Sholey",
  "Masala Arbi Fry",
  "Nainital Aloo Gutke",
  "Palak Corn Curry",
  "Lachha Pyaz Paneer",
  "Khasta Moong Dal Kachori",
  "Matar Kulcha Skillet",
  "Saffron Zafrani Pulao",
  "Shahi Egg Korma",
  "Mughlai Chicken Rezala",
  "Tawa Tangdi Masala",
  "Kasundi Fish Tikka",
  "Mutton Yakhni Pulao",
  "Hariyali Chicken Tikka",
  "Badami Kofta Curry",
  "Lahori Paneer Bhuna",
  "Amritsari Aloo Wadiyan",
  "Spinach Hara Bhara Kebab",
  "Smoked Dal Panchratan",
  "Ginger Methi Chicken",
  "Crisp Lotus Stem Stir Fry",
  "Pindi Aloo Anardana",
  "Tandoori Broccoli Tikka",
  "Kashmiri Muji Chetin",
  "Creamy Turnip Peas Curry",
  "Sattu Stuffed Paratha",
  "Ghee Roast Achari Aloo",
  "Makhana Matar Masala",
  "Anda Methi Keema",
  "Pepper Garlic Mutton Fry",
  "Tomato Fenugreek Fish Curry",
  "Sesame Honey Chicken Bites",
  "Bharwan Shimla Mirch",
  "Corn Palak Seekh",
  "Minty Rajma Galouti",
  "Peshawari Chole Pulao",
  "Kasuri Paneer Jalfrezi",
  "Spiced Beetroot Tikki",
] as const;

function toImageKeyword(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function inferDietType(title: string): DietType {
  const lower = title.toLowerCase();
  if (lower.includes("egg") || lower.includes("anda")) return "Egg";
  if (lower.includes("chicken") || lower.includes("mutton") || lower.includes("fish")) {
    return "Non-Veg";
  }
  return "Veg";
}

function inferDifficulty(index: number): Difficulty {
  if (index % 9 === 0) return "Hard";
  if (index % 2 === 0) return "Medium";
  return "Easy";
}

function inferTags(index: number, prepTime: number): string[] {
  if (prepTime <= 20) return ["under20", "quick"];
  if (index % 5 === 0) return ["festive", "leftover"];
  if (index % 3 === 0) return ["kids", "quick"];
  return ["quick", "leftover"];
}

function inferProtein(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("fish")) return "Fish fillet";
  if (lower.includes("mutton")) return "Mutton";
  if (lower.includes("keema")) return "Chicken keema";
  if (lower.includes("chicken")) return "Chicken";
  if (lower.includes("egg") || lower.includes("anda")) return "Anda";
  if (lower.includes("paneer")) return "Paneer";
  if (lower.includes("chana")) return "Kabuli chana";
  if (lower.includes("rajma")) return "Rajma";
  return "Aloo";
}

function ingredientsFor(title: string, dietType: DietType): Array<{ name: string; isStaple: boolean }> {
  const hero = inferProtein(title);
  const base = [
    { name: "Pyaaz", isStaple: true },
    { name: "Tamatar", isStaple: true },
    { name: "Adrak", isStaple: true },
    { name: "Lahsun", isStaple: true },
    { name: "Haldi", isStaple: true },
    { name: "Dhania powder", isStaple: true },
  ];

  if (dietType === "Veg" && hero !== "Paneer" && hero !== "Kabuli chana" && hero !== "Rajma") {
    return [{ name: hero, isStaple: true }, ...base];
  }
  if (dietType === "Veg") {
    return [{ name: hero, isStaple: true }, ...base];
  }
  return [{ name: hero, isStaple: false }, ...base];
}

function stepsFor(title: string): string[] {
  return [
    `Prepare and portion ingredients for ${title.toLowerCase()}.`,
    "Cook onions, ginger, and garlic to build a deep masala base.",
    "Add the hero ingredients with spices and simmer until cooked through.",
    "Finish with garnish and serve hot with roti, rice, or paratha.",
  ];
}

function multiCuisineIds(id: number): string[] | undefined {
  if (id === 34) return ["north", "street"];
  if (id === 52) return ["north", "punjabi"];
  if (id === 73) return ["north", "kashmiri"];
  return undefined;
}

export const NORTH_BATCH2_RECIPES: RecipeCatalogEntry[] = NORTH_BATCH2_TITLES.map((title, idx) => {
  const idNumber = idx + 31;
  const dietType = inferDietType(title);
  const prepTime = 22 + (idx % 8) * 4;
  return {
    id: `north-${idNumber}`,
    kitchenStyleId: "north",
    kitchenStyleIds: multiCuisineIds(idNumber),
    title,
    prepTime,
    calories: 270 + (idx % 10) * 28,
    region: "North",
    dietType,
    difficulty: inferDifficulty(idNumber),
    description: `${title} is a North Indian style recipe with balanced spices and homestyle depth.`,
    imageKeyword: toImageKeyword(title),
    tags: inferTags(idNumber, prepTime),
    ingredients: ingredientsFor(title, dietType),
    steps: stepsFor(title),
  };
});
