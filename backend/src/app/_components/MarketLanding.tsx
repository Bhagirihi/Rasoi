import Link from 'next/link';

import AppFeatures from '@/app/_components/AppFeatures';
import ContactEmailLink from '@/app/_components/ContactEmailLink';
import FaqAccordion from '@/app/_components/FaqAccordion';
import MarketFooter from '@/app/_components/MarketFooter';
import PlayStoreBadge from '@/app/_components/PlayStoreBadge';
import PublishedRecipeCount from '@/app/_components/PublishedRecipeCount';
import RasoiLogo from '@/app/_components/RasoiLogo';
import Reveal from '@/app/_components/Reveal';
import SponsorApplyForm from '@/app/_components/SponsorApplyForm';
import { PLAY_STORE_LISTING_URL, PLAY_STORE_SEO_PATH } from '@/lib/app-download';
import { APP_STORE_LISTING } from '@/lib/app-store-content';
import { LEGAL_CONTACT_EMAIL } from '@/lib/legal-content';
import type { MarketConfig } from '@/lib/markets';
import { HERO_PHONE_IMAGE, PLAY_STORE_IMAGES } from '@/lib/play-store-images';
import { getCityGuidesForMarket } from '@/lib/seo-city-guides';
import { SEO_RECIPE_PAGES } from '@/lib/seo-content-pages';

const TOP_RECIPE_LINKS = [...SEO_RECIPE_PAGES]
  .sort((a, b) => (a.searchVolumeRank ?? 999) - (b.searchVolumeRank ?? 999))
  .slice(0, 6);

const FLOAT_CHIPS = [
  { className: 'landing-float-chip--a', text: 'Cook from your pantry' },
  { className: 'landing-float-chip--b', text: 'Veg · Jain · Regional' },
  { className: 'landing-float-chip--c', text: "Tonight’s picks, ready" },
] as const;

const MOBILE_JUMP: { href: string; label: string; brand?: boolean }[] = [
  { href: '#review', label: 'Features' },
  { href: '#how', label: 'How it works' },
  { href: '#features', label: 'Perfect for' },
  { href: '#sponsor', label: 'For brands', brand: true },
];

type MarketLandingProps = {
  market: MarketConfig;
};

