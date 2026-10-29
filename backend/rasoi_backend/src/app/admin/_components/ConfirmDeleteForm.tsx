'use client';

import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';

import { useToast } from '@/app/admin/_components/Toast';

export default function ConfirmDeleteForm({
  action,
  confirmMessage = 'Are you sure you want to delete this item?',
  successMessage = 'Deleted successfully.',
  children,
}: {
  action: () => Promise<void>;
  confirmMessage?: string;
  successMessage?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setLoading(true);
    try {
      await action();
      toast.success(successMessage);
      router.refresh();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(event) => void handleSubmit(event)}>
      <fieldset disabled={loading} className="inline">
        {children}
      </fieldset>
    </form>
  );
}
