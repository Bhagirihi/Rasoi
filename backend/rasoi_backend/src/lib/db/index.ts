import { createRepository, type Repository } from '@/lib/db/repository';
import type {
  Admin,
  AffiliateEvent,
  AppSettings,
  GroceryList,
  GroceryListItem,
  HomeAnnouncement,
  KitchenStyle,
  MealNotificationLog,
  MealPlan,
  MealPlanItem,
  PantrySection,
  PartnerLink,
  ProcessedWebhookEvent,
  PromoCode,
  PromoRedemption,
  PushToken,
  Recipe,
  RegionalCuisineOption,
  Sponsor,
  SponsorApplication,
  SponsorEvent,
  User,
  UserFeedback,
  UserRecommendationCache,
  UserRecommendationHistory,
  UserRecipeCooked,
  UserRecipeView,
} from '@/lib/db/types';

export { RASOI_SCHEMA, createRowId, rasoiDb } from '@/lib/db/client';
export { DbError, throwIfError, unwrap } from '@/lib/db/errors';
export { getPgPool, queryPg } from '@/lib/db/pg';
export { loadEligibleUsers } from '@/lib/db/users';
export type { UserWithTokens } from '@/lib/db/users';
export type * from '@/lib/db/types';

type DbClient = {
  user: Repository<User>;
  recipe: Repository<Recipe>;
  sponsor: Repository<Sponsor>;
  admin: Repository<Admin>;
  partnerLink: Repository<PartnerLink>;
  kitchenStyle: Repository<KitchenStyle>;
  pantrySection: Repository<PantrySection>;
  regionalCuisineOption: Repository<RegionalCuisineOption>;
  appSettings: Repository<AppSettings>;
  homeAnnouncement: Repository<HomeAnnouncement>;
  pushToken: Repository<PushToken>;
  affiliateEvent: Repository<AffiliateEvent>;
  sponsorEvent: Repository<SponsorEvent>;
  userFeedback: Repository<UserFeedback>;
  sponsorApplication: Repository<SponsorApplication>;
  processedWebhookEvent: Repository<ProcessedWebhookEvent>;
  mealNotificationLog: Repository<MealNotificationLog>;
  mealPlan: Repository<MealPlan>;
  mealPlanItem: Repository<MealPlanItem>;
  groceryList: Repository<GroceryList>;
  groceryListItem: Repository<GroceryListItem>;
  promoCode: Repository<PromoCode>;
  promoRedemption: Repository<PromoRedemption>;
  userRecommendationCache: Repository<UserRecommendationCache>;
  userRecommendationHistory: Repository<UserRecommendationHistory>;
  userRecipeView: Repository<UserRecipeView>;
  userRecipeCooked: Repository<UserRecipeCooked>;
  $transaction: {
    <T>(fn: (tx: DbClient) => Promise<T>): Promise<T>;
    (operations: readonly Promise<unknown>[]): Promise<unknown[]>;
  };
};

function createDbClient(): DbClient {
  return {
    user: createRepository<User>('User'),
    recipe: createRepository<Recipe>('Recipe'),
    sponsor: createRepository<Sponsor>('Sponsor'),
    admin: createRepository<Admin>('Admin'),
    partnerLink: createRepository<PartnerLink>('PartnerLink'),
    kitchenStyle: createRepository<KitchenStyle>('KitchenStyle'),
    pantrySection: createRepository<PantrySection>('PantrySection'),
    regionalCuisineOption: createRepository<RegionalCuisineOption>('RegionalCuisineOption'),
    appSettings: createRepository<AppSettings>('AppSettings'),
    homeAnnouncement: createRepository<HomeAnnouncement>('HomeAnnouncement'),
    pushToken: createRepository<PushToken>('PushToken'),
    affiliateEvent: createRepository<AffiliateEvent>('AffiliateEvent'),
    sponsorEvent: createRepository<SponsorEvent>('SponsorEvent'),
    userFeedback: createRepository<UserFeedback>('UserFeedback'),
    sponsorApplication: createRepository<SponsorApplication>('SponsorApplication'),
    processedWebhookEvent: createRepository<ProcessedWebhookEvent>('ProcessedWebhookEvent'),
    mealNotificationLog: createRepository<MealNotificationLog>('MealNotificationLog'),
    mealPlan: createRepository<MealPlan>('MealPlan'),
    mealPlanItem: createRepository<MealPlanItem>('MealPlanItem'),
    groceryList: createRepository<GroceryList>('GroceryList'),
    groceryListItem: createRepository<GroceryListItem>('GroceryListItem'),
    promoCode: createRepository<PromoCode>('PromoCode'),
    promoRedemption: createRepository<PromoRedemption>('PromoRedemption'),
    userRecommendationCache: createRepository<UserRecommendationCache>('UserRecommendationCache'),
    userRecommendationHistory: createRepository<UserRecommendationHistory>('UserRecommendationHistory'),
    userRecipeView: createRepository<UserRecipeView>('UserRecipeView'),
    userRecipeCooked: createRepository<UserRecipeCooked>('UserRecipeCooked'),

    $transaction: async <T>(
      arg: ((tx: DbClient) => Promise<T>) | readonly Promise<unknown>[],
    ): Promise<T | unknown[]> => {
      // WARNING: this is sequential execution, NOT an atomic database
      // transaction. The PostgREST-based repositories cannot join a single
      // transaction, so a failure half-way through does NOT roll back.
      // Do not rely on this for multi-step writes. Instead, make each step
      // idempotent and order-safe: unique-key guards that turn double-runs
      // into catchable conflicts (see promo-codes.ts), and conditional
      // UPDATEs that act as the serialization point.
      if (typeof arg === 'function') {
        return arg(createDbClient());
      }
      const results: unknown[] = [];
      for (const operation of arg) {
        results.push(await operation);
      }
      return results;
    },
  };
}

/** Supabase-backed data access layer (Prisma replacement). */
export const db = createDbClient();

