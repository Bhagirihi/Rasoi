import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AppState } from 'react-native';

import { PlanTier, type BillingInterval } from '@/constants/plans';
import { CuisineId, DietChoice } from '@/constants/theme';
import { useReferenceData } from '@/context/ReferenceContext';
import { useRecipes } from '@/context/RecipesContext';
import { DietType, Recipe } from '@/data/mockRecipes';
import { loginAsGuestUser, logoutSession, syncSupabaseAccount } from '@/services/auth';
import { purchaseRasoiPlusDefault, restoreRasoiPlus } from '@/services/payments';
import type { PurchaseFlowResult } from '@/services/payments/types';
import { getSupabaseSession, sendEmailOtp, sendLoginEmailOtp, verifyEmailOtp, ensureValidSupabaseSession } from '@/services/supabaseAuth';
import {
  completeUserOnboarding,
  deactivatePushTokens,
  deleteUserAccount,
  exportUserData,
  fetchCurrentUser,
  registerPushToken,
  updatePantryIngredients,
  updateSavedRecipeIds,
  updateUserLocation,
  updateUserPlan,
  updateUserProfile,
} from '@/services/user';
import type { DeleteAccountPayload } from '@/services/user';
import type { UserProfileResponse } from '@/types/api';
import { authError, authLog } from '@/utils/authLogger';
import { useRasoiUserPlanRealtime } from '@/utils/realtime';
import { clearUserLoggedOut, getAuthToken, isUserLoggedOut, markUserLoggedOut } from '@/utils/authToken';
import { clearSentryUser, captureException, captureMessage, setSentryUser } from '@/utils/sentry';
import { setFirebaseUserId, setFirebaseUserProperties, logFirebaseEvent } from '@/utils/firebase';
import { trackDietFilterChanged, trackOnboardingComplete } from '@/utils/productAnalytics';
import { resolvePlanState, type ResolvedPlan } from '@/utils/planLogic';
import {
  DEFAULT_HOUSEHOLD_SIZE,
  parseKitchenPreferences,
  recordPartnerCheckout,
  type KitchenPreferences,
} from '@/utils/kitchenPreferences';
import { resolvePartnerAccess, type PartnerAccess } from '@/utils/partnerQuota';
import {
  syncDailyReminder,
  ensureNotificationPermissions,
  sendDailyReminderThankYouNotification,
  sendRecipeSavedNotification,
  scheduleTrialDayTwoReminder,
  getExpoPushTokenDetailed,
  getPushPlatform,
} from '@/utils/notifications';
import { isRemotePushAvailable } from '@/utils/notificationCapability';
import { clearPermissionsOnboardingComplete } from '@/utils/permissionsOnboarding';
import { clearLegalConsent } from '@/utils/legalConsent';
import {
  addPantryIngredient,
  pantryHasIngredient,
  removePantryIngredient,
} from '@/utils/recipeIngredients';
import {
  DEFAULT_PANTRY,
  OnboardingPayload,
  clearAuthState,
  dietChoiceToFilter,
  loadLocalOnboardingState,
  localStateToOnboardingPayload,
  loadPendingTrialWelcome,
  loadPendingPantrySetup,
  clearLocalOnboardingCompleteFlag,
  saveOnboardingComplete,
  savePendingTrialWelcome,
  savePendingPantrySetup,
} from '@/utils/storage';
import { cuisinesToRegion } from '@/utils/kitchenStyles';
import type { StoredPlanState } from '@/utils/planStorage';
import { savePlanState } from '@/utils/planStorage';
import { redeemPromoCode as redeemPromoCodeApi } from '@/services/promo';
import type { UserLocationSnapshot } from '@/utils/location';
import {
  clearPendingEmailVerification as clearPendingEmailVerificationStorage,
  loadPendingEmailVerification,
  savePendingEmailVerification,
  type PendingEmailVerification,
} from '@/utils/pendingEmailVerification';
import {
  clearCachedUserProfile,
  loadCachedUserProfile,
  saveCachedUserProfile,
} from '@/utils/userProfileCache';

export type FoodPreferencesPayload = {
  dietChoice: DietChoice;
  regionalCuisine: string;
  favoriteCuisines: CuisineId[];
  notificationsEnabled: boolean;
  allergyExclusions?: string[];
  householdSize?: number;
};

export type NotificationEnableResult = { ok: true } | { ok: false; reason: string };

export type PushTokenSyncResult = { ok: true } | { ok: false; reason: string };

export type AuthNavigationResult = {
  showTrialWelcome: boolean;
  hasCompletedOnboarding: boolean;
  userCity: string | null;
};

