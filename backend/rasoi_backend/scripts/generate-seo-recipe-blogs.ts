/**
 * Generate SEO recipe blog JSON + copy hero images from Rasoi Scalper outputs.
 *
 * Usage:
 *   npx tsx scripts/generate-seo-recipe-blogs.ts
 *   SCALPER_RECIPES_DIR=/path/to/outputs/recipes npx tsx scripts/generate-seo-recipe-blogs.ts
 */
import fs from 'node:fs';
import path from 'node:path';

import { SEO_TOP_RECIPES } from './seo-top-recipes-config';

const RECIPE_LIBRARY_LABEL = '5,000+';

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_SCALPER_ROOT =
  process.env.SCALPER_OUTPUTS_DIR?.trim() ||
  '/Users/dhruvdave/Documents/Dhruv/AI_CODE/RASOI SCALPER/outputs';
const DEFAULT_SCALPER_RECIPES = path.join(DEFAULT_SCALPER_ROOT, 'recipes');
const DEFAULT_SCALPER_IMAGES = path.join(DEFAULT_SCALPER_ROOT, 'images');

const RECIPES_DIR = process.env.SCALPER_RECIPES_DIR?.trim() || DEFAULT_SCALPER_RECIPES;
const IMAGES_DIR = process.env.SCALPER_IMAGES_DIR?.trim() || DEFAULT_SCALPER_IMAGES;
const OUT_JSON = path.join(ROOT, 'src/lib/data/seo-recipe-blogs.json');
const OUT_IMAGES = path.join(ROOT, 'public/seo-recipes');

export type GeneratedSeoRecipeBlog = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  intro: string;
  cuisine: string;
  diet: string;
  time: string;
  imageUrl: string;
  ingredients: string[];
  steps: string[];
  marketNotes: Record<string, string>;
  sections: { heading: string; body: string }[];
  faqs: { question: string; answer: string }[];
  relatedLinks: { href: string; label: string }[];
  sourceFile: string;
  searchVolumeRank: number;
};

function listMdFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
}

function findMdFile(files: string[], hints: string[]): string | null {
  const lowerFiles = files.map((f) => ({ file: f, base: f.replace(/\.md$/i, '').toLowerCase() }));
  for (const hint of hints) {
    const h = hint.toLowerCase();
    const exact = lowerFiles.find((x) => x.base === h);
    if (exact) return exact.file;
    const starts = lowerFiles.find((x) => x.base.startsWith(h));
    if (starts) return starts.file;
    const includes = lowerFiles.find((x) => x.base.includes(h));
    if (includes) return includes.file;
  }
  return null;
}

function readMeta(recipesDir: string, mdFile: string): Record<string, string> {
  const metaPath = path.join(recipesDir, mdFile.replace(/\.md$/i, '.meta.json'));
  if (!fs.existsSync(metaPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(metaPath, 'utf8')) as Record<string, string>;
  } catch {
    return {};
  }
}

function parseMarkdown(content: string): {
  ingredients: string[];
  steps: string[];
  cuisine: string;
  diet: string;
  imageFile: string;
} {
  const ingredients: string[] = [];
  const steps: string[] = [];
  let cuisine = 'Indian';
  let diet = 'Veg';
  let imageFile = '';

  const imgMatch = content.match(/!\[[^\]]*\]\(\.\.\/images\/([^)]+)\)/);
  if (imgMatch) imageFile = imgMatch[1];

  const cuisineMatch = content.match(/\*\*Cuisine[^*]*\*\*\s*-\s*([^\n]+)/i);
  if (cuisineMatch) cuisine = cuisineMatch[1].split('(')[0].trim() || cuisine;

  const dietMatch = content.match(/\*\*Diet\*\*\s*-\s*(\w+)/i);
  if (dietMatch) diet = dietMatch[1].trim();

  const ingBlock = content.match(/\*\*The Ingredients\*\*([\s\S]*?)(?=\*\*Main Ingredients\*\*|\*\*The True|\*\*Method|\n\n\*\*)/i);
  if (ingBlock) {
    for (const line of ingBlock[1].split('\n')) {
      const bullet = line.replace(/^[•\-\*]\s*/, '').trim();
      if (bullet && bullet.length > 2 && bullet.length < 120) ingredients.push(bullet);
    }
  }

  const methodBlock = content.match(/\*\*The True[\s\S]*?Method\*\*([\s\S]*?)(?:\n_Source:|$)/i)
    || content.match(/\*\*Method\*\*([\s\S]*?)(?:\n_Source:|$)/i);
  if (methodBlock) {
    const stepLines = methodBlock[1].match(/\d+\.\s+\*\*[^*]+\*\*\s*\n\s*([^\n]+)/g) || [];
    for (const block of stepLines) {
      const text = block.replace(/^\d+\.\s+\*\*[^*]+\*\*\s*\n\s*/, '').trim();
      if (text) steps.push(text);
    }
    if (steps.length === 0) {
      const numbered = methodBlock[1].match(/^\d+\.\s+(.+)$/gm) || [];
      for (const line of numbered.slice(0, 14)) {
        const text = line.replace(/^\d+\.\s+/, '').replace(/\*\*/g, '').trim();
        if (text) steps.push(text);
      }
    }
  }

  return { ingredients: ingredients.slice(0, 18), steps: steps.slice(0, 12), cuisine, diet, imageFile };
}

