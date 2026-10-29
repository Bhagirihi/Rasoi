import { z } from 'zod';

import {
  getDisposableEmailError,
  getDummyPhoneError,
  isDisposableEmail,
  isDummyIndianPhone,
} from '@/lib/identity-validation';
import {
  SPONSOR_APPLICATION_PLACEMENT_VALUES,
  SPONSOR_PLACEMENT_VALUES,
} from '@/lib/sponsor-placements';

const dietType = z.enum(['Veg', 'Egg', 'Non-Veg']);
const dietChoice = z.enum(['Veg', 'Egg', 'Non-Veg', 'Jain']);
const genderChoice = z.enum(['Male', 'Female', 'Other']);
const difficulty = z.enum(['Easy', 'Medium', 'Hard']);
const recipeTag = z.enum(['under20', 'leftover', 'kids', 'quick', 'festive']);

const sponsorPlacement = z.enum(SPONSOR_PLACEMENT_VALUES);
const planTier = z.enum(['free', 'trial', 'paid']);
const favoriteCuisines = z.array(z.string().trim().min(1).max(40));

const indianPhone = z
  .string()
  .transform((value) => value.replace(/\D/g, '').replace(/^91/, '').slice(0, 10))
  .refine((value) => /^[6-9]\d{9}$/.test(value), 'Invalid Indian phone number')
  .refine((value) => !isDummyIndianPhone(value), getDummyPhoneError());

const allowedEmail = z
  .string()
  .trim()
  .max(120)
  .email()
  .transform((value) => value.toLowerCase())
  .refine((value) => !isDisposableEmail(value), getDisposableEmailError());

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
  phone: indianPhone,
});

export const onboardingSchema = z.object({
  dietPreference: dietType,
  dietChoice: dietChoice,
  regionalCuisine: z.string().min(1),
  favoriteCuisines,
  notificationsEnabled: z.boolean(),
});

export const supabaseSyncSchema = z.object({
  name: z.string().trim().min(2).max(80),
  gender: genderChoice.optional(),
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
    )
    .refine(
      (value) => value === undefined || !isDummyIndianPhone(value),
      getDummyPhoneError(),
    ),
  acceptedTerms: z.literal(true).optional(),
  /** Rasoi guest user id to upgrade when converting guest → registered member. */
  linkGuestUserId: z.string().trim().min(1).optional(),
  /** Apply onboarding in the same request to avoid a second round trip after OTP verify. */
  onboarding: onboardingSchema.optional(),
  /** Set after Firebase SMS OTP verification during signup. */
  phoneVerified: z.literal(true).optional(),
});

export const kitchenPreferencesSchema = z.object({
  allergyExclusions: z.array(z.string().trim().min(1).max(80)).max(20).optional(),
  householdSize: z.number().int().min(1).max(12).optional(),
  freePartnerShopsUsed: z.number().int().min(0).max(100).optional(),
  freePartnerShopsMonthKey: z.string().regex(/^\d{4}-\d{2}$/).optional(),
});

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  phone: indianPhone.optional(),
  dietChoice: dietChoice.optional(),
  dietPreference: dietType.optional(),
  regionalCuisine: z.string().min(1).optional(),
  favoriteCuisines: favoriteCuisines.optional(),
  notificationsEnabled: z.boolean().optional(),
  kitchenPreferences: kitchenPreferencesSchema.optional(),
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
  /** Optional preview-only; not stored (column dropped — API synthesizes on read). */
  description: z.string().max(2000).optional(),
  descriptionHi: z.string().max(2000).optional(),
  imageUrl: z.string().url(),
  /** Accepted for API compat; not stored (column dropped — serialized as []). */
  tags: z.array(recipeTag).default([]),
  ingredients: z.array(ingredient).min(1),
  /** Comma-separated or string[] — stored as rasoi.Recipe.main_ingredients. */
  mainIngredients: z
    .union([z.array(z.string().trim().min(1).max(120)).max(40), z.string().max(2000)])
    .optional(),
  steps: z.array(z.string().min(1)).optional(),
  stepsHi: z.array(z.string().min(1)).optional(),
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
  ingredients: z.array(z.string().min(1).max(120)).max(200),
});

export const defaultPantryUpdateSchema = z.object({
  ingredients: z.array(z.string().min(1).max(120)).max(500),
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
  recipeIds: z.array(z.string().min(1).max(64)).max(500),
});

export const planUpdateSchema = z.object({
  planTier: planTier,
  trialStartedAt: z.string().datetime().nullable().optional(),
  hasUsedTrial: z.boolean().optional(),
});

export const promoRedeemSchema = z.object({
  code: z.string().trim().min(4).max(32),
});

const promoCodeKind = z.enum(['trial_extend', 'yearly_discount']);

