import Link from 'next/link';

import RasoiLogo from '@/app/_components/RasoiLogo';
import { LEGAL_CONTACT_EMAIL } from '@/lib/legal-content';
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
    <div className="landing-grain min-h-screen text-[#1a1a2e]">
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
          <nav className="flex items-center gap-4 text-sm font-semibold text-[#6b6560]">
            <Link href="/privacy" className="hover:text-[#c45c2a]">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#c45c2a]">
              Terms
            </Link>
            <a
              href={PLAY_STORE_LISTING_URL}
              className="text-[#c45c2a] hover:text-[#1a1a2e]"
              rel="noopener noreferrer"
              target="_blank"
            >
              Google Play
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12 lg:px-8 lg:py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
          Legal
        </p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-[#6b6560]">{description}</p>
        <p className="mt-2 text-sm text-[#6b6560]">Last updated: {lastUpdated}</p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-2xl font-semibold">{section.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#6b6560]">{section.body}</p>
            </section>
          ))}
        </div>
      </main>

      <footer className="border-t border-[#e8dfd3] bg-[#fcf9f4]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-[#6b6560] lg:px-8">
          <p>
            Rasoi ·{' '}
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
            <a
              href={PLAY_STORE_LISTING_URL}
              className="font-semibold text-[#c45c2a]"
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
