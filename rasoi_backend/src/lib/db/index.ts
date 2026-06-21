import { createRepository, type Repository } from '@/lib/db/repository';
import type {
  Admin,
  AffiliateEvent,
  AppSettings,
  KitchenStyle,
  MealNotificationLog,
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
  pushToken: Repository<PushToken>;
  affiliateEvent: Repository<AffiliateEvent>;
  sponsorEvent: Repository<SponsorEvent>;
  userFeedback: Repository<UserFeedback>;
  sponsorApplication: Repository<SponsorApplication>;
  processedWebhookEvent: Repository<ProcessedWebhookEvent>;
  mealNotificationLog: Repository<MealNotificationLog>;
  promoCode: Repository<PromoCode>;
  promoRedemption: Repository<PromoRedemption>;
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
    pushToken: createRepository<PushToken>('PushToken'),
    affiliateEvent: createRepository<AffiliateEvent>('AffiliateEvent'),
    sponsorEvent: createRepository<SponsorEvent>('SponsorEvent'),
    userFeedback: createRepository<UserFeedback>('UserFeedback'),
    sponsorApplication: createRepository<SponsorApplication>('SponsorApplication'),
    processedWebhookEvent: createRepository<ProcessedWebhookEvent>('ProcessedWebhookEvent'),
    mealNotificationLog: createRepository<MealNotificationLog>('MealNotificationLog'),
    promoCode: createRepository<PromoCode>('PromoCode'),
    promoRedemption: createRepository<PromoRedemption>('PromoRedemption'),

    $transaction: async <T>(
      arg: ((tx: DbClient) => Promise<T>) | readonly Promise<unknown>[],
    ): Promise<T | unknown[]> => {
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
