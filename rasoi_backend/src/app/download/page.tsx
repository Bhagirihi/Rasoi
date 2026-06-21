import Image from 'next/image';
import Link from 'next/link';

import { LEGAL_CONTACT_EMAIL } from '@/lib/legal-content';

import RasoiLogo from '@/app/_components/RasoiLogo';
import JsonLd from '@/app/_components/JsonLd';
import {
  ANDROID_APK_URL,
  APP_FEATURES,
  APP_NAME,
  PLAY_STORE_LISTING_URL,
} from '@/lib/app-download';
import { absoluteUrl, downloadMetadata, mobileAppJsonLd } from '@/lib/seo';

export const metadata = downloadMetadata;

export default function DownloadPage() {
  return (
    <div className="landing-grain min-h-screen text-[#1a1a2e]">
      <JsonLd data={mobileAppJsonLd(absoluteUrl('/download'))} />
      <header className="border-b border-[#e8dfd3] bg-[#fcf9f4]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <RasoiLogo size="sm" />
            <div>
              <p className="font-display text-2xl font-semibold tracking-tight">Rasoi</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6b6560]">
                Indian home cooking
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
              alt="Rasoi app preview — Indian home cooking on your phone"
              width={1600}
              height={900}
              priority
              className="h-auto w-full object-cover"
            />
          </div>

          <div className="mx-auto mt-12 max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
              Available on Google Play
            </p>
            <h1 className="font-display mt-4 text-4xl font-semibold leading-tight tracking-tight lg:text-5xl">
              Download {APP_NAME} on Google Play
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-[#6b6560]">
              {APP_NAME} is live on Google Play. Install in one tap for regional recipes, smart
              pantry matching, saved favourites, and automatic updates.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-xl rounded-[1.5rem] border border-[#e8dfd3] bg-[#fcf9f4] p-8 text-center">
            <a
              href={PLAY_STORE_LISTING_URL}
              className="inline-flex rounded-full bg-[#14110f] px-8 py-3.5 text-sm font-semibold text-[#f5f0e8] transition hover:bg-[#1c1714]"
            >
              Get it on Google Play
            </a>
            <p className="mt-4 text-sm leading-relaxed text-[#6b6560]">
              Free to install. Open Google Play on your Android phone and tap Install.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-xl rounded-[1.5rem] border border-dashed border-[#d9d0c4] bg-white p-6 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6b6560]">
              Alternative · Direct APK
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#6b6560]">
              Can&apos;t use Google Play? Download the latest Android APK from our site.
            </p>
            <a
              href={ANDROID_APK_URL}
              className="mt-4 inline-flex rounded-full border border-[#d9d0c4] px-6 py-3 text-sm font-semibold transition hover:border-[#c9a227]/50"
            >
              Download Android APK
            </a>
          </div>
        </section>

        <section className="border-y border-[#e8dfd3] bg-[#fcf9f4]">
          <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
              App features
            </p>
            <h2 className="font-display mt-3 text-4xl font-semibold">What you get with Rasoi</h2>
            <p className="mt-4 max-w-2xl text-[#6b6560]">
              A beautifully simple Indian recipe app built for real home kitchens — discover
              dishes, match your pantry, and shop missing ingredients in one flow.
            </p>
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
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-12 text-center lg:px-8">
          <p className="text-sm text-[#6b6560]">
            Questions or feedback?{' '}
            <a
              href={`mailto:${LEGAL_CONTACT_EMAIL}`}
              className="font-semibold text-[#c45c2a] hover:text-[#1a1a2e]"
            >
              {LEGAL_CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </main>

      <footer className="border-t border-[#e8dfd3] bg-[#fcf9f4]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-[#6b6560] lg:px-8">
          <p>
            Rasoi — Indian recipes for modern home cooks ·{' '}
            <a href={`mailto:${LEGAL_CONTACT_EMAIL}`} className="font-semibold hover:text-[#c45c2a]">
              {LEGAL_CONTACT_EMAIL}
            </a>
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy" className="font-semibold hover:text-[#c45c2a]">
              Privacy
            </Link>
            <Link href="/terms" className="font-semibold hover:text-[#c45c2a]">
              Terms
            </Link>
            <Link href="/" className="font-semibold text-[#c45c2a] hover:text-[#1a1a2e]">
              Back to home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
