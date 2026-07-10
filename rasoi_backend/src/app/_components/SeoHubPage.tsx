import Link from 'next/link';

import MarketFooter from '@/app/_components/MarketFooter';
import RasoiLogo from '@/app/_components/RasoiLogo';
import { PLAY_STORE_LISTING_URL, PLAY_STORE_SEO_PATH } from '@/lib/app-download';
import type { SeoContentFaq } from '@/lib/seo-content-pages';
import type { SeoRecipePage } from '@/lib/seo-content-pages';

type SeoHubPageProps = {
  eyebrow: string;
  h1: string;
  intro: string;
  sections: { heading: string; body: string }[];
  faqs: SeoContentFaq[];
  recipes: SeoRecipePage[];
  relatedHubs: { href: string; label: string }[];
  breadcrumbs: { href: string; label: string }[];
};

export default function SeoHubPage({
  eyebrow,
  h1,
  intro,
  sections,
  faqs,
  recipes,
  relatedHubs,
  breadcrumbs,
}: SeoHubPageProps) {
  return (
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
            <Link href="/recipes" className="hover:text-landing-saffron">
              Recipes
            </Link>
            <Link href="/indian-recipe-app" className="hover:text-landing-saffron">
              Guides
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
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-landing-muted">
          <ol className="flex flex-wrap items-center gap-2">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.href} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-semibold text-landing-ink">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-landing-saffron">
                    {crumb.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-landing-gold">
          {eyebrow}
        </p>
        <h1 className="font-display mt-3 max-w-3xl text-4xl font-semibold tracking-tight lg:text-5xl">
          {h1}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-landing-muted">{intro}</p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-2xl font-semibold">{section.heading}</h2>
              <p className="mt-3 max-w-3xl leading-relaxed text-landing-muted">{section.body}</p>
            </section>
          ))}
        </div>

        {recipes.length > 0 ? (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-semibold">Recipe guides</h2>
            <p className="mt-2 text-sm text-landing-muted">
              Ingredients, method, and diaspora tips —{' '}
              <Link href="/recipes" className="font-semibold text-landing-saffron hover:text-landing-ink">
                browse all 55 guides →
              </Link>
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <li key={recipe.slug}>
                  <Link
                    href={`/recipes/${recipe.slug}`}
                    className="block rounded-xl border border-landing-border bg-white px-5 py-4 font-semibold hover:border-landing-gold/40 hover:text-landing-saffron"
                  >
                    {recipe.h1}
                    <span className="mt-1 block text-xs font-normal text-landing-muted">
                      {recipe.cuisine} · {recipe.time}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {faqs.length > 0 ? (
          <section className="mt-14 border-t border-landing-border pt-12">
            <h2 className="font-display text-3xl font-semibold">FAQ</h2>
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {faqs.map((item) => (
                <div
                  key={item.question}
                  className="rounded-[1.25rem] border border-landing-border bg-white p-6"
                >
                  <h3 className="font-display text-xl font-semibold">{item.question}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-landing-muted">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {relatedHubs.length > 0 ? (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-semibold">Explore more</h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {relatedHubs.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-full border border-landing-border bg-white px-4 py-2 text-sm font-semibold text-landing-saffron hover:border-landing-gold/50 hover:text-landing-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>

      <MarketFooter showIndiaAppLinks />
    </div>
  );
}
