'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import MobileRecipePreview, {
  type RecipePreviewData,
} from '@/app/admin/(console)/recipes/MobileRecipePreview';
import RecipeMarkdownImport from '@/app/admin/(console)/recipes/RecipeMarkdownImport';
import type { ParsedRecipeMarkdown } from '@/lib/recipe-markdown';
import AdminPageLayout from '@/app/admin/_components/AdminPageLayout';
import { useToast } from '@/app/admin/_components/Toast';
import {
  AdminCard,
  Badge,
  FieldLabel,
  GhostButton,
  PageHeader,
  PrimaryButton,
  SelectInput,
  TextArea,
  TextInput,
} from '@/app/admin/_components/ui';
import { getAdminSectionLabel } from '@/app/admin/_components/admin-nav';
import { createRecipeAction, updateRecipeAction } from '@/app/admin/recipe-actions';
import { DEFAULT_KITCHEN_STYLES } from '@/lib/kitchen-style-data';
import { buildRecipeDescription, buildRecipeDescriptionHi } from '@/lib/recipe-description';
import {
  DIET_TYPES,
  RECIPE_DIFFICULTIES,
  RECIPE_REGIONS,
  RECIPE_TAGS,
} from '@/lib/recipe-filters';
import type { RecipeIngredient, RecipeResponse, RecipeTag } from '@/lib/types';

const defaultIngredient = { name: 'Rice', isStaple: true };

const TAG_LABELS: Record<RecipeTag, string> = {
  under20: 'Under 20 min',
  leftover: 'Leftover makeover',
  kids: 'Kids favourites',
  quick: 'Quick',
  festive: 'Festive',
};

function normalizeStepList(steps: string[] | undefined): string[] {
  const cleaned = (steps ?? []).map((step) => step.trim()).filter(Boolean);
  return cleaned.length > 0 ? cleaned : [''];
}

function cleanSteps(steps: string[]): string[] {
  return steps.map((step) => step.trim()).filter(Boolean);
}

type RecipeFormProps = {
  recipe?: RecipeResponse;
  mode?: 'create' | 'edit';
  pageTitle: string;
  pageDescription: string;
};

