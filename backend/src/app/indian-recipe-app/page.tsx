import Link from 'next/link';

import JsonLd from '@/app/_components/JsonLd';
import MarketFooter from '@/app/_components/MarketFooter';
import RasoiLogo from '@/app/_components/RasoiLogo';
import { getAllMarkets } from '@/lib/markets';
import {
  INDIAN_RECIPE_APP_HUB,
  SEO_GUIDE_PAGES,
  SEO_RECIPE_PAGES,
} from '@/lib/seo-content-pages';
import { SEO_CITY_GUIDE_PAGES, SEO_CITY_GUIDE_SLUGS } from '@/lib/seo-city-guides';
import { articlePageJsonLd, buildContentPageMetadata } from '@/lib/seo';
import {
  CUISINE_HUBS,
  FESTIVAL_HUBS,
  INGREDIENT_HUBS,
  MEAL_HUBS,
  getTaxonomyPath,
} from '@/lib/seo-taxonomy';

export const metadata = buildContentPageMetadata({
  title: INDIAN_RECIPE_APP_HUB.title,
  description: INDIAN_RECIPE_APP_HUB.description,
  path: INDIAN_RECIPE_APP_HUB.path,
  keywords: [...INDIAN_RECIPE_APP_HUB.keywords],
});

const DIASPORA_GUIDES = SEO_GUIDE_PAGES.filter((page) =>
  [
    'indian-cooking-in-usa',
    'indian-cooking-in-canada',
    'indian-cooking-in-australia',
    'indian-cooking-in-new-zealand',
  ].includes(page.slug),
);

const TOP_RECIPE_BLOGS = [...SEO_RECIPE_PAGES].sort(
  (a, b) => (a.searchVolumeRank ?? 999) - (b.searchVolumeRank ?? 999),
);

const DINNER_GUIDES = SEO_GUIDE_PAGES.filter(
  (page) =>
    !DIASPORA_GUIDES.includes(page) &&
    !SEO_CITY_GUIDE_SLUGS.has(page.slug) &&
    !page.slug.startsWith('indian-cooking-in'),
);

export default function IndianRecipeAppHubPage() {
  const markets = getAllMarkets();

  return (
    <>
      <JsonLd
        data={articlePageJsonLd({
          title: INDIAN_RECIPE_APP_HUB.title,
          description: INDIAN_RECIPE_APP_HUB.description,
          path: INDIAN_RECIPE_APP_HUB.path,
        })}
      />
      <div className="landing-grain min-h-screen text-landing-ink">
        <header className="border-b border-landing-border bg-landing-cream/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 lg:px-8">
            <Link href="/" className="flex items-center gap-3">
              <RasoiLogo size="sm" />
              <div>
                <p className="font-display text-2xl font-semibold tracking-tight">Rasoi</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-landing-muted">
                  Indian home cooking
                </p>
              </div>
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-landing-gold">
            Guides hub
          </p>
          <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight lg:text-5xl">
            {INDIAN_RECIPE_APP_HUB.h1}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-landing-muted">
            {INDIAN_RECIPE_APP_HUB.intro}
          </p>

          <section className="mt-14">
            <h2 className="font-display text-2xl font-semibold">Rasoi by region</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {markets.map((market) => (
                <li key={market.id}>
                  <Link
                    href={market.path}
                    hrefLang={market.hreflang}
                    className="block rounded-[1.25rem] border border-landing-border bg-white p-5 transition hover:border-landing-gold/40"
                  >
                    <p className="text-2xl">{market.flag}</p>
                    <p className="font-display mt-2 text-xl font-semibold">{market.label}</p>
                    <p className="mt-2 text-sm text-landing-muted">Indian home cooking for {market.countryName}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14">
            <h2 className="font-display text-2xl font-semibold">Dinner & diet guides</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {DINNER_GUIDES.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/${page.slug}`}
                    className="block rounded-xl border border-landing-border bg-white px-5 py-4 font-semibold text-landing-ink hover:border-landing-gold/40 hover:text-landing-saffron"
                  >
                    {page.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14">
            <h2 className="font-display text-2xl font-semibold">Cooking abroad</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {DIASPORA_GUIDES.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/${page.slug}`}
                    className="block rounded-xl border border-landing-border bg-white px-5 py-4 font-semibold hover:border-landing-gold/40 hover:text-landing-saffron"
                  >
                    {page.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14">
            <h2 className="font-display text-2xl font-semibold">City guides — USA, Canada & Australia</h2>
            <p className="mt-3 max-w-2xl text-sm text-landing-muted">
              Practical weeknight cooking for large Indian diaspora cities — pantry staples, local grocery patterns, and
              links to your country Rasoi page.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SEO_CITY_GUIDE_PAGES.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/${page.slug}`}
                    className="block rounded-xl border border-landing-border bg-white px-5 py-4 font-semibold hover:border-landing-gold/40 hover:text-landing-saffron"
                  >
                    {page.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14">
            <h2 className="font-display text-2xl font-semibold">Browse by topic</h2>
            <div className="mt-8 grid gap-10 lg:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-landing-gold">
                  Cuisines
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {CUISINE_HUBS.map((hub) => (
                    <li key={hub.slug}>
                      <Link
                        href={getTaxonomyPath(hub)}
                        className="rounded-full border border-landing-border bg-white px-4 py-2 text-sm font-semibold hover:border-landing-gold/40 hover:text-landing-saffron"
                      >
                        {hub.h1.replace(/ for.*/, '')}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-landing-gold">
                  Ingredients
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {INGREDIENT_HUBS.map((hub) => (
                    <li key={hub.slug}>
                      <Link
                        href={getTaxonomyPath(hub)}
                        className="rounded-full border border-landing-border bg-white px-4 py-2 text-sm font-semibold hover:border-landing-gold/40 hover:text-landing-saffron"
                      >
                        {hub.slug}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-landing-gold">
                  Meals
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {MEAL_HUBS.map((hub) => (
                    <li key={hub.slug}>
                      <Link
                        href={getTaxonomyPath(hub)}
                        className="rounded-full border border-landing-border bg-white px-4 py-2 text-sm font-semibold hover:border-landing-gold/40 hover:text-landing-saffron"
                      >
                        {hub.h1}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-landing-gold">
                  Festivals
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {FESTIVAL_HUBS.map((hub) => (
                    <li key={hub.slug}>
                      <Link
                        href={getTaxonomyPath(hub)}
                        className="rounded-full border border-landing-border bg-white px-4 py-2 text-sm font-semibold hover:border-landing-gold/40 hover:text-landing-saffron"
                      >
                        {hub.h1}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="mt-14">
            <h2 className="font-display text-2xl font-semibold">Top recipe blogs</h2>
            <p className="mt-2 max-w-2xl text-sm text-landing-muted">
              {TOP_RECIPE_BLOGS.length} high-search Indian dishes with ingredients, method, and
              diaspora tips for India, USA, Canada, Australia, and New Zealand.{' '}
              <Link href="/recipes" className="font-semibold text-landing-saffron hover:text-landing-ink">
                View all recipe guides →
              </Link>
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {TOP_RECIPE_BLOGS.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/recipes/${page.slug}`}
                    className="block rounded-xl border border-landing-border bg-white px-5 py-4 font-semibold hover:border-landing-gold/40 hover:text-landing-saffron"
                  >
                    {page.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </main>

        <MarketFooter showIndiaAppLinks />
      </div>
    </>
  );
}
