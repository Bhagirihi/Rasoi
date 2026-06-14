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

export async function fetchSponsor(
  placement: 'home' | 'pantry' | 'recipe',
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

export function fetchPantrySponsor(): Promise<SponsorCardData | null> {
  return fetchSponsor('pantry');
}

export async function fetchRecipeSponsor(recipeId: string): Promise<SponsorCardData | null> {
  return fetchSponsor('recipe', recipeId);
}