export default function RecipeForm({
  recipe,
  mode = 'create',
  pageTitle,
  pageDescription,
}: RecipeFormProps) {
  const router = useRouter();
  const toast = useToast();
  const isEdit = mode === 'edit';
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [title, setTitle] = useState(recipe?.title ?? '');
  const [prepTime, setPrepTime] = useState(recipe?.prepTime ?? 20);
  const [calories, setCalories] = useState(recipe?.calories ?? 400);
  const [region, setRegion] = useState(recipe?.region ?? 'North');
  const [kitchenStyleId, setKitchenStyleId] = useState(recipe?.kitchenStyleId ?? 'north');
  const [dietType, setDietType] = useState(recipe?.dietType ?? 'Veg');
  const [difficulty, setDifficulty] = useState(recipe?.difficulty ?? 'Easy');
  const [description, setDescription] = useState(recipe?.description ?? '');
  const [descriptionHi, setDescriptionHi] = useState(recipe?.descriptionHi ?? '');
  const [imageUrl, setImageUrl] = useState(recipe?.imageUrl ?? '');
  const [selectedTags, setSelectedTags] = useState<RecipeTag[]>(recipe?.tags ?? []);
  const [ingredientsJson, setIngredientsJson] = useState(
    JSON.stringify(recipe?.ingredients ?? [defaultIngredient], null, 2),
  );
  const [mainIngredientsText, setMainIngredientsText] = useState(
    (recipe?.mainIngredients ?? []).join(', '),
  );
  const [steps, setSteps] = useState<string[]>(() => normalizeStepList(recipe?.steps));
  const [stepsHi, setStepsHi] = useState<string[]>(() => normalizeStepList(recipe?.stepsHi));
  const [published, setPublished] = useState(recipe?.published ?? false);

  const toggleTag = (tag: RecipeTag) => {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  };

  const updateStepAt = (index: number, value: string) => {
    setSteps((current) => current.map((step, i) => (i === index ? value : step)));
  };

  const addStep = () => {
    setSteps((current) => [...current, '']);
  };

  const removeStep = (index: number) => {
    setSteps((current) => {
      if (current.length <= 1) return [''];
      return current.filter((_, i) => i !== index);
    });
  };

  const updateStepHiAt = (index: number, value: string) => {
    setStepsHi((current) => current.map((step, i) => (i === index ? value : step)));
  };

  const addStepHi = () => {
    setStepsHi((current) => [...current, '']);
  };

  const removeStepHi = (index: number) => {
    setStepsHi((current) => {
      if (current.length <= 1) return [''];
      return current.filter((_, i) => i !== index);
    });
  };

  const buildPayload = (publish: boolean) => {
    const ingredients = JSON.parse(ingredientsJson) as RecipeIngredient[];
    return {
      title,
      prepTime: Number(prepTime),
      calories: Number(calories),
      region,
      kitchenStyleId,
      dietType,
      difficulty,
      description,
      descriptionHi: descriptionHi.trim() || undefined,
      imageUrl,
      tags: selectedTags,
      ingredients,
      mainIngredients: mainIngredientsText.trim(),
      steps: cleanSteps(steps),
      stepsHi: cleanSteps(stepsHi),
      published: publish,
    };
  };

  const buildPreviewData = (): RecipePreviewData => {
    let ingredients: RecipeIngredient[] = [];
    try {
      ingredients = JSON.parse(ingredientsJson) as RecipeIngredient[];
    } catch {
      ingredients = [];
    }

    const stepList = cleanSteps(steps);
    const resolvedDescription =
      description.trim() ||
      buildRecipeDescription({
        title,
        kitchenStyleId,
        dietType,
        ingredients,
        prepTime: Number(prepTime),
        difficulty,
        steps: stepList,
      });
    const resolvedDescriptionHi =
      descriptionHi.trim() ||
      buildRecipeDescriptionHi({
        title,
        kitchenStyleId,
        dietType,
        ingredients,
        prepTime: Number(prepTime),
        difficulty,
        steps: stepList,
      });

    return {
      title,
      prepTime: Number(prepTime),
      calories: Number(calories),
      region,
      kitchenStyleId,
      dietType,
      difficulty,
      description: resolvedDescription,
      descriptionHi: resolvedDescriptionHi,
      imageUrl,
      tags: selectedTags,
      ingredients,
      steps: stepList,
      stepsHi: cleanSteps(stepsHi),
      published,
    };
  };

  const validateBeforePreview = (): boolean => {
    if (title.trim().length < 2) {
      toast.error('Add a title before previewing.');
      return false;
    }
    if (!imageUrl.trim()) {
      toast.error('Add an image URL before previewing.');
      return false;
    }
    try {
      const parsed = JSON.parse(ingredientsJson);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        toast.error('Add at least one ingredient in JSON format.');
        return false;
      }
    } catch {
      toast.error('Ingredients JSON is invalid. Fix it before previewing.');
      return false;
    }
    return true;
  };

  const saveRecipe = async (publish: boolean) => {
    setLoading(true);

    try {
      const payload = buildPayload(publish);

      if (recipe) {
        await updateRecipeAction(recipe.id, payload);
        toast.success(
          publish
            ? `Saved "${payload.title}" — live on mobile app now.`
            : `Saved draft "${payload.title}". Publish to show on mobile.`,
        );
        setPublished(publish);
        setPreviewOpen(false);
        router.refresh();
      } else {
        await createRecipeAction(payload);
        toast.success(
          publish
            ? `Published "${payload.title}" to the mobile app.`
            : `Saved "${payload.title}" as draft.`,
        );
        setPublished(publish);
        setPreviewOpen(false);
        router.push('/admin/recipes');
        router.refresh();
      }
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : 'Failed to save recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPreview = () => {
    if (!validateBeforePreview()) return;
    setPreviewOpen(true);
  };

  const applyMarkdownImport = (data: ParsedRecipeMarkdown) => {
    setTitle(data.title);
    setPrepTime(data.prepTime);
    setCalories(data.calories);
    setRegion(data.region);
    setDietType(data.dietType);
    setDifficulty(data.difficulty);
    setDescription(data.description);
    setImageUrl(data.imageUrl);
    setSelectedTags(data.tags);
    setIngredientsJson(JSON.stringify(data.ingredients, null, 2));
    setSteps(normalizeStepList(data.steps));
    if (data.published !== undefined) {
      setPublished(data.published);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await saveRecipe(published);
  };

  const confirmPublishLabel = isEdit
    ? 'Confirm & update live on mobile'
    : 'Confirm & publish to mobile';

  const workflowHint = isEdit
    ? 'Preview your changes on a phone frame. Confirm to push updates to the live mobile app, or save as draft to hide from users.'
    : 'New recipes stay as draft until you preview on mobile and confirm publishing.';

  return (
    <AdminPageLayout>
      {previewOpen && (
        <MobileRecipePreview
          data={buildPreviewData()}
          loading={loading}
          confirmLabel={confirmPublishLabel}
          onClose={() => setPreviewOpen(false)}
          onConfirmPublish={() => saveRecipe(true)}
          onSaveDraft={() => saveRecipe(false)}
        />
      )}

      <PageHeader
        title={pageTitle}
        section={getAdminSectionLabel('/admin/recipes')}
        description={pageDescription}
        backHref="/admin/recipes"
        backLabel="Back to recipes"
        action={
          <div className="flex flex-wrap items-center gap-2">
            {published ? (
              <Badge tone="success">Live on mobile</Badge>
            ) : (
              <Badge tone="warning">Draft</Badge>
            )}
            <GhostButton type="button" onClick={handleOpenPreview}>
              View on mobile
            </GhostButton>
          </div>
        }
      />

      <RecipeMarkdownImport onApply={applyMarkdownImport} />

      <AdminCard className="p-6 lg:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-admin-border pb-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">
              Mobile preview
            </p>
            <p className="mt-1 text-sm text-admin-muted">
              Same feed card and recipe detail view as the Rasoi app.
            </p>
          </div>
          <GhostButton type="button" onClick={handleOpenPreview}>
            View on mobile
          </GhostButton>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {isEdit && recipe?.id ? (
              <div className="block lg:col-span-2">
                <FieldLabel>Recipe ID (CSV `id`)</FieldLabel>
                <p className="mt-2 rounded-xl border border-admin-border bg-[#f7f2ea]/80 px-4 py-3 font-mono text-sm text-admin-ink">
                  {recipe.id}
                </p>
                <p className="mt-1 text-sm text-admin-muted">
                  Immutable key used by the app and CSV exports. Create a new recipe to change it.
                </p>
              </div>
            ) : null}

            <label className="block lg:col-span-2">
              <FieldLabel>Title (CSV `title`)</FieldLabel>
              <TextInput value={title} onChange={setTitle} required />
            </label>

            <label className="block">
              <FieldLabel>Prep time (minutes)</FieldLabel>
              <TextInput type="number" value={prepTime} onChange={(v) => setPrepTime(Number(v))} />
            </label>

            <label className="block">
              <FieldLabel>Calories</FieldLabel>
              <TextInput type="number" value={calories} onChange={(v) => setCalories(Number(v))} />
            </label>

            <label className="block">
              <FieldLabel>Region</FieldLabel>
              <SelectInput value={region} onChange={setRegion} options={[...RECIPE_REGIONS]} />
            </label>

            <label className="block">
              <FieldLabel>Kitchen style</FieldLabel>
              <select
                value={kitchenStyleId}
                onChange={(event) => {
                  const nextStyleId = event.target.value;
                  setKitchenStyleId(nextStyleId);
                  const style = DEFAULT_KITCHEN_STYLES.find((item) => item.id === nextStyleId);
                  if (style) setRegion(style.region);
                }}
                className="mt-2 w-full rounded-xl border border-admin-border bg-white/80 px-4 py-3 text-sm text-admin-ink outline-none transition focus:border-admin-gold/70 focus:ring-2 focus:ring-admin-gold/15"
              >
                {DEFAULT_KITCHEN_STYLES.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <FieldLabel>Diet type</FieldLabel>
              <SelectInput
                value={dietType}
                onChange={(v) => setDietType(v as typeof dietType)}
                options={[...DIET_TYPES]}
              />
            </label>

            <label className="block">
              <FieldLabel>Difficulty</FieldLabel>
              <SelectInput
                value={difficulty}
                onChange={(v) => setDifficulty(v as typeof difficulty)}
                options={[...RECIPE_DIFFICULTIES]}
              />
            </label>

            <div className="block lg:col-span-2">
              <FieldLabel>Quick filters (mobile tags)</FieldLabel>
              <div className="mt-2 flex flex-wrap gap-2">
                {RECIPE_TAGS.map((tag) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                        active
                          ? 'border-admin-gold/50 bg-[#f0e9de] text-admin-ink'
                          : 'border-admin-border bg-white/70 text-admin-muted hover:border-admin-gold/30'
                      }`}
                    >
                      {TAG_LABELS[tag]}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="block lg:col-span-2">
              <FieldLabel>Description (optional preview override)</FieldLabel>
              <p className="mb-2 text-sm text-admin-muted">
                Not stored in Supabase — the app synthesizes English copy from title and ingredients
                when this is empty.
              </p>
              <TextArea value={description} onChange={setDescription} rows={4} />
            </label>

            <div className="block lg:col-span-2 rounded-xl border border-admin-border bg-[#f7f2ea]/60 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">
                Hindi content
              </p>
              <p className="mt-1 text-sm text-admin-muted">
                Shown when users tap the Hindi toggle on recipe detail in the mobile app.
              </p>

              <label className="mt-4 block">
                <FieldLabel>Description (Hindi)</FieldLabel>
                <TextArea
                  value={descriptionHi}
                  onChange={setDescriptionHi}
                  rows={4}
                  placeholder="हिंदी में व्यंजन का संक्षिप्त विवरण…"
                />
              </label>

              <div className="mt-4 block">
                <FieldLabel>Steps (Hindi)</FieldLabel>
                <p className="mb-2 text-sm text-admin-muted">Numbered cooking steps shown in Hindi.</p>
                <div className="space-y-3">
                  {stepsHi.map((step, index) => (
                    <div key={`step-hi-${index}`} className="flex gap-3">
                      <span className="mt-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-admin-border bg-white text-sm font-semibold text-admin-ink">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <TextArea
                          value={step}
                          onChange={(value) => updateStepHiAt(index, value)}
                          rows={3}
                          placeholder="पहला कदम…"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeStepHi(index)}
                        disabled={stepsHi.length <= 1 && !step.trim()}
                        className="mt-2 h-10 shrink-0 rounded-lg border border-admin-border bg-white px-3 text-sm font-medium text-admin-muted transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <GhostButton type="button" onClick={addStepHi}>
                    + Add Hindi step
                  </GhostButton>
                </div>
              </div>
            </div>

            <label className="block lg:col-span-2">
              <FieldLabel>Image URL</FieldLabel>
              <TextInput value={imageUrl} onChange={setImageUrl} required />
            </label>

            <label className="block lg:col-span-2">
              <FieldLabel>Ingredients (CSV `ingredients`)</FieldLabel>
              <p className="mb-2 text-sm text-admin-muted">
                Stored on the recipe and shown in the app. Prefer JSON objects with{' '}
                <code className="text-xs">name</code> and <code className="text-xs">isStaple</code>.
                Plain comma-separated names from the CSV also work after save/reload.
              </p>
              <TextArea
                value={ingredientsJson}
                onChange={setIngredientsJson}
                rows={8}
                className="font-mono text-xs"
              />
            </label>

            <label className="block lg:col-span-2">
              <FieldLabel>Main ingredients (CSV `main_ingredients`)</FieldLabel>
              <p className="mb-2 text-sm text-admin-muted">
                Comma-separated names used for pantry match. Paste from the CSV column as-is, then
                save / publish to push to Supabase.
              </p>
              <TextArea
                value={mainIngredientsText}
                onChange={setMainIngredientsText}
                rows={4}
                placeholder="Paneer, Tomato, Onion, Ginger, Garlic, …"
              />
            </label>

            <div className="block lg:col-span-2">
              <FieldLabel>Steps</FieldLabel>
              <p className="mb-2 text-sm text-admin-muted">
                Numbered cooking steps stored in Supabase and shown in the app. Add or remove rows as
                needed.
              </p>
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div key={`step-${index}`} className="flex gap-3">
                    <span className="mt-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-admin-border bg-[#f7f2ea] text-sm font-semibold text-admin-ink">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <TextArea
                        value={step}
                        onChange={(value) => updateStepAt(index, value)}
                        rows={3}
                        placeholder={`Step ${index + 1}…`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      disabled={steps.length <= 1 && !step.trim()}
                      className="mt-2 h-10 shrink-0 rounded-lg border border-admin-border bg-white px-3 text-sm font-medium text-admin-muted transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <GhostButton type="button" onClick={addStep}>
                  + Add step
                </GhostButton>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-admin-border bg-[#f7f2ea] px-4 py-3 text-sm text-admin-muted">
            {workflowHint} Use <strong className="text-admin-ink">View on mobile</strong> then{' '}
            <strong className="text-admin-ink">{confirmPublishLabel}</strong>.
          </div>

          <div className="flex flex-wrap gap-3">
            <GhostButton type="button" onClick={handleOpenPreview}>
              View on mobile
            </GhostButton>
            <GhostButton type="button" onClick={() => saveRecipe(false)} disabled={loading}>
              Save draft
            </GhostButton>
            <PrimaryButton type="submit" disabled={loading}>
              {loading
                ? 'Saving…'
                : isEdit
                  ? published
                    ? 'Save changes'
                    : 'Save (keep draft)'
                  : published
                    ? 'Save changes'
                    : 'Save (keep draft)'}
            </PrimaryButton>
          </div>
        </form>
      </AdminCard>
    </AdminPageLayout>
  );
}
