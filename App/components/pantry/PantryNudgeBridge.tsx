import { useCallback } from 'react';

import AffiliateCheckoutModal from '@/components/AffiliateCheckoutModal';
import PantryNudgeModal from '@/components/pantry/PantryNudgeModal';
import { useDismissOnBlur } from '@/hooks/useDismissOnBlur';
import { usePantryDayNudge } from '@/hooks/usePantryDayNudge';

export default function PantryNudgeBridge() {
  const {
    visible,
    activeWindow,
    missingItems,
    focusRecipeTitle,
    shopModalVisible,
    setShopModalVisible,
    dismiss,
    handleCheckPantry,
    handleOrderMissing,
    handleCookTonight,
  } = usePantryDayNudge();

  useDismissOnBlur(useCallback(() => setShopModalVisible(false), [setShopModalVisible]));

  if (!activeWindow && !shopModalVisible) {
    return null;
  }

  return (
    <>
      {activeWindow ? (
        <PantryNudgeModal
          visible={visible}
          window={activeWindow}
          recipeTitle={focusRecipeTitle}
          onDismiss={() => void dismiss()}
          onCheckPantry={() => void handleCheckPantry()}
          onOrderMissing={() => void handleOrderMissing()}
          onCookTonight={() => void handleCookTonight()}
        />
      ) : null}

      <AffiliateCheckoutModal
        visible={shopModalVisible}
        onClose={() => setShopModalVisible(false)}
        recipeTitle={focusRecipeTitle}
        missingIngredients={missingItems}
        variant="pantry"
      />
    </>
  );
}
