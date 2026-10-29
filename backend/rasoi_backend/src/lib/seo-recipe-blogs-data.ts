import blogsData from '@/lib/data/seo-recipe-blogs.json';
import type { SeoRecipePage } from '@/lib/seo-content-pages';

type BlogsFile = {
  generatedAt: string;
  count: number;
  recipes: SeoRecipePage[];
};

const file = blogsData as BlogsFile;

/** Generated from Rasoi Scalper outputs via `npm run seo:recipe-blogs`. */
export const GENERATED_SEO_RECIPE_BLOGS: SeoRecipePage[] = file.recipes;

export const SEO_RECIPE_BLOGS_GENERATED_AT = file.generatedAt;

export function getGeneratedRecipeBlog(slug: string): SeoRecipePage | undefined {
  return GENERATED_SEO_RECIPE_BLOGS.find((page) => page.slug === slug);
}
