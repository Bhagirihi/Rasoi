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

import { PlanTier, type BillingInterval } from '@/constants/plans';
import { CuisineId, DietChoice } from '@/constants/theme';
import { useReferenceData } from '@/context/ReferenceContext';
import { useRecipes } from '@/context/RecipesContext';
import { DietType, Recipe } from '@/data/mockRecipes';
import { loginAsGuestUser, logoutSession, syncSupabaseAccount } from '@/services/auth';
import { purchaseRasoiPlusDefault, restoreRasoiPlus } from '@/services/payments';
import { getSupabaseSession, sendEmailOtp, verifyEmailOtp } from '@/services/supabaseAuth';
import {
  completeUserOnboarding,
  deactivatePushTokens,
  fetchCurrentUser,
  registerPushToken,
  updatePantryIngredients,
  updateSavedRecipeIds,
  updateUserPlan,
  updateUserProfile,
} from '@/services/user';
import type { UserProfileResponse } from '@/types/api';
import { authError, authLog } from '@/utils/authLogger';
import { clearAuthToken, getAuthToken } from '@/utils/authToken';
import { clearSentryUser, setSentryUser } from '@/utils/sentry';
import { resolvePlanState, type ResolvedPlan } from '@/utils/planLogic';
import {
  syncDailyReminder,
  sendDailyReminderThankYouNotification,
  sendRecipeSavedNotification,
  scheduleTrialDayTwoReminder,
  getExpoPushToken,
  getPushPlatform,
} from '@/utils/notifications';
import {
  DEFAULT_PANTRY,
  OnboardingPayload,
  clearAuthState,
  dietChoiceToFilter,
  loadLocalOnboardingState,
  localStateToOnboardingPayload,
  loadPendingTrialWelcome,
  saveOnboardingComplete,
  savePendingTrialWelcome,
} from '@/utils/storage';
import { cuisinesToRegion } from '@/utils/kitchenStyles';
import type { StoredPlanState } from '@/utils/planStorage';

