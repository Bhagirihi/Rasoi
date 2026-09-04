'use client';

import { useRef, useState } from 'react';

import { useToast } from '@/app/admin/_components/Toast';
import {
  AdminCard,
  FieldLabel,
  GhostButton,
  PrimaryButton,
  TextArea,
} from '@/app/admin/_components/ui';
import DownloadMarkdownSampleButton from '@/app/admin/(console)/recipes/DownloadMarkdownSampleButton';
import {
  parseRecipeMarkdown,
  RECIPE_MARKDOWN_TEMPLATE,
  type ParsedRecipeMarkdown,
} from '@/lib/recipe-markdown';

type RecipeMarkdownImportProps = {
  onApply: (data: ParsedRecipeMarkdown) => void;
};

export default function RecipeMarkdownImport({ onApply }: RecipeMarkdownImportProps) {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [markdown, setMarkdown] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!/\.(md|markdown|txt)$/i.test(file.name)) {
      toast.error('Upload a .md, .markdown, or .txt file.');
      return;
    }

    const text = await file.text();
    setMarkdown(text);
    toast.info(`Loaded ${file.name}. Review and click Apply to form.`);
    event.target.value = '';
  };

  const handleApply = () => {
    const result = parseRecipeMarkdown(markdown);
    if (!result.ok) {
      toast.error(result.errors.join(' '));
      return;
    }

    onApply(result.data);
    toast.success('Markdown applied to the form. Review fields and preview on mobile.');
  };

  const handleLoadTemplate = () => {
    setMarkdown(RECIPE_MARKDOWN_TEMPLATE);
    toast.info('Sample loaded into editor. Edit it, then click Apply to form.');
  };

  return (
    <AdminCard className="p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">
            Markdown import
          </p>
          <p className="mt-1 text-sm text-admin-muted">
            Upload or paste a recipe in Markdown. Metadata uses{' '}
            <code className="text-xs">key: value</code> lines; body uses{' '}
            <code className="text-xs">## Description</code>,{' '}
            <code className="text-xs">## Ingredients</code>, and{' '}
            <code className="text-xs">## Steps</code>.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DownloadMarkdownSampleButton />
          <GhostButton type="button" onClick={() => setExpanded((value) => !value)}>
            {expanded ? 'Hide' : 'Show'} markdown import
          </GhostButton>
        </div>
      </div>

      {expanded && (
        <div className="mt-6 space-y-4 border-t border-admin-border pt-6">
          <div className="flex flex-wrap gap-2">
            <GhostButton type="button" onClick={() => fileInputRef.current?.click()}>
              Upload .md file
            </GhostButton>
            <GhostButton type="button" onClick={handleLoadTemplate}>
              Load sample into editor
            </GhostButton>
            <DownloadMarkdownSampleButton />
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.markdown,.txt,text/markdown,text/plain"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <label className="block">
            <FieldLabel>Recipe markdown</FieldLabel>
            <TextArea
              value={markdown}
              onChange={setMarkdown}
              rows={14}
              className="font-mono text-xs leading-relaxed"
              placeholder="Paste markdown here or upload a file…"
            />
          </label>

          <div className="rounded-xl border border-admin-border bg-[#f7f2ea] px-4 py-3 text-xs leading-relaxed text-admin-muted">
            <p className="font-semibold text-admin-ink">Ingredient markers</p>
            <ul className="mt-2 space-y-1">
              <li>
                <code>- Rice [staple]</code> — already in pantry
              </li>
              <li>
                <code>- Urad dal</code> — need to buy
              </li>
              <li>
                <code>- Basmati [sponsor: Tata Sampann | https://logo.url]</code> — sponsored brand
              </li>
            </ul>
            <p className="mt-3 font-semibold text-admin-ink">Optional YAML frontmatter</p>
            <p className="mt-1">
              Start with <code>---</code> block instead of inline metadata if you prefer.
            </p>
          </div>

          <PrimaryButton type="button" onClick={handleApply} disabled={!markdown.trim()}>
            Apply to form
          </PrimaryButton>
        </div>
      )}
    </AdminCard>
  );
}
