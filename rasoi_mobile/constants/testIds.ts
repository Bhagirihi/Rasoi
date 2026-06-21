/** Stable IDs for Maestro / adb UI automation on real devices. */
export const testIds = {
  tabHome: 'tab-home',
  tabRecipes: 'tab-recipes',
  tabPantry: 'tab-pantry',
  tabSaved: 'tab-saved',
  tabSettings: 'tab-settings',

  screenHome: 'screen-home',
  screenRecipesTab: 'screen-recipes-tab',
  screenPantry: 'screen-pantry',
  screenSaved: 'screen-saved',
  screenSettings: 'screen-settings',
  screenLogin: 'screen-login',
  screenRegister: 'screen-register',
  screenLegalConsent: 'screen-legal-consent',
  screenOnboarding: 'screen-onboarding',
  screenTrialWelcome: 'screen-trial-welcome',

  legalConsentCheckbox: 'legal-consent-checkbox',
  legalConsentContinue: 'legal-consent-continue',
  screenRecipe: 'screen-recipe',

  loginGuest: 'login-guest',
  guestContinue: 'guest-continue',
  loginSendOtp: 'login-send-otp',
  registerSendOtp: 'register-send-otp',

  onboardingDietVeg: 'onboarding-diet-veg',
  onboardingDietContinue: 'onboarding-diet-continue',
  onboardingCuisineFirst: 'onboarding-cuisine-first',
  onboardingCuisineContinue: 'onboarding-cuisine-continue',
  onboardingSkipNotify: 'onboarding-skip-notify',

  trialContinue: 'trial-continue',

  settingsThemeLight: 'settings-theme-light',
  settingsThemeDark: 'settings-theme-dark',

  recipeCardFirst: 'recipe-card-first',
  recipesSearchInput: 'recipes-search-input',
} as const;
