const DISPOSABLE_EMAIL_DOMAINS = new Set([
  '10minutemail.com',
  '10minutemail.net',
  'dispostable.com',
  'dropmail.me',
  'fakeinbox.com',
  'getairmail.com',
  'getnada.com',
  'guerrillamail.com',
  'guerrillamailblock.com',
  'guerrillamail.de',
  'guerrillamail.info',
  'guerrillamail.net',
  'guerrillamail.org',
  'maildrop.cc',
  'mailinator.com',
  'mailinator.net',
  'mailnesia.com',
  'mailtemp.net',
  'mintemail.com',
  'moakt.com',
  'mytemp.email',
  'sharklasers.com',
  'spam4.me',
  'temp-mail.org',
  'tempail.com',
  'tempmail.com',
  'tempmail.net',
  'tempmailo.com',
  'throwaway.email',
  'trashmail.com',
  'trashmail.net',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
]);

const DUMMY_INDIAN_PHONES = new Set([
  '6000000000',
  '6123456789',
  '6666666666',
  '6789012345',
  '6900000000',
  '7000000000',
  '7777777777',
  '7890123456',
  '8000000000',
  '8888888888',
  '8989898989',
  '9000000000',
  '9090909090',
  '9876543210',
  '9898989898',
  '9999999999',
]);

function extractEmailDomain(email: string): string {
  const at = email.lastIndexOf('@');
  if (at <= 0) return '';
  return email.slice(at + 1).trim().toLowerCase();
}

export function isDisposableEmail(email: string): boolean {
  const domain = extractEmailDomain(email.trim().toLowerCase());
  if (!domain) return false;
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) return true;
  for (const blocked of DISPOSABLE_EMAIL_DOMAINS) {
    if (domain.endsWith(`.${blocked}`)) return true;
  }
  return false;
}

function isSequentialDigits(digits: string, ascending: boolean): boolean {
  if (digits.length < 4) return false;
  for (let i = 1; i < digits.length; i += 1) {
    const prev = Number(digits[i - 1]);
    const curr = Number(digits[i]);
    const expected = ascending ? prev + 1 : prev - 1;
    if (curr !== expected) return false;
  }
  return true;
}

function isRepeatingPairPattern(digits: string): boolean {
  if (digits.length !== 10) return false;
  const pair = digits.slice(0, 2);
  for (let i = 2; i < digits.length; i += 2) {
    if (digits.slice(i, i + 2) !== pair) return false;
  }
  return true;
}

export function isDummyIndianPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '').replace(/^91/, '').slice(0, 10);
  if (digits.length !== 10) return false;
  if (DUMMY_INDIAN_PHONES.has(digits)) return true;
  if (/^(\d)\1{9}$/.test(digits)) return true;
  if (isSequentialDigits(digits, true) || isSequentialDigits(digits, false)) return true;
  if (isRepeatingPairPattern(digits)) return true;
  return false;
}

export function getDisposableEmailError(): string {
  return 'Temporary or disposable email addresses are not allowed. Use your regular email.';
}

export function getDummyPhoneError(): string {
  return 'Enter your real mobile number — test or placeholder numbers are not allowed.';
}
