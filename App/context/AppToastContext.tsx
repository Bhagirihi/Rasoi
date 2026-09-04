import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type AppToastContextValue = {
  message: string | null;
  showToast: (message: string) => void;
  hideToast: () => void;
};

const AppToastContext = createContext<AppToastContextValue | null>(null);

const TOAST_DURATION_MS = 3200;

export function AppToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setMessage(null);
  }, []);

  const showToast = useCallback((next: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessage(next);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setMessage(null);
    }, TOAST_DURATION_MS);
  }, []);

  const value = useMemo(
    () => ({ message, showToast, hideToast }),
    [message, showToast, hideToast],
  );

  return <AppToastContext.Provider value={value}>{children}</AppToastContext.Provider>;
}

export function useAppToast() {
  const ctx = useContext(AppToastContext);
  if (!ctx) {
    throw new Error('useAppToast must be used within AppToastProvider');
  }
  return ctx;
}
