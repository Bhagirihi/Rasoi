'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useToast } from '@/app/admin/_components/Toast';
import {
  AdminCard,
  FieldLabel,
  PrimaryButton,
  SelectInput,
  TextArea,
  TextInput,
} from '@/app/admin/_components/ui';
import {
  createHomeAnnouncementAction,
  updateHomeAnnouncementAction,
} from '@/app/admin/announcement-actions';
import type { HomeAnnouncement } from '@/lib/db/types';

function formatDateInput(value: Date | null): string {
  if (!value) return '';
  return value.toISOString().slice(0, 16);
}

const PRESENTATION_OPTIONS = [
  { value: 'both', label: 'Modal + banner' },
  { value: 'modal', label: 'Modal only' },
  { value: 'banner', label: 'Banner only' },
] as const;

const AUDIENCE_OPTIONS = [
  { value: 'all', label: 'All users' },
  { value: 'guest', label: 'Guest only' },
  { value: 'logged_in', label: 'Registered only' },
  { value: 'free', label: 'Free plan' },
  { value: 'paid', label: 'Paid plan' },
] as const;

const DEV_DUMMY_DEFAULTS = {
  campaignKey: 'local-test-2026',
  enabled: true,
  title: 'Welcome to Rasoi announcements',
  body: 'Dummy campaign for local testing. Modal + banner on Home, once per device.',
  imageUrl: '',
  ctaLabel: 'Open paywall',
  ctaLink: '/paywall',
  presentation: 'both' as const,
  minAppVersion: '1.0.0',
  audience: 'all' as const,
  sortOrder: 100,
};

function devDefaults() {
  return process.env.NODE_ENV === 'development' ? DEV_DUMMY_DEFAULTS : null;
}

export default function HomeAnnouncementForm({ announcement }: { announcement?: HomeAnnouncement }) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const dummy = announcement ? null : devDefaults();

  const [campaignKey, setCampaignKey] = useState(announcement?.campaignKey ?? dummy?.campaignKey ?? '');
  const [enabled, setEnabled] = useState(announcement?.enabled ?? dummy?.enabled ?? false);
  const [title, setTitle] = useState(announcement?.title ?? dummy?.title ?? '');
  const [body, setBody] = useState(announcement?.body ?? dummy?.body ?? '');
  const [imageUrl, setImageUrl] = useState(announcement?.imageUrl ?? dummy?.imageUrl ?? '');
  const [ctaLabel, setCtaLabel] = useState(announcement?.ctaLabel ?? dummy?.ctaLabel ?? '');
  const [ctaLink, setCtaLink] = useState(announcement?.ctaLink ?? dummy?.ctaLink ?? '');
  const [presentation, setPresentation] = useState(announcement?.presentation ?? dummy?.presentation ?? 'both');
  const [startsAt, setStartsAt] = useState(formatDateInput(announcement?.startsAt ?? null));
  const [endsAt, setEndsAt] = useState(formatDateInput(announcement?.endsAt ?? null));
  const [minAppVersion, setMinAppVersion] = useState(announcement?.minAppVersion ?? dummy?.minAppVersion ?? '');
  const [audience, setAudience] = useState(announcement?.audience ?? dummy?.audience ?? 'all');
  const [sortOrder, setSortOrder] = useState(announcement?.sortOrder ?? dummy?.sortOrder ?? 0);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const payload = {
        campaignKey,
        enabled,
        title,
        body,
        imageUrl: imageUrl || undefined,
        ctaLabel: ctaLabel || undefined,
        ctaLink: ctaLink || undefined,
        presentation,
        startsAt: startsAt || undefined,
        endsAt: endsAt || undefined,
        minAppVersion: minAppVersion || undefined,
        audience,
        sortOrder,
      };

      if (announcement) {
        const { campaignKey: _ignored, ...updatePayload } = payload;
        await updateHomeAnnouncementAction(announcement.id, updatePayload);
        toast.success('Announcement updated.');
      } else {
        await createHomeAnnouncementAction(payload);
        toast.success('Announcement created.');
      }

      router.push('/admin/announcements');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save announcement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminCard className="p-6 lg:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <label className="block">
            <FieldLabel>Campaign key</FieldLabel>
            <TextInput
              value={campaignKey}
              onChange={setCampaignKey}
              placeholder="summer-launch-2026"
              required={!announcement}
            />
            <p className="mt-1 text-xs text-admin-muted">
              Stable id for once-per-device dismiss. Set carefully on create.
            </p>
          </label>

          <label className="block">
            <FieldLabel>Priority</FieldLabel>
            <TextInput type="number" value={sortOrder} onChange={(value) => setSortOrder(Number(value))} />
          </label>

          <label className="block lg:col-span-2">
            <FieldLabel>Title</FieldLabel>
            <TextInput value={title} onChange={setTitle} required />
          </label>

          <label className="block lg:col-span-2">
            <FieldLabel>Body</FieldLabel>
            <TextArea value={body} onChange={setBody} rows={5} required />
          </label>

          <label className="block lg:col-span-2">
            <FieldLabel>Image URL (optional)</FieldLabel>
            <TextInput value={imageUrl} onChange={setImageUrl} />
          </label>

          <label className="block">
            <FieldLabel>CTA label</FieldLabel>
            <TextInput value={ctaLabel} onChange={setCtaLabel} />
          </label>

          <label className="block">
            <FieldLabel>CTA link</FieldLabel>
            <TextInput
              value={ctaLink}
              onChange={setCtaLink}
              placeholder="/paywall or https://rasoiapplication.in/download"
            />
          </label>

          <label className="block">
            <FieldLabel>Presentation</FieldLabel>
            <SelectInput
              value={presentation}
              onChange={(value) => setPresentation(value as typeof presentation)}
              options={PRESENTATION_OPTIONS}
            />
          </label>

          <label className="block">
            <FieldLabel>Audience</FieldLabel>
            <SelectInput
              value={audience}
              onChange={(value) => setAudience(value as typeof audience)}
              options={AUDIENCE_OPTIONS}
            />
          </label>

          <label className="block">
            <FieldLabel>Min app version</FieldLabel>
            <TextInput value={minAppVersion} onChange={setMinAppVersion} placeholder="1.0.6" />
          </label>

          <label className="block">
            <FieldLabel>Starts at</FieldLabel>
            <TextInput type="datetime-local" value={startsAt} onChange={setStartsAt} />
          </label>

          <label className="block">
            <FieldLabel>Ends at</FieldLabel>
            <TextInput type="datetime-local" value={endsAt} onChange={setEndsAt} />
          </label>
        </div>

        <label className="flex items-center gap-3 rounded-xl border border-admin-border bg-white/50 px-4 py-3">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(event) => setEnabled(event.target.checked)}
            className="h-4 w-4 rounded border-admin-border"
          />
          <span className="text-sm font-medium text-admin-ink">Enabled (live when schedule matches)</span>
        </label>

        <PrimaryButton type="submit" disabled={loading || (!announcement && !campaignKey.trim())}>
          {loading ? 'Saving…' : announcement ? 'Update announcement' : 'Create announcement'}
        </PrimaryButton>
      </form>
    </AdminCard>
  );
}
