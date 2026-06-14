import { isValidIndianPhone } from '@/utils/storage';

export function hasValidProfilePhone(phone: string | null | undefined): boolean {
  if (!phone?.trim()) return false;
  return isValidIndianPhone(phone);
}

export const PHONE_REQUIRED_FOR_PARTNERS_MESSAGE =
  'Add your 10-digit mobile number before using shop & delivery partners.';
