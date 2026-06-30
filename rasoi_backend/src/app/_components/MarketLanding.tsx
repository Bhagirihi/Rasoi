import Link from 'next/link';

import MarketFooter from '@/app/_components/MarketFooter';
import RasoiLogo from '@/app/_components/RasoiLogo';
import SponsorApplyForm from '@/app/_components/SponsorApplyForm';
import { LEGAL_CONTACT_EMAIL } from '@/lib/legal-content';
import { MARKET_FEATURES, type MarketConfig } from '@/lib/markets';

type MarketLandingProps = {
  market: MarketConfig;
  recipeCount: number;
};

export default function MarketLanding({ market, recipeCount }: MarketLandingProps) {
  const homeHref = market.path === '/' ? '/' : market.path;
  const isIndia = market.id === 'IN';

  return (
    <div className="landing-grain min-h-screen text-[#1a1a2e]">
      <header className="border-b border-[#e8dfd3] bg-[#fcf9f4]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 lg:px-8">
          <Link href={homeHref} className="flex items-center gap-3">
            <RasoiLogo size="sm" />
            <div>
              <p className="font-display text-2xl font-semibold tracking-tight">Rasoi</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6b6560]">
                {market.id === 'IN' ? 'Indian home cooking' : `Indian recipes · ${market.label}`}
              </p>
            </div>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-[#6b6560] md:flex">
            <Link href="/indian-recipe-app" className="hover:text-[#c45c2a]">
              Guides
            </Link>
            <a href="#features" className="hover:text-[#c45c2a]">
              Features
            </a>
            <a href="#faq" className="hover:text-[#c45c2a]">
              FAQ
            </a>
            <a href="#partners" className="hover:text-[#c45c2a]">
              Partners
            </a>
            {market.showSponsor ? (
              <a href="#sponsor" className="hover:text-[#c45c2a]">
                Sponsor with us
              </a>
            ) : null}
            <a href="#plans" className="hover:text-[#c45c2a]">
              Rasoi Plus
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
                {market.heroBadge}
              </p>
              <h1 className="font-display mt-4 text-5xl font-semibold leading-[1.05] tracking-tight lg:text-6xl">
                {market.heroTitle}
              </h1>
              <p className="font-display mt-4 text-3xl font-semibold leading-tight tracking-tight text-[#6b6560] lg:text-4xl">
                {market.heroSubtitle}
              </p>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#6b6560]">{market.heroBody}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                {isIndia ? (
                  <Link
                    href="/indian-recipe-app"
                    className="rounded-full bg-[#14110f] px-6 py-3 text-sm font-semibold text-[#f5f0e8] transition hover:bg-[#1c1714]"
                  >
                    Browse recipe guides
                  </Link>
                ) : null}
                <a
                  href="#features"
                  className={`rounded-full border border-[#d9d0c4] px-6 py-3 text-sm font-semibold transition hover:border-[#c9a227]/50${
                    isIndia ? '' : ' bg-[#14110f] text-[#f5f0e8] hover:bg-[#1c1714] hover:border-transparent'
                  }`}
                >
                  Explore features
                </a>
                {isIndia ? (
                  <Link
                    href="/aaj-kya-banaye"
                    className="rounded-full border border-[#d9d0c4] px-6 py-3 text-sm font-semibold transition hover:border-[#c9a227]/50"
                  >
                    आज क्या बनाएं?
                  </Link>
                ) : null}
              </div>
              <p className="mt-8 text-sm text-[#6b6560]">
                <span className="font-semibold text-[#1a1a2e]">{recipeCount}+ curated recipes</span>
                {market.id === 'IN'
                  ? ' across North, South, East, West & Central India'
                  : ' — Gujarati, Punjabi, South Indian, Bengali & 12 more cuisines'}
              </p>
              {market.partnersStatus === 'rolling_out' ? (
                <p className="mt-4 rounded-xl border border-[#e8dfd3] bg-[#fcf9f4] px-4 py-3 text-sm text-[#6b6560]">
                  <span className="font-semibold text-[#1a1a2e]">Recipes work worldwide.</span>{' '}
                  Grocery checkout links are rolling out in {market.countryName}.
                </p>
              ) : null}
            </div>

            <div className="landing-phone relative mx-auto w-full max-w-sm">
              <div className="absolute -inset-4 rounded-[2rem] bg-[radial-gradient(circle,rgba(201,162,39,0.18),transparent_70%)]" />
              <div className="relative rounded-[2rem] border border-[#e8dfd3] bg-[#fcf9f4] p-6 shadow-[0_30px_80px_rgba(26,26,46,0.12)]">
                <div className="rounded-2xl border border-[#e8dfd3] bg-white p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c9a227]">
                    Tonight&apos;s pick
                  </p>
                  <p className="font-display mt-2 text-2xl font-semibold">Paneer Butter Masala</p>
                  <p className="mt-2 text-sm text-[#6b6560]">25 min · North · Veg · Easy</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['under20', 'kids'].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#f4efe6] px-3 py-1 text-xs font-medium text-[#6b6560]"
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
                      className="rounded-xl border border-[#e8dfd3] bg-white px-3 py-3 text-[#1a1a2e]"
                    >
                      {name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-y border-[#e8dfd3] bg-[#fcf9f4]">
          <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
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
                  className="rounded-[1.25rem] border border-[#e8dfd3] bg-white p-6 shadow-sm"
                >
                  <h3 className="font-display text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#6b6560]">{feature.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="partners" className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
            Partners
          </p>
          <h2 className="font-display mt-3 text-4xl font-semibold">Shop missing ingredients</h2>
          <p className="mt-4 max-w-2xl text-[#6b6560]">{market.partnersIntro}</p>
          {market.partnersStatus === 'rolling_out' ? (
            <p className="mt-3 text-sm font-semibold text-[#c45c2a]">
              Grocery partner links rolling out — recipes and pantry guides work today.
            </p>
          ) : null}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {market.partners.map((partner) => (
              <div
                key={partner.name}
                className="rounded-[1.25rem] border border-[#e8dfd3] bg-white p-6"
              >
                <div className="h-2 w-12 rounded-full" style={{ backgroundColor: partner.color }} />
                <p className="font-display mt-4 text-2xl font-semibold">{partner.name}</p>
                <p className="mt-2 text-sm text-[#6b6560]">{partner.note}</p>
              </div>
            ))}
          </div>
        </section>

        {market.showSponsor ? (
          <section id="sponsor" className="border-y border-[#e8dfd3] bg-[#fcf9f4]">
            <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
              <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
                    For brands
                  </p>
                  <h2 className="font-display mt-3 text-4xl font-semibold">Sponsor with Rasoi</h2>
                  <p className="mt-4 leading-relaxed text-[#6b6560]">
                    {market.id === 'IN'
                      ? 'Put your brand in front of home cooks actively planning dinner. Rasoi offers native sponsored placements on Home, Recipes, Pantry, Saved, and Recipe detail — right when users are deciding what to cook and what to buy.'
                      : `Reach Indian home cooks and the diaspora in ${market.countryName}. Rasoi offers sponsored placements when users browse recipes, match pantry items, and plan weeknight dinners.`}
                  </p>
                  <p className="mt-6 text-sm text-[#6b6560]">
                    Questions about sponsorship?{' '}
                    <a
                      href={`mailto:${LEGAL_CONTACT_EMAIL}`}
                      className="font-semibold text-[#c45c2a] hover:text-[#1a1a2e]"
                    >
                      {LEGAL_CONTACT_EMAIL}
                    </a>
                    <span className="text-[#d9d0c4]"> · </span>
                    <span className="text-[#6b6560]">
                      Phone example ({market.label}):{' '}
                      <span className="font-semibold text-[#1a1a2e]">{market.sponsorPhonePlaceholder}</span>
                    </span>
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

        <section id="plans" className="border-t border-[#e8dfd3] bg-[#14110f] text-[#f5f0e8]">
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
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9a227]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">FAQ</p>
          <h2 className="font-display mt-3 text-4xl font-semibold">
            Rasoi in {market.countryName}
          </h2>
          <div className="mt-10 space-y-6">
            {market.faqs.map((item) => (
              <article
                key={item.question}
                className="rounded-[1.25rem] border border-[#e8dfd3] bg-white p-6"
              >
                <h3 className="font-display text-xl font-semibold">{item.question}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#6b6560]">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <MarketFooter showIndiaAppLinks={isIndia} />
    </div>
  );
}
