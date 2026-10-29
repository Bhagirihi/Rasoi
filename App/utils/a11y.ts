import { MIN_TOUCH_TARGET } from '@/constants/designSystem';
import type { AccessibilityRole, AccessibilityState } from 'react-native';

export function minHitSlop(size: number) {
  const extra = Math.max(0, Math.ceil((MIN_TOUCH_TARGET - size) / 2));
  return { top: extra, bottom: extra, left: extra, right: extra };
}

export function a11yButton(label: string, hint?: string) {
  return {
    accessible: true,
    accessibilityRole: 'button' as AccessibilityRole,
    accessibilityLabel: label,
    ...(hint ? { accessibilityHint: hint } : {}),
  };
}

export function a11yHeader(label: string) {
  return {
    accessible: true,
    accessibilityRole: 'header' as AccessibilityRole,
    accessibilityLabel: label,
  };
}

export function a11ySelected(isSelected: boolean): AccessibilityState {
  return { selected: isSelected };
}

export function a11yDisabled(isDisabled: boolean): AccessibilityState {
  return { disabled: isDisabled };
}
