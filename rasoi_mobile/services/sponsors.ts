import type { SponsorResponse } from '@/types/api';
import { apiFetch } from '@/utils/api';
import { getRasoiDb, isDirectSupabaseCatalogEnabled } from '@/utils/rasoiDb';

export type SponsorCardData = {
  id: string;
  brandName: string;
  productLabel: string;
  tagline: string;
  logoUrl: string;
  cta?: string;
  searchQuery?: string;
};

function mapSponsor(sponsor: SponsorResponse): SponsorCardData {
  return {
    id: sponsor.id,
    brandName: sponsor.brandName,
    productLabel: sponsor.productLabel,
    tagline: sponsor.tagline,
    logoUrl: sponsor.logoUrl,
    cta: sponsor.cta,
    searchQuery: sponsor.searchQuery,
  };
}

export type SponsorScreenPlacement = 'home' | 'recipes' | 'pantry' | 'saved' | 'plan';

async function fetchSponsorsFromSupabase(
  placement: SponsorScreenPlacement | 'recipe',
): Promise<SponsorResponse[]> {
  const { data, error } = await getRasoiDb()
    .from('Sponsor')
    .select(
      'id, placement, brandName, productLabel, tagline, logoUrl, cta, searchQuery, recipeId, active, priority',
    )
    .eq('placement', placement)
    .eq('active', true)
    .order('priority', { ascending: false })
    .order('createdAt', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    placement: row.placement as SponsorResponse['placement'],
    brandName: row.brandName,
    productLabel: row.productLabel,
    tagline: row.tagline,
    logoUrl: row.logoUrl,
    cta: row.cta,
    searchQuery: row.searchQuery ?? undefined,
    recipeId: row.recipeId ?? undefined,
    active: row.active,
    priority: row.priority,
  }));
}

export async function fetchSponsor(
  placement: SponsorScreenPlacement | 'recipe',
  recipeId?: string,
): Promise<SponsorCardData | null> {
  let sponsors: SponsorResponse[];

  if (isDirectSupabaseCatalogEnabled()) {
    try {
      sponsors = await fetchSponsorsFromSupabase(placement);
    } catch (error) {
      console.warn('[sponsors] Supabase read failed, falling back to API', error);
      sponsors = await apiFetch<SponsorResponse[]>(
        `/api/sponsors?placement=${placement}&active=true`,
      );
    }
  } else {
    sponsors = await apiFetch<SponsorResponse[]>(
      `/api/sponsors?placement=${placement}&active=true`,
    );
  }

  let candidates = sponsors;
  if (placement === 'recipe' && recipeId) {
    const scoped = sponsors.filter(
      (sponsor) => !sponsor.recipeId || sponsor.recipeId === recipeId,
    );
    if (scoped.length > 0) {
      candidates = scoped;
    }
  }

  const top = candidates[0];
  return top ? mapSponsor(top) : null;
}

export function fetchHomeSponsor(): Promise<SponsorCardData | null> {
  return fetchSponsor('home');
}

export function fetchRecipesSponsor(): Promise<SponsorCardData | null> {
  return fetchSponsor('recipes');
}

export function fetchPantrySponsor(): Promise<SponsorCardData | null> {
  return fetchSponsor('pantry');
}

export function fetchSavedSponsor(): Promise<SponsorCardData | null> {
  return fetchSponsor('saved');
}

export async function fetchRecipeSponsor(recipeId: string): Promise<SponsorCardData | null> {
  return fetchSponsor('recipe', recipeId);
}
