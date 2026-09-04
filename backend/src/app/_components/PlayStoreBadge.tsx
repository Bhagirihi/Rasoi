import { PLAY_STORE_LISTING_URL } from '@/lib/app-download';

type PlayStoreBadgeProps = {
  className?: string;
  size?: 'md' | 'lg';
};

/** Official Google Play badge asset — https://play.google.com/intl/en_us/badges */
export default function PlayStoreBadge({ className = '', size = 'lg' }: PlayStoreBadgeProps) {
  const height = size === 'lg' ? 60 : 48;

  return (
    <a
      href={PLAY_STORE_LISTING_URL}
      className={`inline-flex shrink-0 transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-landing-leaf ${className}`}
      rel="noopener noreferrer"
      aria-label="Get Rasoi on Google Play"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/badges/google-play-badge.png"
        alt="Get it on Google Play"
        height={height}
        width={Math.round(height * (646 / 250))}
        className="h-auto w-auto"
        style={{ height, width: 'auto' }}
      />
    </a>
  );
}
