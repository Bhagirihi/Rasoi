import Link from 'next/link';

import ContactEmailLink from '@/app/_components/ContactEmailLink';
import { PLAY_STORE_LISTING_URL, PLAY_STORE_SEO_PATH } from '@/lib/app-download';
import { getAllMarkets } from '@/lib/markets';

type MarketFooterProps = {
  showIndiaAppLinks?: boolean;
};

export default function MarketFooter({ showIndiaAppLinks = false }: MarketFooterProps) {
  const markets = getAllMarkets();

  return (
    <footer className="border-t border-landing-border bg-landing-cream">
      <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
        <p className="text-sm font-semibold text-landing-ink">Rasoi by region</p>
        <nav
          aria-label="Rasoi regional pages"
          className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm"
        >
          {markets.map((market, index) => (
            <span key={market.id} className="inline-flex items-center gap-4">
              {index > 0 ? (
                <span className="hidden text-[#d9d0c4] sm:inline" aria-hidden>
                  ·
                </span>
              ) : null}
              <Link
                href={market.path}
                hrefLang={market.hreflang}
                className="font-semibold text-landing-saffron hover:text-landing-ink"
              >
                {market.label}
              </Link>
            </span>
          ))}
          <span className="hidden text-[#d9d0c4] sm:inline" aria-hidden>
            ·
          </span>
          <Link href="/indian-recipe-app" className="font-semibold text-landing-saffron hover:text-landing-ink">
            Indian recipe guides
          </Link>
        </nav>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-sm text-landing-muted">
          <p>
            Rasoi — Indian home cooking ·{' '}
            <ContactEmailLink className="font-semibold hover:text-landing-saffron" />
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {showIndiaAppLinks ? (
              <>
                <a
                  href={PLAY_STORE_LISTING_URL}
                  className="font-semibold text-landing-saffron hover:text-landing-ink"
                  rel="noopener noreferrer"
                >
                  Google Play
                </a>
                <Link href={PLAY_STORE_SEO_PATH} className="font-semibold text-landing-saffron">
                  Play Store page
                </Link>
              </>
            ) : null}
            <Link href="/privacy" className="font-semibold hover:text-landing-saffron">
              Privacy
            </Link>
            <Link href="/terms" className="font-semibold hover:text-landing-saffron">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
