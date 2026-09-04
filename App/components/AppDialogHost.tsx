import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import SmoothModal from '@/components/ui/SmoothModal';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { testIds } from '@/constants/testIds';
import {
  useAppDialog,
  type AppDialogButton,
  type AppDialogButtonStyle,
  type AppDialogOptions,
} from '@/context/AppDialogContext';

export default function AppDialogHost() {
  const { dialog, hideDialog } = useAppDialog();
  const [content, setContent] = useState<AppDialogOptions | null>(null);

  useEffect(() => {
    if (dialog) {
      setContent(dialog);
    }
  }, [dialog]);

  if (!content) {
    return null;
  }

  const handlePress = (button: AppDialogButton) => {
    void Haptics.selectionAsync();
    hideDialog();
    button.onPress?.();
  };

  const buttons = content.buttons ?? [{ text: 'OK', style: 'default' as const }];
  const cancelButtons = buttons.filter((b) => b.style === 'cancel');
  const actionButtons = buttons.filter((b) => b.style !== 'cancel');
  const orderedButtons =
    cancelButtons.length > 0 && actionButtons.length > 0
      ? [...cancelButtons, ...actionButtons]
      : buttons;

  return (
    <SmoothModal
      visible={Boolean(dialog)}
      onClose={hideDialog}
      variant="center"
      dismissOnBackdrop={buttons.some((b) => b.style === 'cancel') || buttons.length === 1}
    >
      <View style={styles.card}>
        <Text style={styles.title}>{content.title}</Text>
        {content.message ? <Text style={styles.message}>{content.message}</Text> : null}

        <View style={[styles.actions, orderedButtons.length > 1 && styles.actionsRow]}>
          {orderedButtons.map((button, index) => (
            <Pressable
              key={`${button.text}-${index}`}
              testID={
                button.testID ??
                (content.title === 'Log out?' && button.style === 'destructive'
                  ? testIds.settingsLogoutConfirm
                  : content.title === 'Delete guest session?' && button.text === 'Delete'
                    ? testIds.settingsDeleteConfirm
                    : undefined)
              }
              onPress={() => handlePress(button)}
              style={({ pressed }) => [
                styles.button,
                orderedButtons.length > 1 && styles.buttonHalf,
                buttonStyle(button.style),
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={[styles.buttonText, buttonTextStyle(button.style)]}>{button.text}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SmoothModal>
  );
}

function buttonStyle(style: AppDialogButtonStyle | undefined) {
  if (style === 'destructive') {
    return styles.buttonDestructive;
  }
  if (style === 'cancel') {
    return styles.buttonCancel;
  }
  return styles.buttonPrimary;
}

function buttonTextStyle(style: AppDialogButtonStyle | undefined) {
  if (style === 'destructive') {
    return styles.buttonTextDestructive;
  }
  if (style === 'cancel') {
    return styles.buttonTextCancel;
  }
  return styles.buttonTextPrimary;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    padding: spacing.xl,
    ...shadows.cardLifted,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.charcoal,
    textAlign: 'center',
  },
  message: {
    marginTop: spacing.sm,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
    textAlign: 'center',
  },
  actions: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  actionsRow: {
    flexDirection: 'row',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    paddingVertical: 13,
    paddingHorizontal: spacing.lg,
  },
  buttonHalf: {
    flex: 1,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonCancel: {
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonDestructive: {
    backgroundColor: 'rgba(229,57,53,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(229,57,53,0.25)',
  },
  buttonPressed: {
    opacity: 0.88,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '800',
  },
  buttonTextPrimary: {
    color: colors.white,
  },
  buttonTextCancel: {
    color: colors.charcoal,
  },
  buttonTextDestructive: {
    color: colors.danger,
  },
});
