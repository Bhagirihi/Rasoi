/**
 * Rasoi API smoke tests — run with backend up: npm run dev (005) then npx tsx scripts/qa-api-smoke.ts
 */
const BASE = process.env.QA_API_URL ?? 'http://localhost:3000';

type Envelope<T> = { ok: boolean; data?: T; error?: string };

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<{ status: number; body: Envelope<T> }> {
  const response = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });
  const body = (await response.json()) as Envelope<T>;
  return { status: response.status, body };
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

async function main(): Promise<void> {
  const results: Array<{ id: string; pass: boolean; note?: string }> = [];

  const record = (id: string, pass: boolean, note?: string) => {
    results.push({ id, pass, note });
    console.log(`${pass ? 'PASS' : 'FAIL'} ${id}${note ? ` — ${note}` : ''}`);
  };

  try {
    const recipes = await request<Array<{ id: string }>>('/api/recipes');
    record('TC-API-01', recipes.body.ok && Array.isArray(recipes.body.data), 'GET /api/recipes');

    const reference = await request<{ regionalCuisines: string[] }>('/api/reference');
    record(
      'TC-API-02',
      reference.body.ok && (reference.body.data?.regionalCuisines.length ?? 0) > 0,
      'GET /api/reference',
    );

    const partners = await request<unknown[]>('/api/partners');
    record('TC-API-03', partners.body.ok && Array.isArray(partners.body.data), 'GET /api/partners');

    const guest = await request<{ token: string; user: { id: string } }>('/api/auth/guest', {
      method: 'POST',
    });
    record('TC-API-04', guest.body.ok && Boolean(guest.body.data?.token), 'POST /api/auth/guest');
    const token = guest.body.data?.token ?? '';

    const me = await request<{ id: string }>('/api/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    record('TC-API-05', me.body.ok && me.body.data?.id === guest.body.data?.user.id, 'GET /api/users/me');

    const onboarding = await request<{ hasCompletedOnboarding: boolean }>('/api/users/me/onboarding', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        dietPreference: 'Veg',
        dietChoice: 'Jain',
        regionalCuisine: 'West',
        favoriteCuisines: ['gujarati'],
        notificationsEnabled: false,
      }),
    });
    record(
      'TC-API-06',
      onboarding.body.ok && onboarding.body.data?.hasCompletedOnboarding === true,
      'POST /api/users/me/onboarding',
    );

    const plan = await request<{ planTier: string; hasUsedTrial: boolean }>('/api/users/me/plan', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        planTier: 'trial',
        trialStartedAt: new Date().toISOString(),
        hasUsedTrial: true,
      }),
    });
    const planData = plan.body.data;
    record(
      'TC-API-07',
      plan.body.ok &&
        planData?.planTier === 'trial' &&
        !('id' in (planData ?? {})),
      'PUT /api/users/me/plan returns plan object only',
    );

    const pantry = await request<unknown>('/api/users/me/pantry', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ingredients: [] }),
    });
    record('TC-API-08', pantry.body.ok, 'PUT /api/users/me/pantry empty list');

    const recipeId = recipes.body.data?.[0]?.id;
    if (recipeId) {
      const detail = await request<{ id: string }>(`/api/recipes/${recipeId}`);
      record('TC-API-09', detail.body.ok && detail.body.data?.id === recipeId, 'GET /api/recipes/:id');
    } else {
      record('TC-API-09', false, 'No recipes seeded');
    }

    const badPhone = await request<unknown>('/api/auth/supabase-sync', {
      method: 'POST',
      headers: { Authorization: 'Bearer invalid-token' },
      body: JSON.stringify({ name: 'Test User', phone: '9876543210' }),
    });
    record(
      'TC-API-10',
      badPhone.status === 401 || badPhone.status === 503,
      `supabase-sync rejects invalid token or missing config (${badPhone.status})`,
    );
  } catch (error) {
    console.error('Smoke test aborted:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
    return;
  }

  const failed = results.filter((item) => !item.pass);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length > 0) process.exitCode = 1;
}

void main();