interface AppContextValue extends ResolvedPlan {
  isHydrated: boolean;
  hasCompletedOnboarding: boolean;
  isLoggedIn: boolean;
  isGuest: boolean;
  userName: string;
  userPhone: string;
  userEmail: string;
  pantryIngredients: string[];
  dietPreference: DietType;
  dietChoice: DietChoice;
  regionalCuisine: string;
  favoriteCuisines: CuisineId[];
  notificationsEnabled: boolean;
  savedRecipeIds: string[];
  pantryFilterActive: boolean;
  completeOnboarding: (payload: OnboardingPayload) => Promise<void>;
  sendEmailOtp: (name: string, phone: string, email: string) => Promise<void>;
  verifyEmailOtpAndLogin: (email: string, otp: string, name: string, phone: string) => Promise<boolean>;
  loginAsGuest: () => Promise<void>;
  updateProfile: (name: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  resetAppFlow: () => Promise<void>;
  togglePantryIngredient: (ingredient: string) => void;
  setDietChoice: (choice: DietChoice) => Promise<void>;
  setRegionalCuisine: (region: string) => void;
  setFavoriteCuisines: (cuisines: CuisineId[]) => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  toggleSavedRecipe: (recipeId: string) => void;
  isRecipeSaved: (recipeId: string) => boolean;
  setPantryFilterActive: (active: boolean) => void;
  getSavedRecipes: () => Recipe[];
  startTrial: (options?: { showWelcome?: boolean }) => Promise<boolean>;
  upgradeToPaid: (interval?: BillingInterval) => Promise<void>;
  restorePurchases: () => Promise<void>;
  refreshPlan: () => Promise<void>;
  pendingTrialWelcome: boolean;
  dismissTrialWelcome: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const DEFAULT_PLAN: StoredPlanState = {
  planTier: 'free',
  trialStartedAt: null,
  hasUsedTrial: false,
};

function planFromUser(user: UserProfileResponse): StoredPlanState {
  return {
    planTier: user.plan.planTier,
    trialStartedAt: user.plan.trialStartedAt,
    hasUsedTrial: user.plan.hasUsedTrial,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { recipes, getRecipeById } = useRecipes();
  const { kitchenStyles } = useReferenceData();
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isGuestUser, setIsGuestUser] = useState(false);
  const [pantryIngredients, setPantryIngredients] = useState<string[]>([...DEFAULT_PANTRY]);
  const [dietChoice, setDietChoiceState] = useState<DietChoice>('Veg');
  const [regionalCuisine, setRegionalCuisine] = useState<string>('All India');
  const [favoriteCuisines, setFavoriteCuisines] = useState<CuisineId[]>([]);
  const [notificationsEnabled, setNotificationsEnabledState] = useState(false);
  const [savedRecipeIds, setSavedRecipeIds] = useState<string[]>([]);
  const [pantryFilterActive, setPantryFilterActive] = useState(false);
  const [pendingTrialWelcome, setPendingTrialWelcomeState] = useState(false);

  const setPendingTrialWelcome = useCallback(async (pending: boolean) => {
    setPendingTrialWelcomeState(pending);
    await savePendingTrialWelcome(pending);
  }, []);
  const [planState, setPlanState] = useState<StoredPlanState>(DEFAULT_PLAN);
  const pendingOnboardingRef = useRef<OnboardingPayload | null>(null);

  const syncPushTokenToServer = useCallback(async (enabled: boolean) => {
    const authToken = await getAuthToken();
    if (!authToken) return;

    try {
      if (!enabled) {
        await deactivatePushTokens();
        return;
      }

      const expoPushToken = await getExpoPushToken();
      if (!expoPushToken) return;

      await registerPushToken({
        expoPushToken,
        platform: getPushPlatform(),
        active: true,
      });
    } catch {
      // Push token sync is best-effort; local reminders still work.
    }
  }, []);

  const dietPreference = useMemo(() => dietChoiceToFilter(dietChoice), [dietChoice]);
  const resolvedPlan = useMemo(() => resolvePlanState(planState), [planState]);

  const applyPlanState = useCallback((next: StoredPlanState) => {
    setPlanState(next);
    const resolved = resolvePlanState(next);
    if (resolved.effectiveTier === 'free' && next.planTier === 'trial' && resolved.trialExpired) {
      setPlanState((current) => ({ ...current, planTier: 'free' }));
    }
  }, []);

  const applyLocalOnboarding = useCallback((local: Awaited<ReturnType<typeof loadLocalOnboardingState>>) => {
    setHasCompletedOnboarding(local.hasCompletedOnboarding);
    setDietChoiceState(local.dietChoice);
    setRegionalCuisine(local.regionalCuisine);
    setFavoriteCuisines(local.favoriteCuisines);
    setNotificationsEnabledState(local.notificationsEnabled);
  }, []);

  const applyUserProfile = useCallback(
    (user: UserProfileResponse) => {
      setIsLoggedIn(true);
      setIsGuestUser(user.isGuest);
      setUserName(user.name);
      setUserPhone(user.phone ?? '');
      setUserEmail(user.email ?? '');
      setHasCompletedOnboarding((prev) => user.hasCompletedOnboarding || prev);
      setDietChoiceState(user.dietChoice);
      setRegionalCuisine(user.regionalCuisine);
      setFavoriteCuisines(user.favoriteCuisines);
      setNotificationsEnabledState(user.notificationsEnabled);
      setPantryIngredients(
        user.pantryIngredients,
      );
      setSavedRecipeIds(user.savedRecipeIds);
      applyPlanState(planFromUser(user));
      setSentryUser({
        id: user.id,
        email: user.email,
        name: user.name,
        isGuest: user.isGuest,
      });
    },
    [applyPlanState],
  );

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

  const maybeStartTrialAfterAuth = useCallback(
    async (user: UserProfileResponse, options?: { showWelcome?: boolean }) => {
      if (!user.hasCompletedOnboarding || user.plan.hasUsedTrial) return false;
      const startedAt = new Date().toISOString();
      const plan = await updateUserPlan({
        planTier: 'trial',
        trialStartedAt: startedAt,
        hasUsedTrial: true,
      });
      applyPlanState({
        planTier: plan.planTier,
        trialStartedAt: plan.trialStartedAt,
        hasUsedTrial: plan.hasUsedTrial,
      });
      if (plan.trialStartedAt) {
        void scheduleTrialDayTwoReminder(plan.trialStartedAt);
      }
      if (options?.showWelcome) {
        await setPendingTrialWelcome(true);
        return true;
      }
      return false;
    },
    [applyPlanState, setPendingTrialWelcome],
  );

  const finishAuthAfterSync = useCallback(
    async (user: UserProfileResponse) => {
      applyUserProfile(user);

      let syncedUser = user;
      if (pendingOnboardingRef.current && !user.hasCompletedOnboarding) {
        const updated = await syncPendingOnboarding();
        if (updated) syncedUser = updated;
      }

      let showTrialWelcome = false;
      if (syncedUser.hasCompletedOnboarding && !syncedUser.plan.hasUsedTrial) {
        showTrialWelcome = await maybeStartTrialAfterAuth(syncedUser, { showWelcome: true });
      }

      void syncPushTokenToServer(syncedUser.notificationsEnabled);
      return showTrialWelcome;
    },
    [applyUserProfile, maybeStartTrialAfterAuth, syncPendingOnboarding, syncPushTokenToServer],
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

  useEffect(() => {
    void (async () => {
      try {
        const local = await loadLocalOnboardingState();
        applyLocalOnboarding(local);
        const pendingWelcome = await loadPendingTrialWelcome();
        setPendingTrialWelcomeState(pendingWelcome);
        const pendingPayload = localStateToOnboardingPayload(local);
        if (pendingPayload) {
          pendingOnboardingRef.current = pendingPayload;
          authLog('hydrate:restored_pending_onboarding');
        }

        const appToken = await getAuthToken();
        if (appToken) {
          try {
            const user = await fetchCurrentUser();
            applyUserProfile(user);
            if (!user.hasCompletedOnboarding && pendingOnboardingRef.current) {
              await syncPendingOnboarding();
            }
            return;
          } catch (error) {
            authError('hydrate:fetch_user_failed', error);
            await clearAuthToken();
          }
        }

        const session = await getSupabaseSession();
        if (session?.access_token) {
          const metadata = session.user.user_metadata as { name?: string; phone?: string };
          const name = metadata.name?.trim() || session.user.email?.split('@')[0] || 'User';
          const phone = metadata.phone ?? '';
          const { user } = await syncSupabaseAccount(session.access_token, name, phone);
          await finishAuthAfterSync(user);
        }
      } catch (error) {
        authError('hydrate:failed', error);
        await logoutSession();
        setIsLoggedIn(false);
        setIsGuestUser(false);
        setUserName('');
        setUserPhone('');
        setUserEmail('');
      } finally {
        setIsHydrated(true);
      }
    })();
  }, [applyLocalOnboarding, applyUserProfile, finishAuthAfterSync, syncPendingOnboarding]);

  useEffect(() => {
    if (!isHydrated) return;
    void syncDailyReminder(notificationsEnabled);
    if (isLoggedIn) {
      void syncPushTokenToServer(notificationsEnabled);
    }
  }, [isHydrated, isLoggedIn, notificationsEnabled, syncPushTokenToServer]);

  const startTrial = useCallback(
    async (options?: { showWelcome?: boolean }) => {
      if (planState.hasUsedTrial) return false;

      if (isLoggedIn) {
        const startedAt = new Date().toISOString();
        const plan = await updateUserPlan({
          planTier: 'trial',
          trialStartedAt: startedAt,
          hasUsedTrial: true,
        });
        applyPlanState({
          planTier: plan.planTier,
          trialStartedAt: plan.trialStartedAt,
          hasUsedTrial: plan.hasUsedTrial,
        });
        if (plan.trialStartedAt) {
          void scheduleTrialDayTwoReminder(plan.trialStartedAt);
        }
      } else {
        const startedAt = new Date().toISOString();
        applyPlanState({
          planTier: 'trial',
          trialStartedAt: startedAt,
          hasUsedTrial: true,
        });
        void scheduleTrialDayTwoReminder(startedAt);
      }

      if (options?.showWelcome) {
        await setPendingTrialWelcome(true);
      }
      return true;
    },
    [applyPlanState, isLoggedIn, planState.hasUsedTrial, setPendingTrialWelcome],
  );

  const dismissTrialWelcome = useCallback(() => {
    void setPendingTrialWelcome(false);
  }, [setPendingTrialWelcome]);

  const upgradeToPaid = useCallback(async (interval: BillingInterval = 'monthly') => {
    const result = await purchaseRasoiPlusDefault(
      {
        isLoggedIn,
        trialStartedAt: planState.trialStartedAt,
      },
      interval,
    );
    if (!result.ok) {
      throw new Error(result.error);
    }
    applyPlanState(result.planState);
  }, [applyPlanState, isLoggedIn, planState.trialStartedAt]);

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
    async (payload: OnboardingPayload) => {
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

      if (payload.notificationsEnabled) {
        const scheduled = await syncDailyReminder(true);
        if (scheduled) {
          await sendDailyReminderThankYouNotification();
        }
      } else {
        await syncDailyReminder(false);
      }

      const token = await getAuthToken();
      if (token) {
        await syncPendingOnboarding();
      }
      authLog('completeOnboarding:done', { syncedToServer: Boolean(token) });
    },
    [syncPendingOnboarding],
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

  const verifyEmailOtpAndLogin = useCallback(
    async (email: string, otp: string, name: string, phone: string) => {
      authLog('verifyEmailOtpAndLogin:start');
      try {
        const session = await verifyEmailOtp(email, otp);
        const { user } = await syncSupabaseAccount(session.access_token, name, phone);
        const showTrialWelcome = await finishAuthAfterSync(user);
        authLog('verifyEmailOtpAndLogin:success', {
          onboardingDone: user.hasCompletedOnboarding,
          pendingSync: Boolean(pendingOnboardingRef.current),
          showTrialWelcome,
        });
        return showTrialWelcome;
      } catch (error) {
        authError('verifyEmailOtpAndLogin:failed', error);
        throw error;
      }
    },
    [finishAuthAfterSync],
  );

  const loginAsGuest = useCallback(async () => {
    authLog('loginAsGuest:context_start');
    const { user } = await loginAsGuestUser();
    await finishAuthAfterSync(user);
  }, [finishAuthAfterSync]);

  const updateProfile = useCallback(
    async (name: string, phone: string) => {
      const user = await updateUserProfile({ name, phone });
      applyUserProfile(user);
    },
    [applyUserProfile],
  );

  const logout = useCallback(async () => {
    await syncPushTokenToServer(false);
    await logoutSession();
    setIsLoggedIn(false);
    setIsGuestUser(false);
    setUserName('');
    setUserPhone('');
    setUserEmail('');
    setPantryIngredients([...DEFAULT_PANTRY]);
    setSavedRecipeIds([]);
    applyPlanState(DEFAULT_PLAN);
    clearSentryUser();
  }, [applyPlanState, syncPushTokenToServer]);

  const resetAppFlow = useCallback(async () => {
    await syncPushTokenToServer(false);
    await logoutSession();
    await clearAuthState();
    pendingOnboardingRef.current = null;
    setHasCompletedOnboarding(false);
    setIsLoggedIn(false);
    setIsGuestUser(false);
    setUserName('');
    setUserPhone('');
    setUserEmail('');
    setDietChoiceState('Veg');
    setRegionalCuisine('All India');
    setFavoriteCuisines([]);
    setNotificationsEnabledState(false);
    setPantryFilterActive(false);
    void setPendingTrialWelcome(false);
    setPantryIngredients([...DEFAULT_PANTRY]);
    setSavedRecipeIds([]);
    setPlanState(DEFAULT_PLAN);
    await syncDailyReminder(false);
    clearSentryUser();
  }, [syncPushTokenToServer]);

  const setDietChoice = useCallback(
    async (choice: DietChoice) => {
      const preference = dietChoiceToFilter(choice);
      setDietChoiceState(choice);
      if (isLoggedIn) {
        const user = await updateUserProfile({ dietChoice: choice, dietPreference: preference });
        applyUserProfile(user);
      }
    },
    [applyUserProfile, isLoggedIn],
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
    async (enabled: boolean) => {
      const wasEnabled = notificationsEnabled;
      const scheduled = enabled ? await syncDailyReminder(true) : await syncDailyReminder(false);
      setNotificationsEnabledState(scheduled);
      if (isLoggedIn) {
        const user = await updateUserProfile({ notificationsEnabled: scheduled });
        applyUserProfile(user);
        await syncPushTokenToServer(scheduled);
      }
      if (scheduled && !wasEnabled) {
        await sendDailyReminderThankYouNotification();
      }
    },
    [applyUserProfile, isLoggedIn, notificationsEnabled, syncPushTokenToServer],
  );

  const isGuest = isGuestUser || ((userName === 'Guest' || userName.length === 0) && userPhone.length === 0);

  const togglePantryIngredient = useCallback(
    (ingredient: string) => {
      setPantryIngredients((current) => {
        const next = current.includes(ingredient)
          ? current.filter((item) => item !== ingredient)
          : [...current, ingredient];
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
      ...resolvedPlan,
      isHydrated,
      hasCompletedOnboarding,
      isLoggedIn,
      isGuest,
      userName,
      userPhone,
      userEmail,
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
      verifyEmailOtpAndLogin,
      loginAsGuest,
      updateProfile,
      logout,
      resetAppFlow,
      togglePantryIngredient,
      setDietChoice,
      setRegionalCuisine: setRegionalCuisineState,
      setFavoriteCuisines: setFavoriteCuisinesState,
      setNotificationsEnabled,
      toggleSavedRecipe,
      isRecipeSaved,
      setPantryFilterActive,
      getSavedRecipes,
      startTrial,
      upgradeToPaid,
      restorePurchases,
      refreshPlan,
      pendingTrialWelcome,
      dismissTrialWelcome,
    }),
    [
      resolvedPlan,
      isHydrated,
      hasCompletedOnboarding,
      isLoggedIn,
      isGuest,
      userName,
      userPhone,
      userEmail,
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
      verifyEmailOtpAndLogin,
      loginAsGuest,
      updateProfile,
      logout,
      resetAppFlow,
      togglePantryIngredient,
      setDietChoice,
      setRegionalCuisineState,
      setFavoriteCuisinesState,
      setNotificationsEnabled,
      toggleSavedRecipe,
      isRecipeSaved,
      getSavedRecipes,
      startTrial,
      upgradeToPaid,
      restorePurchases,
      refreshPlan,
      pendingTrialWelcome,
      dismissTrialWelcome,
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
