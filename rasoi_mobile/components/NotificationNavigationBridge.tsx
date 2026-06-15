import { useNotificationNavigation } from '@/hooks/useNotificationNavigation';

/** Wires push/local notification taps to in-app navigation once auth is ready. */
export default function NotificationNavigationBridge() {
  useNotificationNavigation();
  return null;
}
