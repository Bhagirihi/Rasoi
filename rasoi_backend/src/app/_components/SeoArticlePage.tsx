import Image from 'next/image';
import Link from 'next/link';

import MarketFooter from '@/app/_components/MarketFooter';
import RecipeBlogPlayStoreCta from '@/app/_components/RecipeBlogPlayStoreCta';
import RasoiLogo from '@/app/_components/RasoiLogo';
import type { MarketId } from '@/lib/markets';
import { MARKET_PATHS } from '@/lib/markets';
import type { SeoContentFaq } from '@/lib/seo-content-pages';

const MARKET_LABELS: Record<MarketId, string> = {
  IN: 'India',
  US: 'United States',
  CA: 'Canada',
  AU: 'Australia',
  NZ: 'New Zealand',
};

type SeoArticlePageProps = {
  h1: string;
  intro: string;
  sections: { heading: string; body: string }[];
  faqs: SeoContentFaq[];
  relatedLinks: { href: string; label: string }[];
  marketHomeHref?: string;
  marketHomeLabel?: string;
  showIndiaAppLinks?: boolean;
  meta?: { cuisine?: string; diet?: string; time?: string };
  imageUrl?: string;
  ingredients?: string[];
  steps?: string[];
  marketNotes?: Partial<Record<MarketId, string>>;
  breadcrumbs?: { href: string; label: string }[];
  imageAlt?: string;
  /** When set, shows Google Play CTA between Ingredients and Method (recipe blogs). */
  playStoreCtaDishName?: string;
};

export default function SeoArticlePage({
  h1,
  intro,
  sections,
  faqs,
  relatedLinks,
  marketHomeHref = '/',
  marketHomeLabel = 'Rasoi India',
  showIndiaAppLinks = false,
  meta,
  imageUrl,
  ingredients,
  steps,
  marketNotes,
  breadcrumbs,
  imageAlt,
  playStoreCtaDishName,
}: SeoArticlePageProps) {
  return (
    <div className="landing-grain min-h-screen text-[#1a1a2e]">
      <header className="border-b border-[#e8dfd3] bg-[#fcf9f4]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <RasoiLogo size="sm" />
            <div>
              <p className="font-display text-2xl font-semibold tracking-tight">Rasoi</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6b6560]">
                Indian home cooking
              </p>
            </div>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-[#6b6560]">
            <Link href="/recipes" className="hover:text-[#c45c2a]">
              Recipes
            </Link>
            <Link href="/indian-recipe-app" className="hover:text-[#c45c2a]">
              Guides
            </Link>
            <Link href={marketHomeHref} className="font-semibold text-[#c45c2a] hover:text-[#1a1a2e]">
              {marketHomeLabel}
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12 lg:px-8 lg:py-16">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-[#6b6560]">
            <ol className="flex flex-wrap items-center gap-2">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.href} className="flex items-center gap-2">
                  {index > 0 ? <span aria-hidden="true">/</span> : null}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="font-semibold text-[#1a1a2e]">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="hover:text-[#c45c2a]">
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <article itemScope itemType="https://schema.org/Recipe">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
            Rasoi guide
          </p>
          <h1 className="font-display mt-3 text-4xl font-semibold leading-tight tracking-tight lg:text-5xl" itemProp="name">
            {h1}
          </h1>
          {meta ? (
            <p className="mt-4 text-sm font-medium text-[#6b6560]">
              <span itemProp="recipeCuisine">{meta.cuisine}</span>
              {meta.diet ? <> · {meta.diet}</> : null}
              {meta.time ? <> · <time>{meta.time}</time></> : null}
            </p>
          ) : null}
          <p className="mt-6 text-lg leading-relaxed text-[#6b6560]" itemProp="description">
            {intro}
          </p>

          {imageUrl ? (
            <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-[#e8dfd3] bg-white shadow-sm">
              <Image
                src={imageUrl}
                alt={imageAlt ?? `${h1} — Indian home cooking guide`}
                width={1200}
                height={800}
                className="h-auto w-full object-cover"
                priority
                itemProp="image"
              />
            </div>
          ) : null}

          {ingredients && ingredients.length > 0 ? (
            <section className="mt-10">
              <h2 className="font-display text-2xl font-semibold">Ingredients</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-[#6b6560]">
                {ingredients.map((item) => (
                  <li key={item} itemProp="recipeIngredient">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {playStoreCtaDishName ? (
            <RecipeBlogPlayStoreCta dishName={playStoreCtaDishName} />
          ) : null}

          {steps && steps.length > 0 ? (
            <section className="mt-10">
              <h2 className="font-display text-2xl font-semibold">Method</h2>
              <ol className="mt-4 list-decimal space-y-3 pl-5 text-[#6b6560]">
                {steps.map((step, index) => (
                  <li key={step} id={`step-${index + 1}`} itemProp="recipeInstructions">
                    {step}
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <div className="mt-10 space-y-10">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-2xl font-semibold">{section.heading}</h2>
                <p className="mt-3 leading-relaxed text-[#6b6560]">{section.body}</p>
              </section>
            ))}
          </div>

          {marketNotes && Object.keys(marketNotes).length > 0 ? (
            <section className="mt-14 border-t border-[#e8dfd3] pt-12">
              <h2 className="font-display text-3xl font-semibold">Cooking abroad</h2>
              <div className="mt-8 space-y-4">
                {(Object.entries(marketNotes) as [MarketId, string][]).map(([id, note]) => (
                  <div
                    key={id}
                    className="rounded-[1.25rem] border border-[#e8dfd3] bg-[#fcf9f4] p-5"
                  >
                    <p className="text-sm font-semibold uppercase tracking-wide text-[#c9a227]">
                      {MARKET_LABELS[id]}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[#6b6560]">{note}</p>
                    {id !== 'IN' ? (
                      <Link
                        href={MARKET_PATHS[id]}
                        className="mt-3 inline-block text-sm font-semibold text-[#c45c2a] hover:text-[#1a1a2e]"
                      >
                        Rasoi for {MARKET_LABELS[id]} →
                      </Link>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {faqs.length > 0 ? (
            <section className="mt-14 border-t border-[#e8dfd3] pt-12">
              <h2 className="font-display text-3xl font-semibold">FAQ</h2>
              <div className="mt-8 space-y-6">
                {faqs.map((item) => (
                  <div
                    key={item.question}
                    className="rounded-[1.25rem] border border-[#e8dfd3] bg-white p-6"
                  >
                    <h3 className="font-display text-xl font-semibold">{item.question}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#6b6560]">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {relatedLinks.length > 0 ? (
            <section className="mt-14">
              <h2 className="font-display text-2xl font-semibold">Related guides</h2>
              <ul className="mt-4 flex flex-wrap gap-3">
                {relatedLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded-full border border-[#e8dfd3] bg-white px-4 py-2 text-sm font-semibold text-[#c45c2a] hover:border-[#c9a227]/50 hover:text-[#1a1a2e]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>
      </main>

      <MarketFooter showIndiaAppLinks={showIndiaAppLinks} />
    </div>
  );
}
