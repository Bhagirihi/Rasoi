type DbUserRow = Record<string, unknown>;

function parseJson<T>(value: unknown, fallback: T): T {
  if (typeof value !== 'string') return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function serializeUser(row: DbUserRow) {
  return {
    id: String(row.id),
    email: (row.email as string | null) ?? null,
    phone: (row.phone as string | null) ?? null,
    name: String(row.name),
    isGuest: Boolean(row.isGuest),
    isActive: row.isActive !== false,
    hasCompletedOnboarding: Boolean(row.hasCompletedOnboarding),
    dietPreference: String(row.dietPreference),
    dietChoice: String(row.dietChoice),
    regionalCuisine: String(row.regionalCuisine),
    favoriteCuisines: parseJson<string[]>(row.favoriteCuisines, []),
    notificationsEnabled: Boolean(row.notificationsEnabled),
    city: (row.city as string | null) ?? null,
    state: (row.state as string | null) ?? null,
    latitude: (row.latitude as number | null) ?? null,
    longitude: (row.longitude as number | null) ?? null,
    locationUpdatedAt: (row.locationUpdatedAt as string | null) ?? null,
    termsAcceptedAt: (row.termsAcceptedAt as string | null) ?? null,
    termsAcceptedVersion: (row.termsAcceptedVersion as string | null) ?? null,
    createdAt: String(row.createdAt),
    pantryIngredients: parseJson<string[]>(row.pantryIngredients, []),
    savedRecipeIds: parseJson<string[]>(row.savedRecipeIds, []),
    plan: {
      planTier: String(row.planTier),
      trialStartedAt: (row.trialStartedAt as string | null) ?? null,
      hasUsedTrial: Boolean(row.hasUsedTrial),
    },
  };
}

export function normalizePhone(raw?: string): string | undefined {
  if (!raw?.trim()) return undefined;
  const digits = raw.replace(/\D/g, '').replace(/^91/, '').slice(0, 10);
  return /^[6-9]\d{9}$/.test(digits) ? digits : undefined;
}

export function isAnonymousAuthUser(user: {
  is_anonymous?: boolean;
  app_metadata?: Record<string, unknown>;
}): boolean {
  if (user.is_anonymous === true) return true;
  return user.app_metadata?.provider === 'anonymous';
}
