"""Instagram search/discoverability keywords for @rasoi_app."""

from __future__ import annotations

# Target Instagram search queries (profile + captions + hashtags)
SEARCH_KEYWORDS = (
    "rasoi",
    "rasoi app",
    "rasoi aaj kya banaye",
    "jamvanu",
    "aaj kya banaye",
    "indian recipe app",
    "recipe app",
    "cooking app",
    "what to cook today",
    "dinner ideas",
    "pantry match",
    "home cooking",
    "gujarati recipes",
)

APK_DOWNLOAD_URL = "https://rasoiapplication.in/download"

PROFILE_FULL_NAME = "Rasoi App · Recipe · Jamvanu"

PROFILE_BIO = """Jamvanu? Rasoi recipe app 🍲 Aaj kya banaye?
Pantry match · 15 cuisines · Veg/Jain
1,200+ recipes · Free Android ↓"""

# Full vocabulary — deduped, brand-first. Rotated per post in captions (see post_seo_keywords_for).
POST_SEO_KEYWORDS_LIST: tuple[str, ...] = (
    # Brand
    "rasoi",
    "rasoi app",
    "rasoi aaj kya banaye",
    "jamvanu",
    "aaj kya banaye",
    "rasoiapplication.in",
    # Daily intent (EN + HI)
    "what to make today",
    "what to cook today",
    "what to eat today",
    "today's menu",
    "Indian meal ideas",
    "daily cooking ideas",
    # Meal times
    "breakfast ideas",
    "lunch ideas",
    "dinner ideas",
    "evening snacks",
    "breakfast recipes",
    "lunch recipes",
    "dinner recipes",
    "tiffin ideas",
    # App category
    "Indian recipes",
    "Indian food",
    "Indian recipe app",
    "recipe app",
    "cooking app",
    "food suggestion app",
    "meal planning app",
    "recipe discovery",
    "Android recipe app",
    # Features / benefits
    "pantry match recipes",
    "Tonight's Picks",
    "meal suggestions",
    "meal recommendations",
    "recipe recommendations",
    "recipe finder",
    "recipe inspiration",
    "cooking ideas",
    "cooking inspiration",
    "food ideas",
    "cook from fridge",
    "grocery list",
    "kitchen assistant",
    "smart cooking",
    # Home & family
    "home cooking",
    "home cooking India",
    "homemade food",
    "family meals",
    "family recipe planner",
    # Diet & style
    "healthy recipes",
    "healthy Indian recipes",
    "quick recipes",
    "quick Indian recipes",
    "easy recipes",
    "vegetarian recipes",
    "veg recipe app India",
    "Jain recipes",
    # Regional
    "Gujarati recipes",
    "Hindi recipes",
    "South Indian food",
    "regional Indian recipes",
    # Planners (search volume — product is dinner-from-pantry, not weekly calendar)
    "meal planner",
    "daily meal planner",
    "weekly meal planner",
    "food planner",
    "smart meal planner",
    "kitchen planner",
    "daily food planner",
    "meal prep",
    "cooking guide",
    # Collections
    "recipe collection",
    "food recipes",
    # Seasonal
    "seasonal recipes",
    "festive recipes",
    # Discovery / AI-adjacent search terms (indexed for reach; app lead is pantry match)
    "AI recipe app",
    "recipe generator",
)

# Entire list comma-separated (copy-paste for manual posts / FB)
POST_SEO_KEYWORDS = ", ".join(POST_SEO_KEYWORDS_LIST)

# Keywords per caption chunk (~18 terms) — full list cycles across campaign post ids
_KEYWORDS_PER_POST = 18


def post_seo_keywords_for(post_id: int | None = None, max_chars: int = 580) -> str:
    """Return a comma-separated SEO line; rotates chunks by post_id across the full list."""
    if post_id is None:
        text = POST_SEO_KEYWORDS
    else:
        n = len(POST_SEO_KEYWORDS_LIST)
        start = ((int(post_id) - 1) * _KEYWORDS_PER_POST) % n
        chunk: list[str] = []
        for i in range(_KEYWORDS_PER_POST):
            chunk.append(POST_SEO_KEYWORDS_LIST[(start + i) % n])
        text = ", ".join(chunk)
    if len(text) > max_chars:
        return text[: max_chars - 1].rsplit(",", 1)[0]
    return text

# Short branded line (hook-adjacent posts still get full keyword line below CTA)
CAPTION_SEO_LINE = "Rasoi · Indian kitchen companion · Aaj kya banaye? · Jamvanu"

# Product line — aligned with BRAND_BRIEF (pantry match, not AI / meal planner)
CAPTION_VALUE_LINE = (
    "Decide dinner from your pantry — 15 cuisines, Veg/Jain filters, partner grocery checkout."
)

BASE_HASHTAGS = (
    "#Rasoi #RasoiApp #RecipeApp #IndianRecipeApp #Jamvanu #JamvanuRecipe "
    "#IndianFood #HomeCooking #DesiFood #IndianKitchen #WhatsForDinner "
    "#AajKyaBanaye #FoodTech #IndianStartup #AndroidApp #Recipe"
)

# Shorter set — better reach than 15+ tags (used in feed captions)
ENGAGEMENT_HASHTAGS = (
    "#RasoiApp #Jamvanu #AajKyaBanaye #IndianFood #HomeCooking "
    "#DesiFood #RecipeApp #IndianRecipeApp"
)
