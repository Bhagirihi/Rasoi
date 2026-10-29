import Link from 'next/link';

import ContactEmailLink from '@/app/_components/ContactEmailLink';
import MarketFooter from '@/app/_components/MarketFooter';
import PublishedRecipeCount from '@/app/_components/PublishedRecipeCount';
import { PLAY_STORE_LISTING_URL, PLAY_STORE_SEO_PATH } from '@/lib/app-download';
import RasoiLogo from '@/app/_components/RasoiLogo';
import SponsorApplyForm from '@/app/_components/SponsorApplyForm';
import { LEGAL_CONTACT_EMAIL } from '@/lib/legal-content';
import { getCityGuidesForMarket } from '@/lib/seo-city-guides';
import { MARKET_FEATURES, type MarketConfig } from '@/lib/markets';
import { SEO_RECIPE_PAGES } from '@/lib/seo-content-pages';

const TOP_RECIPE_LINKS = [...SEO_RECIPE_PAGES]
  .sort((a, b) => (a.searchVolumeRank ?? 999) - (b.searchVolumeRank ?? 999))
  .slice(0, 6);

type MarketLandingProps = {
  market: MarketConfig;
};

export default function MarketLanding({ market }: MarketLandingProps) {
  const homeHref = market.path === '/' ? '/' : market.path;
  const isIndia = market.id === 'IN';
  const cityGuides = getCityGuidesForMarket(market.id);

  return (
    <div className="landing-grain min-h-screen text-landing-ink">
      <header className="border-b border-landing-border bg-landing-cream/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 lg:px-8">
          <Link href={homeHref} className="flex items-center gap-3">
            <RasoiLogo size="sm" priority />
            <div>
              <p className="font-display text-2xl font-semibold tracking-tight">Rasoi</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-landing-muted">
                {market.id === 'IN' ? 'Indian home cooking' : `Indian recipes · ${market.label}`}
              </p>
            </div>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-landing-muted md:flex">
            <Link href="/indian-recipe-app" className="hover:text-landing-saffron">
              Guides
            </Link>
            <a href="#features" className="hover:text-landing-saffron">
              Features
            </a>
            <a href="#faq" className="hover:text-landing-saffron">
              FAQ
            </a>
            <a href="#partners" className="hover:text-landing-saffron">
              Partners
            </a>
            {market.showSponsor ? (
              <a href="#sponsor" className="hover:text-landing-saffron">
                Sponsor with us
              </a>
            ) : null}
            <a href="#plans" className="hover:text-landing-saffron">
              Rasoi Plus
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-landing-gold">
                {market.heroBadge}
              </p>
              <h1 className="font-display mt-4 text-5xl font-semibold leading-[1.05] tracking-tight lg:text-6xl">
                {market.heroTitle}
              </h1>
              <p className="font-display mt-4 text-3xl font-semibold leading-tight tracking-tight text-landing-muted lg:text-4xl">
                {market.heroSubtitle}
              </p>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-landing-muted">{market.heroBody}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                {isIndia ? (
                  <>
                    <a
                      href={PLAY_STORE_LISTING_URL}
                      className="rounded-full bg-[#14110f] px-6 py-3 text-sm font-semibold text-[#f5f0e8] transition hover:bg-[#1c1714]"
                      rel="noopener noreferrer"
                    >
                      Get it on Google Play
                    </a>
                    <Link
                      href={PLAY_STORE_SEO_PATH}
                      className="rounded-full border border-[#d9d0c4] px-6 py-3 text-sm font-semibold transition hover:border-landing-gold/50"
                    >
                      Play Store listing
                    </Link>
                    <Link
                      href="/indian-recipe-app"
                      className="rounded-full border border-[#d9d0c4] px-6 py-3 text-sm font-semibold transition hover:border-landing-gold/50"
                    >
                      Browse recipe guides
                    </Link>
                  </>
                ) : (
                  <>
                    <a
                      href="/download"
                      className="rounded-full bg-[#14110f] px-6 py-3 text-sm font-semibold text-[#f5f0e8] transition hover:bg-[#1c1714]"
                    >
                      Get it on Google Play
                    </a>
                    <a
                      href="#features"
                      className="rounded-full border border-[#d9d0c4] px-6 py-3 text-sm font-semibold transition hover:border-landing-gold/50"
                    >
                      Explore features
                    </a>
                  </>
                )}
                {isIndia ? (
                  <Link
                    href="/aaj-kya-banaye"
                    className="rounded-full border border-[#d9d0c4] px-6 py-3 text-sm font-semibold transition hover:border-landing-gold/50"
                  >
                    आज क्या बनाएं?
                  </Link>
                ) : null}
              </div>
              <PublishedRecipeCount marketId={market.id} />
              {market.partnersStatus === 'rolling_out' ? (
                <p className="mt-4 rounded-xl border border-landing-border bg-landing-cream px-4 py-3 text-sm text-landing-muted">
                  <span className="font-semibold text-landing-ink">Recipes work worldwide.</span>{' '}
                  Grocery checkout links are rolling out in {market.countryName}.
                </p>
              ) : null}
            </div>

            <div className="landing-phone relative mx-auto w-full max-w-sm">
              <div className="absolute -inset-4 rounded-[2rem] bg-[radial-gradient(circle,rgba(201,162,39,0.18),transparent_70%)]" />
              <div className="relative rounded-[2rem] border border-landing-border bg-landing-cream p-6 shadow-[0_30px_80px_rgba(26,26,46,0.12)]">
                <div className="rounded-2xl border border-landing-border bg-white p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-landing-gold">
                    Tonight&apos;s pick
                  </p>
                  <p className="font-display mt-2 text-2xl font-semibold">Paneer Butter Masala</p>
                  <p className="mt-2 text-sm text-landing-muted">25 min · North · Veg · Easy</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['under20', 'kids'].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#f4efe6] px-3 py-1 text-xs font-medium text-landing-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-center text-xs font-semibold">
                  {market.phonePartners.map((name) => (
                    <div
                      key={name}
                      className="rounded-xl border border-landing-border bg-white px-3 py-3 text-landing-ink"
                    >
                      {name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-landing-border bg-white">
          <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-landing-gold">
                  Recipe guides
                </p>
                <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight">
                  Popular Indian recipes
                </h2>
              </div>
              <Link
                href="/recipes"
                className="text-sm font-semibold text-landing-saffron hover:text-landing-ink"
              >
                All 55 guides →
              </Link>
            </div>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {TOP_RECIPE_LINKS.map((recipe) => (
                <li key={recipe.slug}>
                  <Link
                    href={`/recipes/${recipe.slug}`}
                    className="block rounded-xl border border-landing-border bg-landing-cream px-5 py-4 font-semibold hover:border-landing-gold/40 hover:text-landing-saffron"
                  >
                    {recipe.h1}
                    <span className="mt-1 block text-xs font-normal text-landing-muted">
                      {recipe.cuisine} · {recipe.time}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-landing-muted">
              Browse by{' '}
              <Link href="/cuisine/punjabi" className="font-semibold text-landing-saffron hover:text-landing-ink">
                cuisine
              </Link>
              ,{' '}
              <Link href="/ingredient/paneer" className="font-semibold text-landing-saffron hover:text-landing-ink">
                ingredient
              </Link>
              , or{' '}
              <Link href="/meal/dinner" className="font-semibold text-landing-saffron hover:text-landing-ink">
                meal type
              </Link>
              .
            </p>
            {cityGuides.length > 0 ? (
              <div className="mt-8 border-t border-landing-border pt-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-landing-gold">
                  City guides
                </p>
                <h3 className="font-display mt-2 text-2xl font-semibold tracking-tight">
                  Indian home cooking in {market.countryName}
                </h3>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {cityGuides.map((guide) => (
                    <li key={guide.slug}>
                      <Link
                        href={`/${guide.slug}`}
                        className="block rounded-xl border border-landing-border bg-landing-cream px-5 py-4 font-semibold hover:border-landing-gold/40 hover:text-landing-saffron"
                      >
                        {guide.h1}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>

        <section id="features" className="border-y border-landing-border bg-landing-cream">
          <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-landing-gold">
              Features
            </p>
            <h2 className="font-display mt-3 text-4xl font-semibold">
              {market.id === 'IN'
                ? 'Built for real Indian kitchens'
                : `Indian home cooking for ${market.countryName}`}
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {MARKET_FEATURES.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-[1.25rem] border border-landing-border bg-white p-6 shadow-sm"
                >
                  <h3 className="font-display text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-landing-muted">{feature.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="partners" className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-landing-gold">
            Partners
          </p>
          <h2 className="font-display mt-3 text-4xl font-semibold">Shop missing ingredients</h2>
          <p className="mt-4 max-w-2xl text-landing-muted">{market.partnersIntro}</p>
          {market.partnersStatus === 'rolling_out' ? (
            <p className="mt-3 text-sm font-semibold text-landing-saffron">
              Grocery partner links rolling out — recipes and pantry guides work today.
            </p>
          ) : null}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {market.partners.map((partner) => (
              <div
                key={partner.name}
                className="rounded-[1.25rem] border border-landing-border bg-white p-6"
              >
                <div className="h-2 w-12 rounded-full" style={{ backgroundColor: partner.color }} />
                <p className="font-display mt-4 text-2xl font-semibold">{partner.name}</p>
                <p className="mt-2 text-sm text-landing-muted">{partner.note}</p>
              </div>
            ))}
          </div>
        </section>

        {market.showSponsor ? (
          <section id="sponsor" className="border-y border-landing-border bg-landing-cream">
            <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
              <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-landing-gold">
                    For brands
                  </p>
                  <h2 className="font-display mt-3 text-4xl font-semibold">Sponsor with Rasoi</h2>
                  <p className="mt-4 leading-relaxed text-landing-muted">
                    {market.id === 'IN'
                      ? 'Put your brand in front of home cooks actively planning dinner. Rasoi offers native sponsored placements on Home, Recipes, Pantry, Saved, and Recipe detail — right when users are deciding what to cook and what to buy.'
                      : `Reach Indian home cooks and the diaspora in ${market.countryName}. Rasoi offers sponsored placements when users browse recipes, match pantry items, and plan weeknight dinners.`}
                  </p>
                  <p className="mt-6 text-sm text-landing-muted">
                    Questions about sponsorship?{' '}
                    <ContactEmailLink
                      label={LEGAL_CONTACT_EMAIL}
                      className="font-semibold text-landing-saffron hover:text-landing-ink"
                    />
                  </p>
                </div>
                <SponsorApplyForm
                  phonePlaceholder={market.sponsorPhonePlaceholder}
                  brandExample={market.sponsorBrandExample}
                />
              </div>
            </div>
          </section>
        ) : null}

        <section id="plans" className="border-t border-landing-border bg-[#14110f] text-[#f5f0e8]">
          <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#e8d5a3]">
                  Rasoi Plus
                </p>
                <h2 className="font-display mt-3 text-4xl font-semibold">
                  {market.id === 'IN' ? 'Free trial. Premium partner access.' : 'Ad-free. Local checkout.'}
                </h2>
                <p className="mt-4 leading-relaxed text-[#b8b0a6]">{market.plusIntro}</p>
                <p className="mt-4 text-sm font-semibold text-[#e8d5a3]">{market.plusPricing}</p>
              </div>
              <ul className="space-y-4 text-sm">
                {market.plusFeatures.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-[#2a2218] bg-[#1c1714] px-4 py-3"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-landing-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-landing-gold">FAQ</p>
          <h2 className="font-display mt-3 text-4xl font-semibold">
            Rasoi in {market.countryName}
          </h2>
          <div className="mt-10 space-y-6">
            {market.faqs.map((item) => (
              <article
                key={item.question}
                className="rounded-[1.25rem] border border-landing-border bg-white p-6"
              >
                <h3 className="font-display text-xl font-semibold">{item.question}</h3>
                <p className="mt-3 text-sm leading-relaxed text-landing-muted">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <MarketFooter showIndiaAppLinks={isIndia} />
    </div>
  );
}

