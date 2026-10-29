import { Image, Text, View } from 'react-native';

import { authStyles } from '@/components/auth/authStyles';
import { DIET_CHOICE_LABELS, DietChoice } from '@/constants/theme';
import { getDietPreferenceOption } from '@/constants/dietOptions';
import { getKitchenStyleLabel, type KitchenStyle } from '@/utils/kitchenStyles';

function formatPreferencesSummary(
  dietChoice: DietChoice,
  regionalCuisine: string,
  favoriteCuisines: string[],
  kitchenStyles: KitchenStyle[],
): string {
  const cuisineLabels = favoriteCuisines
    .map((id) => getKitchenStyleLabel(id, kitchenStyles))
    .filter(Boolean);

  const cuisineText =
    cuisineLabels.length > 0 ? cuisineLabels.join(', ') : regionalCuisine;

  return `${DIET_CHOICE_LABELS[dietChoice]} · ${cuisineText}`;
}

export default function PreferencesSummaryCard({
  dietChoice,
  regionalCuisine,
  favoriteCuisines,
  kitchenStyles,
}: {
  dietChoice: DietChoice;
  regionalCuisine: string;
  favoriteCuisines: string[];
  kitchenStyles: KitchenStyle[];
}) {
  const dietOption = getDietPreferenceOption(dietChoice);
  const DietIcon = dietOption.icon;
  const leadCuisine = favoriteCuisines[0]
    ? kitchenStyles?.find((item) => item.id === favoriteCuisines[0])
    : null;

  return (
    <View style={authStyles.summaryCard}>
      <Text style={authStyles.summaryLabel}>Your preferences</Text>
      <View style={authStyles.summaryRow}>
        <View style={[authStyles.summaryDietIcon, { backgroundColor: dietOption.iconBg }]}>
          <DietIcon size={20} color={dietOption.iconColor} />
        </View>
        {leadCuisine && (
          <Image source={{ uri: leadCuisine.heroImage }} style={authStyles.summaryCuisineImage} />
        )}
        <Text style={authStyles.summaryValue}>
          {formatPreferencesSummary(
            dietChoice,
            regionalCuisine,
            favoriteCuisines,
            kitchenStyles ?? [],
          )}
        </Text>
      </View>
    </View>
  );
}
