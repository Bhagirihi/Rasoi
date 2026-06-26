import Link from 'next/link';

import MarketFooter from '@/app/_components/MarketFooter';
import RasoiLogo from '@/app/_components/RasoiLogo';
import type { SeoContentFaq } from '@/lib/seo-content-pages';

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
        <article>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
            Rasoi guide
          </p>
          <h1 className="font-display mt-3 text-4xl font-semibold leading-tight tracking-tight lg:text-5xl">
            {h1}
          </h1>
          {meta ? (
            <p className="mt-4 text-sm font-medium text-[#6b6560]">
              {[meta.cuisine, meta.diet, meta.time].filter(Boolean).join(' · ')}
            </p>
          ) : null}
          <p className="mt-6 text-lg leading-relaxed text-[#6b6560]">{intro}</p>

          <div className="mt-10 space-y-10">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-2xl font-semibold">{section.heading}</h2>
                <p className="mt-3 leading-relaxed text-[#6b6560]">{section.body}</p>
              </section>
            ))}
          </div>

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
