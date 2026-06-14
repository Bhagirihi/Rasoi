import {
  DIET_TYPES,
  RECIPE_DIFFICULTIES,
  RECIPE_REGIONS,
  RECIPE_TAGS,
  type DietType,
  type RecipeRegion,
  type RecipeTag,
} from '@/lib/recipe-filters';
import type { RecipeDifficulty, RecipeIngredient } from '@/lib/types';

export const RECIPE_MARKDOWN_TEMPLATE = `# Masala Dosa with Coconut Chutney

prep_time: 35
calories: 420
region: South
diet: Veg
difficulty: Medium
image: https://images.unsplash.com/photo-1632517355606-632f38f4b6da?w=800
tags: quick, under20
published: false

## Description

A crispy South Indian classic with spiced potato filling and fresh coconut chutney.

## Ingredients

- Rice [staple]
- Oil [staple]
- Namak [staple]
- Urad dal
- Coconut
- Potatoes

## Steps

1. Soak rice and urad dal for 4–6 hours, then grind to a smooth batter and ferment overnight.
2. Boil potatoes, mash with spices, and prepare the masala filling.
3. Spread batter on a hot tawa, add filling, fold, and serve with coconut chutney.
`;

export const RECIPE_MARKDOWN_SAMPLE_FILENAME = 'rasoi-recipe-sample.md';

export function downloadRecipeMarkdownSample(): void {
  const blob = new Blob([RECIPE_MARKDOWN_TEMPLATE], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = RECIPE_MARKDOWN_SAMPLE_FILENAME;
  anchor.click();
  URL.revokeObjectURL(url);
}

export type ParsedRecipeMarkdown = {
  title: string;
  prepTime: number;
  calories: number;
  region: RecipeRegion;
  dietType: DietType;
  difficulty: RecipeDifficulty;
  description: string;
  imageUrl: string;
  tags: RecipeTag[];
  ingredients: RecipeIngredient[];
  steps: string[];
  published?: boolean;
};

export type RecipeMarkdownParseResult =
  | { ok: true; data: ParsedRecipeMarkdown }
  | { ok: false; errors: string[] };

const META_ALIASES: Record<string, string> = {
  prep_time: 'prepTime',
  preptime: 'prepTime',
  'prep time': 'prepTime',
  time: 'prepTime',
  calories: 'calories',
  kcal: 'calories',
  region: 'region',
  diet: 'dietType',
  diet_type: 'dietType',
  'diet type': 'dietType',
  difficulty: 'difficulty',
  image: 'imageUrl',
  image_url: 'imageUrl',
  'image url': 'imageUrl',
  photo: 'imageUrl',
  tags: 'tags',
  published: 'published',
  title: 'title',
};

function normalizeKey(key: string): string {
  return key.trim().toLowerCase().replace(/-/g, '_');
}

function parseMetaValue(key: string, value: string): Partial<ParsedRecipeMarkdown> {
  const trimmed = value.trim();

  switch (key) {
    case 'prepTime':
      return { prepTime: Number.parseInt(trimmed, 10) };
    case 'calories':
      return { calories: Number.parseInt(trimmed, 10) };
    case 'region':
      return { region: trimmed as RecipeRegion };
    case 'dietType':
      return { dietType: trimmed as DietType };
    case 'difficulty':
      return { difficulty: trimmed as RecipeDifficulty };
    case 'imageUrl':
      return { imageUrl: trimmed };
    case 'title':
      return { title: trimmed };
    case 'tags':
      return {
        tags: trimmed
          .split(/[,;]/)
          .map((tag) => tag.trim())
          .filter(Boolean) as RecipeTag[],
      };
    case 'published':
      return { published: /^(true|yes|1)$/i.test(trimmed) };
    default:
      return {};
  }
}

function extractFrontmatter(source: string): {
  body: string;
  meta: Partial<ParsedRecipeMarkdown>;
} {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { body: source, meta: {} };
  }

  const meta: Partial<ParsedRecipeMarkdown> = {};
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = META_ALIASES[normalizeKey(line.slice(0, colon))];
    if (!key) continue;
    Object.assign(meta, parseMetaValue(key, line.slice(colon + 1)));
  }

  return { body: match[2], meta };
}

function parseInlineMeta(lines: string[]): {
  meta: Partial<ParsedRecipeMarkdown>;
  restLines: string[];
} {
  const meta: Partial<ParsedRecipeMarkdown> = {};
  const restLines: string[] = [];

  for (const line of lines) {
    const metaMatch = line.match(/^([a-z][\w\s_-]*):\s*(.+)$/i);
    if (metaMatch) {
      const key = META_ALIASES[normalizeKey(metaMatch[1])];
      if (key) {
        Object.assign(meta, parseMetaValue(key, metaMatch[2]));
        continue;
      }
    }
    restLines.push(line);
  }

  return { meta, restLines };
}

