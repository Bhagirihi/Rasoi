'use client';

import { useState } from 'react';

import type { RecipeIngredient, RecipeTag } from '@/lib/types';

export type RecipePreviewData = {
  title: string;
  prepTime: number;
  calories: number;
  region: string;
  kitchenStyleId?: string;
  dietType: string;
  difficulty: string;
  description: string;
  descriptionHi?: string;
  imageUrl: string;
  tags: RecipeTag[];
  ingredients: RecipeIngredient[];
  steps: string[];
  stepsHi?: string[];
  published: boolean;
};

function FeedCardPreview({ data }: { data: RecipePreviewData }) {
  const missing = data.ingredients.filter((item) => !item.isStaple).slice(0, 3);

  return (
    <div className="overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-white shadow-md">
      <div className="relative h-[168px] bg-[#f0e9de]">
        {data.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-[#6B7280]">
            Add image URL
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[17px] font-extrabold leading-tight text-[#1A1A2E]">
            {data.title || 'Recipe title'}
          </h3>
          <span className="rounded-full bg-[rgba(255,107,53,0.12)] px-2.5 py-1 text-[11px] font-bold text-[#FF6B35]">
            Save
          </span>
        </div>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-[#6B7280]">
          {data.description || 'Recipe description will appear here.'}
        </p>
        <div className="mt-2.5 flex flex-wrap gap-3 text-[12px] font-semibold text-[#1A1A2E]">
          <span>🕐 {data.prepTime} min</span>
          <span>🔥 {data.calories} kcal</span>
          <span className="text-[#00A86B]">📍 100%</span>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-[rgba(0,168,107,0.12)] px-2.5 py-1 text-[11px] font-bold">
            {data.dietType}
          </span>
          <span className="rounded-full bg-[rgba(255,107,53,0.12)] px-2.5 py-1 text-[11px] font-bold">
            {data.region}
          </span>
        </div>
        {missing.length > 0 && (
          <div
            className="mt-3 rounded-xl p-3"
            style={{ background: 'linear-gradient(90deg, #F8CB46, #7C3AED, #FF5200)' }}
          >
            <p className="text-[11px] font-extrabold text-[#1A1A2E]">
              {missing.length} missing — shop on Blinkit · Zepto · Instamart
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailPreview({ data }: { data: RecipePreviewData }) {
  const [stepsLang, setStepsLang] = useState<'en' | 'hi'>('en');
  const staples = data.ingredients.filter((item) => item.isStaple);
  const missing = data.ingredients.filter((item) => !item.isStaple);
  const totalIngredients = data.ingredients.length;
  const stockedCount = staples.length;
  const progress = totalIngredients > 0 ? stockedCount / totalIngredients : 0;
  const sponsored = data.ingredients.find((item) => item.recommendedBrand);
  const displayDescription =
    stepsLang === 'hi' && data.descriptionHi?.trim()
      ? data.descriptionHi
      : data.description;
  const displaySteps =
    stepsLang === 'hi' && data.stepsHi?.length ? data.stepsHi : data.steps;

  return (
    <div className="relative h-full bg-[#FAFAFA]">
      <div className="h-full overflow-y-auto pb-[140px]">
        {/* Hero */}
        <div className="relative h-[288px] bg-[#2a2218]">
          {data.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.imageUrl} alt="" className="h-full w-full object-cover" />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,26,46,0.92)] via-[rgba(26,26,46,0.35)] to-transparent" />

          {/* Top bar */}
          <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-4 pt-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-[#FF6B35] px-3.5 py-2 text-[13px] font-bold text-white shadow-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
              Saved
            </div>
          </div>

          {/* Hero title + pills */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h2 className="text-[26px] font-extrabold leading-tight text-white">
              {data.title || 'Recipe title'}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-[11px] font-bold text-white">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                {data.prepTime} min
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-[11px] font-bold text-white">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                {data.difficulty}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(0,168,107,0.85)] px-3 py-1.5 text-[11px] font-bold text-white">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 21s-6-5.33-6-10a6 6 0 1112 0c0 4.67-6 10-6 10z" />
                  <circle cx="12" cy="11" r="2" />
                </svg>
                100% regional match
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 pt-5">
          {/* Food delivery strip */}
          <div
            className="overflow-hidden rounded-[22px] shadow-lg"
            style={{ background: 'linear-gradient(135deg, #E23744 0%, #FC8019 50%, #FF6B35 100%)' }}
          >
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/25 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">
                  ✨ Easier tonight
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/25 px-2.5 py-1 text-[10px] font-extrabold text-white">
                  🕐 Save {data.prepTime} min
                </span>
              </div>
              <div className="mt-3 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
                    <path d="M7 2v20" />
                    <path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1 pr-2">
                  <p className="text-[15px] font-extrabold text-white">Skip cooking?</p>
                  <p className="mt-0.5 text-[12px] leading-snug text-white/90">
                    Order {data.title || 'this dish'} on Zomato or Swiggy — delivered hot.
                  </p>
                  <p className="mt-1 text-[12px] font-bold text-white">Order ready-made →</p>
                </div>
                <span className="text-white/80">›</span>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="flex-1 rounded-full bg-white py-2.5 text-center text-[13px] font-extrabold text-[#1A1A2E]">
                  Zomato
                </span>
                <span className="flex-1 rounded-full bg-white py-2.5 text-center text-[13px] font-extrabold text-[#1A1A2E]">
                  Swiggy
                </span>
              </div>
            </div>
          </div>

          {/* Rasoi Plus badge */}
          <div className="mt-5">
            <span className="rounded-full border border-[rgba(255,107,53,0.35)] bg-[rgba(255,107,53,0.1)] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#FF6B35]">
              Rasoi Plus
            </span>
          </div>

          <p className="mt-4 text-[15px] leading-relaxed text-[#6B7280]">
            {displayDescription || 'Recipe description appears here.'}
          </p>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 gap-2.5">
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-3.5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#6B7280]">Calories</p>
              <p className="mt-1 text-[18px] font-extrabold text-[#1A1A2E]">{data.calories}</p>
            </div>
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-3.5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#6B7280]">Region</p>
              <p className="mt-1 text-[18px] font-extrabold text-[#FF6B35]">{data.region}</p>
            </div>
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-3.5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#6B7280]">Diet</p>
              <p className="mt-1 text-[18px] font-extrabold text-[#00A86B]">{data.dietType}</p>
            </div>
          </div>

          {/* How to cook */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-[15px] font-extrabold text-[#1A1A2E]">
              {stepsLang === 'hi' ? 'बनाने की विधि' : 'How to cook'}
            </h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStepsLang('en')}
                className={`rounded-full border px-3 py-1 text-[11px] font-bold ${
                  stepsLang === 'en'
                    ? 'border-[#FF6B35] bg-[rgba(255,107,53,0.12)] text-[#FF6B35]'
                    : 'border-[#E5E7EB] bg-white text-[#6B7280]'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setStepsLang('hi')}
                className={`rounded-full border px-3 py-1 text-[11px] font-bold ${
                  stepsLang === 'hi'
                    ? 'border-[#FF6B35] bg-[rgba(255,107,53,0.12)] text-[#FF6B35]'
                    : 'border-[#E5E7EB] bg-white text-[#6B7280]'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>
          <div className="mt-3 space-y-3">
            {displaySteps.length === 0 ? (
              <p className="text-sm text-[#6B7280]">
                {stepsLang === 'hi'
                  ? 'No Hindi steps added yet.'
                  : 'No steps added yet.'}
              </p>
            ) : (
              displaySteps.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-3.5 shadow-sm"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FF6B35] text-[13px] font-extrabold text-white">
                    {index + 1}
                  </span>
                  <p className="text-[14px] leading-[22px] text-[#1A1A2E]">{step}</p>
                </div>
              ))
            )}
          </div>

          {/* Ingredients */}
          <h3 className="mt-8 text-[15px] font-extrabold text-[#1A1A2E]">Ingredients</h3>

          {staples.length > 0 && (
            <div className="mt-3">
              <div className="mb-3 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00A86B" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="text-[15px] font-extrabold text-[#1A1A2E]">Already in your kitchen</span>
                <span className="rounded-full bg-[rgba(0,168,107,0.15)] px-2 py-0.5 text-[11px] font-extrabold text-[#00A86B]">
                  {staples.length}
                </span>
              </div>
              {staples.map((item) => (
                <div
                  key={item.name}
                  className="mb-2 flex items-center rounded-xl bg-[rgba(0,168,107,0.06)] px-3.5 py-2.5"
                >
                  <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#00A86B] text-white">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  <span className="ml-3 flex-1 text-[14px] font-semibold text-[#6B7280]">{item.name}</span>
                  {item.isStaple && (
                    <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-extrabold uppercase text-[#6B7280]">
                      Staple
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {missing.length > 0 && (
            <div className="mt-4 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(255,107,53,0.1)]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[15px] font-extrabold text-[#1A1A2E]">Need to buy</p>
                    <p className="text-[12px] text-[#6B7280]">
                      {missing.length} item{missing.length !== 1 ? 's' : ''} to order
                    </p>
                  </div>
                </div>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF6B35] text-[13px] font-extrabold text-white">
                  {missing.length}
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E5E7EB]">
                <div
                  className="h-full rounded-full bg-[#00A86B]"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] font-semibold text-[#6B7280]">
                {stockedCount} of {totalIngredients} ingredients in your pantry
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {missing.map((item) => (
                  <span
                    key={item.name}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-[#FAFAFA] px-3 py-1.5 text-[12px] font-semibold text-[#1A1A2E]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B35]" />
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {sponsored?.recommendedBrand && (
            <div className="mt-4 rounded-2xl border border-[rgba(255,107,53,0.2)] bg-[#FAFAFA] p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF6B35]">
                Sponsored
              </p>
              <p className="mt-2 text-[14px] font-bold text-[#1A1A2E]">
                {sponsored.recommendedBrand.name} recommended for this dish
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[#E5E7EB] bg-white px-4 pb-3 pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="rounded-2xl border-2 border-[#E23744] bg-[#1A1A2E] px-4 py-3.5 text-center shadow-lg">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF9933]">
            Recommended
          </p>
          <p className="mt-0.5 text-[15px] font-extrabold text-white">Skip cooking — order ready-made</p>
          <p className="mt-0.5 text-[11px] text-white/75">Zomato · Swiggy · ~30 min delivery</p>
        </div>
        {missing.length > 0 && (
          <p className="mt-2 flex items-center justify-center gap-1.5 text-[13px] font-bold text-[#FF6B35]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            Or shop {missing.length} grocery item{missing.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* More below pill */}
      <div className="pointer-events-none absolute bottom-[118px] left-1/2 z-10 -translate-x-1/2">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#FF6B35] px-4 py-2 text-[11px] font-extrabold text-white shadow-lg">
          More below ↓
        </span>
      </div>
    </div>
  );
}

export default function MobileRecipePreview({
  data,
  onClose,
  onConfirmPublish,
  onSaveDraft,
  loading,
  confirmLabel = 'Confirm & publish to mobile',
}: {
  data: RecipePreviewData;
  onClose: () => void;
  onConfirmPublish: () => void;
  onSaveDraft: () => void;
  loading?: boolean;
  confirmLabel?: string;
}) {
  const [view, setView] = useState<'feed' | 'detail'>('detail');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14110f]/80 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-4xl flex-col gap-6 lg:flex-row lg:items-start">
        <div className="mx-auto w-full max-w-[390px] shrink-0">
          <div className="rounded-[2.5rem] border-[10px] border-[#1c1714] bg-[#1c1714] p-2 shadow-2xl">
            <div className="overflow-hidden rounded-[1.75rem] bg-[#FAFAFA]">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-white px-4 py-2">
                <span className="text-[11px] font-bold text-[#1A1A2E]">9:41</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
                  Rasoi
                </span>
                <span className="text-[10px] text-[#6B7280]">●●●</span>
              </div>

              <div className="flex border-b border-[#E5E7EB] bg-white">
                <button
                  type="button"
                  onClick={() => setView('feed')}
                  className={`flex-1 py-2.5 text-xs font-bold ${
                    view === 'feed' ? 'text-[#FF6B35]' : 'text-[#6B7280]'
                  }`}
                >
                  Home feed
                </button>
                <button
                  type="button"
                  onClick={() => setView('detail')}
                  className={`flex-1 py-2.5 text-xs font-bold ${
                    view === 'detail' ? 'text-[#FF6B35]' : 'text-[#6B7280]'
                  }`}
                >
                  Recipe detail
                </button>
              </div>

              <div className="h-[680px] overflow-hidden">
                {view === 'feed' ? (
                  <div className="h-full overflow-y-auto bg-[#FAFAFA] p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                      Tonight&apos;s recipes
                    </p>
                    <FeedCardPreview data={data} />
                  </div>
                ) : (
                  <DetailPreview data={data} />
                )}
              </div>
            </div>
          </div>
          {!data.published && (
            <p className="mt-3 text-center text-xs font-semibold uppercase tracking-wider text-[#e8d5a3]">
              Draft — not visible in app until you confirm
            </p>
          )}
        </div>

        <div className="flex-1 rounded-[1.25rem] border border-[#3a312a] bg-[#1c1714] p-6 text-[#f5f0e8]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c9a227]">
            Mobile preview
          </p>
          <h2 className="font-display mt-2 text-3xl font-semibold">Review before going live</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#b8b0a6]">
            Recipe detail matches the Rasoi app — hero, delivery strip, stats, steps,
            pantry ingredients, and sticky order bar.
          </p>

          <ul className="mt-6 space-y-2 text-sm text-[#d8d0c6]">
            <li>• Hero with time, difficulty & regional match</li>
            <li>• Zomato / Swiggy skip-cooking card</li>
            <li>• Ingredients split: kitchen vs need to buy</li>
            <li>• Bottom recommended delivery CTA</li>
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={onConfirmPublish}
              disabled={loading}
              className="rounded-full bg-[#c9a227] px-5 py-3 text-sm font-bold text-[#14110f] transition hover:bg-[#e8d5a3] disabled:opacity-60"
            >
              {loading ? 'Publishing…' : confirmLabel}
            </button>
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={loading}
              className="rounded-full border border-[#3a312a] px-5 py-3 text-sm font-semibold text-[#f5f0e8] hover:border-[#c9a227]/40 disabled:opacity-60"
            >
              Save as draft
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-full px-5 py-3 text-sm font-semibold text-[#9a9590] hover:text-white"
            >
              Back to editor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