export default function MarketLanding({ market }: MarketLandingProps) {
  const homeHref = market.path === '/' ? '/' : market.path;
  const isIndia = market.id === 'IN';
  const cityGuides = getCityGuidesForMarket(market.id);
  const app = APP_STORE_LISTING;

  return (
    <div className="landing-dark landing-grain min-h-screen text-landing-ink">
      <header className="sticky top-0 z-40 border-b border-landing-border bg-landing-bg/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3 lg:px-8">
          <Link href={homeHref} className="flex min-w-0 items-center gap-2.5">
            <RasoiLogo size="sm" priority />
            <span className="font-display text-xl font-semibold tracking-tight">Rasoi</span>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden items-center gap-6 text-sm font-medium text-landing-muted md:flex">
              <a href="#review" className="transition hover:text-landing-ink">
                Features
              </a>
              <a href="#how" className="transition hover:text-landing-ink">
                How it works
              </a>
              <a href="#features" className="transition hover:text-landing-ink">
                Perfect for
              </a>
              {market.showSponsor ? (
                <a href="#sponsor" className="landing-nav-brands">
                  For brands
                </a>
              ) : null}
              {!isIndia ? (
                <Link href="/indian-recipe-app" className="transition hover:text-landing-ink">
                  Guides
                </Link>
              ) : null}
            </nav>
            {isIndia ? (
              <a
                href={PLAY_STORE_LISTING_URL}
                className="landing-btn-primary !inline-flex !shrink-0 !items-center !gap-2 !px-3 !py-2 !text-sm"
                rel="noopener noreferrer"
              >
                <RasoiLogo size="sm" className="!h-5 !w-5 !rounded-md" />
                <span className="sm:hidden">Download</span>
                <span className="hidden sm:inline">Download app</span>
              </a>
            ) : null}
          </div>
        </div>
        {isIndia ? (
          <div className="border-t border-landing-border md:hidden">
            <nav
              aria-label="Page sections"
              className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {MOBILE_JUMP.filter((item) => !item.brand || market.showSponsor).map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={
                    item.brand
                      ? 'landing-nav-brands shrink-0 !px-3 !py-1.5 !text-xs'
                      : 'shrink-0 rounded-full border border-landing-border bg-landing-cream px-3 py-1.5 text-xs font-semibold text-landing-muted'
                  }
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        ) : null}
      </header>

      <main className={isIndia ? 'pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0' : undefined}>
        <section className="landing-hero-soft">
          <div className="landing-hero-grid">
            <div className="landing-hero-visual">
              <div className="landing-fade-in landing-phone-wrap">
                {isIndia ? (
                  <a
                    href={PLAY_STORE_LISTING_URL}
                    className="block"
                    rel="noopener noreferrer"
                    aria-label="Open Rasoi on Google Play"
                  >
                    <div className="landing-phone">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={HERO_PHONE_IMAGE.src}
                        alt={HERO_PHONE_IMAGE.alt}
                        className="landing-phone__screen"
                        width={359}
                        height={1024}
                      />
                    </div>
                  </a>
                ) : (
                  <div className="landing-phone">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={HERO_PHONE_IMAGE.src}
                      alt={HERO_PHONE_IMAGE.alt}
                      className="landing-phone__screen"
                      width={359}
                      height={1024}
                    />
                  </div>
                )}
                {FLOAT_CHIPS.map((chip) => (
                  <span key={chip.className} className={`landing-float-chip ${chip.className}`}>
                    {chip.text}
                  </span>
                ))}
              </div>
            </div>

            <div className="landing-hero-copy">
              <p className="landing-rise landing-eyebrow">
                {isIndia ? app.heroEyebrow : market.heroBadge}
              </p>
              <h1 className="landing-rise-delay-1 font-display mt-4 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.35rem]">
                {isIndia ? (
                  <>
                    Rasoi App:{' '}
                    <span className="text-landing-copper">Aaj Kya Banaye?</span>
                  </>
                ) : (
                  market.heroTitle
                )}
              </h1>
              <p className="landing-rise-delay-1 mt-4 text-lg font-semibold leading-snug text-landing-ink sm:text-xl">
                {isIndia ? app.heroLead : market.heroSubtitle}
              </p>
              <p className="landing-rise-delay-2 mt-3 max-w-md text-base leading-relaxed text-landing-muted">
                {isIndia ? app.heroBody : market.heroBody}
              </p>

              <div className="landing-rise-delay-2 mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
                {isIndia ? (
                  <>
                    <a href={PLAY_STORE_LISTING_URL} className="landing-btn-primary" rel="noopener noreferrer">
                      Download on Google Play →
                    </a>
                    <a
                      href="#review"
                      className="text-sm font-semibold text-landing-copper underline decoration-landing-border underline-offset-4 transition hover:text-landing-ink"
                    >
                      See features
                    </a>
                  </>
                ) : (
                  <a href="#features" className="landing-btn-primary">
                    Explore features
                  </a>
                )}
              </div>

              {isIndia ? (
                <p className="landing-rise-delay-2 mt-5 text-sm font-medium text-landing-muted">
                  {app.heroTrust}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        {isIndia ? (
          <section className="landing-trust-strip" aria-label="Trust">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-5 py-3.5 text-sm text-landing-muted lg:px-8">
              <span className="font-semibold text-landing-ink">Free on Google Play</span>
              <span className="hidden h-1 w-1 rounded-full bg-landing-border sm:inline-block" aria-hidden />
              <span>1,200+ Indian recipes</span>
              <span className="hidden h-1 w-1 rounded-full bg-landing-border sm:inline-block" aria-hidden />
              <span>Veg · Jain · Regional</span>
            </div>
          </section>
        ) : null}

        {isIndia ? (
          <section id="review" className="landing-section">
            <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
              <AppFeatures themes={app.featureThemes} />
            </div>
          </section>
        ) : null}

        {!isIndia ? (
          <section id="why" className="landing-section">
            <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
              <Reveal>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-landing-copper">
                  Why choose Rasoi
                </p>
                <h2 className="font-display mt-3 max-w-2xl text-4xl font-semibold tracking-tight lg:text-5xl">
                  One question, every single evening.
                </h2>
                <p className="mt-4 max-w-2xl text-landing-muted">{market.heroBody}</p>
              </Reveal>
              <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {app.whyChoose.slice(0, 3).map((point, i) => (
                  <Reveal key={point.title} delay={i * 80}>
                    <article>
                      <p className="font-display text-4xl font-semibold text-landing-copper/50">
                        {String(i + 1).padStart(2, '0')}
                      </p>
                      <h3 className="font-display mt-3 text-2xl font-semibold">{point.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-landing-muted">{point.body}</p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section id="how" className="landing-section bg-landing-cream/40">
          <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
            <Reveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-landing-copper">
                How it works
              </p>
              <h2 className="font-display mt-3 text-4xl font-semibold tracking-tight lg:text-5xl">
                From Google Play to dinner
              </h2>
            </Reveal>
            <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {app.howItWorks.map((step, i) => (
                <li key={step.n} className="border-t-2 border-landing-copper/30 pt-5">
                  <Reveal delay={i * 90}>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-landing-copper">
                      {step.n}
                    </p>
                    <h3 className="font-display mt-3 text-xl font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-landing-muted">{step.body}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="features" className="landing-section">
          <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
            <Reveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-landing-copper">
                Perfect for
              </p>
              <h2 className="font-display mt-3 max-w-2xl text-4xl font-semibold tracking-tight lg:text-5xl">
                Built for Indian home kitchens
              </h2>
            </Reveal>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {app.perfectFor.map((item, i) => (
                <li key={item}>
                  <Reveal delay={i * 60} variant="fade">
                    <div className="flex items-start gap-3 rounded-2xl border border-landing-border bg-landing-cream/50 px-4 py-4 text-sm leading-relaxed text-landing-muted">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-landing-copper" />
                      <span>{item}</span>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
            <Reveal delay={80}>
              <PublishedRecipeCount marketId={market.id} />
            </Reveal>
          </div>
        </section>

        <section className="landing-section bg-landing-cream/40">
          <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-landing-muted">
                    Free guides
                  </p>
                  <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight">
                    Popular Indian recipes
                  </h2>
                </div>
                <Link
                  href="/recipes"
                  className="text-sm font-semibold text-landing-copper transition hover:text-landing-ink"
                >
                  All guides →
                </Link>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <ul className="mt-8 columns-1 gap-x-10 sm:columns-2">
                {TOP_RECIPE_LINKS.map((recipe) => (
                  <li key={recipe.slug} className="break-inside-avoid border-b border-landing-border">
                    <Link
                      href={`/recipes/${recipe.slug}`}
                      className="flex items-baseline justify-between gap-3 py-3.5 transition hover:text-landing-copper"
                    >
                      <span className="font-display text-lg font-semibold">{recipe.h1}</span>
                      <span className="shrink-0 text-xs text-landing-muted">{recipe.time}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
            {cityGuides.length > 0 ? (
              <Reveal delay={120} className="mt-8">
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  {cityGuides.map((guide) => (
                    <Link
                      key={guide.slug}
                      href={`/${guide.slug}`}
                      className="font-semibold text-landing-copper hover:text-landing-ink"
                    >
                      {guide.h1} →
                    </Link>
                  ))}
                </div>
              </Reveal>
            ) : null}
          </div>
        </section>

        {market.showSponsor ? (
          <section id="sponsor" className="landing-sponsor">
            <div className="landing-sponsor__glow" aria-hidden />
            <div className="relative mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
              <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
                <Reveal>
                  <div>
                    <p className="landing-sponsor__badge">For brands</p>
                    <h2 className="font-display mt-5 text-4xl font-semibold tracking-tight text-landing-ink sm:text-5xl">
                      Sponsor with <span className="text-landing-copper">Rasoi</span>
                    </h2>
                    <p className="mt-5 max-w-md text-base leading-relaxed text-landing-muted">
                      {market.id === 'IN'
                        ? 'Reach home cooks inside the Rasoi Android app — when they decide what to cook and what to buy.'
                        : `Reach Indian home cooks in ${market.countryName} while they browse recipes and plan dinners.`}
                    </p>
                    <ul className="mt-8 space-y-3.5">
                      {[
                        'In-app placements on home, pantry & recipe screens',
                        'Audience already deciding dinner & grocery runs',
                        'Built for food, FMCG & kitchen brands in India',
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-landing-ink/85">
                          <span
                            className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-landing-copper"
                            aria-hidden
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-8 text-sm text-landing-muted">
                      Questions?{' '}
                      <ContactEmailLink
                        label={LEGAL_CONTACT_EMAIL}
                        className="font-semibold text-landing-copper underline decoration-landing-copper/40 underline-offset-4 hover:text-landing-ink"
                      />
                    </p>
                  </div>
                </Reveal>
                <Reveal delay={120} variant="fade">
                  <div className="landing-sponsor__form">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-landing-saffron">
                      Apply to sponsor
                    </p>
                    <SponsorApplyForm
                      phonePlaceholder={market.sponsorPhonePlaceholder}
                      brandExample={market.sponsorBrandExample}
                    />
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        ) : null}

        <section id="plans" className="bg-landing-night text-landing-bone">
          <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
              <Reveal>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-landing-copper">
                    Rasoi Plus
                  </p>
                  <h2 className="font-display mt-3 text-4xl font-semibold">
                    {market.id === 'IN' ? 'Free app. Optional Plus.' : 'Ad-free. Local checkout.'}
                  </h2>
                  <p className="mt-4 leading-relaxed text-landing-muted">
                    {isIndia ? app.plusNote : market.plusIntro}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-landing-copper">{market.plusPricing}</p>
                  {isIndia ? (
                    <div className="mt-8">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-landing-muted">
                        Shop what’s missing
                      </p>
                      <ul className="mt-4 flex flex-wrap gap-2.5">
                        {market.partners.map((partner) => (
                          <li
                            key={partner.name}
                            className="inline-flex items-center gap-2 rounded-full border border-landing-border bg-landing-cream/40 px-3.5 py-1.5 text-sm"
                          >
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: partner.color }}
                              aria-hidden
                            />
                            <span className="font-semibold text-landing-ink/90">{partner.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="mt-6 text-sm text-landing-muted">{market.partnersIntro}</p>
                  )}
                </div>
              </Reveal>
              <Reveal delay={100} variant="fade">
                <ul>
                  {market.plusFeatures.map((item) => (
                    <li
                      key={item}
                      className="border-b border-landing-border py-4 text-sm leading-relaxed text-landing-ink/80 last:border-0"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="faq" className="landing-section">
          <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
            <Reveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-landing-copper">
                FAQ
              </p>
              <h2 className="font-display mt-3 text-4xl font-semibold">
                Rasoi in {market.countryName}
              </h2>
            </Reveal>
            <Reveal delay={80} className="mt-10">
              <FaqAccordion items={market.faqs} />
            </Reveal>
          </div>
        </section>

        {isIndia ? (
          <section className="bg-landing-mist">
            <Reveal>
              <div className="mx-auto max-w-2xl px-5 py-20 text-center lg:px-8 lg:py-24">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PLAY_STORE_IMAGES.appIcon}
                  alt=""
                  className="mx-auto h-20 w-20 rounded-[1.25rem]"
                  width={80}
                  height={80}
                />
                <p className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-landing-copper">
                  Google Play · Free
                </p>
                <h2 className="font-display mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                  Ready for tonight’s pick?
                </h2>
                <p className="font-display mt-2 text-3xl font-semibold text-landing-copper sm:text-4xl">
                  Install Rasoi now.
                </p>
                <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-landing-muted">
                  {app.closing}
                </p>
                <div className="mt-10 flex flex-col items-center gap-4">
                  <PlayStoreBadge size="lg" />
                  <Link
                    href={PLAY_STORE_SEO_PATH}
                    className="text-sm font-semibold text-landing-muted underline decoration-landing-border underline-offset-4 hover:text-landing-copper"
                  >
                    Play Store info page →
                  </Link>
                </div>
              </div>
            </Reveal>
          </section>
        ) : null}
      </main>

      {isIndia ? (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-landing-border bg-landing-bg/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
          <div className="mx-auto flex max-w-lg items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PLAY_STORE_IMAGES.appIcon}
              alt=""
              className="h-11 w-11 rounded-xl"
              width={44}
              height={44}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-landing-ink">Rasoi</p>
              <p className="truncate text-xs text-landing-muted">Free on Google Play</p>
            </div>
            <a
              href={PLAY_STORE_LISTING_URL}
              className="landing-install-pulse landing-btn-primary !px-5 !py-2.5"
              rel="noopener noreferrer"
            >
              Install
            </a>
          </div>
        </div>
      ) : null}

      <MarketFooter showIndiaAppLinks={isIndia} />
    </div>
  );
}