interface AppContextValue extends ResolvedPlan {
  paymentsEnabled: boolean;
  isHydrated: boolean;
  hasCompletedOnboarding: boolean;
  isLoggedIn: boolean;
  isGuest: boolean;
  userId: string | null;
  userName: string;
  userPhone: string;
  userEmail: string;
  userCity: string | null;
  userState: string | null;
  allergyExclusions: string[];
  householdSize: number;
  kitchenPreferences: KitchenPreferences;
  partnerAccess: PartnerAccess;
  lastProfileSyncedAt: string | null;
  pantryIngredients: string[];
  dietPreference: DietType;
  dietChoice: DietChoice;
  regionalCuisine: string;
  favoriteCuisines: CuisineId[];
  notificationsEnabled: boolean;
  savedRecipeIds: string[];
  pantryFilterActive: boolean;
  completeOnboarding: (payload: OnboardingPayload) => Promise<boolean>;
  sendEmailOtp: (name: string, phone: string, email: string) => Promise<void>;
  sendLoginEmailOtp: (email: string) => Promise<void>;
  verifyEmailOtpAndLogin: (
    email: string,
    otp: string,
    name: string,
    phone: string,
    options?: { acceptedTerms?: boolean },
  ) => Promise<AuthNavigationResult>;
  verifyLoginEmailOtp: (email: string, otp: string) => Promise<AuthNavigationResult>;
  loginAsGuest: (options?: { name?: string }) => Promise<AuthNavigationResult>;
  updateProfile: (name: string, phone: string) => Promise<void>;
  syncUserLocation: (snapshot: UserLocationSnapshot) => Promise<boolean>;
  logout: () => Promise<void>;
  deleteAccount: (payload: DeleteAccountPayload) => Promise<void>;
  exportAccountData: () => Promise<unknown>;
  resetAppFlow: () => Promise<void>;
  togglePantryIngredient: (ingredient: string) => void;
  setDietChoice: (choice: DietChoice) => Promise<void>;
  setRegionalCuisine: (region: string) => void;
  setFavoriteCuisines: (cuisines: CuisineId[]) => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<NotificationEnableResult>;
  saveFoodPreferences: (payload: FoodPreferencesPayload) => Promise<void>;
  recordPartnerShop: () => Promise<void>;
  refreshSyncedProfile: () => Promise<void>;
  toggleSavedRecipe: (recipeId: string) => void;
  isRecipeSaved: (recipeId: string) => boolean;
  setPantryFilterActive: (active: boolean) => void;
  getSavedRecipes: () => Recipe[];
  startTrial: (options?: { showWelcome?: boolean }) => Promise<boolean>;
  upgradeToPaid: (interval?: BillingInterval) => Promise<PurchaseFlowResult>;
  restorePurchases: () => Promise<void>;
  refreshPlan: () => Promise<void>;
  redeemPromoCode: (code: string) => Promise<{ message: string }>;
  pendingTrialWelcome: boolean;
  dismissTrialWelcome: () => void;
  pendingPantrySetup: boolean;
  clearPendingPantrySetup: () => void;
  pendingEmailVerification: PendingEmailVerification | null;
  emailVerificationModalVisible: boolean;
  openEmailVerificationModal: () => void;
  closeEmailVerificationModal: () => void;
  continueWithPendingEmailVerification: (
    pending: Omit<PendingEmailVerification, 'savedAt' | 'reason'>,
  ) => Promise<AuthNavigationResult | null>;
  verifyPendingEmailOtp: (otp: string) => Promise<AuthNavigationResult>;
  resendPendingEmailVerificationOtp: () => Promise<void>;
  clearPendingEmailVerification: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const DEFAULT_PLAN: StoredPlanState = {
  planTier: 'free',
  trialStartedAt: null,
  hasUsedTrial: false,
  trialBonusDays: 0,
  yearlyPromoOfferTag: null,
};

function planFromUser(user: UserProfileResponse): StoredPlanState {
  return {
    planTier: user.plan.planTier,
    trialStartedAt: user.plan.trialStartedAt,
    hasUsedTrial: user.plan.hasUsedTrial,
    trialBonusDays: user.plan.trialBonusDays ?? 0,
    yearlyPromoOfferTag: user.plan.yearlyPromoOfferTag ?? null,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { recipes, getRecipeById, syncRecipeFilters } = useRecipes();
  const { kitchenStyles, paymentsEnabled } = useReferenceData();
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userCity, setUserCity] = useState<string | null>(null);
  const [userState, setUserState] = useState<string | null>(null);
  const [isGuestUser, setIsGuestUser] = useState(false);
  const [pantryIngredients, setPantryIngredients] = useState<string[]>([...DEFAULT_PANTRY]);
  const [dietChoice, setDietChoiceState] = useState<DietChoice>('Veg');
  const [regionalCuisine, setRegionalCuisine] = useState<string>('All India');
  const [favoriteCuisines, setFavoriteCuisines] = useState<CuisineId[]>([]);
  const [notificationsEnabled, setNotificationsEnabledState] = useState(false);
  const [allergyExclusions, setAllergyExclusions] = useState<string[]>([]);
  const [householdSize, setHouseholdSize] = useState(DEFAULT_HOUSEHOLD_SIZE);
  const [kitchenPreferences, setKitchenPreferences] = useState<KitchenPreferences>({});
  const [lastProfileSyncedAt, setLastProfileSyncedAt] = useState<string | null>(null);
  const [savedRecipeIds, setSavedRecipeIds] = useState<string[]>([]);
  const [pantryFilterActive, setPantryFilterActive] = useState(false);
  const [pendingTrialWelcome, setPendingTrialWelcomeState] = useState(false);
  const [pendingPantrySetup, setPendingPantrySetupState] = useState(false);
  const [pendingEmailVerification, setPendingEmailVerificationState] =
    useState<PendingEmailVerification | null>(null);
  const [emailVerificationModalVisible, setEmailVerificationModalVisible] = useState(false);

  const setPendingTrialWelcome = useCallback((pending: boolean) => {
    setPendingTrialWelcomeState(pending);
    void savePendingTrialWelcome(pending);
  }, []);

  const setPendingPantrySetup = useCallback((pending: boolean) => {
    setPendingPantrySetupState(pending);
    void savePendingPantrySetup(pending);
  }, []);

  const clearPendingPantrySetup = useCallback(() => {
    setPendingPantrySetup(false);
  }, [setPendingPantrySetup]);
  const [planState, setPlanState] = useState<StoredPlanState>(DEFAULT_PLAN);
  const pendingOnboardingRef = useRef<OnboardingPayload | null>(null);
  const pendingPantrySetupRef = useRef(false);
  const profileRefreshInFlightRef = useRef(false);
  const logoutRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    pendingPantrySetupRef.current = pendingPantrySetup;
  }, [pendingPantrySetup]);

  const syncPushTokenToServer = useCallback(async (enabled: boolean): Promise<PushTokenSyncResult> => {
    if (!isRemotePushAvailable()) {
      return {
        ok: false,
        reason:
          'Push tokens need the Rasoi release app. Expo Go on Android cannot register — install from rasoiapplication.in/download.',
      };
    }

    const hasLegacyToken = Boolean(await getAuthToken());
    const session = await getSupabaseSession();
    if (!hasLegacyToken && !session?.access_token) {
      return { ok: false, reason: 'Sign in to register this device for meal notifications.' };
    }

    try {
      if (!enabled) {
        await deactivatePushTokens();
        return { ok: true };
      }

      const tokenResult = await getExpoPushTokenDetailed();
      if (!tokenResult.ok) {
        const reason = tokenResult.reason.toLowerCase();
        const isExpectedFailure =
          reason.includes('expo go') ||
          reason.includes('too_many_registrations') ||
          reason.includes('simulator');
        if (!isExpectedFailure) {
          captureMessage(`push_token_failed: ${tokenResult.reason}`, 'warning');
        }
        return { ok: false, reason: tokenResult.reason };
      }

      await registerPushToken({
        expoPushToken: tokenResult.token,
        platform: getPushPlatform(),
        active: true,
      });
      return { ok: true };
    } catch (error) {
      captureException(error, { scope: 'syncPushTokenToServer' });
      const message = error instanceof Error ? error.message : 'Could not register push token';
      return { ok: false, reason: message };
    }
  }, []);

  const dietPreference = useMemo(() => dietChoiceToFilter(dietChoice), [dietChoice]);
  const resolvedPlan = useMemo(
    () => resolvePlanState(planState, paymentsEnabled),
    [planState, paymentsEnabled],
  );

  const partnerAccess = useMemo(
    () => resolvePartnerAccess(resolvedPlan.effectiveTier, kitchenPreferences),
    [resolvedPlan.effectiveTier, kitchenPreferences],
  );

  const planWithPartnerAccess = useMemo(
    () => ({
      ...resolvedPlan,
      showPartners: resolvedPlan.showPartners || partnerAccess.canCheckout,
      partnersInTrialMode:
        resolvedPlan.partnersInTrialMode ||
        (partnerAccess.freemiumMode && resolvedPlan.effectiveTier === 'free'),
    }),
    [resolvedPlan, partnerAccess],
  );

  const applyPlanState = useCallback(
    (next: StoredPlanState) => {
      setPlanState(next);
      void savePlanState(next);
      const resolved = resolvePlanState(next, paymentsEnabled);
      if (resolved.effectiveTier === 'free' && next.planTier === 'trial' && resolved.trialExpired) {
        setPlanState((current) => ({ ...current, planTier: 'free' }));
      }
    },
    [paymentsEnabled],
  );

  const applyLocalOnboarding = useCallback((local: Awaited<ReturnType<typeof loadLocalOnboardingState>>) => {
    setHasCompletedOnboarding(local.hasCompletedOnboarding);
    setDietChoiceState(local.dietChoice);
    setRegionalCuisine(local.regionalCuisine);
    setFavoriteCuisines(local.favoriteCuisines);
    setNotificationsEnabledState(local.notificationsEnabled);
  }, []);

  const applyUserProfile = useCallback(
    (user: UserProfileResponse) => {
      if (user.isActive === false) {
        authLog('applyUserProfile:inactive_account');
        void logoutRef.current?.();
        return;
      }
      setIsLoggedIn(true);
      setIsGuestUser(user.isGuest);
      setUserId(user.id);
      setUserName(user.name);
      setUserPhone(user.phone ?? '');
      setUserEmail(user.email ?? '');
      setUserCity(user.city ?? null);
      setUserState(user.state ?? null);
      setHasCompletedOnboarding((prev) => user.hasCompletedOnboarding || prev);
      setDietChoiceState(user.dietChoice);
      setRegionalCuisine(user.regionalCuisine);
      setFavoriteCuisines(user.favoriteCuisines);
      setNotificationsEnabledState(user.notificationsEnabled);
      const prefs = parseKitchenPreferences(user.kitchenPreferences);
      setKitchenPreferences(prefs);
      setAllergyExclusions(prefs.allergyExclusions ?? []);
      setHouseholdSize(prefs.householdSize ?? DEFAULT_HOUSEHOLD_SIZE);
      if (user.hasCompletedOnboarding) {
        void saveOnboardingComplete({
          dietPreference: user.dietPreference,
          dietChoice: user.dietChoice,
          regionalCuisine: user.regionalCuisine,
          favoriteCuisines: user.favoriteCuisines,
          notificationsEnabled: user.notificationsEnabled,
        });
      }
      setPantryIngredients(user.pantryIngredients);
      setSavedRecipeIds(user.savedRecipeIds);
      applyPlanState(planFromUser(user));
      void saveCachedUserProfile(user);
      void clearUserLoggedOut();
      if (user.plan.planTier === 'trial' && user.plan.trialStartedAt) {
        void setPendingTrialWelcome(false);
        void scheduleTrialDayTwoReminder(user.plan.trialStartedAt);
      }
      setSentryUser({
        id: user.id,
        email: user.email,
        name: user.name,
        isGuest: user.isGuest,
      });
      void setFirebaseUserId(user.id);
      void setFirebaseUserProperties({
        account_type: user.isGuest ? 'guest' : 'member',
        plan_tier: user.plan.planTier,
      });
    },
    [applyPlanState, setPendingTrialWelcome],
  );

  const refreshUserProfileFromServer = useCallback(async () => {
    if (profileRefreshInFlightRef.current) return;
    profileRefreshInFlightRef.current = true;
    try {
      const user = await fetchCurrentUser();
      applyUserProfile(user);
      setLastProfileSyncedAt(new Date().toISOString());
    } catch (error) {
      authError('refreshUserProfile:failed', error);
    } finally {
      profileRefreshInFlightRef.current = false;
    }
  }, [applyUserProfile]);

  const syncPendingOnboarding = useCallback(async (): Promise<UserProfileResponse | null> => {
    const pending = pendingOnboardingRef.current;
    if (!pending) return null;

    authLog('syncPendingOnboarding:start');
    try {
      const user = await completeUserOnboarding(pending);
      pendingOnboardingRef.current = null;
      applyUserProfile(user);
      authLog('syncPendingOnboarding:success', { onboardingDone: user.hasCompletedOnboarding });
      return user;
    } catch (error) {
      authError('syncPendingOnboarding:failed', error);
      throw error;
    }
  }, [applyUserProfile]);

  const finishAuthAfterSync = useCallback(
    async (user: UserProfileResponse): Promise<AuthNavigationResult> => {
      await clearPermissionsOnboardingComplete();
      if (!user.hasCompletedOnboarding) {
        await clearLocalOnboardingCompleteFlag();
        pendingOnboardingRef.current = null;
      }
      applyUserProfile(user);
      if (!user.hasCompletedOnboarding) {
        setHasCompletedOnboarding(false);
      }

      let notificationsOn = user.notificationsEnabled;
      let onboardingDone = user.hasCompletedOnboarding;

      let resolvedCity = user.city ?? null;

      try {
        if (pendingOnboardingRef.current && !user.hasCompletedOnboarding) {
          const updated = await syncPendingOnboarding();
          if (updated) {
            notificationsOn = updated.notificationsEnabled;
            onboardingDone = updated.hasCompletedOnboarding;
            resolvedCity = updated.city ?? resolvedCity;
          }
        } else if (user.hasCompletedOnboarding) {
          pendingOnboardingRef.current = null;
        }
      } catch (error) {
        authError('finishAuthAfterSync:onboarding_failed', error);
      }

      void syncPushTokenToServer(onboardingDone ? notificationsOn : false);

      return {
        showTrialWelcome: false,
        hasCompletedOnboarding: onboardingDone,
        userCity: resolvedCity,
      };
    },
    [applyUserProfile, syncPendingOnboarding, syncPushTokenToServer],
  );

  const refreshPlan = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const user = await fetchCurrentUser();
      applyPlanState(planFromUser(user));
    } catch {
      // Keep cached plan state when offline.
    }
  }, [applyPlanState, isLoggedIn]);

  useRasoiUserPlanRealtime(isLoggedIn && isHydrated ? userId : null, () => {
    authLog('realtime:user_plan_changed');
    void refreshPlan();
  });

  useEffect(() => {
    void (async () => {
      try {
        await ensureValidSupabaseSession();

        const [local, pendingWelcome, pendingPantry, pendingEmail, appToken, session, userLoggedOut, cachedProfile] =
          await Promise.all([
            loadLocalOnboardingState(),
            loadPendingTrialWelcome(),
            loadPendingPantrySetup(),
            loadPendingEmailVerification(),
            getAuthToken(),
            getSupabaseSession(),
            isUserLoggedOut(),
            loadCachedUserProfile(),
          ]);
        applyLocalOnboarding(local);
        setPendingTrialWelcomeState(pendingWelcome);
        pendingPantrySetupRef.current = pendingPantry;
        setPendingPantrySetupState(pendingPantry);
        setPendingEmailVerificationState(pendingEmail);
        const pendingPayload = localStateToOnboardingPayload(local);
        if (pendingPayload) {
          pendingOnboardingRef.current = pendingPayload;
          authLog('hydrate:restored_pending_onboarding');
        }

        if (userLoggedOut) {
          authLog('hydrate:skipped_auth_restore_logged_out');
          return;
        }

        const hasCredentials = Boolean(session?.access_token || appToken);
        if (!hasCredentials) {
          return;
        }

        const syncOnboardingIfNeeded = async (user: UserProfileResponse) => {
          if (!user.hasCompletedOnboarding && pendingOnboardingRef.current) {
            await syncPendingOnboarding();
          }
        };

        try {
          const user = await fetchCurrentUser();
          if (!user.hasCompletedOnboarding) {
            await clearLocalOnboardingCompleteFlag();
            pendingOnboardingRef.current = null;
          }
          applyUserProfile(user);
          if (!user.hasCompletedOnboarding) {
            setHasCompletedOnboarding(false);
          }
          await syncOnboardingIfNeeded(user);
          return;
        } catch (error) {
          authError('hydrate:fetch_user_failed', error);
        }

        if (session?.access_token) {
          try {
            const metadata = session.user.user_metadata as { name?: string; phone?: string };
            const name = metadata.name?.trim() || session.user.email?.split('@')[0] || 'User';
            const phone = metadata.phone ?? '';
            const { user } = await syncSupabaseAccount(session.access_token, name, phone);
            void finishAuthAfterSync(user);
            return;
          } catch (error) {
            authError('hydrate:sync_supabase_failed', error);
          }
        }

        if (cachedProfile) {
          applyUserProfile(cachedProfile);
          authLog('hydrate:restored_from_cache');
          void refreshUserProfileFromServer();
        }
      } catch (error) {
        authError('hydrate:failed', error);
        try {
          const [userLoggedOut, cachedProfile, appToken, session] = await Promise.all([
            isUserLoggedOut(),
            loadCachedUserProfile(),
            getAuthToken(),
            getSupabaseSession(),
          ]);
          if (!userLoggedOut && cachedProfile && (session?.access_token || appToken)) {
            applyUserProfile(cachedProfile);
            authLog('hydrate:restored_from_cache_after_error');
            void refreshUserProfileFromServer();
          }
        } catch (fallbackError) {
          authError('hydrate:cache_fallback_failed', fallbackError);
        }
      } finally {
        setIsHydrated(true);
      }
    })();
  }, [
    applyLocalOnboarding,
    applyUserProfile,
    finishAuthAfterSync,
    refreshUserProfileFromServer,
    syncPendingOnboarding,
  ]);

  useEffect(() => {
    if (!isHydrated) return;
    syncRecipeFilters(dietChoice, regionalCuisine);
  }, [isHydrated, dietChoice, regionalCuisine, syncRecipeFilters]);

  useEffect(() => {
    if (!isHydrated) return;
    void syncDailyReminder(notificationsEnabled);
    if (isLoggedIn && hasCompletedOnboarding) {
      void syncPushTokenToServer(notificationsEnabled);
    }
  }, [isHydrated, isLoggedIn, hasCompletedOnboarding, notificationsEnabled, syncPushTokenToServer]);

  useEffect(() => {
    if (!isHydrated || !isLoggedIn) return;

    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        void (async () => {
          await ensureValidSupabaseSession();
          await refreshUserProfileFromServer();
        })();
        if (notificationsEnabled && hasCompletedOnboarding) {
          void syncPushTokenToServer(true);
        }
      }
    });

    return () => sub.remove();
  }, [
    isHydrated,
    isLoggedIn,
    hasCompletedOnboarding,
    notificationsEnabled,
    refreshUserProfileFromServer,
    syncPushTokenToServer,
  ]);

  const startTrial = useCallback(
    async (options?: { showWelcome?: boolean }) => {
      if (!paymentsEnabled || planState.hasUsedTrial) return false;

      const startedAt = new Date().toISOString();
      const optimisticPlan: StoredPlanState = {
        planTier: 'trial',
        trialStartedAt: startedAt,
        hasUsedTrial: true,
        trialBonusDays: planState.trialBonusDays,
        yearlyPromoOfferTag: planState.yearlyPromoOfferTag,
      };

      applyPlanState(optimisticPlan);
      void scheduleTrialDayTwoReminder(startedAt);

      if (isLoggedIn) {
        try {
          const plan = await updateUserPlan({
            planTier: 'trial',
            trialStartedAt: startedAt,
            hasUsedTrial: true,
          });
          applyPlanState({
            planTier: plan.planTier,
            trialStartedAt: plan.trialStartedAt,
            hasUsedTrial: plan.hasUsedTrial,
            trialBonusDays: plan.trialBonusDays ?? 0,
            yearlyPromoOfferTag: plan.yearlyPromoOfferTag ?? null,
          });
        } catch (error) {
          authError('startTrial:sync_failed', error);
        }
      }

      if (options?.showWelcome) {
        await setPendingTrialWelcome(true);
      }
      return true;
    },
    [applyPlanState, isLoggedIn, paymentsEnabled, planState.hasUsedTrial, planState.trialBonusDays, planState.yearlyPromoOfferTag, setPendingTrialWelcome],
  );

  const dismissTrialWelcome = useCallback(() => {
    void setPendingTrialWelcome(false);
  }, [setPendingTrialWelcome]);

  const upgradeToPaid = useCallback(async (interval: BillingInterval = 'monthly'): Promise<PurchaseFlowResult> => {
    if (!paymentsEnabled) {
      return { ok: false, error: 'Subscriptions are not available right now.' };
    }
    const result = await purchaseRasoiPlusDefault(
      {
        isLoggedIn,
        trialStartedAt: planState.trialStartedAt,
        yearlyPromoOfferTag: planState.yearlyPromoOfferTag,
      },
      interval,
    );
    if (result.ok) {
      applyPlanState(result.planState);
    }
    return result;
  }, [applyPlanState, isLoggedIn, paymentsEnabled, planState.trialStartedAt, planState.yearlyPromoOfferTag]);

  const redeemPromoCode = useCallback(
    async (code: string) => {
      if (!isLoggedIn) {
        throw new Error('Sign in to redeem a promo code.');
      }
      const result = await redeemPromoCodeApi(code);
      applyPlanState({
        planTier: result.plan.planTier,
        trialStartedAt: result.plan.trialStartedAt,
        hasUsedTrial: result.plan.hasUsedTrial,
        trialBonusDays: result.plan.trialBonusDays ?? 0,
        yearlyPromoOfferTag: result.plan.yearlyPromoOfferTag ?? null,
      });
      return { message: result.message };
    },
    [applyPlanState, isLoggedIn],
  );

  const restorePurchases = useCallback(async () => {
    const result = await restoreRasoiPlus({
      isLoggedIn,
      trialStartedAt: planState.trialStartedAt,
    });
    if (!result.ok) {
      throw new Error(result.error);
    }
    applyPlanState(result.planState);
  }, [applyPlanState, isLoggedIn, planState.trialStartedAt]);

  const completeOnboarding = useCallback(
    async (payload: OnboardingPayload): Promise<boolean> => {
      authLog('completeOnboarding:start', {
        notificationsEnabled: payload.notificationsEnabled,
        dietChoice: payload.dietChoice,
      });
      await saveOnboardingComplete(payload);
      pendingOnboardingRef.current = payload;
      setHasCompletedOnboarding(true);
      setDietChoiceState(payload.dietChoice);
      setRegionalCuisine(payload.regionalCuisine);
      setFavoriteCuisines(payload.favoriteCuisines);
      setNotificationsEnabledState(payload.notificationsEnabled);

      void syncDailyReminder(payload.notificationsEnabled).then((scheduled) => {
        if (scheduled && payload.notificationsEnabled) {
          void sendDailyReminderThankYouNotification();
        }
      });

      let showTrialWelcome = false;
      const session = await getSupabaseSession();
      const legacyToken = await getAuthToken();
      if (session?.access_token || legacyToken) {
        await syncPendingOnboarding();
        await syncPushTokenToServer(payload.notificationsEnabled);
      }

      authLog('completeOnboarding:done', {
        syncedToServer: Boolean(session?.access_token || legacyToken),
        showTrialWelcome,
      });
      trackOnboardingComplete({
        dietChoice: payload.dietChoice,
        regionalCuisine: payload.regionalCuisine,
        notificationsEnabled: payload.notificationsEnabled,
        isGuest: isGuestUser,
      });
      return showTrialWelcome;
    },
    [isGuestUser, syncPendingOnboarding, syncPushTokenToServer],
  );

  const sendEmailOtpCode = useCallback(async (name: string, phone: string, email: string) => {
    authLog('sendEmailOtp:context_start');
    try {
      await sendEmailOtp(name, phone, email);
    } catch (error) {
      authError('sendEmailOtp:context_failed', error);
      throw error;
    }
  }, []);

  const sendLoginEmailOtpCode = useCallback(async (email: string) => {
    authLog('sendLoginEmailOtp:context_start');
    try {
      await sendLoginEmailOtp(email);
    } catch (error) {
      authError('sendLoginEmailOtp:context_failed', error);
      throw error;
    }
  }, []);

  const verifyEmailOtpAndLogin = useCallback(
    async (
      email: string,
      otp: string,
      name: string,
      phone: string,
      options?: { acceptedTerms?: boolean },
    ) => {
      authLog('verifyEmailOtpAndLogin:start', { upgradingGuest: isGuestUser });
      try {
        const otpFlow = isGuestUser ? 'guest_upgrade' : 'signup';
        const session = await verifyEmailOtp(email, otp, otpFlow);
        const pendingOnboarding = pendingOnboardingRef.current ?? undefined;
        const { user } = await syncSupabaseAccount(session.access_token, name, phone, {
          ...options,
          linkGuestUserId: isGuestUser && userId ? userId : undefined,
          onboarding: pendingOnboarding,
        });
        if (pendingOnboarding && user.hasCompletedOnboarding) {
          pendingOnboardingRef.current = null;
        }
        const isNewSignup = otpFlow === 'signup';
        if (isNewSignup) {
          pendingPantrySetupRef.current = true;
          setPendingPantrySetup(true);
        }
        const nav = await finishAuthAfterSync(user);
        if (isNewSignup) {
          setPantryIngredients([]);
          void updatePantryIngredients([]).then(applyUserProfile).catch((error) => {
            authError('signup:clear_default_pantry_failed', error);
          });
        }
        authLog('verifyEmailOtpAndLogin:success', {
          onboardingDone: nav.hasCompletedOnboarding,
          upgradedGuest: isGuestUser,
          userId: user.id.slice(0, 8),
          pendingSync: Boolean(pendingOnboardingRef.current),
          showTrialWelcome: nav.showTrialWelcome,
        });
        void logFirebaseEvent('sign_up', { method: isGuestUser ? 'email_guest_upgrade' : 'email' });
        return nav;
      } catch (error) {
        authError('verifyEmailOtpAndLogin:failed', error);
        throw error;
      }
    },
    [finishAuthAfterSync, isGuestUser, userId, setPendingPantrySetup, updatePantryIngredients, applyUserProfile],
  );

  const verifyLoginEmailOtp = useCallback(
    async (email: string, otp: string) => {
      authLog('verifyLoginEmailOtp:start');
      try {
        const session = await verifyEmailOtp(email, otp, 'login');
        const meta = session.user?.user_metadata as Record<string, unknown> | undefined;
        const metaName = typeof meta?.name === 'string' ? meta.name.trim() : '';
        const metaPhone = typeof meta?.phone === 'string' ? meta.phone : '';
        const fallbackName =
          email.split('@')[0]?.replace(/[^a-zA-Z\s]/g, ' ').trim() || 'Rasoi User';
        const name = metaName.length >= 2 ? metaName : fallbackName.length >= 2 ? fallbackName : 'Rasoi User';
        const phone = metaPhone.replace(/\D/g, '').replace(/^91/, '').slice(0, 10);
        const pendingOnboarding = pendingOnboardingRef.current ?? undefined;
        const { user } = await syncSupabaseAccount(session.access_token, name, phone, {
          onboarding: pendingOnboarding,
        });
        if (pendingOnboarding && user.hasCompletedOnboarding) {
          pendingOnboardingRef.current = null;
        }
        const nav = await finishAuthAfterSync(user);
        authLog('verifyLoginEmailOtp:success', { onboardingDone: nav.hasCompletedOnboarding });
        void logFirebaseEvent('login', { method: 'email' });
        return nav;
      } catch (error) {
        authError('verifyLoginEmailOtp:failed', error);
        throw error;
      }
    },
    [finishAuthAfterSync],
  );

  const loginAsGuest = useCallback(async (options?: { name?: string }) => {
    authLog('loginAsGuest:context_start');
    const { user } = await loginAsGuestUser(options);
    const nav = await finishAuthAfterSync(user);
    if (user.isGuest && !user.hasCompletedOnboarding) {
      setPendingPantrySetup(true);
    }
    void logFirebaseEvent('guest_login');
    return nav;
  }, [finishAuthAfterSync, setPendingPantrySetup]);

  const openEmailVerificationModal = useCallback(() => {
    setEmailVerificationModalVisible(true);
  }, []);

  const closeEmailVerificationModal = useCallback(() => {
    setEmailVerificationModalVisible(false);
  }, []);

  const clearPendingEmailVerification = useCallback(async () => {
    await clearPendingEmailVerificationStorage();
    setPendingEmailVerificationState(null);
    setEmailVerificationModalVisible(false);
  }, []);

  const continueWithPendingEmailVerification = useCallback(
    async (pending: Omit<PendingEmailVerification, 'savedAt' | 'reason'>) => {
      const payload: PendingEmailVerification = {
        ...pending,
        reason: 'email_delivery_unavailable',
        savedAt: new Date().toISOString(),
      };
      await savePendingEmailVerification(payload);
      setPendingEmailVerificationState(payload);

      if (!isLoggedIn) {
        return loginAsGuest(pending.name?.trim().length ? { name: pending.name.trim() } : undefined);
      }
      return null;
    },
    [isLoggedIn, loginAsGuest],
  );

  const resendPendingEmailVerificationOtp = useCallback(async () => {
    const pending = pendingEmailVerification;
    if (!pending) {
      throw new Error('No pending email verification.');
    }

    if (pending.flow === 'login') {
      await sendLoginEmailOtpCode(pending.email);
      return;
    }

    await sendEmailOtpCode(pending.name ?? 'User', pending.phone ?? '', pending.email);
  }, [pendingEmailVerification, sendEmailOtpCode, sendLoginEmailOtpCode]);

  const verifyPendingEmailOtp = useCallback(
    async (otp: string) => {
      const pending = pendingEmailVerification;
      if (!pending) {
        throw new Error('No pending email verification.');
      }

      let nav: AuthNavigationResult;
      if (pending.flow === 'login') {
        nav = await verifyLoginEmailOtp(pending.email, otp);
      } else {
        nav = await verifyEmailOtpAndLogin(
          pending.email,
          otp,
          pending.name ?? 'User',
          pending.phone ?? '',
          { acceptedTerms: pending.termsAccepted },
        );
      }

      await clearPendingEmailVerification();
      return nav;
    },
    [
      clearPendingEmailVerification,
      pendingEmailVerification,
      verifyEmailOtpAndLogin,
      verifyLoginEmailOtp,
    ],
  );

  const updateProfile = useCallback(
    async (name: string, phone: string) => {
      const user = await updateUserProfile({ name, phone });
      applyUserProfile(user);
    },
    [applyUserProfile],
  );

  const syncUserLocation = useCallback(
    async (snapshot: UserLocationSnapshot): Promise<boolean> => {
      if (!isLoggedIn) return false;
      try {
        await ensureValidSupabaseSession();
        const user = await updateUserLocation({
          city: snapshot.city,
          state: snapshot.state,
          latitude: snapshot.latitude,
          longitude: snapshot.longitude,
        });
        applyUserProfile(user);
        return true;
      } catch {
        // Optional — GPS sync can fail when permission is denied or API is not deployed yet.
        return false;
      }
    },
    [applyUserProfile, isLoggedIn],
  );

  const logout = useCallback(async () => {
    await markUserLoggedOut();
    await Promise.race([
      syncPushTokenToServer(false),
      new Promise<void>((resolve) => setTimeout(resolve, 2500)),
    ]);
    await logoutSession();
    await clearCachedUserProfile();
    setIsLoggedIn(false);
    setIsGuestUser(false);
    setUserId(null);
    setUserName('');
    setUserPhone('');
    setUserEmail('');
    setUserCity(null);
    setUserState(null);
    setPantryIngredients([...DEFAULT_PANTRY]);
    setSavedRecipeIds([]);
    applyPlanState(DEFAULT_PLAN);
    clearSentryUser();
    void setFirebaseUserId(null);
    await clearPendingEmailVerificationStorage();
    setPendingEmailVerificationState(null);
    setEmailVerificationModalVisible(false);
  }, [applyPlanState, syncPushTokenToServer]);

  logoutRef.current = logout;

  const deleteAccount = useCallback(
    async (payload: DeleteAccountPayload) => {
      await markUserLoggedOut();
      await syncPushTokenToServer(false);
      await deleteUserAccount(payload);
      await logoutSession();
      await clearAuthState();
      pendingOnboardingRef.current = null;
      setHasCompletedOnboarding(false);
      setIsLoggedIn(false);
      setIsGuestUser(false);
      setUserId(null);
      setUserName('');
      setUserPhone('');
      setUserEmail('');
      setUserCity(null);
      setUserState(null);
      setPantryIngredients([...DEFAULT_PANTRY]);
      setSavedRecipeIds([]);
      applyPlanState(DEFAULT_PLAN);
      clearSentryUser();
      void setFirebaseUserId(null);
    },
    [applyPlanState, syncPushTokenToServer],
  );

  const exportAccountData = useCallback(async () => {
    return exportUserData();
  }, []);

  const resetAppFlow = useCallback(async () => {
    await markUserLoggedOut();
    await syncPushTokenToServer(false);
    await logoutSession();
    await clearAuthState();
    await clearLegalConsent();
    pendingOnboardingRef.current = null;
    setHasCompletedOnboarding(false);
    setIsLoggedIn(false);
    setIsGuestUser(false);
    setUserId(null);
    setUserName('');
    setUserPhone('');
    setUserEmail('');
    setUserCity(null);
    setUserState(null);
    setDietChoiceState('Veg');
    setRegionalCuisine('All India');
    setFavoriteCuisines([]);
    setNotificationsEnabledState(false);
    setPantryFilterActive(false);
    void setPendingTrialWelcome(false);
    setPendingPantrySetup(false);
    setPantryIngredients([...DEFAULT_PANTRY]);
    setSavedRecipeIds([]);
    setPlanState(DEFAULT_PLAN);
    await syncDailyReminder(false);
    clearSentryUser();
    void setFirebaseUserId(null);
  }, [syncPushTokenToServer, setPendingPantrySetup]);

  const setDietChoice = useCallback(
    async (choice: DietChoice) => {
      const previous = dietChoice;
      const preference = dietChoiceToFilter(choice);
      setDietChoiceState(choice);
      if (choice !== previous) {
        trackDietFilterChanged({
          dietChoice: choice,
          previousDiet: previous,
          source: 'home',
        });
      }
      if (isLoggedIn) {
        const user = await updateUserProfile({ dietChoice: choice, dietPreference: preference });
        applyUserProfile(user);
      }
    },
    [applyUserProfile, dietChoice, isLoggedIn],
  );

  const setRegionalCuisineState = useCallback(
    (region: string) => {
      setRegionalCuisine(region);
      if (isLoggedIn) {
        void updateUserProfile({ regionalCuisine: region }).then(applyUserProfile);
      }
    },
    [applyUserProfile, isLoggedIn],
  );

  const setFavoriteCuisinesState = useCallback(
    async (cuisines: CuisineId[]) => {
      const region = cuisinesToRegion(cuisines, kitchenStyles);
      setFavoriteCuisines(cuisines);
      setRegionalCuisine(region);
      if (isLoggedIn) {
        const user = await updateUserProfile({
          favoriteCuisines: cuisines,
          regionalCuisine: region,
        });
        applyUserProfile(user);
      }
    },
    [applyUserProfile, isLoggedIn, kitchenStyles],
  );

  const setNotificationsEnabled = useCallback(
    async (enabled: boolean): Promise<NotificationEnableResult> => {
      const wasEnabled = notificationsEnabled;

      if (!enabled) {
        await syncDailyReminder(false);
        setNotificationsEnabledState(false);
        if (isLoggedIn) {
          const user = await updateUserProfile({ notificationsEnabled: false });
          applyUserProfile(user);
          await syncPushTokenToServer(false);
        }
        return { ok: true };
      }

      const granted = await ensureNotificationPermissions();
      if (!granted) {
        setNotificationsEnabledState(false);
        if (isLoggedIn) {
          const user = await updateUserProfile({ notificationsEnabled: false });
          applyUserProfile(user);
        }
        return {
          ok: false,
          reason:
            'Notification permission is off. Allow notifications for Rasoi in your phone Settings, then try again.',
        };
      }

      const tokenSync = await syncPushTokenToServer(true);
      if (!tokenSync.ok) {
        setNotificationsEnabledState(false);
        if (isLoggedIn) {
          const user = await updateUserProfile({ notificationsEnabled: false });
          applyUserProfile(user);
        }
        return { ok: false, reason: tokenSync.reason };
      }

      void syncDailyReminder(true);
      setNotificationsEnabledState(true);
      if (isLoggedIn) {
        const user = await updateUserProfile({ notificationsEnabled: true });
        applyUserProfile(user);
      }
      if (!wasEnabled) {
        void sendDailyReminderThankYouNotification();
      }
      return { ok: true };
    },
    [applyUserProfile, isLoggedIn, notificationsEnabled, syncPushTokenToServer],
  );

  const saveFoodPreferences = useCallback(
    async (payload: FoodPreferencesPayload) => {
      const preference = dietChoiceToFilter(payload.dietChoice);
      const notificationsChanged = payload.notificationsEnabled !== notificationsEnabled;
      const previousNotificationsEnabled = notificationsEnabled;
      const previousDiet = dietChoice;

      setDietChoiceState(payload.dietChoice);
      setRegionalCuisine(payload.regionalCuisine);
      setFavoriteCuisines(payload.favoriteCuisines);
      if (payload.allergyExclusions !== undefined) {
        setAllergyExclusions(payload.allergyExclusions);
      }
      if (payload.householdSize !== undefined) {
        setHouseholdSize(payload.householdSize);
      }

      let scheduledNotifications = payload.notificationsEnabled;
      if (notificationsChanged) {
        const enableResult = await setNotificationsEnabled(payload.notificationsEnabled);
        scheduledNotifications = enableResult.ok ? payload.notificationsEnabled : false;
        if (!enableResult.ok && payload.notificationsEnabled) {
          throw new Error(enableResult.reason);
        }
      }

      if (isLoggedIn) {
        const nextKitchenPreferences: KitchenPreferences = {
          ...kitchenPreferences,
          ...(payload.allergyExclusions !== undefined
            ? { allergyExclusions: payload.allergyExclusions }
            : {}),
          ...(payload.householdSize !== undefined ? { householdSize: payload.householdSize } : {}),
        };

        const user = await updateUserProfile({
          dietChoice: payload.dietChoice,
          dietPreference: preference,
          regionalCuisine: payload.regionalCuisine,
          favoriteCuisines: payload.favoriteCuisines,
          notificationsEnabled: scheduledNotifications,
          kitchenPreferences: nextKitchenPreferences,
        });
        applyUserProfile(user);
      }

      if (payload.dietChoice !== previousDiet) {
        trackDietFilterChanged({
          dietChoice: payload.dietChoice,
          previousDiet: previousDiet,
          source: 'settings',
        });
      }
    },
    [applyUserProfile, dietChoice, isLoggedIn, kitchenPreferences, notificationsEnabled, setNotificationsEnabled],
  );

  const recordPartnerShop = useCallback(async () => {
    const nextPrefs = recordPartnerCheckout(kitchenPreferences);
    setKitchenPreferences(nextPrefs);
    if (!isLoggedIn) return;
    try {
      const user = await updateUserProfile({ kitchenPreferences: nextPrefs });
      applyUserProfile(user);
    } catch (error) {
      captureException(error, { scope: 'recordPartnerShop' });
    }
  }, [applyUserProfile, isLoggedIn, kitchenPreferences]);

  const isGuest = isGuestUser || ((userName === 'Guest' || userName.length === 0) && userPhone.length === 0);

  const togglePantryIngredient = useCallback(
    (ingredient: string) => {
      setPantryIngredients((current) => {
        const next = pantryHasIngredient(current, ingredient)
          ? removePantryIngredient(current, ingredient)
          : addPantryIngredient(current, ingredient);
        if (isLoggedIn) {
          void updatePantryIngredients(next).then(applyUserProfile);
        }
        return next;
      });
    },
    [applyUserProfile, isLoggedIn],
  );

  const toggleSavedRecipe = useCallback(
    (recipeId: string) => {
      setSavedRecipeIds((current) => {
        const isSaving = !current.includes(recipeId);
        const next = isSaving
          ? [...current, recipeId]
          : current.filter((id) => id !== recipeId);
        if (isLoggedIn) {
          void updateSavedRecipeIds(next).then(applyUserProfile);
        }
        if (isSaving) {
          const recipe = getRecipeById(recipeId);
          if (recipe) {
            void sendRecipeSavedNotification(recipe.title);
          }
        }
        return next;
      });
    },
    [applyUserProfile, getRecipeById, isLoggedIn],
  );

  const isRecipeSaved = useCallback(
    (recipeId: string) => savedRecipeIds.includes(recipeId),
    [savedRecipeIds],
  );

  const getSavedRecipes = useCallback(
    () => recipes.filter((recipe) => savedRecipeIds.includes(recipe.id)),
    [recipes, savedRecipeIds],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      ...planWithPartnerAccess,
      paymentsEnabled,
      isHydrated,
      hasCompletedOnboarding,
      isLoggedIn,
      isGuest,
      userId,
      userName,
      userPhone,
      userEmail,
      userCity,
      userState,
      allergyExclusions,
      householdSize,
      kitchenPreferences,
      partnerAccess,
      lastProfileSyncedAt,
      pantryIngredients,
      dietPreference,
      dietChoice,
      regionalCuisine,
      favoriteCuisines,
      notificationsEnabled,
      savedRecipeIds,
      pantryFilterActive,
      completeOnboarding,
      sendEmailOtp: sendEmailOtpCode,
      sendLoginEmailOtp: sendLoginEmailOtpCode,
      verifyEmailOtpAndLogin,
      verifyLoginEmailOtp,
      loginAsGuest,
      updateProfile,
      syncUserLocation,
      logout,
      deleteAccount,
      exportAccountData,
      resetAppFlow,
      togglePantryIngredient,
      setDietChoice,
      setRegionalCuisine: setRegionalCuisineState,
      setFavoriteCuisines: setFavoriteCuisinesState,
      setNotificationsEnabled,
      saveFoodPreferences,
      recordPartnerShop,
      refreshSyncedProfile: refreshUserProfileFromServer,
      toggleSavedRecipe,
      isRecipeSaved,
      setPantryFilterActive,
      getSavedRecipes,
      startTrial,
      upgradeToPaid,
      restorePurchases,
      refreshPlan,
      redeemPromoCode,
      pendingTrialWelcome,
      dismissTrialWelcome,
      pendingPantrySetup,
      clearPendingPantrySetup,
      pendingEmailVerification,
      emailVerificationModalVisible,
      openEmailVerificationModal,
      closeEmailVerificationModal,
      continueWithPendingEmailVerification,
      verifyPendingEmailOtp,
      resendPendingEmailVerificationOtp,
      clearPendingEmailVerification,
    }),
    [
      planWithPartnerAccess,
      paymentsEnabled,
      isHydrated,
      hasCompletedOnboarding,
      isLoggedIn,
      isGuest,
      userId,
      userName,
      userPhone,
      userEmail,
      userCity,
      userState,
      allergyExclusions,
      householdSize,
      kitchenPreferences,
      partnerAccess,
      lastProfileSyncedAt,
      pantryIngredients,
      dietPreference,
      dietChoice,
      regionalCuisine,
      favoriteCuisines,
      notificationsEnabled,
      savedRecipeIds,
      pantryFilterActive,
      completeOnboarding,
      sendEmailOtpCode,
      sendLoginEmailOtpCode,
      verifyEmailOtpAndLogin,
      verifyLoginEmailOtp,
      loginAsGuest,
      updateProfile,
      syncUserLocation,
      logout,
      deleteAccount,
      exportAccountData,
      resetAppFlow,
      togglePantryIngredient,
      setDietChoice,
      setRegionalCuisineState,
      setFavoriteCuisinesState,
      setNotificationsEnabled,
      saveFoodPreferences,
      recordPartnerShop,
      refreshUserProfileFromServer,
      toggleSavedRecipe,
      isRecipeSaved,
      getSavedRecipes,
      startTrial,
      upgradeToPaid,
      restorePurchases,
      refreshPlan,
      redeemPromoCode,
      pendingTrialWelcome,
      dismissTrialWelcome,
      pendingPantrySetup,
      clearPendingPantrySetup,
      pendingEmailVerification,
      emailVerificationModalVisible,
      openEmailVerificationModal,
      closeEmailVerificationModal,
      continueWithPendingEmailVerification,
      verifyPendingEmailOtp,
      resendPendingEmailVerificationOtp,
      clearPendingEmailVerification,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