function slugifyRelated(slug: string): string {
  return slug;
}

function buildMarketNotes(displayName: string): Record<string, string> {
  return {
    IN: `${displayName} is a staple in Indian home kitchens — Rasoi helps you match this dish to what's already in your pantry and filter by Veg, Jain, or regional taste.`,
    US: `Cooking ${displayName} in the USA? Use Indian grocers plus mainstream supermarkets for staples. Rasoi's pantry match works wherever you shop — Instacart and Amazon links roll out for missing items.`,
    CA: `In Canada, ${displayName} fits weeknight rotation for South Asian families. Stock dal, rice, atta, and core masalas from local Indian stores; Rasoi suggests dinners from what you already have.`,
    AU: `Australian home cooks make ${displayName} with Woolworths, Coles, and Indian grocers. Rasoi helps diaspora families decide dinner without scrolling endless recipe blogs.`,
    NZ: `In New Zealand, ${displayName} is popular with Indian and Fijian-Indian communities. Rasoi supports pantry-first cooking from Pak'nSave, Countdown, and local spice shops.`,
  };
}

function buildKeywords(displayName: string, slug: string, cuisine: string): string[] {
  const base = displayName.toLowerCase();
  const cuisineLower = cuisine.toLowerCase();
  return [
    `${base} recipe`,
    `how to make ${base}`,
    `${base} recipe at home`,
    `${cuisineLower} ${base}`,
    `authentic ${base}`,
    `${base} ingredients`,
    `${base} recipe india`,
    `${base} recipe usa`,
    `${base} recipe canada`,
    `${base} recipe australia`,
    `${base} recipe new zealand`,
    `indian ${base} diaspora`,
    `${slug.replace(/-/g, ' ')} rasoi`,
    'indian home cooking',
    'indian recipe app',
    'aaj kya banaye',
  ];
}

function buildDescription(displayName: string, diet: string, cuisine: string): string {
  const text = `How to make ${displayName} at home — ${diet} ${cuisine} recipe with ingredients, step-by-step method & pantry tips for India, USA, Canada, Australia & NZ.`;
  return text.length <= 160 ? text : text.slice(0, 157) + '…';
}

function buildRelatedLinks(
  slug: string,
  rank: number,
  all: typeof SEO_TOP_RECIPES,
): { href: string; label: string }[] {
  const sorted = [...all].sort((a, b) => a.searchVolumeRank - b.searchVolumeRank);
  const index = sorted.findIndex((r) => r.slug === slug);
  const neighbors = sorted
    .filter((_, i) => i !== index && Math.abs(i - index) <= 2)
    .slice(0, 3)
    .map((r) => ({ href: `/recipes/${r.slug}`, label: r.displayName }));

  return [
    ...neighbors,
    { href: '/recipes', label: 'All 55 recipe guides' },
    { href: '/indian-recipe-app', label: 'Cooking guides hub' },
    { href: '/download', label: 'Download Rasoi app' },
  ];
}

function copyImage(imageFile: string, slug: string): string | null {
  if (!imageFile) return null;
  const exts = ['', '.jpg', '.jpeg', '.png', '.webp'];
  const base = imageFile.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  for (const ext of exts) {
    const candidates = [
      path.join(IMAGES_DIR, imageFile),
      path.join(IMAGES_DIR, base + ext),
      path.join(IMAGES_DIR, base + '.jpg'),
      path.join(IMAGES_DIR, base + '.webp'),
    ];
    for (const src of candidates) {
      if (!fs.existsSync(src)) continue;
      const destExt = path.extname(src) || '.jpg';
      const dest = path.join(OUT_IMAGES, `${slug}${destExt}`);
      fs.copyFileSync(src, dest);
      return `/seo-recipes/${slug}${destExt}`;
    }
  }
  return null;
}

