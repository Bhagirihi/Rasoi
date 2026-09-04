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
  console.error(PREFIX, step, { ...details, message, error });
}
