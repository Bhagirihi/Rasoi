/** Rasoi schema row types — mirrors prisma/schema.prisma (camelCase columns). */

export type UserRole = 'USER' | 'ADMIN';

export type User = {
  id: string;
  supabaseUserId: string | null;
  email: string | null;
  phone: string | null;
  name: string;
  gender: string | null;
  isGuest: boolean;
  role: UserRole;
  isActive: boolean;
  hasCompletedOnboarding: boolean;
  dietPreference: string;
  dietChoice: string;
  regionalCuisine: string;
  favoriteCuisines: string;
  notificationsEnabled: boolean;
  timezone: string;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  locationUpdatedAt: Date | null;
  pantryIngredients: string;
  savedRecipeIds: string;
  planTier: string;
  trialStartedAt: Date | null;
  hasUsedTrial: boolean;
  trialBonusDays: number;
  yearlyPromoOfferTag: string | null;
  termsAcceptedAt: Date | null;
  termsAcceptedVersion: string | null;
  kitchenPreferences: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProcessedWebhookEvent = {
  eventId: string;
  source: string;
  eventType: string;
  userId: string | null;
  createdAt: Date;
};

export type MealNotificationLog = {
  id: string;
  userId: string;
  mealSlot: string;
  dayKey: string;
  recipeId: string;
  sentAt: Date;
};

export type AffiliateEvent = {
  id: string;
  userId: string | null;
  partner: string;
  context: string | null;
  recipeId: string | null;
  query: string | null;
  createdAt: Date;
};

export type SponsorEvent = {
  id: string;
  userId: string | null;
  eventType: string;
  brandName: string;
  placement: string;
  sponsorId: string | null;
  partner: string | null;
  query: string | null;
  city: string | null;
  createdAt: Date;
};

export type PushToken = {
  id: string;
  userId: string;
  expoPushToken: string;
  platform: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Admin = {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Recipe = {
  id: string;
  title: string;
  prepTime: number;
  calories: number;
  region: string;
  kitchenStyleId: string;
  dietType: string;
  difficulty: string;
  descriptionHi?: string | null;
  imageUrl: string;
  ingredients: string;
  main_ingredients?: string | null;
  steps: string | null;
  stepsHi?: string | null;
  primaryIngredient: string | null;
  popularityScore: number;
  qualityScore: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UserRecommendationCache = {
  id: string;
  userId: string;
  dayKey: string;
  mealSlot: string;
  windowKey: string;
  algorithmVersion: string;
  recipeIds: string;
  reasons: string;
  preferenceSnapshot: string;
  generatedAt: Date;
};

export type UserRecommendationHistory = {
  id: string;
  userId: string;
  recipeId: string;
  mealSlot: string;
  shownAt: Date;
};

export type UserRecipeView = {
  id: string;
  userId: string;
  recipeId: string;
  viewedAt: Date;
};

export type UserRecipeCooked = {
  id: string;
  userId: string;
  recipeId: string;
  cookedAt: Date;
};

export type CookDay = {
  id: string;
  userId: string;
  dayKey: string;
  cookedAt: Date;
};

export type Sponsor = {
  id: string;
  placement: string;
  brandName: string;
  productLabel: string;
  tagline: string;
  logoUrl: string;
  cta: string;
  searchQuery: string | null;
  recipeId: string | null;
  active: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
};

export type PartnerLink = {
  partnerId: string;
  label: string;
  category: string;
  region: string;
  deepLinkUrl: string;
  webUrl: string;
  active: boolean;
  updatedAt: Date;
};

export type KitchenStyle = {
  id: string;
  label: string;
  tagline: string;
  mood: string;
  region: string;
  heroImage: string;
  active: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type RegionalCuisineOption = {
  label: string;
  sortOrder: number;
  active: boolean;
};

export type PantrySection = {
  id: string;
  title: string;
  items: string;
  sortOrder: number;
  active: boolean;
};

export type AppSettings = {
  id: string;
  paymentsEnabled: boolean;
  paymentsMinAppVersion: string | null;
  defaultPantryIngredients: string;
  updatedAt: Date;
};

export type HomeAnnouncementAudience = 'all' | 'guest' | 'logged_in' | 'free' | 'paid';
export type HomeAnnouncementPresentation = 'modal' | 'banner' | 'both';

export type HomeAnnouncement = {
  id: string;
  campaignKey: string;
  enabled: boolean;
  title: string;
  body: string;
  imageUrl: string | null;
  ctaLabel: string | null;
  ctaLink: string | null;
  presentation: HomeAnnouncementPresentation;
  startsAt: Date | null;
  endsAt: Date | null;
  minAppVersion: string | null;
  audience: HomeAnnouncementAudience;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type PromoCodeKind = 'trial_extend' | 'yearly_discount';

export type PromoCode = {
  id: string;
  code: string;
  kind: PromoCodeKind;
  trialExtendDays: number | null;
  playOfferTag: string | null;
  maxRedemptions: number;
  redemptionCount: number;
  expiresAt: Date | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type PromoRedemption = {
  id: string;
  userId: string;
  promoCodeId: string;
  redeemedAt: Date;
  consumedAt: Date | null;
};

export type SponsorApplication = {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string | null;
  brandName: string;
  productDescription: string;
  placementInterest: string;
  website: string | null;
  message: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserFeedback = {
  id: string;
  userId: string | null;
  category: string;
  message: string;
  name: string | null;
  email: string | null;
  appVersion: string | null;
  platform: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

/** Prisma-style filter helpers used across the codebase. */
export type StringFilter = {
  equals?: string;
  not?: string | { not: string };
  in?: string[];
  contains?: string;
};

export type DateTimeFilter = {
  equals?: Date | string;
  gte?: Date | string;
  lte?: Date | string;
  gt?: Date | string;
  lt?: Date | string;
  not?: null;
};

export type BoolFilter = {
  equals?: boolean;
};

export type RelationSomeFilter = {
  some?: Record<string, unknown>;
  every?: Record<string, unknown>;
  none?: Record<string, unknown>;
};

export type OrderDirection = 'asc' | 'desc';

export type OrderBy<T> = Partial<Record<keyof T, OrderDirection>> | Array<Partial<Record<keyof T, OrderDirection>>>;

export type NestedSelect = {
  select?: SelectFields;
  where?: Record<string, unknown>;
};

export type SelectFields = Record<string, boolean | NestedSelect>;

export type IncludeShape = Record<
  string,
  boolean | { select?: SelectFields; where?: Record<string, unknown>; orderBy?: OrderBy<unknown>; take?: number }
>;

export type GroupByResult<TFields extends string> = Array<
  Record<TFields, string> & { _count: { _all: number } }
>;

export type BatchPayload = { count: number };

export type RecipeWhereInput = Record<string, unknown>;
export type UserWhereInput = Record<string, unknown>;
export type SponsorEventWhereInput = Record<string, unknown>;

export type UserWithRelations = User & {
  pushTokens?: PushToken[];
  affiliateEvents?: AffiliateEvent[];
  sponsorEvents?: SponsorEvent[];
  mealNotificationLogs?: MealNotificationLog[];
  feedback?: UserFeedback[];
  _count?: { pushTokens: number };
};

export type SponsorEventWithUser = SponsorEvent & {
  user?: Pick<User, 'id' | 'name' | 'email' | 'city' | 'state'> | null;
};

export type AffiliateEventWithUser = AffiliateEvent & {
  user?: Pick<User, 'id' | 'name' | 'email' | 'phone' | 'city' | 'state'> | null;
};

export type UserFeedbackWithUser = UserFeedback & {
  user?: Pick<User, 'id' | 'name' | 'email' | 'phone'> | null;
};
