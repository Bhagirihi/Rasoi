/** Bump when recommendation logic changes — invalidates stale caches. */
export const RECOMMENDATION_ALGORITHM_VERSION = 'v2';

/** Days to avoid re-showing a recipe that appeared in recommendation history. */
export const RECOMMENDATION_HISTORY_EXCLUDE_DAYS = 7;

/** Days to deprioritize recently viewed recipes. */
export const RECENT_VIEW_EXCLUDE_DAYS = 3;

/** Days to deprioritize recently saved recipes. */
export const RECENT_SAVE_EXCLUDE_DAYS = 5;

/** Days to deprioritize recently cooked recipes. */
export const RECENT_COOKED_EXCLUDE_DAYS = 14;

export const HOME_PICK_COUNT = 4;
