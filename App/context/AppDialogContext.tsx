import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type AppDialogButtonStyle = 'default' | 'cancel' | 'destructive';

export type AppDialogButton = {
  text: string;
  style?: AppDialogButtonStyle;
  onPress?: () => void;
  testID?: string;
};

export type AppDialogOptions = {
  title: string;
  message?: string;
  buttons?: AppDialogButton[];
};

type AppDialogContextValue = {
  showDialog: (options: AppDialogOptions) => void;
  hideDialog: () => void;
  dialog: AppDialogOptions | null;
};

const AppDialogContext = createContext<AppDialogContextValue | null>(null);

export function AppDialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<AppDialogOptions | null>(null);

  const hideDialog = useCallback(() => {
    setDialog(null);
  }, []);

  const showDialog = useCallback((options: AppDialogOptions) => {
    setDialog({
      ...options,
      buttons:
        options.buttons && options.buttons.length > 0
          ? options.buttons
          : [{ text: 'OK', style: 'default' }],
    });
  }, []);

  const value = useMemo(
    () => ({ showDialog, hideDialog, dialog }),
    [showDialog, hideDialog, dialog],
  );

  return <AppDialogContext.Provider value={value}>{children}</AppDialogContext.Provider>;
}

export function useAppDialog() {
  const ctx = useContext(AppDialogContext);
  if (!ctx) {
    throw new Error('useAppDialog must be used within AppDialogProvider');
  }
  return ctx;
}