function buildBlog(entry: (typeof SEO_TOP_RECIPES)[number], mdFile: string, parsed: ReturnType<typeof parseMarkdown>, meta: Record<string, string>): GeneratedSeoRecipeBlog {
  const { displayName, slug } = entry;
  const cuisine = meta.region ? `${meta.region} Indian` : parsed.cuisine;
  const diet = meta.dietType || parsed.diet;
  const imageUrl = copyImage(meta.image_file || parsed.imageFile, slug) || '/download-hero.png';

  const stepSummary = parsed.steps.slice(0, 4).join(' ');
  const intro = `${displayName} is one of the most searched Indian recipes online — in India and across the diaspora in the USA, Canada, Australia, and New Zealand. This home-kitchen guide covers ingredients and method so you can cook from your pantry, not a long shopping list. ${stepSummary ? `Key steps: ${parsed.steps[0] ?? ''}` : ''}`.trim();

  const sections = [
    {
      heading: 'Ingredients at a glance',
      body: parsed.ingredients.length
        ? parsed.ingredients.slice(0, 10).join(' · ')
        : `Classic ${displayName} uses pantry staples — check the Rasoi app for a full match % against your kitchen.`,
    },
    {
      heading: 'Method overview',
      body: parsed.steps.length
        ? parsed.steps.map((s, i) => `${i + 1}. ${s}`).join(' ')
        : `Follow the traditional ${displayName} method in the Rasoi app for step-by-step cooking mode with Hindi support.`,
    },
    {
      heading: 'Cook smarter with Rasoi',
      body: `Open Rasoi on Android to see ${displayName} with pantry match %, Veg/Jain filters, and tonight's picks. Add what's in your kitchen — dal, rice, paneer, vegetables, masalas — and cook what fits today.`,
    },
  ];

  const marketNotes = buildMarketNotes(displayName);

  const faqs = [
    {
      question: `How do I make ${displayName} at home?`,
      answer: `Follow the ingredients and numbered method above. For pantry match, Veg/Jain filters, and step-by-step cooking mode, open the Rasoi Android app — free on Google Play.`,
    },
    {
      question: `What ingredients do I need for ${displayName}?`,
      answer: parsed.ingredients.length
        ? `${displayName} uses ${parsed.ingredients.slice(0, 5).join(', ')}${parsed.ingredients.length > 5 ? ', and more' : ''}. Rasoi shows match % against your pantry so you cook from what you already have.`
        : `Classic ${displayName} uses Indian pantry staples. Add your kitchen items in Rasoi to see what you can make tonight.`,
    },
    {
      question: `Is ${displayName} good for weeknights?`,
      answer: parsed.steps.length > 8
        ? `${displayName} rewards a bit of prep — marinate or soak ahead when you can. Rasoi quick filters help find faster alternatives on busy nights.`
        : `${displayName} fits many weeknight rotations when your pantry already has the basics.`,
    },
    {
      question: `Can I cook ${displayName} in the USA, Canada, Australia, or New Zealand?`,
      answer: `Yes. This guide includes diaspora tips for Indian groceries abroad. Rasoi supports home cooks worldwide with the same pantry-first approach on rasoiapplication.in.`,
    },
    {
      question: `Where can I find more ${cuisine} recipes like ${displayName}?`,
      answer: `Browse related guides below or download Rasoi for ${RECIPE_LIBRARY_LABEL} regional Indian recipes with pantry match and diet filters.`,
    },
  ];

  const related = buildRelatedLinks(slug, entry.searchVolumeRank, SEO_TOP_RECIPES);

  return {
    slug,
    title: `How to Make ${displayName} — ${cuisine} Recipe | Rasoi`,
    description: buildDescription(displayName, diet, cuisine),
    keywords: buildKeywords(displayName, slug, cuisine),
    h1: `${displayName} recipe`,
    intro,
    cuisine,
    diet,
    time: parsed.steps.length > 10 ? '~60 min' : parsed.steps.length > 6 ? '~40 min' : '~30 min',
    imageUrl,
    ingredients: parsed.ingredients,
    steps: parsed.steps,
    marketNotes,
    sections,
    faqs,
    relatedLinks: related,
    sourceFile: mdFile,
    searchVolumeRank: entry.searchVolumeRank,
  };
}

function main() {
  if (!fs.existsSync(RECIPES_DIR)) {
    console.error(`Recipes dir not found: ${RECIPES_DIR}`);
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.mkdirSync(OUT_IMAGES, { recursive: true });

  const mdFiles = listMdFiles(RECIPES_DIR);
  const blogs: GeneratedSeoRecipeBlog[] = [];
  const missing: string[] = [];

  for (const entry of SEO_TOP_RECIPES) {
    const mdFile = findMdFile(mdFiles, entry.fileHints);
    if (!mdFile) {
      missing.push(entry.slug);
      continue;
    }
    const content = fs.readFileSync(path.join(RECIPES_DIR, mdFile), 'utf8');
    const meta = readMeta(RECIPES_DIR, mdFile);
    const parsed = parseMarkdown(content);
    blogs.push(buildBlog(entry, mdFile, parsed, meta));
  }

  blogs.sort((a, b) => a.searchVolumeRank - b.searchVolumeRank);

  fs.writeFileSync(
    OUT_JSON,
    JSON.stringify({ generatedAt: new Date().toISOString(), count: blogs.length, recipes: blogs }, null, 2),
    'utf8',
  );

  console.log(`Wrote ${blogs.length} recipe blogs → ${OUT_JSON}`);
  console.log(`Images → ${OUT_IMAGES}`);
  if (missing.length) {
    console.warn(`Missing scalper files for ${missing.length} slugs:`, missing.join(', '));
  }
}

main();
