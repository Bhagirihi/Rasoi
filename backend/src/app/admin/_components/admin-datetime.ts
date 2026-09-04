/** Rasoi admin console always displays timestamps in Indian Standard Time. */
export const ADMIN_TIMEZONE = 'Asia/Kolkata';

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

export function formatAdminDateTime(value: Date | string): string {
  return toDate(value).toLocaleString('en-IN', {
    timeZone: ADMIN_TIMEZONE,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatAdminDate(value: Date | string): string {
  return toDate(value).toLocaleDateString('en-IN', {
    timeZone: ADMIN_TIMEZONE,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatAdminDateTimeMedium(value: Date | string): string {
  return toDate(value).toLocaleString('en-IN', {
    timeZone: ADMIN_TIMEZONE,
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function formatAdminDateShort(value: Date | string): string {
  return toDate(value).toLocaleDateString('en-IN', {
    timeZone: ADMIN_TIMEZONE,
    day: 'numeric',
    month: 'short',
  });
}
