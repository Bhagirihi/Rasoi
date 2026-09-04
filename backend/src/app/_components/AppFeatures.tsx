import Reveal from '@/app/_components/Reveal';
import { APP_STORE_LISTING } from '@/lib/app-store-content';

type AppFeaturesProps = {
  themes?: typeof APP_STORE_LISTING.featureThemes;
};

export default function AppFeatures({
  themes = APP_STORE_LISTING.featureThemes,
}: AppFeaturesProps) {
  return (
    <div>
      <Reveal>
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-landing-saffron">
            App
          </p>
          <h2 className="font-display mt-3 text-4xl font-semibold tracking-tight lg:text-5xl">
            Application Features
          </h2>
          <p className="mt-3 text-landing-muted">
            Everything in the Rasoi Android app — grouped the way you cook.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        {themes.map((group, gi) => (
          <Reveal key={group.theme} delay={gi * 80}>
            <article className="h-full border-t-2 border-landing-saffron/35 pt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-landing-saffron">
                {group.theme}
              </p>
              <h3 className="font-display mt-2 text-2xl font-semibold tracking-tight">
                {group.title}
              </h3>
              <ul className="mt-5 space-y-4">
                {group.items.map((item) => (
                  <li key={item.title}>
                    <p className="text-sm font-semibold text-landing-ink">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-landing-muted">{item.body}</p>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
