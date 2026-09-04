import Link from 'next/link';

import ContactEmailLink from '@/app/_components/ContactEmailLink';
import PlayStoreBadge from '@/app/_components/PlayStoreBadge';
import { PLAY_STORE_LISTING_URL, PLAY_STORE_SEO_PATH } from '@/lib/app-download';
import { APP_STORE_LISTING } from '@/lib/app-store-content';
import { getAllMarkets } from '@/lib/markets';
import { PLAY_STORE_IMAGES } from '@/lib/play-store-images';

type MarketFooterProps = {
  showIndiaAppLinks?: boolean;
};

export default function MarketFooter({ showIndiaAppLinks = false }: MarketFooterProps) {
  const markets = getAllMarkets();

  return (
    <footer className="border-t border-white/10 bg-landing-night text-landing-bone">
      <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PLAY_STORE_IMAGES.appIcon}
                alt=""
                className="h-12 w-12 rounded-xl"
                width={48}
                height={48}
              />
              <div>
                <p className="font-display text-3xl font-semibold">Rasoi</p>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-landing-copper">
                  {APP_STORE_LISTING.title}
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
              {APP_STORE_LISTING.shortDescription}
            </p>
            {showIndiaAppLinks ? (
              <div className="mt-6">
                <PlayStoreBadge size="md" />
              </div>
            ) : null}
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
                Regions
              </p>
              <nav aria-label="Rasoi regional pages" className="mt-4 flex flex-col gap-2 text-sm">
                {markets.map((market) => (
                  <Link
                    key={market.id}
                    href={market.path}
                    hrefLang={market.hreflang}
                    className="font-semibold text-white/75 transition hover:text-landing-copper"
                  >
                    {market.label}
                  </Link>
                ))}
                <Link
                  href="/indian-recipe-app"
                  className="font-semibold text-white/75 transition hover:text-landing-copper"
                >
                  Guides
                </Link>
              </nav>
            </div>
            {showIndiaAppLinks ? (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
                  Get the app
                </p>
                <nav className="mt-4 flex flex-col gap-2 text-sm">
                  <a
                    href={PLAY_STORE_LISTING_URL}
                    className="font-semibold text-landing-copper hover:text-white"
                    rel="noopener noreferrer"
                  >
                    Google Play →
                  </a>
                  <Link
                    href={PLAY_STORE_SEO_PATH}
                    className="font-semibold text-white/75 hover:text-landing-copper"
                  >
                    Play Store page
                  </Link>
                </nav>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/45">
          <p>
            © {new Date().getFullYear()} Rasoi ·{' '}
            <ContactEmailLink className="font-semibold text-white/65 hover:text-landing-copper" />
          </p>
          <div className="flex flex-wrap gap-6">
            <Link href="/privacy" className="font-semibold hover:text-landing-copper">
              Privacy
            </Link>
            <Link href="/terms" className="font-semibold hover:text-landing-copper">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
