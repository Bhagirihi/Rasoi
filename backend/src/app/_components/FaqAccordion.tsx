'use client';

import { useState } from 'react';

type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: readonly FaqItem[];
};

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [open, setOpen] = useState(0);

  return (
    <div className="divide-y divide-landing-border border-y border-landing-border">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <article key={item.question}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 py-5 text-left transition hover:text-landing-saffron"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <h3 className="font-display text-xl font-semibold lg:text-2xl">{item.question}</h3>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-landing-border text-sm transition ${
                  isOpen
                    ? 'bg-landing-ink text-landing-bg'
                    : 'bg-landing-cream text-landing-muted'
                }`}
                aria-hidden
              >
                {isOpen ? '−' : '+'}
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr] pb-6' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-3xl text-sm leading-relaxed text-landing-muted lg:text-base">
                  {item.answer}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
