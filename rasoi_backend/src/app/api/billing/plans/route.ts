import { jsonOk, handleApiError } from '@/lib/api';
import { getAppConfig } from '@/lib/app-settings';
import { getBillingPlansCatalog } from '@/lib/plan-pricing';

/** Public Rasoi Plus pricing + yearly Play offer metadata for the mobile app. */
export async function GET() {
  try {
    const config = await getAppConfig();

    return jsonOk({
      paymentsEnabled: config.paymentsEnabled,
      ...getBillingPlansCatalog(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
