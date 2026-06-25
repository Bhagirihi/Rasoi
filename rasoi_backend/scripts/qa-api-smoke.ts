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
  const raw = await response.text();
  try {
    const body = JSON.parse(raw) as Envelope<T>;
    return { status: response.status, body };
  } catch {
    throw new Error(
      `${path} returned ${response.status} (expected JSON, got ${raw.slice(0, 80).replace(/\s+/g, ' ')}…)`,
    );
  }
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
    const recipes = await request<{
      items: Array<{ id: string }>;
      pagination: { total: number; hasMore: boolean };
    }>('/api/recipes?limit=1');
    record(
      'TC-API-01',
      recipes.body.ok &&
        Array.isArray(recipes.body.data?.items) &&
        typeof recipes.body.data?.pagination?.total === 'number',
      'GET /api/recipes (paginated)',
    );

    const reference = await request<{ regionalCuisines: string[] }>('/api/reference');
    record(
      'TC-API-02',
      reference.body.ok && (reference.body.data?.regionalCuisines.length ?? 0) > 0,
      'GET /api/reference',
    );

    const partners = await request<unknown[]>('/api/partners');
    record('TC-API-03', partners.body.ok && Array.isArray(partners.body.data), 'GET /api/partners');

    const billingPlans = await request<{
      paymentsEnabled: boolean;
      yearlyPromo: { offerTag: string; checkoutAmountInr: number };
    }>('/api/billing/plans');
    record(
      'TC-API-03b',
      billingPlans.body.ok &&
        billingPlans.body.data?.yearlyPromo?.offerTag === 'promo-yearly-5' &&
        billingPlans.body.data?.yearlyPromo?.checkoutAmountInr === 475,
      'GET /api/billing/plans promo catalog',
    );

    const guest = await request<{ token: string; user: { id: string } }>('/api/auth/guest', {
      method: 'POST',
      body: JSON.stringify({ acceptedTerms: true, termsVersion: '2025-06-21' }),
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

    const mePlan = await request<{ planTier: string; hasUsedTrial: boolean }>('/api/users/me/plan', {
      headers: { Authorization: `Bearer ${token}` },
    });
    let planData = mePlan.body.data;
    if (mePlan.body.ok && planData?.planTier !== 'trial') {
      const plan = await request<{ planTier: string; hasUsedTrial: boolean }>('/api/users/me/plan', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          planTier: 'trial',
          trialStartedAt: new Date().toISOString(),
          hasUsedTrial: true,
        }),
      });
      planData = plan.body.data;
      record(
        'TC-API-07',
        plan.body.ok &&
          planData?.planTier === 'trial' &&
          !('id' in (planData ?? {})),
        'PUT /api/users/me/plan returns plan object only',
      );
    } else {
      record(
        'TC-API-07',
        mePlan.body.ok &&
          planData?.planTier === 'trial' &&
          planData?.hasUsedTrial === true &&
          !('id' in (planData ?? {})),
        'GET /api/users/me/plan returns plan object only (auto-trial)',
      );
    }

    const paidBlocked = await request<{ planTier: string }>('/api/users/me/plan', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ planTier: 'paid' }),
    });
    record(
      'TC-API-07b',
      paidBlocked.status === 403,
      'PUT /api/users/me/plan rejects client-paid escalation',
    );

    const pantry = await request<unknown>('/api/users/me/pantry', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ingredients: [] }),
    });
    record('TC-API-08', pantry.body.ok, 'PUT /api/users/me/pantry empty list');

    const recipeId = recipes.body.data?.items?.[0]?.id;
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

    const sponsorEvent = await request<{ id: string }>('/api/sponsor-events', {
      method: 'POST',
      body: JSON.stringify({
        eventType: 'impression',
        brandName: 'Smoke Test',
        placement: 'home',
      }),
    });
    record('TC-API-11', sponsorEvent.status === 201 && Boolean(sponsorEvent.body.data?.id), 'POST /api/sponsor-events');

    const location = await request<{ city: string | null }>('/api/users/me/location', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        city: 'Mumbai',
        state: 'Maharashtra',
        latitude: 19.076,
        longitude: 72.8777,
      }),
    });
    record(
      'TC-API-12',
      location.body.ok && location.body.data?.city === 'Mumbai',
      'PUT /api/users/me/location',
    );

    const affiliate = await request<{ id: string }>('/api/affiliate-events', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ partner: 'blinkit', context: 'smoke' }),
    });
    record('TC-API-13', affiliate.status === 201 && Boolean(affiliate.body.data?.id), 'POST /api/affiliate-events');

    const search = await request<{ id: string }>('/api/recipe-searches', {
      method: 'POST',
      body: JSON.stringify({ query: 'paneer', sourceScreen: 'home', resultCount: 3 }),
    });
    record('TC-API-14', search.status === 201 && Boolean(search.body.data?.id), 'POST /api/recipe-searches');

    const apkRedirect = await fetch(`${BASE}/api/download/apk`, { redirect: 'manual' });
    const apkLocation = apkRedirect.headers.get('location') ?? '';
    record(
      'TC-API-15',
      apkRedirect.status === 302 && apkLocation.includes('rasoi-release.apk'),
      'GET /api/download/apk redirects to APK',
    );

    if (apkLocation.startsWith('http')) {
      const apkHead = await fetch(apkLocation, { method: 'HEAD' });
      const apkSize = Number(apkHead.headers.get('content-length') ?? 0);
      record(
        'TC-API-16',
        apkHead.status === 200 && apkSize > 50_000_000,
        `APK artifact reachable (${apkSize || 'unknown'} bytes)`,
      );
    } else {
      record('TC-API-16', true, 'Skipped remote APK size check (relative redirect)');
    }

    const playStoreRedirect = await fetch(`${BASE}/api/play-store`, { redirect: 'manual' });
    const playStoreLocation = playStoreRedirect.headers.get('location') ?? '';
    record(
      'TC-API-17',
      playStoreRedirect.status === 302 &&
        playStoreLocation.includes('play.google.com/store/apps/details') &&
        playStoreLocation.includes('com.bhagihiri.rasoiapp'),
      'GET /api/play-store redirects to Google Play listing',
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
