import type { SponsorResponse } from '@/types/api';
import { apiFetch } from '@/utils/api';

export type SponsorCardData = {
  brandName: string;
  productLabel: string;
  tagline: string;
  logoUrl: string;
  cta?: string;
  searchQuery?: string;
};

function mapSponsor(sponsor: SponsorResponse): SponsorCardData {
  return {
    brandName: sponsor.brandName,
    productLabel: sponsor.productLabel,
    tagline: sponsor.tagline,
    logoUrl: sponsor.logoUrl,
    cta: sponsor.cta,
    searchQuery: sponsor.searchQuery,
  };
}

export type SponsorScreenPlacement = 'home' | 'recipes' | 'pantry' | 'saved';

export async function fetchSponsor(
  placement: SponsorScreenPlacement | 'recipe',
  recipeId?: string,
): Promise<SponsorCardData | null> {
  const sponsors = await apiFetch<SponsorResponse[]>(
    `/api/sponsors?placement=${placement}&active=true`,
  );

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
