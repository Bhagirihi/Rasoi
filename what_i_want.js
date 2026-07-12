/**
 * Rasoi recipe data contract
 *
 * Source of truth for scraped content: RASOI SCALPER
 *   /Users/dhruvdave/Documents/Dhruv/AI_CODE/RASOI SCALPER
 *   Parser: recipe_markdown_parser.py
 *   Sync:   sync_recipes_to_supabase.py, rebuild_recipes_to_supabase.py
 *
 * Status: SPEC ONLY — Supabase changes require explicit approval before upload.
 */

// ---------------------------------------------------------------------------
// Example markdown (Aam Panna) — canonical scrape format from RASOI SCALPER
// ---------------------------------------------------------------------------

export const EXAMPLE_MARKDOWN = `![Aam Panna](../images/Aam Panna.jpg)

Here is the correct way to make standard **Aam Panna**:

**Cuisine (kitchenStyleId)** - north (North Indian)
**Region** - North
**Diet** - Veg
**The Ingredients**
• Raw mango — 200g
• Sugar — 30g
• Mint — 10g
• Black salt — 3g

**Main Ingredients**
Raw mango, Sugar, Mint, Black salt

**The True Aam Panna Method**

1. **Step 1**
   Boil or roast raw mango until soft

2. **Step 2**
   Peel and extract pulp

3. **Step 3**
   Blend with sugar, mint, cumin, and black salt

4. **Step 4**
   Dilute with water and serve chilled with ice

**विधि (Method in Hindi)**

1. **चरण 1**
   कच्चे आम को नरम होने तक उबालें या भून लें

2. **चरण 2**
   छीलकर गूदा निकाल लें

3. **चरण 3**
   चीनी, पुदीना, जीरा और काला नमक मिला लें

4. **चरण 4**
   पानी में घोलें और बर्फ के साथ ठंडा परोसें

_Source: https://rasoirani.app/recipe/aam-panna_`;

// ---------------------------------------------------------------------------
// Markdown sections → meaning
// ---------------------------------------------------------------------------

export const MARKDOWN_SECTIONS = {
  cuisine: {
    header: '**Cuisine (kitchenStyleId)**',
    example: 'north (North Indian)',
    supabaseColumn: 'kitchenStyleId / cuisine',
    appUse: 'Filtering, regional picks, kitchen-style badges',
  },
  region: {
    header: '**Region**',
    example: 'North',
    supabaseColumn: 'region',
    appUse: 'Regional match, recipe ID prefix (SCALPER)',
  },
  diet: {
    header: '**Diet**',
    example: 'Veg',
    supabaseColumn: 'dietType / diet',
    appUse: 'Diet filters, badges',
  },
  theIngredients: {
    header: '**The Ingredients**',
    example: '• Raw mango — 200g\n• Sugar — 30g',
    supabaseColumn: 'ingredients (JSON array)',
    appUse: 'Recipe detail — full ingredient list WITH quantities for cooking',
    mustNotUseFor: 'Pantry match %, missing-items list, shop/checkout',
  },
  mainIngredients: {
    header: '**Main Ingredients**',
    example: 'Raw mango, Sugar, Mint, Black salt',
    supabaseColumn: 'main_ingredients (comma-separated text)',
    appUse: 'Pantry match %, missing-items list, Order missing, plan nudges',
    notes:
      'Clean ingredient names only — no quantities. Derived by enrich_main_ingredients.py from The Ingredients.',
  },
  methodEn: {
    header: '**The True <Recipe Name> Method**',
    example: 'Numbered steps in English',
    supabaseColumn: 'steps (JSON string array)',
    appUse: 'Recipe detail — Method tab when language = English',
    notes:
      'Steps may mention extra items (e.g. cumin, water, ice) that are not in Main Ingredients. That is OK.',
  },
  methodHi: {
    header: '**विधि (Method in Hindi)**',
    example: 'Numbered steps in Hindi',
    supabaseColumn: 'stepsHi (JSON string array)',
    appUse: 'Recipe detail — Method tab when language = Hindi',
  },
};

// ---------------------------------------------------------------------------
// Product rules (what the app must do)
// ---------------------------------------------------------------------------

export const APP_BEHAVIOR = {
  recipeDetail: {
    ingredientsSection: {
      source: 'theIngredients',
      display: 'Full list with quantities (e.g. "Raw mango — 200g")',
      pantryOverlay:
        'Show in-pantry / missing badges by matching Main Ingredients against user pantry — not by matching quantity strings',
    },
    methodSection: {
      source: 'methodEn | methodHi',
      toggle: 'User switches English ↔ Hindi on recipe detail',
      fallback: 'If stepsHi empty, show English only; never generate steps from templates',
    },
  },
  pantryAndMissing: {
    source: 'mainIngredients',
    appliesTo: [
      'Pantry match % on Home, Recipes tab, Recipe detail hero',
      'Missing ingredients strip ("Order missing")',
      'MissingItemsPanel / shop checkout',
      'Plan tab pantry nudge',
    ],
    mustNotUse: 'theIngredients (quantity strings break canonical pantry matching)',
  },
  listViews: {
    ingredientsPayload: 'May omit steps for egress; main_ingredients needed for pantry match on cards',
  },
};

