-- Recipe search history (home screen and future surfaces)
CREATE TABLE IF NOT EXISTS public.recipe_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text,
  query text NOT NULL CHECK (char_length(trim(query)) >= 1),
  source_screen text NOT NULL DEFAULT 'home',
  result_count int CHECK (result_count IS NULL OR result_count >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recipe_searches_user_created
  ON public.recipe_searches (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_recipe_searches_query
  ON public.recipe_searches (query);

ALTER TABLE public.recipe_searches ENABLE ROW LEVEL SECURITY;

-- Inserts go through backend service role; users can read their own history later.
DROP POLICY IF EXISTS recipe_searches_select_own ON public.recipe_searches;
CREATE POLICY recipe_searches_select_own ON public.recipe_searches
  FOR SELECT TO authenticated
  USING (user_id = auth.uid()::text);
