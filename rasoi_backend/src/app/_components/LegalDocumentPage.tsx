import Link from 'next/link';

import ContactEmailLink from '@/app/_components/ContactEmailLink';
import LegalSectionBody from '@/app/_components/LegalSectionBody';
import RasoiLogo from '@/app/_components/RasoiLogo';
import { PLAY_STORE_LISTING_URL } from '@/lib/app-download';

type LegalSection = { title: string; body: string };

type LegalDocumentPageProps = {
  title: string;
  description: string;
  lastUpdated: string;
  sections: readonly LegalSection[];
};

export default function LegalDocumentPage({
  title,
  description,
  lastUpdated,
  sections,
}: LegalDocumentPageProps) {
  return (
    <div className="landing-grain min-h-screen text-landing-ink">
      <header className="border-b border-landing-border bg-landing-cream/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <RasoiLogo size="sm" priority />
            <div>
              <p className="font-display text-2xl font-semibold tracking-tight">Rasoi</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-landing-muted">
                Indian home cooking
              </p>
            </div>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-semibold text-landing-muted">
            <Link href="/privacy" className="hover:text-landing-saffron">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-landing-saffron">
              Terms
            </Link>
            <a
              href={PLAY_STORE_LISTING_URL}
              className="text-landing-saffron hover:text-landing-ink"
              rel="noopener noreferrer"
              target="_blank"
            >
              Google Play
            </a>
          </nav>
        </div>
      </header>

      <main id="contact" className="mx-auto max-w-3xl px-5 py-12 lg:px-8 lg:py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-landing-gold">
          Legal
        </p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-landing-muted">{description}</p>
        <p className="mt-2 text-sm text-landing-muted">Last updated: {lastUpdated}</p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-2xl font-semibold">{section.title}</h2>
              <LegalSectionBody body={section.body} />
            </section>
          ))}
        </div>
      </main>

      <footer className="border-t border-landing-border bg-landing-cream">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-landing-muted lg:px-8">
          <p>
            Rasoi ·{' '}
            <ContactEmailLink className="font-semibold hover:text-landing-saffron" />
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy" className="font-semibold hover:text-landing-saffron">
              Privacy
            </Link>
            <Link href="/terms" className="font-semibold hover:text-landing-saffron">
              Terms
            </Link>
            <a
              href={PLAY_STORE_LISTING_URL}
              className="font-semibold text-landing-saffron"
              rel="noopener noreferrer"
              target="_blank"
            >
              Get on Google Play
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
