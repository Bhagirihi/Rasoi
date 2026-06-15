'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useToast } from '@/app/admin/_components/Toast';
import { FieldLabel, TextArea, TextInput } from '@/app/admin/_components/ui';
import { sendCustomNotificationAction } from '@/app/admin/user-actions';

export default function SendCustomNotificationControl({
  userId,
  userName,
  pushTokenCount,
}: {
  userId: string;
  userName: string;
  pushTokenCount: number;
}) {
  const router = useRouter();
  const toast = useToast();
  const [title, setTitle] = useState('Rasoi');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  const canDeliver = pushTokenCount > 0;

  const handleSend = async () => {
    if (!canDeliver) {
      toast.error('Cannot send — user has no active push token on any device.');
      return;
    }

    if (!title.trim() || !body.trim()) {
      toast.error('Title and message are required.');
      return;
    }

    const confirmed = window.confirm(
      `Send custom notification to ${userName}?\n\nTitle: ${title.trim()}\n\nThey will receive it on ${pushTokenCount} registered device${pushTokenCount === 1 ? '' : 's'}.`,
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const result = await sendCustomNotificationAction(userId, title, body);
      if (result.ok) {
        toast.success(result.message);
        setBody('');
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : 'Custom notification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card space-y-4 rounded-2xl p-4">
      <div>
        <FieldLabel>Title</FieldLabel>
        <TextInput
          value={title}
          onChange={setTitle}
          placeholder="Notification title"
        />
      </div>

      <div>
        <FieldLabel>Message</FieldLabel>
        <TextArea
          value={body}
          onChange={setBody}
          rows={4}
          placeholder="Write a custom message for this member…"
        />
        <p className="mt-1.5 text-xs text-admin-muted">{body.length}/500 characters</p>
      </div>

      <button
        type="button"
        disabled={loading || !canDeliver || !title.trim() || !body.trim()}
        onClick={() => void handleSend()}
        title={!canDeliver ? 'Requires an active push token' : undefined}
        className="w-full rounded-full border border-admin-gold/40 bg-admin-gold/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-admin-ink transition hover:bg-admin-gold/20 disabled:opacity-50"
      >
        {loading ? 'Sending…' : 'Send custom notification'}
      </button>

      {!canDeliver && (
        <p className="text-xs leading-relaxed text-admin-muted">
          Push delivery needs at least one active device token.
        </p>
      )}
    </div>
  );
}
