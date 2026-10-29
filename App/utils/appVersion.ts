import Constants from 'expo-constants';

/** Expo marketing version from app.json (e.g. 1.0.13). */
export function getAppVersionLabel(): string {
  return Constants.expoConfig?.version ?? '0.0.0';
}

function parseSemverParts(version: string): number[] {
  return version
    .trim()
    .replace(/^v/i, '')
    .split(/[.+-]/)
    .map((part) => Number.parseInt(part, 10))
    .map((part) => (Number.isFinite(part) ? part : 0));
}

export function compareSemver(left: string, right: string): number {
  const a = parseSemverParts(left);
  const b = parseSemverParts(right);
  const length = Math.max(a.length, b.length);

  for (let index = 0; index < length; index += 1) {
    const delta = (a[index] ?? 0) - (b[index] ?? 0);
    if (delta !== 0) return delta;
  }

  return 0;
}

/** True when no floor is set, or the installed app is at/above the floor. */
export function meetsMinAppVersion(
  appVersion: string | null | undefined,
  minAppVersion: string | null | undefined,
): boolean {
  if (!minAppVersion?.trim()) return true;
  if (!appVersion?.trim()) return false;
  return compareSemver(appVersion, minAppVersion) >= 0;
}

/**
 * Global payments kill switch + optional min version floor.
 * Older builds stay in early access when a floor is set.
 */
export function resolveEffectivePaymentsEnabled(options: {
  paymentsEnabled: boolean;
  paymentsMinAppVersion?: string | null;
  appVersion?: string | null;
}): boolean {
  if (!options.paymentsEnabled) return false;
  return meetsMinAppVersion(
    options.appVersion ?? getAppVersionLabel(),
    options.paymentsMinAppVersion,
  );
}
