import { captureException } from '@/utils/sentry';

const PREFIX = '[RasoiAuth]';

export function maskEmail(email: string): string {
  const trimmed = email.trim();
  const at = trimmed.indexOf('@');
  if (at <= 1) return '***';
  return `${trimmed.slice(0, 2)}***${trimmed.slice(at)}`;
}

export function authLog(step: string, details?: Record<string, unknown>): void {
  if (__DEV__) {
    console.log(PREFIX, step, details ?? '');
  }
}

export function authError(step: string, error: unknown, details?: Record<string, unknown>): void {
  const message = error instanceof Error ? error.message : String(error);
  if (__DEV__) {
    console.error(PREFIX, step, { ...details, message, error });
    return;
  }
  // Production: report to Sentry with masked details only — never console.log
  // raw auth internals, and never log response bodies on auth paths.
  try {
    captureException(error instanceof Error ? error : new Error(message), {
      area: 'auth',
      step,
      ...(details ?? {}),
    });
  } catch {
    // Monitoring must never break auth.
  }
}
