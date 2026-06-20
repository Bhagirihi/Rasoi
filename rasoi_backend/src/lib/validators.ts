import { z } from 'zod';

import {
  SPONSOR_APPLICATION_PLACEMENT_VALUES,
  SPONSOR_PLACEMENT_VALUES,
} from '@/lib/sponsor-placements';

const dietType = z.enum(['Veg', 'Egg', 'Non-Veg']);
const dietChoice = z.enum(['Veg', 'Egg', 'Non-Veg', 'Jain']);
const difficulty = z.enum(['Easy', 'Medium', 'Hard']);
const recipeTag = z.enum(['under20', 'leftover', 'kids', 'quick', 'festive']);

const sponsorPlacement = z.enum(SPONSOR_PLACEMENT_VALUES);
const planTier = z.enum(['free', 'trial', 'paid']);
const favoriteCuisines = z.array(z.string().trim().min(1).max(40));

const recommendedBrand = z.object({
  name: z.string().min(1),
  logo: z.string().url(),
});

const ingredient = z.object({
  name: z.string().min(1),
  isStaple: z.boolean(),
  recommendedBrand: recommendedBrand.optional(),
});

export const loginSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z
    .string()
    .transform((value) => value.replace(/\D/g, '').replace(/^91/, '').slice(0, 10))
    .refine((value) => /^[6-9]\d{9}$/.test(value), 'Invalid Indian phone number'),
});

export const supabaseSyncSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z
    .string()
    .optional()
    .transform((value) => {
      if (!value?.trim()) return undefined;
      return value.replace(/\D/g, '').replace(/^91/, '').slice(0, 10);
    })
    .refine(
      (value) => value === undefined || /^[6-9]\d{9}$/.test(value),
      'Invalid Indian phone number',
    ),
  acceptedTerms: z.literal(true).optional(),
});

export const onboardingSchema = z.object({
  dietPreference: dietType,
  dietChoice: dietChoice,
  regionalCuisine: z.string().min(1),
  favoriteCuisines,
  notificationsEnabled: z.boolean(),
});

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  phone: z
    .string()
    .transform((value) => value.replace(/\D/g, '').replace(/^91/, '').slice(0, 10))
    .refine((value) => /^[6-9]\d{9}$/.test(value), 'Invalid Indian phone number')
    .optional(),
  dietChoice: dietChoice.optional(),
  dietPreference: dietType.optional(),
  regionalCuisine: z.string().min(1).optional(),
  favoriteCuisines: favoriteCuisines.optional(),
  notificationsEnabled: z.boolean().optional(),
});

export const recipeCreateSchema = z.object({
  title: z.string().min(2).max(120),
  prepTime: z.number().int().min(1).max(600),
  calories: z.number().int().min(1).max(5000),
  region: z.enum(['North', 'South', 'East', 'West', 'Central']),
  kitchenStyleId: z.string().trim().min(2).max(40),
  kitchenStyleIds: z.array(z.string().trim().min(2).max(40)).optional(),
  dietType: dietType,
  difficulty: difficulty,
  description: z.string().min(10).max(2000),
  imageUrl: z.string().url(),
  tags: z.array(recipeTag).default([]),
  ingredients: z.array(ingredient).min(1),
  steps: z.array(z.string().min(1)).optional(),
  published: z.boolean().default(true),
});

export const recipeUpdateSchema = recipeCreateSchema.partial();

export const sponsorCreateSchema = z.object({
  placement: sponsorPlacement,
  brandName: z.string().min(1).max(80),
  productLabel: z.string().min(1).max(200),
  tagline: z.string().min(1).max(200),
  logoUrl: z.string().url(),
  cta: z.string().min(1).max(40).default('Shop now'),
  searchQuery: z.string().min(1).max(120).optional(),
  recipeId: z.string().optional(),
  active: z.boolean().default(true),
  priority: z.number().int().min(0).max(100).default(0),
});

export const sponsorUpdateSchema = sponsorCreateSchema.partial();

export const pantryUpdateSchema = z.object({
  ingredients: z.array(z.string().min(1)),
});