// ---------------------------------------------------------------------------
// Supabase field mapping (post-approval sync plan)
// ---------------------------------------------------------------------------

export const SUPABASE_MAPPING = {
  fromScalperMarkdown: {
    'The Ingredients': {
      column: 'ingredients',
      format: 'JSON [{ name, isStaple }]',
      scalperParser: 'recipe_markdown_parser._ingredients_json',
      fixNeeded:
        'Store display names WITH quantities in name field (e.g. "Raw mango — 200g"), not stripped names',
    },
    'Main Ingredients': {
      column: 'main_ingredients',
      format: 'Comma-separated text',
      scalperParser: 'recipe_markdown_parser main_block',
      fixNeeded: 'Already populated by rebuild; sync_recipes_to_supabase must also write this column',
    },
    'The True … Method': {
      column: 'steps',
      format: 'JSON string[]',
      scalperParser: 'recipe_markdown_parser._parse_steps (EN)',
      fixNeeded: 'North_Aam_Panna_Veg currently has steps = null — re-sync from SCALPER markdown',
    },
    'विधि (Method in Hindi)': {
      column: 'stepsHi',
      format: 'JSON string[]',
      scalperParser: 'recipe_markdown_parser._parse_steps (HI)',
      fixNeeded: 'North_Aam_Panna_Veg currently has stepsHi = null — re-sync from SCALPER markdown',
    },
  },
  appColumns: {
    kitchenStyleId: 'From Cuisine line',
    region: 'From Region line',
    dietType: 'From Diet line',
    primaryIngredient: 'First Main Ingredient (SCALPER primary_ingredient)',
    imageUrl: 'Uploaded hero from SCALPER images/',
  },
};

// ---------------------------------------------------------------------------
// Current gaps (verified 2026-07-12)
// ---------------------------------------------------------------------------

export const CURRENT_GAPS = {
  supabase: {
    exampleRecipeId: 'North_Aam_Panna_Veg',
    issues: [
      'ingredients stores quantity strings in name — correct for detail display, wrong source for pantry (app uses this today)',
      'main_ingredients is populated ("Raw mango, Sugar, Mint, Black salt") but app/API do not read it',
      'steps and stepsHi are null despite valid markdown in SCALPER outputs/recipes/Aam Panna.md',
    ],
  },
  scalper: {
    syncPayload: 'sync_recipes_to_supabase.build_payload writes ingredients, steps, stepsHi — not main_ingredients',
    ingredientsJson: 'Parser strips quantities from ingredient names (stores "Raw mango" not "Raw mango — 200g")',
  },
  rasoiApp: {
    pantryMatch: 'partitionIngredients / getPantryMatchPercent use recipe.ingredients — should use main ingredients',
    api: 'Serializers do not expose mainIngredients; backend has no main_ingredients field in types',
  },
};

// ---------------------------------------------------------------------------
// Planned work (awaiting approval)
// ---------------------------------------------------------------------------

export const PLANNED_WORK = {
  phase1_scalper: {
    status: 'done',
    items: [
      'Fix recipe_markdown_parser to preserve quantity in ingredients[].name for display',
      'Add main_ingredients to sync_recipes_to_supabase.build_payload',
      'Add main_ingredients + --match-supabase to generate_sync_sql.py',
    ],
  },
  phase2_supabase: {
    status: 'done',
    approvalRequired: true,
    executedAt: '2026-07-12',
    results: {
      recipesUpdated: 287,
      batchesRun: 2,
      verifiedRecipeId: 'North_Aam_Panna_Veg',
      verifiedStepsEn: 4,
      verifiedStepsHi: 4,
      note: 'Only recipes with local SCALPER markdown (289 files) were updated. Remaining ~7765 Supabase recipes still lack steps until scraped.',
    },
  },
  phase3_app: {
    status: 'done',
    items: [
      'Expose mainIngredients on API + mobile Recipe type',
      'Switch pantry match / missing lists to mainIngredients',
      'Keep recipe detail ingredients list on full ingredients (with quantities)',
      'Ensure method toggle reads steps / stepsHi from DB only (no template generation)',
    ],
  },
};

export default {
  EXAMPLE_MARKDOWN,
  MARKDOWN_SECTIONS,
  APP_BEHAVIOR,
  SUPABASE_MAPPING,
  CURRENT_GAPS,
  PLANNED_WORK,
};
