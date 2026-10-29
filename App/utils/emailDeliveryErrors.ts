export const EMAIL_DELIVERY_UNAVAILABLE_MESSAGE =
  'Email delivery is temporarily unavailable. You can keep using Rasoi and verify your email later.';

export class EmailDeliveryUnavailableError extends Error {
  constructor(message = EMAIL_DELIVERY_UNAVAILABLE_MESSAGE) {
    super(message);
    this.name = 'EmailDeliveryUnavailableError';
  }
}

export function isEmailDeliveryUnavailableError(error: unknown): boolean {
  if (error instanceof EmailDeliveryUnavailableError) return true;

  const message =
    error instanceof Error
      ? error.message.toLowerCase()
      : typeof error === 'object' && error && 'message' in error
        ? String((error as { message?: string }).message ?? '').toLowerCase()
        : String(error).toLowerCase();

  return (
    message.includes('magic link') ||
    message.includes('error sending magic link') ||
    message.includes('smtp') ||
    message.includes('badcredentials') ||
    message.includes('email delivery') ||
    message.includes('mail server') ||
    message.includes('unable to send email') ||
    message.includes('email provider')
  );
}

export function mapSupabaseOtpSendError(error: { message?: string; status?: number | null }): Error {
  const message = error.message ?? '';
  const lower = message.toLowerCase();

  if (isEmailDeliveryUnavailableError({ message })) {
    return new EmailDeliveryUnavailableError();
  }
  if (lower.includes('already registered')) {
    return new Error('This email is already registered. Log in instead.');
  }
  if (lower.includes('signups not allowed')) {
    return new Error('No account found for this email. Create an account first.');
  }
  if (lower.includes('rate limit')) {
    return new Error('Too many attempts. Wait a minute and try again.');
  }
  if (lower.includes('invalid') && lower.includes('email')) {
    return new Error('Enter a valid email address.');
  }

  return new Error(message || 'Could not send verification code. Try again.');
}
