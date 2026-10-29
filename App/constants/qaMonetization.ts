/** Dev-only QA shortcuts for paywall / trial welcome. Set EXPO_PUBLIC_QA_MONETIZATION=1 on release QA builds. */
export const QA_MONETIZATION_UI_ENABLED =
  __DEV__ || process.env.EXPO_PUBLIC_QA_MONETIZATION === '1';

export const QA_MONETIZATION_QUERY = '1';

export function isQaMonetizationPreview(
  qa: string | string[] | undefined,
): boolean {
  if (!QA_MONETIZATION_UI_ENABLED) return false;
  const value = Array.isArray(qa) ? qa[0] : qa;
  return value === QA_MONETIZATION_QUERY;
}
