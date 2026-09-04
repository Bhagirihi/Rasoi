'use client';

import { useToast } from '@/app/admin/_components/Toast';
import { GhostButton } from '@/app/admin/_components/ui';
import { downloadRecipeMarkdownSample } from '@/lib/recipe-markdown';

export default function DownloadMarkdownSampleButton({
  className = '',
}: {
  className?: string;
}) {
  const toast = useToast();

  return (
    <GhostButton
      type="button"
      className={className}
      onClick={() => {
        downloadRecipeMarkdownSample();
        toast.success('Sample markdown downloaded.');
      }}
    >
      Download sample
    </GhostButton>
  );
}