function splitSections(body: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const parts = body.split(/^##\s+(.+)$/m);

  if (parts.length === 1) {
    sections._preamble = body.trim();
    return sections;
  }

  const preamble = parts[0].trim();
  if (preamble) sections._preamble = preamble;

  for (let i = 1; i < parts.length; i += 2) {
    const heading = parts[i].trim().toLowerCase();
    const content = (parts[i + 1] ?? '').trim();
    sections[heading] = content;
  }

  return sections;
}

function parseIngredientLine(line: string): RecipeIngredient | null {
  const cleaned = line
    .replace(/^[-*+]\s*/, '')
    .replace(/^\d+\.\s*/, '')
    .trim();

  if (!cleaned) return null;

  let name = cleaned;
  let isStaple = false;
  let recommendedBrand: RecipeIngredient['recommendedBrand'] | undefined;

  const stapleMatch = name.match(/\[(staple)\]|\((staple)\)/i);
  if (stapleMatch) {
    isStaple = true;
    name = name.replace(/\[(staple)\]|\((staple)\)/i, '').trim();
  }

  const sponsorMatch = name.match(/\[(?:sponsor|brand):\s*([^|]+)\s*\|\s*([^\]]+)\]/i);
  if (sponsorMatch) {
    recommendedBrand = {
      name: sponsorMatch[1].trim(),
      logo: sponsorMatch[2].trim(),
    };
    name = name.replace(/\[(?:sponsor|brand):\s*([^|]+)\s*\|\s*([^\]]+)\]/i, '').trim();
  }

  name = name.replace(/\s{2,}/g, ' ').trim();
  if (!name) return null;

  return { name, isStaple, recommendedBrand };
}

function parseListItems(content: string): string[] {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*+]\s*/, '').replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean);
}

function parseIngredients(content: string): RecipeIngredient[] {
  const ingredients: RecipeIngredient[] = [];

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const item = parseIngredientLine(trimmed);
    if (item) ingredients.push(item);
  }

  return ingredients;
}

function parseSteps(content: string): string[] {
  const numbered = parseListItems(content);
  if (numbered.length > 0) return numbered;

  return content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export function parseRecipeMarkdown(markdown: string): RecipeMarkdownParseResult {
  const trimmed = markdown.trim();
  if (!trimmed) {
    return { ok: false, errors: ['Markdown is empty.'] };
  }

  const { body, meta: frontmatterMeta } = extractFrontmatter(trimmed);
  const lines = body.split('\n');

  let title = frontmatterMeta.title ?? '';
  let startIndex = 0;

  if (!title && lines[0]?.startsWith('# ')) {
    title = lines[0].slice(2).trim();
    startIndex = 1;
  }

  const { meta: inlineMeta, restLines } = parseInlineMeta(lines.slice(startIndex));
  const combinedMeta: Partial<ParsedRecipeMarkdown> = {
    ...inlineMeta,
    ...frontmatterMeta,
  };

  if (combinedMeta.title) title = combinedMeta.title;

  const sections = splitSections(restLines.join('\n'));
  const description =
    sections.description ??
    sections._preamble ??
  '';

  const ingredientsContent = sections.ingredients ?? '';
  const stepsContent = sections.steps ?? sections['how to cook'] ?? '';

  const data: ParsedRecipeMarkdown = {
    title,
    prepTime: combinedMeta.prepTime ?? 20,
    calories: combinedMeta.calories ?? 400,
    region: combinedMeta.region ?? 'North',
    dietType: combinedMeta.dietType ?? 'Veg',
    difficulty: combinedMeta.difficulty ?? 'Easy',
    description: description.trim(),
    imageUrl: combinedMeta.imageUrl ?? '',
    tags: combinedMeta.tags ?? [],
    ingredients: parseIngredients(ingredientsContent),
    steps: parseSteps(stepsContent),
    published: combinedMeta.published,
  };

  const errors = validateParsedRecipe(data);
  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data };
}

export function validateParsedRecipe(data: ParsedRecipeMarkdown): string[] {
  const errors: string[] = [];

  if (data.title.trim().length < 2) {
    errors.push('Title is required (use `# Title` or `title:` in frontmatter).');
  }

  if (data.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters (`## Description` section).');
  }

  if (!data.imageUrl.trim()) {
    errors.push('Image URL is required (`image:` metadata).');
  } else if (!/^https?:\/\//i.test(data.imageUrl)) {
    errors.push('Image URL must start with http:// or https://');
  }

  if (!Number.isFinite(data.prepTime) || data.prepTime < 1) {
    errors.push('prep_time must be a positive number.');
  }

  if (!Number.isFinite(data.calories) || data.calories < 1) {
    errors.push('calories must be a positive number.');
  }

  if (!RECIPE_REGIONS.includes(data.region)) {
    errors.push(`region must be one of: ${RECIPE_REGIONS.join(', ')}`);
  }

  if (!DIET_TYPES.includes(data.dietType)) {
    errors.push(`diet must be one of: ${DIET_TYPES.join(', ')}`);
  }

  if (!RECIPE_DIFFICULTIES.includes(data.difficulty)) {
    errors.push(`difficulty must be one of: ${RECIPE_DIFFICULTIES.join(', ')}`);
  }

  const invalidTags = data.tags.filter((tag) => !RECIPE_TAGS.includes(tag));
  if (invalidTags.length > 0) {
    errors.push(`Unknown tags: ${invalidTags.join(', ')}. Use: ${RECIPE_TAGS.join(', ')}`);
  }

  if (data.ingredients.length === 0) {
    errors.push('Add at least one ingredient under `## Ingredients`.');
  }

  return errors;
}
