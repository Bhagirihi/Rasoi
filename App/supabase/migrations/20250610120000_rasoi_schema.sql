-- Rasoi — Supabase schema + seed data
-- Run in Supabase SQL Editor or via: supabase db push

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.diet_type AS ENUM ('Veg', 'Egg', 'Non-Veg');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.diet_choice AS ENUM ('Veg', 'Egg', 'Non-Veg', 'Jain');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.recipe_difficulty AS ENUM ('Easy', 'Medium', 'Hard');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.plan_tier AS ENUM ('free', 'trial', 'paid');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.pantry_section AS ENUM (
    'Staples', 'Veggies', 'Dairy', 'Protein', 'Other'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.affiliate_partner AS ENUM (
    'blinkit', 'zepto', 'instamart', 'zomato', 'swiggy'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.sponsor_placement AS ENUM ('home', 'pantry');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.subscription_event_type AS ENUM (
    'trial_started', 'subscribed', 'renewed', 'cancelled', 'expired', 'refunded'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- Reference: cuisines
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cuisines (
  id text PRIMARY KEY,
  label text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  mood text NOT NULL DEFAULT '',
  region text NOT NULL,
  hero_image text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Reference: ingredients (pantry master list)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  section public.pantry_section NOT NULL,
  is_staple boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Recipes
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recipes (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  prep_time int NOT NULL CHECK (prep_time > 0),
  calories int NOT NULL CHECK (calories >= 0),
  region text NOT NULL,
  diet_type public.diet_type NOT NULL,
  difficulty public.recipe_difficulty NOT NULL DEFAULT 'Easy',
  image_url text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.recipe_ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id text NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  ingredient_id uuid NOT NULL REFERENCES public.ingredients(id) ON DELETE RESTRICT,
  sort_order int NOT NULL DEFAULT 0,
  brand_name text,
  brand_logo_url text,
  UNIQUE (recipe_id, ingredient_id)
);

CREATE TABLE IF NOT EXISTS public.recipe_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id text NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  step_number int NOT NULL CHECK (step_number > 0),
  instruction text NOT NULL,
  UNIQUE (recipe_id, step_number)
);

-- ---------------------------------------------------------------------------
-- User & preferences
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  onboarding_completed_at timestamptz,
  diet_choice public.diet_choice NOT NULL DEFAULT 'Veg',
  regional_cuisine text NOT NULL DEFAULT 'All India',
  notifications_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_favorite_cuisines (
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cuisine_id text NOT NULL REFERENCES public.cuisines(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, cuisine_id)
);

CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_tier public.plan_tier NOT NULL DEFAULT 'free',
  trial_started_at timestamptz,
  has_used_trial boolean NOT NULL DEFAULT false,
  paid_until timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_pantry_items (
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ingredient_id uuid NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
  added_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, ingredient_id)
);

CREATE TABLE IF NOT EXISTS public.saved_recipes (
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipe_id text NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  saved_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, recipe_id)
);

-- ---------------------------------------------------------------------------
-- Monetization & ops (optional tables)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  placement public.sponsor_placement NOT NULL,
  brand_name text NOT NULL,
  product_label text NOT NULL DEFAULT '',
  tagline text NOT NULL DEFAULT '',
  logo_url text NOT NULL DEFAULT '',
  cta text NOT NULL DEFAULT 'View deal',
  search_query text,
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.affiliate_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  partner public.affiliate_partner NOT NULL,
  recipe_id text REFERENCES public.recipes(id) ON DELETE SET NULL,
  recipe_title text,
  missing_items text[] NOT NULL DEFAULT '{}',
  source_screen text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.subscription_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type public.subscription_event_type NOT NULL,
  plan_tier public.plan_tier,
  amount_inr numeric(10, 2),
  provider text,
  provider_reference text,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.push_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  expo_push_token text NOT NULL,
  platform text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, expo_push_token)
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_recipes_published ON public.recipes (published);
CREATE INDEX IF NOT EXISTS idx_recipes_region ON public.recipes (region);
CREATE INDEX IF NOT EXISTS idx_recipes_diet ON public.recipes (diet_type);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe ON public.recipe_ingredients (recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_steps_recipe ON public.recipe_steps (recipe_id);
CREATE INDEX IF NOT EXISTS idx_user_pantry_user ON public.user_pantry_items (user_id);
CREATE INDEX IF NOT EXISTS idx_saved_recipes_user ON public.saved_recipes (user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_events_user ON public.affiliate_events (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sponsors_placement ON public.sponsors (placement, active);

-- ---------------------------------------------------------------------------
-- Updated-at trigger
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS recipes_set_updated_at ON public.recipes;
CREATE TRIGGER recipes_set_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS user_subscriptions_set_updated_at ON public.user_subscriptions;
CREATE TRIGGER user_subscriptions_set_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS push_tokens_set_updated_at ON public.push_tokens;
CREATE TRIGGER push_tokens_set_updated_at
  BEFORE UPDATE ON public.push_tokens
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile + subscription on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_subscriptions (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed default pantry for new users
CREATE OR REPLACE FUNCTION public.seed_default_pantry_for_user(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_pantry_items (user_id, ingredient_id)
  SELECT p_user_id, i.id
  FROM public.ingredients i
  WHERE i.name IN ('Atta', 'Rice', 'Dal', 'Namak', 'Oil', 'Haldi')
  ON CONFLICT DO NOTHING;
END;
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE public.cuisines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorite_cuisines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_pantry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;

-- Public read (reference + published content)
DROP POLICY IF EXISTS cuisines_public_read ON public.cuisines;
CREATE POLICY cuisines_public_read ON public.cuisines
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS ingredients_public_read ON public.ingredients;
CREATE POLICY ingredients_public_read ON public.ingredients
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS recipes_public_read ON public.recipes;
CREATE POLICY recipes_public_read ON public.recipes
  FOR SELECT TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS recipe_ingredients_public_read ON public.recipe_ingredients;
CREATE POLICY recipe_ingredients_public_read ON public.recipe_ingredients
  FOR SELECT TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM public.recipes r
    WHERE r.id = recipe_id AND r.published = true
  ));

DROP POLICY IF EXISTS recipe_steps_public_read ON public.recipe_steps;
CREATE POLICY recipe_steps_public_read ON public.recipe_steps
  FOR SELECT TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM public.recipes r
    WHERE r.id = recipe_id AND r.published = true
  ));

DROP POLICY IF EXISTS sponsors_public_read ON public.sponsors;
CREATE POLICY sponsors_public_read ON public.sponsors
  FOR SELECT TO anon, authenticated
  USING (
    active = true
    AND (starts_at IS NULL OR starts_at <= now())
    AND (ends_at IS NULL OR ends_at >= now())
  );

-- Profiles: own row only
DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
CREATE POLICY profiles_insert_own ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- User favorite cuisines
DROP POLICY IF EXISTS user_favorite_cuisines_all_own ON public.user_favorite_cuisines;
CREATE POLICY user_favorite_cuisines_all_own ON public.user_favorite_cuisines
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Subscriptions: read own; updates via service role / edge functions in production
DROP POLICY IF EXISTS user_subscriptions_select_own ON public.user_subscriptions;
CREATE POLICY user_subscriptions_select_own ON public.user_subscriptions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS user_subscriptions_update_own ON public.user_subscriptions;
CREATE POLICY user_subscriptions_update_own ON public.user_subscriptions
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Pantry items
DROP POLICY IF EXISTS user_pantry_items_all_own ON public.user_pantry_items;
CREATE POLICY user_pantry_items_all_own ON public.user_pantry_items
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Saved recipes
DROP POLICY IF EXISTS saved_recipes_all_own ON public.saved_recipes;
CREATE POLICY saved_recipes_all_own ON public.saved_recipes
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Affiliate events: insert own, read own
DROP POLICY IF EXISTS affiliate_events_insert_own ON public.affiliate_events;
CREATE POLICY affiliate_events_insert_own ON public.affiliate_events
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS affiliate_events_select_own ON public.affiliate_events;
CREATE POLICY affiliate_events_select_own ON public.affiliate_events
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Subscription events: read own
DROP POLICY IF EXISTS subscription_events_select_own ON public.subscription_events;
CREATE POLICY subscription_events_select_own ON public.subscription_events
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Push tokens
DROP POLICY IF EXISTS push_tokens_all_own ON public.push_tokens;
CREATE POLICY push_tokens_all_own ON public.push_tokens
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- SEED: cuisines
-- ---------------------------------------------------------------------------
INSERT INTO public.cuisines (id, label, tagline, mood, region, hero_image, sort_order)
VALUES
  ('gujarati', 'Gujarati Home', 'Light, sweet-savoury everyday thali vibes', 'Comfort', 'West',
   'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', 1),
  ('street', 'Street Food', 'Pav bhaji, chaat & late-evening cravings', 'Bold', 'West',
   'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80', 2),
  ('south', 'South Indian', 'Crisp dosas, sambar & coconut-led flavours', 'Fresh', 'South',
   'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80', 3),
  ('north', 'North Indian', 'Rich gravies, tandoori warmth & parathas', 'Hearty', 'North',
   'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80', 4)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  tagline = EXCLUDED.tagline,
  mood = EXCLUDED.mood,
  region = EXCLUDED.region,
  hero_image = EXCLUDED.hero_image,
  sort_order = EXCLUDED.sort_order;

-- ---------------------------------------------------------------------------
-- SEED: ingredients (pantry + recipe extras)
-- ---------------------------------------------------------------------------
INSERT INTO public.ingredients (name, section, is_staple)
VALUES
  ('Atta', 'Staples', true),
  ('Rice', 'Staples', true),
  ('Chawal', 'Staples', true),
  ('Dal', 'Staples', true),
  ('Besan', 'Staples', true),
  ('Jeera', 'Staples', true),
  ('Haldi', 'Staples', true),
  ('Namak', 'Staples', true),
  ('Oil', 'Staples', true),
  ('Mustard Oil', 'Staples', true),
  ('Poha', 'Staples', true),
  ('Rava', 'Staples', true),
  ('Aloo', 'Veggies', false),
  ('Pyaaz', 'Veggies', false),
  ('Tamatar', 'Veggies', false),
  ('Gobi', 'Veggies', false),
  ('Bhindi', 'Veggies', false),
  ('Palak', 'Veggies', false),
  ('Matar', 'Veggies', false),
  ('Mirch', 'Veggies', false),
  ('Adrak', 'Veggies', false),
  ('Paneer', 'Dairy', false),
  ('Dahi', 'Dairy', false),
  ('Milk', 'Dairy', false),
  ('Ghee', 'Dairy', false),
  ('Butter', 'Dairy', false),
  ('Cream', 'Dairy', false),
  ('Eggs', 'Dairy', false),
  ('Chicken', 'Protein', false),
  ('Fish', 'Protein', false)
ON CONFLICT (name) DO UPDATE SET
  section = EXCLUDED.section,
  is_staple = EXCLUDED.is_staple;

-- ---------------------------------------------------------------------------
-- SEED: recipes (ids match app mockRecipes.ts)
-- ---------------------------------------------------------------------------
INSERT INTO public.recipes (
  id, title, description, prep_time, calories, region, diet_type, difficulty, image_url, tags
)
VALUES
  ('1', 'Masala Dosa with Coconut Chutney',
   'Crispy fermented rice crepe with spiced potato filling and fresh coconut chutney.',
   35, 420, 'South', 'Veg', 'Medium',
   'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80',
   ARRAY['festive']),
  ('2', 'Paneer Butter Masala',
   'Rich tomato-cashew gravy with soft paneer cubes — a North Indian classic.',
   25, 510, 'North', 'Veg', 'Easy',
   'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80',
   ARRAY['under20', 'kids']),
  ('3', 'Egg Bhurji Pav',
   'Spicy scrambled eggs with Mumbai-style pav — perfect street-food breakfast.',
   15, 380, 'West', 'Egg', 'Easy',
   'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80',
   ARRAY['under20', 'quick', 'kids']),
  ('4', 'Chicken Biryani',
   'Fragrant layered biryani with marinated chicken and saffron-infused basmati rice.',
   55, 620, 'South', 'Non-Veg', 'Hard',
   'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
   ARRAY['festive']),
  ('5', 'Aloo Paratha with Dahi',
   'Stuffed whole-wheat flatbread with spiced potato — Punjabi comfort food.',
   20, 440, 'North', 'Veg', 'Easy',
   'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80',
   ARRAY['under20', 'kids', 'leftover']),
  ('6', 'Dal Tadka with Jeera Rice',
   'Smoky tempered yellow dal paired with fragrant jeera rice.',
   30, 390, 'North', 'Veg', 'Easy',
   'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80',
   ARRAY['kids', 'leftover']),
  ('7', 'Poha with Peanuts',
   'Light flattened rice breakfast with peanuts, curry leaves, and lemon.',
   12, 310, 'West', 'Veg', 'Easy',
   'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80',
   ARRAY['under20', 'quick', 'kids']),
  ('8', 'Fish Curry with Steamed Rice',
   'Mustard-kissed Bengali fish curry with tender ilish or rohu fillets.',
   35, 480, 'East', 'Non-Veg', 'Medium',
   'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80',
   ARRAY['festive']),
  ('9', 'Palak Paneer Roti Bowl',
   'Creamy spinach gravy with paneer, served with hot phulka rotis.',
   22, 460, 'North', 'Veg', 'Easy',
   'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
   ARRAY['under20', 'kids']),
  ('10', 'Leftover Rice Lemon Pulao',
   'Transform yesterday''s rice into zesty lemon pulao with peanuts and curry leaves.',
   14, 340, 'Central', 'Veg', 'Easy',
   'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80',
   ARRAY['under20', 'leftover', 'quick']),
  ('11', 'Egg Curry with Roti',
   'Boiled eggs simmered in a spiced onion-tomato gravy — a Bengali household staple.',
   25, 430, 'East', 'Egg', 'Medium',
   'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80',
   ARRAY['kids']),
  ('12', 'Bhindi Masala with Dal',
   'Crispy okra stir-fry with a side of homestyle moong dal.',
   28, 370, 'Central', 'Veg', 'Easy',
   'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80',
   ARRAY['kids', 'leftover']),
  ('13', 'Matar Paneer Curry',
   'Peas and paneer in a mildly spiced tomato-onion gravy.',
   24, 495, 'North', 'Veg', 'Easy',
   'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80',
   ARRAY['under20', 'kids']),
  ('14', 'Chicken Tikka Wrap',
   'Smoky tandoori chicken wrapped in roomali roti with mint chutney.',
   18, 520, 'North', 'Non-Veg', 'Medium',
   'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
   ARRAY['under20', 'quick']),
  ('15', 'Vegetable Upma',
   'Semolina upma with mixed veggies — a quick South Indian tiffin favourite.',
   16, 290, 'South', 'Veg', 'Easy',
   'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80',
   ARRAY['under20', 'quick', 'kids', 'leftover'])
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  prep_time = EXCLUDED.prep_time,
  calories = EXCLUDED.calories,
  region = EXCLUDED.region,
  diet_type = EXCLUDED.diet_type,
  difficulty = EXCLUDED.difficulty,
  image_url = EXCLUDED.image_url,
  tags = EXCLUDED.tags,
  published = true;

-- ---------------------------------------------------------------------------
-- SEED: recipe_ingredients
-- ---------------------------------------------------------------------------
DELETE FROM public.recipe_ingredients;

INSERT INTO public.recipe_ingredients (recipe_id, ingredient_id, sort_order, brand_name, brand_logo_url)
SELECT v.recipe_id, i.id, v.sort_order, v.brand_name, v.brand_logo_url
FROM (VALUES
  ('1', 'Rice', 1, NULL::text, NULL::text),
  ('1', 'Besan', 2, NULL, NULL),
  ('1', 'Aloo', 3, NULL, NULL),
  ('1', 'Pyaaz', 4, NULL, NULL),
  ('1', 'Oil', 5, NULL, NULL),
  ('1', 'Namak', 6, NULL, NULL),
  ('1', 'Jeera', 7, NULL, NULL),
  ('2', 'Paneer', 1, 'Amul Paneer', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Amul_Logo.svg/120px-Amul_Logo.svg.png'),
  ('2', 'Tamatar', 2, NULL, NULL),
  ('2', 'Pyaaz', 3, NULL, NULL),
  ('2', 'Butter', 4, 'Amul Butter', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Amul_Logo.svg/120px-Amul_Logo.svg.png'),
  ('2', 'Cream', 5, NULL, NULL),
  ('2', 'Haldi', 6, NULL, NULL),
  ('2', 'Mirch', 7, NULL, NULL),
  ('3', 'Eggs', 1, NULL, NULL),
  ('3', 'Pyaaz', 2, NULL, NULL),
  ('3', 'Tamatar', 3, NULL, NULL),
  ('3', 'Mirch', 4, NULL, NULL),
  ('3', 'Oil', 5, NULL, NULL),
  ('3', 'Namak', 6, NULL, NULL),
  ('4', 'Chicken', 1, NULL, NULL),
  ('4', 'Rice', 2, NULL, NULL),
  ('4', 'Dahi', 3, NULL, NULL),
  ('4', 'Pyaaz', 4, NULL, NULL),
  ('4', 'Adrak', 5, NULL, NULL),
  ('4', 'Mirch', 6, NULL, NULL),
  ('4', 'Ghee', 7, NULL, NULL),
  ('5', 'Atta', 1, NULL, NULL),
  ('5', 'Aloo', 2, NULL, NULL),
  ('5', 'Jeera', 3, NULL, NULL),
  ('5', 'Mirch', 4, NULL, NULL),
  ('5', 'Dahi', 5, NULL, NULL),
  ('5', 'Ghee', 6, NULL, NULL),
  ('6', 'Dal', 1, NULL, NULL),
  ('6', 'Rice', 2, NULL, NULL),
  ('6', 'Tamatar', 3, NULL, NULL),
  ('6', 'Pyaaz', 4, NULL, NULL),
  ('6', 'Jeera', 5, NULL, NULL),
  ('6', 'Haldi', 6, NULL, NULL),
  ('6', 'Ghee', 7, NULL, NULL),
  ('7', 'Poha', 1, NULL, NULL),
  ('7', 'Pyaaz', 2, NULL, NULL),
  ('7', 'Mirch', 3, NULL, NULL),
  ('7', 'Oil', 4, NULL, NULL),
  ('7', 'Namak', 5, NULL, NULL),
  ('7', 'Jeera', 6, NULL, NULL),
  ('8', 'Fish', 1, NULL, NULL),
  ('8', 'Rice', 2, NULL, NULL),
  ('8', 'Mustard Oil', 3, NULL, NULL),
  ('8', 'Tamatar', 4, NULL, NULL),
  ('8', 'Haldi', 5, NULL, NULL),
  ('8', 'Mirch', 6, NULL, NULL),
  ('9', 'Paneer', 1, 'Amul Paneer', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Amul_Logo.svg/120px-Amul_Logo.svg.png'),
  ('9', 'Palak', 2, NULL, NULL),
  ('9', 'Atta', 3, NULL, NULL),
  ('9', 'Cream', 4, NULL, NULL),
  ('9', 'Pyaaz', 5, NULL, NULL),
  ('9', 'Mirch', 6, NULL, NULL),
  ('10', 'Rice', 1, NULL, NULL),
  ('10', 'Pyaaz', 2, NULL, NULL),
  ('10', 'Mirch', 3, NULL, NULL),
  ('10', 'Oil', 4, NULL, NULL),
  ('10', 'Jeera', 5, NULL, NULL),
  ('10', 'Namak', 6, NULL, NULL),
  ('11', 'Eggs', 1, NULL, NULL),
  ('11', 'Tamatar', 2, NULL, NULL),
  ('11', 'Pyaaz', 3, NULL, NULL),
  ('11', 'Atta', 4, NULL, NULL),
  ('11', 'Haldi', 5, NULL, NULL),
  ('11', 'Mirch', 6, NULL, NULL),
  ('11', 'Oil', 7, NULL, NULL),
  ('12', 'Bhindi', 1, NULL, NULL),
  ('12', 'Dal', 2, NULL, NULL),
  ('12', 'Pyaaz', 3, NULL, NULL),
  ('12', 'Tamatar', 4, NULL, NULL),
  ('12', 'Jeera', 5, NULL, NULL),
  ('12', 'Oil', 6, NULL, NULL),
  ('13', 'Paneer', 1, 'Amul Paneer', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Amul_Logo.svg/120px-Amul_Logo.svg.png'),
  ('13', 'Matar', 2, NULL, NULL),
  ('13', 'Tamatar', 3, NULL, NULL),
  ('13', 'Cream', 4, NULL, NULL),
  ('13', 'Butter', 5, NULL, NULL),
  ('13', 'Mirch', 6, NULL, NULL),
  ('14', 'Chicken', 1, NULL, NULL),
  ('14', 'Atta', 2, NULL, NULL),
  ('14', 'Dahi', 3, NULL, NULL),
  ('14', 'Mirch', 4, NULL, NULL),
  ('14', 'Adrak', 5, NULL, NULL),
  ('14', 'Oil', 6, NULL, NULL),
  ('15', 'Rava', 1, NULL, NULL),
  ('15', 'Pyaaz', 2, NULL, NULL),
  ('15', 'Tamatar', 3, NULL, NULL),
  ('15', 'Matar', 4, NULL, NULL),
  ('15', 'Oil', 5, NULL, NULL),
  ('15', 'Jeera', 6, NULL, NULL)
) AS v(recipe_id, ingredient_name, sort_order, brand_name, brand_logo_url)
JOIN public.ingredients i ON i.name = v.ingredient_name;

-- ---------------------------------------------------------------------------
-- SEED: recipe_steps
-- ---------------------------------------------------------------------------
DELETE FROM public.recipe_steps;

INSERT INTO public.recipe_steps (recipe_id, step_number, instruction)
VALUES
  ('1', 1, 'Soak rice and urad dal for 4–6 hours, then grind to a smooth batter and ferment overnight.'),
  ('1', 2, 'Boil potatoes with spices; mash into a dry masala filling with mustard seeds and curry leaves.'),
  ('1', 3, 'Spread batter thin on a hot tawa, add filling, fold, and cook until crisp and golden.'),
  ('1', 4, 'Blend fresh coconut with green chillies for chutney; serve dosa hot with chutney.'),
  ('2', 1, 'Sauté onions and tomatoes until soft; blend with cashews into a smooth gravy base.'),
  ('2', 2, 'Return gravy to pan, add butter, cream, and spices; simmer until rich and glossy.'),
  ('2', 3, 'Add paneer cubes gently; coat in gravy without breaking them.'),
  ('2', 4, 'Garnish with cream and serve with naan or rice.'),
  ('3', 1, 'Beat eggs with salt; finely chop onion, tomato, and green chilli.'),
  ('3', 2, 'Heat oil, sauté onions until golden, then add tomato and spices.'),
  ('3', 3, 'Pour in eggs and scramble on high heat until fluffy but moist.'),
  ('3', 4, 'Toast pav with butter and serve bhurji stuffed in pav.'),
  ('4', 1, 'Marinate chicken in yogurt, ginger-garlic paste, and biryani spices for 30 minutes.'),
  ('4', 2, 'Par-cook basmati rice with whole spices until 70% done; drain.'),
  ('4', 3, 'Layer rice and chicken in a heavy pot; add saffron milk and fried onions.'),
  ('4', 4, 'Seal and dum-cook on low heat 25 minutes; rest 10 minutes before serving.'),
  ('5', 1, 'Boil and mash potatoes with cumin, chilli, and salt for the filling.'),
  ('5', 2, 'Knead atta into a soft dough; roll a disc, stuff with potato, seal, and roll again.'),
  ('5', 3, 'Cook on a tawa with ghee until golden spots appear on both sides.'),
  ('5', 4, 'Serve hot with fresh dahi and pickle.'),
  ('6', 1, 'Pressure-cook dal with turmeric until soft; mash lightly.'),
  ('6', 2, 'Prepare jeera rice: temper cumin in ghee, add rice and water, cook until fluffy.'),
  ('6', 3, 'For tadka, sizzle garlic, cumin, and dried red chilli in ghee; pour over dal.'),
  ('6', 4, 'Serve dal tadka with jeera rice and a wedge of lemon.'),
  ('7', 1, 'Rinse poha and drain; keep aside to soften for 5 minutes.'),
  ('7', 2, 'Temper mustard seeds, curry leaves, and peanuts in oil.'),
  ('7', 3, 'Add onion and green chilli; stir in poha, turmeric, salt, and lemon juice.'),
  ('7', 4, 'Cover for 2 minutes; serve garnished with coriander.'),
  ('8', 1, 'Marinate fish with turmeric and salt; lightly fry until golden.'),
  ('8', 2, 'Make a paste of mustard seeds and green chilli; sauté with tomato.'),
  ('8', 3, 'Add water and simmer gravy; gently slide fish in and cook 8–10 minutes.'),
  ('8', 4, 'Serve with steamed rice and extra mustard oil on top.'),
  ('9', 1, 'Blanch palak and blend to a smooth purée.'),
  ('9', 2, 'Sauté onion, ginger, and garlic; add spices and palak purée; simmer.'),
  ('9', 3, 'Add paneer cubes and cream; cook gently for 5 minutes.'),
  ('9', 4, 'Roll atta into phulkas on tawa; serve bowl with roti on the side.'),
  ('10', 1, 'Fluff leftover rice to separate grains.'),
  ('10', 2, 'Temper mustard seeds, peanuts, and curry leaves in oil.'),
  ('10', 3, 'Add onion, green chilli, turmeric, and rice; toss on high heat.'),
  ('10', 4, 'Finish with lemon juice and fresh coriander.'),
  ('11', 1, 'Hard-boil eggs, peel, and lightly fry until blistered.'),
  ('11', 2, 'Cook onion-tomato masala with ginger-garlic and Bengali spices.'),
  ('11', 3, 'Add water for gravy consistency; simmer eggs 10 minutes.'),
  ('11', 4, 'Serve with fresh roti and sliced onion.'),
  ('12', 1, 'Wash and dry bhindi; slice and shallow-fry until crisp.'),
  ('12', 2, 'Pressure-cook moong dal with turmeric until soft.'),
  ('12', 3, 'Temper dal with cumin, garlic, and dried chilli.'),
  ('12', 4, 'Plate bhindi masala with dal and rice or roti.'),
  ('13', 1, 'Sauté onion-tomato paste with ginger-garlic and garam masala.'),
  ('13', 2, 'Add peas and a splash of water; simmer until peas are tender.'),
  ('13', 3, 'Add paneer and cream; cook gently without stirring too much.'),
  ('13', 4, 'Serve with butter naan or jeera rice.'),
  ('14', 1, 'Marinate chicken chunks in yogurt, tandoori masala, and lemon for 1 hour.'),
  ('14', 2, 'Grill or pan-sear chicken until charred and cooked through.'),
  ('14', 3, 'Warm roomali roti; spread mint chutney and sliced onion.'),
  ('14', 4, 'Wrap chicken in roti and serve immediately.'),
  ('15', 1, 'Dry-roast rava until fragrant; set aside.'),
  ('15', 2, 'Temper mustard seeds, urad dal, curry leaves, and vegetables in oil.'),
  ('15', 3, 'Add water, salt, and rava; stir continuously to avoid lumps.'),
  ('15', 4, 'Cover and steam 3 minutes; serve hot with coconut chutney.');

-- ---------------------------------------------------------------------------
-- SEED: sponsors
-- ---------------------------------------------------------------------------
DELETE FROM public.sponsors;

INSERT INTO public.sponsors (
  placement, brand_name, product_label, tagline, logo_url, cta, search_query, active, sort_order
)
VALUES
  ('home', 'Amul', 'Amul Paneer — tonight''s dinner sorted',
   'Fresh block paneer, perfect for curries',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Amul_Logo.svg/120px-Amul_Logo.svg.png',
   'View deal', 'Paneer', true, 1),
  ('pantry', 'Tata Sampann', 'Restock dal & spices in one order',
   'Sponsored pantry essentials bundle',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_logo.svg/120px-Tata_logo.svg.png',
   'View deal', 'Dal', true, 1);

-- ---------------------------------------------------------------------------
-- Helpful views (optional)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.recipes_with_ingredient_count AS
SELECT
  r.*,
  COUNT(ri.id)::int AS ingredient_count
FROM public.recipes r
LEFT JOIN public.recipe_ingredients ri ON ri.recipe_id = r.id
GROUP BY r.id;

GRANT SELECT ON public.recipes_with_ingredient_count TO anon, authenticated;
