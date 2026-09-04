'use client';

import { useState } from 'react';

import {
  SPONSOR_APPLICATION_PLACEMENT_OPTIONS,
  type SponsorApplicationPlacement,
} from '@/lib/sponsor-placements';

type SponsorApplyFormProps = {
  phonePlaceholder?: string;
  brandExample?: string;
};

export default function SponsorApplyForm({
  phonePlaceholder = '+91 98765 43210',
  brandExample = 'e.g. Amul, Tata Sampann',
}: SponsorApplyFormProps) {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [brandName, setBrandName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [placementInterest, setPlacementInterest] = useState<SponsorApplicationPlacement>('home');
  const [website, setWebsite] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/sponsor-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          contactName,
          email,
          phone: phone || undefined,
          brandName,
          productDescription,
          placementInterest,
          website: website || undefined,
          message: message || undefined,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.ok) {
        setError(result.error ?? 'Could not submit application. Please try again.');
        return;
      }

      setSuccess(result.data.message);
      setCompanyName('');
      setContactName('');
      setEmail('');
      setPhone('');
      setBrandName('');
      setProductDescription('');
      setPlacementInterest('home');
      setWebsite('');
      setMessage('');
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[1.25rem] border border-landing-border bg-white p-6 shadow-sm lg:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-medium text-landing-ink">
          Company name
          <input
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            required
            className="mt-2 w-full rounded-xl border border-landing-border px-4 py-3 text-sm outline-none focus:border-landing-gold/60 focus:ring-2 focus:ring-landing-gold/15"
          />
        </label>

        <label className="block text-sm font-medium text-landing-ink">
          Brand name
          <input
            value={brandName}
            onChange={(event) => setBrandName(event.target.value)}
            required
            placeholder={brandExample}
            className="mt-2 w-full rounded-xl border border-landing-border px-4 py-3 text-sm outline-none focus:border-landing-gold/60 focus:ring-2 focus:ring-landing-gold/15"
          />
        </label>

        <label className="block text-sm font-medium text-landing-ink">
          Contact name
          <input
            value={contactName}
            onChange={(event) => setContactName(event.target.value)}
            required
            className="mt-2 w-full rounded-xl border border-landing-border px-4 py-3 text-sm outline-none focus:border-landing-gold/60 focus:ring-2 focus:ring-landing-gold/15"
          />
        </label>

        <label className="block text-sm font-medium text-landing-ink">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-2 w-full rounded-xl border border-landing-border px-4 py-3 text-sm outline-none focus:border-landing-gold/60 focus:ring-2 focus:ring-landing-gold/15"
          />
        </label>

        <label className="block text-sm font-medium text-landing-ink">
          Phone (optional)
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder={phonePlaceholder}
            className="mt-2 w-full rounded-xl border border-landing-border px-4 py-3 text-sm outline-none focus:border-landing-gold/60 focus:ring-2 focus:ring-landing-gold/15"
          />
        </label>

        <label className="block text-sm font-medium text-landing-ink">
          Website (optional)
          <input
            type="url"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            placeholder="https://"
            className="mt-2 w-full rounded-xl border border-landing-border px-4 py-3 text-sm outline-none focus:border-landing-gold/60 focus:ring-2 focus:ring-landing-gold/15"
          />
        </label>

        <fieldset className="md:col-span-2">
          <legend className="text-sm font-medium text-landing-ink">Preferred placement</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {SPONSOR_APPLICATION_PLACEMENT_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`cursor-pointer rounded-xl border px-4 py-3 transition ${
                  placementInterest === option.value
                    ? 'border-landing-gold bg-landing-bg'
                    : 'border-landing-border bg-landing-cream hover:border-landing-border'
                }`}
              >
                <input
                  type="radio"
                  name="placement"
                  value={option.value}
                  checked={placementInterest === option.value}
                  onChange={() => setPlacementInterest(option.value)}
                  className="sr-only"
                />
                <span className="text-sm font-semibold text-landing-ink">{option.label}</span>
                <p className="mt-1 text-xs text-landing-muted">{option.hint}</p>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block text-sm font-medium text-landing-ink md:col-span-2">
          Product pitch
          <textarea
            value={productDescription}
            onChange={(event) => setProductDescription(event.target.value)}
            required
            rows={4}
            placeholder="Tell us about the product, audience fit, and campaign goals."
            className="mt-2 w-full rounded-xl border border-landing-border px-4 py-3 text-sm outline-none focus:border-landing-gold/60 focus:ring-2 focus:ring-landing-gold/15"
          />
        </label>

        <label className="block text-sm font-medium text-landing-ink md:col-span-2">
          Additional notes (optional)
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={3}
            placeholder="Budget range, timeline, creative assets, or partnership references."
            className="mt-2 w-full rounded-xl border border-landing-border px-4 py-3 text-sm outline-none focus:border-landing-gold/60 focus:ring-2 focus:ring-landing-gold/15"
          />
        </label>
      </div>

      {error && (
        <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {success && (
        <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 rounded-full bg-landing-ink px-6 py-3 text-sm font-semibold text-landing-bone transition hover:bg-landing-night-soft disabled:opacity-60"
      >
        {loading ? 'Submitting…' : 'Submit sponsorship application'}
      </button>
    </form>
  );
}
