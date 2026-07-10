import Link from 'next/link';

import {
  APP_NAME,
  PLAY_STORE_LISTING_URL,
  PLAY_STORE_SEO_PATH,
  RECIPE_LIBRARY_LABEL,
} from '@/lib/app-download';

type RecipeBlogPlayStoreCtaProps = {
  dishName: string;
};

export default function RecipeBlogPlayStoreCta({ dishName }: RecipeBlogPlayStoreCtaProps) {
  return (
    <section
      className="mt-10 rounded-[1.5rem] border border-landing-border bg-landing-cream px-6 py-10 text-center lg:px-10"
      aria-label="Download Rasoi app"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-landing-gold">
        Available on Google Play
      </p>
      <h2 className="font-display mt-4 text-2xl font-semibold leading-tight tracking-tight lg:text-3xl">
        Cook {dishName} with Rasoi on Android
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-landing-muted">
        See how well {dishName} matches your pantry, follow step-by-step cooking mode, and save
        favourites for weeknights — plus {RECIPE_LIBRARY_LABEL} regional Indian recipes in one app.
      </p>

      <div className="mx-auto mt-8 max-w-md rounded-[1.25rem] border border-landing-border bg-white p-6">
        <a
          href={PLAY_STORE_LISTING_URL}
          className="inline-flex rounded-full bg-[#14110f] px-8 py-3.5 text-sm font-semibold text-[#f5f0e8] transition hover:bg-[#1c1714]"
          rel="noopener noreferrer"
        >
          Get it on Google Play
        </a>
        <p className="mt-4 text-sm leading-relaxed text-landing-muted">
          Free to install.{' '}
          <Link href={PLAY_STORE_SEO_PATH} className="font-semibold text-landing-saffron hover:text-landing-ink">
            Official Google Play page
          </Link>{' '}
          · Open Google Play on your Android phone and tap Install.
        </p>
        <p className="mt-3 text-xs text-landing-muted">
          {APP_NAME} — pantry match, diet filters, and tonight&apos;s picks.
        </p>
      </div>
    </section>
  );
}
