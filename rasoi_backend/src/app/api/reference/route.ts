import { jsonOk, handleApiError } from '@/lib/api';
import { getActiveKitchenStyles } from '@/lib/kitchen-styles';
import { getActivePantrySections, getActiveRegionalCuisines } from '@/lib/reference-data';

export async function GET() {
  try {
    const [kitchenStyles, regionalCuisines, pantrySections] = await Promise.all([
      getActiveKitchenStyles(),
      getActiveRegionalCuisines(),
      getActivePantrySections(),
    ]);

    return jsonOk({
      regionalCuisines,
      pantrySections: pantrySections.map((section) => ({
        title: section.title,
        items: [...section.items],
      })),
      kitchenStyles: kitchenStyles.map((style) => ({
        id: style.id,
        label: style.label,
        tagline: style.tagline,
        mood: style.mood,
        region: style.region,
        heroImage: style.heroImage,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
