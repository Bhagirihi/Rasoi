import Image from 'next/image';
import Link from 'next/link';

import JsonLd from '@/app/_components/JsonLd';
import PlayStoreAutoRedirect from '@/app/_components/PlayStoreAutoRedirect';
import RasoiLogo from '@/app/_components/RasoiLogo';
import {
  ANDROID_PACKAGE,
  APP_DEVELOPER,
  APP_FEATURES,
  APP_NAME,
  PLAY_STORE_LISTING_URL,
  PLAY_STORE_SEO_PATH,
} from '@/lib/app-download';
import { LEGAL_CONTACT_EMAIL } from '@/lib/legal-content';
import {
  absoluteUrl,
  faqJsonLd,
  mobileAppJsonLd,
  PLAY_STORE_FAQ_ITEMS,
  playStoreBreadcrumbJsonLd,
  playStoreMetadata,
} from '@/lib/seo';

export const metadata = playStoreMetadata;

const PLAY_STORE_HIGHLIGHTS = [
  'Aaj kya banaye? — smart dinner picks from your pantry',
  '1,200+ Indian recipes across 15 regional cuisines',
  'Veg, Jain, Egg & Non-Veg filters for every home',
  'Pantry match % — cook with what you already have',
  'Blinkit, Zepto & Instamart for missing groceries',
  'Zomato & Swiggy when you want delivery instead',
  'Free to install · Rasoi Plus from ₹49/month',
] as const;

export default function PlayStoreSeoPage() {
  const pageUrl = absoluteUrl(PLAY_STORE_SEO_PATH);

  return (
    <div className="landing-grain min-h-screen text-[#1a1a2e]">
      <JsonLd data={mobileAppJsonLd(pageUrl)} />
      <JsonLd data={playStoreBreadcrumbJsonLd()} />
      <JsonLd data={faqJsonLd(PLAY_STORE_FAQ_ITEMS)} />

      <header className="border-b border-[#e8dfd3] bg-[#fcf9f4]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <RasoiLogo size="sm" />
            <div>
              <p className="font-display text-2xl font-semibold tracking-tight">Rasoi</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6b6560]">
                Apps on Google Play
              </p>
            </div>
          </Link>
          <Link
            href="/"
            className="rounded-full border border-[#d9d0c4] px-4 py-2 text-sm font-semibold transition hover:border-[#c9a227]/50"
          >
            Back to home
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
          <div className="overflow-hidden rounded-[1.75rem] border border-[#e8dfd3] bg-white shadow-[0_24px_60px_rgba(26,26,46,0.08)]">
            <Image
              src="/download-hero.png"
              alt="Rasoi: Aaj Kya Banaye? — Indian recipe app on Google Play for Android"
              width={1600}
              height={900}
              priority
              className="h-auto w-full object-cover"
            />
          </div>

          <div className="mx-auto mt-12 max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
              Google Play · Food &amp; Drink · Everyone
            </p>
            <h1 className="font-display mt-4 text-4xl font-semibold leading-tight tracking-tight lg:text-5xl">
              {APP_NAME} — Apps on Google Play
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-[#6b6560]">
              The free Indian home-cooking app for Android. Answer &ldquo;Aaj kya banaye?&rdquo; every
              evening with pantry-smart recipes, regional cuisines, and one-tap grocery checkout.
            </p>
            <PlayStoreAutoRedirect />
          </div>

          <div className="mx-auto mt-10 max-w-xl rounded-[1.5rem] border border-[#e8dfd3] bg-[#fcf9f4] p-8 text-center">
            <a
              href={PLAY_STORE_LISTING_URL}
              className="inline-flex rounded-full bg-[#14110f] px-8 py-3.5 text-sm font-semibold text-[#f5f0e8] transition hover:bg-[#1c1714]"
              rel="noopener noreferrer"
            >
              Install on Google Play
            </a>
            <p className="mt-4 text-sm leading-relaxed text-[#6b6560]">
              By {APP_DEVELOPER} · Package {ANDROID_PACKAGE}
            </p>
          </div>
        </section>

        <section className="border-y border-[#e8dfd3] bg-[#fcf9f4]">
          <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
              Why download Rasoi from Google Play
            </p>
            <h2 className="font-display mt-3 text-4xl font-semibold">
              Indian recipe app built for real home kitchens
            </h2>
            <ul className="mt-8 grid gap-4 md:grid-cols-2">
              {PLAY_STORE_HIGHLIGHTS.map((item) => (
                <li
                  key={item}
                  className="rounded-[1.25rem] border border-[#e8dfd3] bg-white px-5 py-4 text-sm leading-relaxed text-[#6b6560]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
            App features
          </p>
          <h2 className="font-display mt-3 text-4xl font-semibold">What you get with Rasoi Plus</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {APP_FEATURES.map((feature) => (
              <article
                key={feature.title}
                className="rounded-[1.25rem] border border-[#e8dfd3] bg-white p-6 shadow-sm"
              >
                <h3 className="font-display text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#6b6560]">{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-[#e8dfd3] bg-[#fcf9f4]">
          <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
            <h2 className="font-display text-3xl font-semibold">Frequently asked questions</h2>
            <dl className="mt-8 space-y-8">
              {PLAY_STORE_FAQ_ITEMS.map((item) => (
                <div key={item.question}>
                  <dt className="font-display text-lg font-semibold">{item.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-[#6b6560]">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e8dfd3] bg-[#fcf9f4]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-[#6b6560] lg:px-8">
          <p>
            {APP_NAME} on Google Play ·{' '}
            <a href={`mailto:${LEGAL_CONTACT_EMAIL}`} className="font-semibold hover:text-[#c45c2a]">
              {LEGAL_CONTACT_EMAIL}
            </a>
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/download" className="font-semibold hover:text-[#c45c2a]">
              Download page
            </Link>
            <Link href="/privacy" className="font-semibold hover:text-[#c45c2a]">
              Privacy
            </Link>
            <Link href="/terms" className="font-semibold hover:text-[#c45c2a]">
              Terms
            </Link>
            <Link href="/" className="font-semibold text-[#c45c2a] hover:text-[#1a1a2e]">
              Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
