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
    shopModalVisible,
    setShopModalVisible,
    dismiss,
    handleCheckPantry,
    handleOrderMissing,
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
          missingItems={missingItems}
          onDismiss={() => void dismiss()}
          onCheckPantry={() => void handleCheckPantry()}
          onOrderMissing={() => void handleOrderMissing()}
        />
      ) : null}

      <AffiliateCheckoutModal
        visible={shopModalVisible}
        onClose={() => setShopModalVisible(false)}
        missingIngredients={missingItems}
        variant="pantry"
      />
    </>
  );
}
