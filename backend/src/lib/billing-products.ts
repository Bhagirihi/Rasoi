/** Rasoi Plus store product ids — includes Google Play base-plan suffixes. */

export const RASOI_PLUS_MONTHLY_PRODUCT_ID = 'rasoi_plus_monthly';
export const RASOI_PLUS_YEARLY_PRODUCT_ID = 'rasoi_plus_yearly';
export const RASOI_PLUS_MONTHLY_PLAY_PRODUCT_ID = 'rasoi_plus_monthly:monthly';
export const RASOI_PLUS_YEARLY_PLAY_PRODUCT_ID = 'rasoi_plus_yearly:yearly';

const RASOI_PLUS_PRODUCT_IDS = new Set([
  RASOI_PLUS_MONTHLY_PRODUCT_ID,
  RASOI_PLUS_YEARLY_PRODUCT_ID,
  RASOI_PLUS_MONTHLY_PLAY_PRODUCT_ID,
  RASOI_PLUS_YEARLY_PLAY_PRODUCT_ID,
]);

export function isRasoiPlusProductId(productId: string): boolean {
  return RASOI_PLUS_PRODUCT_IDS.has(productId);
}
