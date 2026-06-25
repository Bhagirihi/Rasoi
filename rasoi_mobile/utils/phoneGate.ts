import { isValidIndianPhone } from '@/utils/storage';

export function hasValidProfilePhone(phone: string | null | undefined): boolean {
  if (!phone?.trim()) return false;
  return isValidIndianPhone(phone);
}

export const PHONE_REQUIRED_FOR_PARTNERS_MESSAGE =
  'Add your 10-digit mobile number before using shop & delivery partners.';

export const PHONE_OPTIONAL_FOR_WEB_CHECKOUT_MESSAGE =
  'Checkout opens in your browser — no phone number required. Add your mobile in Settings for faster in-app partner links.';

export const PHONE_REQUIRED_FOR_DELIVERY_MESSAGE =
  'Add your 10-digit mobile number for food delivery partners.';
