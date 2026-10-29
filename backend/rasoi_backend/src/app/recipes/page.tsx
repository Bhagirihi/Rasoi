import Image from 'next/image';
import Link from 'next/link';

import JsonLd from '@/app/_components/JsonLd';
import MarketFooter from '@/app/_components/MarketFooter';
import RasoiLogo from '@/app/_components/RasoiLogo';
import { PLAY_STORE_LISTING_URL, PLAY_STORE_SEO_PATH } from '@/lib/app-download';
import { SEO_RECIPE_PAGES } from '@/lib/seo-content-pages';
import { SEO_RECIPE_BLOGS_GENERATED_AT } from '@/lib/seo-recipe-blogs-data';
import {
  buildContentPageMetadata,
  recipeIndexJsonLd,
} from '@/lib/seo';
import {
  CUISINE_HUBS,
  FESTIVAL_HUBS,
  INGREDIENT_HUBS,
  MEAL_HUBS,
  getTaxonomyPath,
} from '@/lib/seo-taxonomy';

const SORTED_RECIPES = [...SEO_RECIPE_PAGES].sort(
  (a, b) => (a.searchVolumeRank ?? 999) - (b.searchVolumeRank ?? 999),
);

export const metadata = buildContentPageMetadata({
  title: 'Top 55 Indian Recipe Guides — Ingredients & Method | Rasoi',
  description:
    'Browse 55 high-search Indian recipe blogs — butter chicken, biryani, dosa, dal & more. Ingredients, method, and diaspora tips for India, USA, Canada, Australia & New Zealand.',
  path: '/recipes',
  keywords: [
    'indian recipe blog',
    'indian recipes',
    'how to make indian food',
    'indian recipe guides',
    'butter chicken recipe',
    'biryani recipe',
    'indian cooking usa',
    'indian cooking canada',
    'indian cooking australia',
    'indian cooking new zealand',
    'rasoi recipes',
  ],
  publishedTime: SEO_RECIPE_BLOGS_GENERATED_AT,
  modifiedTime: SEO_RECIPE_BLOGS_GENERATED_AT,
});

export default function RecipeBlogsIndexPage() {
  return (
    <>
      <JsonLd
        data={recipeIndexJsonLd(
          SORTED_RECIPES.map((page) => ({
            name: page.h1,
            slug: page.slug,
            description: page.description,
            imageUrl: page.imageUrl,
          })),
        )}
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
            <nav className="flex items-center gap-6 text-sm font-medium text-landing-muted">
              <Link href="/indian-recipe-app" className="hover:text-landing-saffron">
                All guides
              </Link>
              <a
                href={PLAY_STORE_LISTING_URL}
                className="font-semibold text-landing-saffron hover:text-landing-ink"
                rel="noopener noreferrer"
              >
                Get on Google Play
              </a>
              <Link href={PLAY_STORE_SEO_PATH} className="hover:text-landing-saffron">
                Play listing
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
          <nav aria-label="Breadcrumb" className="text-sm text-landing-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-landing-saffron">
                  Rasoi
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-semibold text-landing-ink">Recipe guides</li>
            </ol>
          </nav>

          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-landing-gold">
            Top {SORTED_RECIPES.length} by search demand
          </p>
          <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight lg:text-5xl">
            Indian recipe guides
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-landing-muted">
            Step-by-step home cooking guides for the most searched Indian dishes — with ingredients,
            method, FAQs, and tips for cooks in India, the USA, Canada, Australia, and New Zealand.
            Open Rasoi on Android for pantry match and {SORTED_RECIPES.length}+ dishes in the app.
          </p>

          <section className="mt-14">
            <h2 className="font-display text-2xl font-semibold">Browse by topic</h2>
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
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
            <h2 className="font-display text-2xl font-semibold">All recipe blogs</h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SORTED_RECIPES.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/recipes/${page.slug}`}
                    className="group block overflow-hidden rounded-[1.25rem] border border-landing-border bg-white transition hover:border-landing-gold/40 hover:shadow-md"
                  >
                    {page.imageUrl ? (
                      <div className="relative aspect-[3/2] overflow-hidden bg-[#f4efe6]">
                        <Image
                          src={page.imageUrl}
                          alt={`${page.h1} — Indian home cooking`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition duration-300 group-hover:scale-[1.02]"
                        />
                      </div>
                    ) : null}
                    <div className="px-5 py-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-landing-gold">
                        #{page.searchVolumeRank ?? '—'} · {page.cuisine} · {page.diet}
                        {page.time ? ` · ${page.time}` : ''}
                      </p>
                      <p className="font-display mt-1 text-xl font-semibold group-hover:text-landing-saffron">
                        {page.h1}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-landing-muted">{page.description}</p>
                      <p className="mt-3 text-sm font-semibold text-landing-saffron">Read guide →</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14 rounded-[1.5rem] border border-landing-border bg-landing-cream p-8">
            <h2 className="font-display text-2xl font-semibold">Cook from your pantry</h2>
            <p className="mt-3 max-w-2xl text-landing-muted">
              Rasoi matches recipes to what you already have — regional filters, Veg & Jain options,
              and tonight&apos;s picks. Install free on Google Play.
            </p>
            <a
              href={PLAY_STORE_LISTING_URL}
              className="mt-6 inline-flex rounded-full bg-landing-saffron px-6 py-3 text-sm font-semibold text-white hover:bg-landing-ink"
              rel="noopener noreferrer"
            >
              Get Rasoi on Google Play
            </a>
          </section>
        </main>

        <MarketFooter showIndiaAppLinks />
      </div>
    </>
  );
}
