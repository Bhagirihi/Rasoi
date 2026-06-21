const DEV_JWT_SECRET = 'rasoi-dev-secret-change-in-production';

export function isProduction(): boolean {
  // NODE_ENV is the reliable runtime signal. Ignore VERCEL_* copied into .env.local
  // via `vercel env pull` — those reflect remote env names, not local dev mode.
  return process.env.NODE_ENV === 'production';
}

export function getJwtSecretBytes(): Uint8Array {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret || secret === DEV_JWT_SECRET) {
    if (isProduction()) {
      throw new Error('JWT_SECRET must be set to a strong value in production');
    }
    return new TextEncoder().encode(DEV_JWT_SECRET);
  }
  return new TextEncoder().encode(secret);
}

export function isStubBillingAllowed(): boolean {
  if (isProduction()) return process.env.ALLOW_STUB_BILLING === '1';
  return process.env.ALLOW_STUB_BILLING !== '0';
}