export const affiliateEventSchema = z.object({
  partner: z.enum(['blinkit', 'zepto', 'instamart', 'zomato', 'swiggy']),
  context: z.string().max(40).optional(),
  recipeId: z.string().max(64).optional(),
  query: z.string().max(240).optional(),
});

export const sponsorEventSchema = z.object({
  eventType: z.enum(['impression', 'tap']),
  brandName: z.string().trim().min(1).max(80),
  placement: z.string().trim().min(2).max(40),
  sponsorId: z.string().max(64).optional(),
  partner: z.enum(['blinkit', 'zepto', 'instamart', 'zomato', 'swiggy']).optional(),
  query: z.string().max(240).optional(),
  city: z.string().max(80).optional(),
});

export const userLocationSchema = z.object({
  city: z.string().trim().min(1).max(80).nullable(),
  state: z.string().trim().max(80).nullable().optional(),
  latitude: z.number().min(-90).max(90).nullable(),
  longitude: z.number().min(-180).max(180).nullable(),
});

export const recipeSearchSchema = z.object({
  query: z.string().trim().min(1).max(120),
  sourceScreen: z.string().trim().min(2).max(40).default('home'),
  resultCount: z.number().int().min(0).optional(),
});

export const savedRecipesSchema = z.object({
  recipeIds: z.array(z.string().min(1)),
});

export const planUpdateSchema = z.object({
  planTier: planTier,
  trialStartedAt: z.string().datetime().nullable().optional(),
  hasUsedTrial: z.boolean().optional(),
});

export const pushTokenSchema = z.object({
  expoPushToken: z.string().min(1).max(512),
  platform: z.enum(['ios', 'android', 'web']).optional(),
  active: z.boolean().default(true),
});

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const partnerId = z.enum(['blinkit', 'zepto', 'instamart', 'zomato', 'swiggy']);

export const partnerLinkSchema = z.object({
  partnerId: partnerId,
  label: z.string().min(1).max(40),
  category: z.enum(['grocery', 'delivery']),
  deepLinkUrl: z.string().min(8).max(500),
  webUrl: z.string().url().max(500),
  active: z.boolean(),
});

export const partnerLinksSchema = z.object({
  links: z.array(partnerLinkSchema).min(1),
});

export const kitchenStyleCreateSchema = z.object({
  id: z
    .string()
    .trim()
    .min(2)
    .max(40)
    .regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers, and hyphens only'),
  label: z.string().trim().min(2).max(80),
  tagline: z.string().trim().min(4).max(200),
  mood: z.string().trim().min(2).max(40),
  region: z.enum(['North', 'South', 'East', 'West', 'Central']),
  heroImage: z.string().url().max(500),
  active: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(999).default(0),
});

export const kitchenStyleUpdateSchema = kitchenStyleCreateSchema.omit({ id: true }).partial();

export const feedbackCategory = z.enum(['issue', 'suggestion', 'other']);

export const feedbackSchema = z.object({
  category: feedbackCategory,
  message: z.string().trim().min(10).max(2000),
  name: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : undefined)),
  email: z
    .string()
    .email()
    .max(120)
    .optional()
    .or(z.literal(''))
    .transform((value) => (value ? value : undefined)),
  appVersion: z.string().trim().max(32).optional(),
  platform: z.enum(['ios', 'android', 'web']).optional(),
});

export const sponsorApplicationSchema = z.object({
  companyName: z.string().trim().min(2).max(120),
  contactName: z.string().trim().min(2).max(80),
  email: z.string().email().max(120),
  phone: z
    .string()
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : undefined)),
  brandName: z.string().trim().min(2).max(80),
  productDescription: z.string().trim().min(20).max(1000),
  placementInterest: z.enum(SPONSOR_APPLICATION_PLACEMENT_VALUES),
  website: z
    .string()
    .url()
    .optional()
    .or(z.literal(''))
    .transform((value) => (value ? value : undefined)),
  message: z
    .string()
    .max(1000)
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : undefined)),
});
