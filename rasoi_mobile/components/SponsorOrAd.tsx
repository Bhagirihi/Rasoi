import AdMobBanner from '@/components/AdMobBanner';
import SponsorRail from '@/components/SponsorRail';
import type { SponsorCardData } from '@/services/sponsors';

type SponsorOrAdProps = {
  sponsor: SponsorCardData | null;
  placement: string;
  compact?: boolean;
  /** Wait for sponsor fetch before showing the AdMob fallback. */
  loading?: boolean;
};

export default function SponsorOrAd({
  sponsor,
  placement,
  compact = false,
  loading = false,
}: SponsorOrAdProps) {
  if (loading) return null;

  if (sponsor) {
    return <SponsorRail {...sponsor} compact={compact} />;
  }

  return <AdMobBanner placement={placement} />;
}