function normalizePromoCodeInput(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, '');
}

const promoCodeBaseSchema = z.object({
  code: z
    .string()
    .trim()
    .min(4)
    .max(32)
    .transform(normalizePromoCodeInput),
  kind: promoCodeKind,
  trialExtendDays: z.number().int().min(1).max(365).nullable().optional(),
  playOfferTag: z.string().trim().min(1).max(64).nullable().optional(),
  maxRedemptions: z.number().int().min(1).max(1_000_000).default(10_000),
  expiresAt: z.string().datetime().nullable().optional(),
  active: z.boolean().default(true),
});

function refinePromoCodeFields(
  data: z.infer<typeof promoCodeBaseSchema>,
  ctx: z.RefinementCtx,
): void {
  if (data.kind === 'trial_extend') {
    if (!data.trialExtendDays) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Trial extension days are required for trial codes.',
        path: ['trialExtendDays'],
      });
    }
  }

  if (data.kind === 'yearly_discount' && data.trialExtendDays) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Yearly discount codes cannot set trial extension days.',
      path: ['trialExtendDays'],
    });
  }
}

export const promoCodeCreateSchema = promoCodeBaseSchema.superRefine(refinePromoCodeFields);

export const promoCodeUpdateSchema = promoCodeBaseSchema.partial();

export const pushTokenSchema = z.object({
  expoPushToken: z.string().min(1).max(512),
  platform: z.enum(['ios', 'android', 'web']).optional(),
  active: z.boolean().default(true),
});

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const partnerRegion = z.enum(['IN', 'US', 'CA', 'AU']);

export const partnerLinkSchema = z.object({
  partnerId: z
    .string()
    .min(2)
    .max(40)
    .regex(/^[a-z0-9_]+$/, 'Use lowercase letters, numbers, and underscores'),
  label: z.string().min(1).max(40),
  category: z.enum(['grocery', 'delivery']),
  region: partnerRegion,
  deepLinkUrl: z.string().min(8).max(500),
  webUrl: z.string().url().max(500),
  active: z.boolean(),
});

export const partnerLinksSchema = z.object({
  links: z.array(partnerLinkSchema),
  deletedPartnerIds: z
    .array(
      z
        .string()
        .min(2)
        .max(40)
        .regex(/^[a-z0-9_]+$/),
    )
    .default([]),
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
  email: allowedEmail
    .optional()
    .or(z.literal(''))
    .transform((value: string | undefined) => (value ? value : undefined)),
  appVersion: z.string().trim().max(32).optional(),
  platform: z.enum(['ios', 'android', 'web']).optional(),
});

export const deleteAccountReason = z.enum([
  'not_using',
  'missing_recipes',
  'too_many_notifications',
  'technical_issues',
  'privacy_concerns',
  'other',
]);

export const deleteAccountSchema = z.object({
  confirmEmail: allowedEmail.optional(),
  reason: deleteAccountReason,
  reasonDetail: z.string().trim().max(500).optional(),
});

export const sponsorApplicationSchema = z.object({
  companyName: z.string().trim().min(2).max(120),
  contactName: z.string().trim().min(2).max(80),
  email: allowedEmail,
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

const homeAnnouncementAudience = z.enum(['all', 'guest', 'logged_in', 'free', 'paid']);
const homeAnnouncementPresentation = z.enum(['modal', 'banner', 'both']);

const optionalIsoDate = z
  .string()
  .trim()
  .optional()
  .or(z.literal(''))
  .transform((value) => (value ? value : undefined));

export const homeAnnouncementCreateSchema = z.object({
  campaignKey: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9_-]+$/i, 'Use letters, numbers, underscores, or hyphens'),
  enabled: z.boolean().default(false),
  title: z.string().trim().min(2).max(120),
  body: z.string().trim().min(2).max(2000),
  imageUrl: z
    .string()
    .url()
    .optional()
    .or(z.literal(''))
    .transform((value) => (value ? value : undefined)),
  ctaLabel: z
    .string()
    .trim()
    .max(40)
    .optional()
    .or(z.literal(''))
    .transform((value) => (value ? value : undefined)),
  ctaLink: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal(''))
    .transform((value) => (value ? value : undefined)),
  presentation: homeAnnouncementPresentation.default('both'),
  startsAt: optionalIsoDate,
  endsAt: optionalIsoDate,
  minAppVersion: z
    .string()
    .trim()
    .max(20)
    .optional()
    .or(z.literal(''))
    .transform((value) => (value ? value : undefined)),
  audience: homeAnnouncementAudience.default('all'),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

export const homeAnnouncementUpdateSchema = homeAnnouncementCreateSchema.omit({ campaignKey: true }).extend({
  campaignKey: homeAnnouncementCreateSchema.shape.campaignKey.optional(),
});
