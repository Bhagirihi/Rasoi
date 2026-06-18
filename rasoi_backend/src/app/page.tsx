import Link from 'next/link';

import JsonLd from '@/app/_components/JsonLd';
import RasoiLogo from '@/app/_components/RasoiLogo';
import SponsorApplyForm from '@/app/_components/SponsorApplyForm';
import { APP_DOWNLOAD_PATH } from '@/lib/app-download';
import {
  FAQ_ITEMS,
  faqJsonLd,
  homeMetadata,
  mobileAppJsonLd,
  organizationJsonLd,
  webSiteJsonLd,
} from '@/lib/seo';
import { LEGAL_CONTACT_EMAIL } from '@/lib/legal-content';
import { getPublishedRecipeCount } from '@/lib/home-stats';

export const metadata = homeMetadata;
export const revalidate = 300;

export default async function HomePage() {
  const recipeCount = await getPublishedRecipeCount();

  return (
    <div className="landing-grain min-h-screen text-[#1a1a2e]">
      <JsonLd data={[organizationJsonLd(), webSiteJsonLd(), mobileAppJsonLd(), faqJsonLd()]} />
      <header className="border-b border-[#e8dfd3] bg-[#fcf9f4]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 lg:px-8">
          <div className="flex items-center gap-3">
            <RasoiLogo size="sm" />
            <div>
              <p className="font-display text-2xl font-semibold tracking-tight">Rasoi</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6b6560]">
                Indian home cooking
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-[#6b6560] md:flex">
            <Link
              href={APP_DOWNLOAD_PATH}
              className="font-semibold text-[#c45c2a] hover:text-[#1a1a2e]"
            >
              Download app
            </Link>
            <a href="#features" className="hover:text-[#c45c2a]">Features</a>
            <a href="#faq" className="hover:text-[#c45c2a]">FAQ</a>
            <a href="#partners" className="hover:text-[#c45c2a]">Partners</a>
            <a href="#sponsor" className="hover:text-[#c45c2a]">Sponsor with us</a>
            <a href="#plans" className="hover:text-[#c45c2a]">Rasoi Plus</a>
          </nav>
          <Link
            href="/admin/login"
            className="rounded-full border border-[#d9d0c4] px-4 py-2 text-sm font-semibold transition hover:border-[#c9a227]/50"
          >
            Admin
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
                Aaj kya banaye? · Cook tonight, effortlessly
              </p>
              <h1 className="font-display mt-4 text-5xl font-semibold leading-[1.05] tracking-tight lg:text-6xl">
                Indian recipe app for
                <br />
                <span className="text-[#c45c2a]">your pantry</span>
                <br />
                and your region.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#6b6560]">
                Rasoi is a free Indian home-cooking app on Android. Discover regional dishes,
                match recipes to what you already have, save favourites, and order missing
                ingredients from Blinkit, Zepto, Instamart, Zomato, or Swiggy in one tap.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={APP_DOWNLOAD_PATH}
                  className="rounded-full bg-[#14110f] px-6 py-3 text-sm font-semibold text-[#f5f0e8] transition hover:bg-[#1c1714]"
                >
                  Download Android app
                </Link>
                <a
                  href="#features"
                  className="rounded-full border border-[#d9d0c4] px-6 py-3 text-sm font-semibold transition hover:border-[#c9a227]/50"
                >
                  Explore features
                </a>
              </div>
              <p className="mt-8 text-sm text-[#6b6560]">
                <span className="font-semibold text-[#1a1a2e]">{recipeCount}+ curated recipes</span>
                across North, South, East, West & Central India
              </p>
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
                  {['Blinkit', 'Zepto', 'Instamart', 'Swiggy'].map((name) => (
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
            <h2 className="font-display mt-3 text-4xl font-semibold">Built for real Indian kitchens</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Regional recipes',
                  body: 'Filter by North, South, East, West, or Central cuisines with diet preferences from Veg to Non-Veg.',
                },
                {
                  title: 'Smart pantry',
                  body: 'See what you can cook tonight with ingredients already in your kitchen — or what you need to buy.',
                },
                {
                  title: 'Saved collection',
                  body: 'Bookmark dishes for weeknight rotation, festive menus, and family favourites.',
                },
                {
                  title: 'Sponsored brands',
                  body: 'Native sponsor cards on Home, Recipes, Pantry, Saved, and recipe detail screens.',
                },
                {
                  title: 'Quick filters',
                  body: 'Under 20 minutes, kid-friendly, leftover-friendly, and festive tags for faster decisions.',
                },
                {
                  title: 'Member profiles',
                  body: 'Phone login, onboarding preferences, notifications, and Rasoi Plus plan support.',
                },
              ].map((feature) => (
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
          <h2 className="font-display mt-3 text-4xl font-semibold">Order in one tap</h2>
          <p className="mt-4 max-w-2xl text-[#6b6560]">
            Rasoi Plus unlocks grocery and food delivery checkout. Missing paneer? Open Blinkit.
            Want delivery instead? Jump to Zomato or Swiggy with affiliate tracking built in.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {[
              { name: 'Blinkit', note: '10-min grocery', color: '#f8cb46' },
              { name: 'Zepto', note: '~15 min delivery', color: '#7c3aed' },
              { name: 'Instamart', note: 'Swiggy quick commerce', color: '#ff5200' },
              { name: 'Zomato', note: 'Restaurant delivery', color: '#e23744' },
              { name: 'Swiggy', note: 'Food delivery', color: '#fc8019' },
            ].map((partner) => (
              <div
                key={partner.name}
                className="rounded-[1.25rem] border border-[#e8dfd3] bg-white p-6"
              >
                <div
                  className="h-2 w-12 rounded-full"
                  style={{ backgroundColor: partner.color }}
                />
                <p className="font-display mt-4 text-2xl font-semibold">{partner.name}</p>
                <p className="mt-2 text-sm text-[#6b6560]">{partner.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="sponsor" className="border-y border-[#e8dfd3] bg-[#fcf9f4]">
          <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
                  For brands
                </p>
                <h2 className="font-display mt-3 text-4xl font-semibold">
                  Sponsor with Rasoi
                </h2>
                <p className="mt-4 text-[#6b6560] leading-relaxed">
                  Put your brand in front of home cooks actively planning dinner. Rasoi offers
                  native sponsored placements on Home, Recipes, Pantry, Saved, and Recipe detail
                  — right when users are deciding what to cook and what to buy.
                </p>
                <p className="mt-6 text-sm text-[#6b6560]">
                  Questions about sponsorship?{' '}
                  <a
                    href={`mailto:${LEGAL_CONTACT_EMAIL}`}
                    className="font-semibold text-[#c45c2a] hover:text-[#1a1a2e]"
                  >
                    {LEGAL_CONTACT_EMAIL}
                  </a>
                </p>
                <ul className="mt-8 space-y-4 text-sm text-[#1a1a2e]">
                  {[
                    'Five high-intent screens: home planning, recipe browse, pantry restock, saved favourites, and in-recipe cooking',
                    'Placements tied to ingredients and checkout moments',
                    'Clear “Sponsored” labeling with affiliate-friendly CTAs',
                    'Reviewed by our team before going live in the app',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9a227]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <SponsorApplyForm />
            </div>
          </div>
        </section>

        <section id="plans" className="border-t border-[#e8dfd3] bg-[#14110f] text-[#f5f0e8]">
          <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#e8d5a3]">
                  Rasoi Plus
                </p>
                <h2 className="font-display mt-3 text-4xl font-semibold">
                  Free trial. Premium partner access.
                </h2>
                <p className="mt-4 text-[#b8b0a6] leading-relaxed">
                  Start with a 3-day trial of partner checkout, then subscribe to keep Blinkit,
                  Zepto, Instamart, Zomato, and Swiggy links — and remove ads across the app.
                </p>
              </div>
              <ul className="space-y-4 text-sm">
                {[
                  'No ads on Free, Trial, or Plus journeys',
                  'Blinkit, Zepto & Instamart grocery cart deep links',
                  'Zomato & Swiggy food delivery links',
                  'Pantry-aware recipe matching',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-xl border border-[#2a2218] bg-[#1c1714] px-4 py-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9a227]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
            FAQ
          </p>
          <h2 className="font-display mt-3 text-4xl font-semibold">About Rasoi app</h2>
          <div className="mt-10 space-y-6">
            {FAQ_ITEMS.map((item) => (
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

      <footer className="border-t border-[#e8dfd3] bg-[#fcf9f4]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-[#6b6560] lg:px-8">
          <p>
            Rasoi — Indian recipe app for home cooks ·{' '}
            <a href={`mailto:${LEGAL_CONTACT_EMAIL}`} className="font-semibold hover:text-[#c45c2a]">
              {LEGAL_CONTACT_EMAIL}
            </a>
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href={APP_DOWNLOAD_PATH}
              className="font-semibold text-[#c45c2a] hover:text-[#1a1a2e]"
            >
              Download Android app
            </Link>
            <Link href="/privacy" className="font-semibold hover:text-[#c45c2a]">
              Privacy
            </Link>
            <Link href="/terms" className="font-semibold hover:text-[#c45c2a]">
              Terms
            </Link>
            <Link href="/admin/login" className="font-semibold text-[#c45c2a] hover:text-[#1a1a2e]">
              Admin console
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
