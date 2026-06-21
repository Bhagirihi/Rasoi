import type { PostgrestError } from '@supabase/supabase-js';

export class DbError extends Error {
  readonly code?: string;
  readonly details?: string;
  readonly hint?: string;

  constructor(message: string, error?: PostgrestError) {
    super(message);
    this.name = 'DbError';
    this.code = error?.code;
    this.details = error?.details;
    this.hint = error?.hint;
  }
}

export function throwIfError(error: PostgrestError | null, context?: string): void {
  if (!error) return;
  const prefix = context ? `${context}: ` : '';
  throw new DbError(`${prefix}${error.message}`, error);
}

export function unwrap<T>(data: T | null, error: PostgrestError | null, context?: string): T {
  throwIfError(error, context);
  return data as T;
}
