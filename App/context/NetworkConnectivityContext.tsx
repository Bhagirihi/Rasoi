import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type NetworkConnectivityValue = {
  /** Device reports no usable network (NetInfo) or QA forced offline. */
  isOffline: boolean;
  /** Raw NetInfo: interface connected (may still lack internet). */
  isConnected: boolean | null;
  /** Raw NetInfo: internet reachable (null while unknown). */
  isInternetReachable: boolean | null;
  /** Dev/QA toggle that blocks API calls without Airplane Mode. */
  qaForceOffline: boolean;
  setQaForceOffline: (forced: boolean) => void;
  toggleQaForceOffline: () => boolean;
};

const NetworkConnectivityContext = createContext<NetworkConnectivityValue | null>(null);

/** Module mirror so apiFetch can fail closed without React context. */
let qaForceOfflineFlag = false;

export function isQaForceOffline(): boolean {
  return qaForceOfflineFlag;
}

function isNetInfoOffline(state: NetInfoState): boolean {
  if (state.isConnected === false) return true;
  if (state.isInternetReachable === false) return true;
  if (state.type === 'none') return true;
  return false;
}

export function NetworkConnectivityProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(null);
  const [netOffline, setNetOffline] = useState(false);
  const [qaForceOffline, setQaForceOfflineState] = useState(qaForceOfflineFlag);

  const setQaForceOffline = useCallback((forced: boolean) => {
    qaForceOfflineFlag = forced;
    setQaForceOfflineState(forced);
  }, []);

  const toggleQaForceOffline = useCallback(() => {
    const next = !qaForceOfflineFlag;
    qaForceOfflineFlag = next;
    setQaForceOfflineState(next);
    return next;
  }, []);

  useEffect(() => {
    const apply = (state: NetInfoState) => {
      setIsConnected(state.isConnected);
      setIsInternetReachable(state.isInternetReachable);
      setNetOffline(isNetInfoOffline(state));
    };

    const unsubscribe = NetInfo.addEventListener(apply);
    void NetInfo.fetch().then(apply).catch(() => undefined);

    return unsubscribe;
  }, []);

  const value = useMemo<NetworkConnectivityValue>(
    () => ({
      isOffline: netOffline || qaForceOffline,
      isConnected,
      isInternetReachable,
      qaForceOffline,
      setQaForceOffline,
      toggleQaForceOffline,
    }),
    [
      netOffline,
      qaForceOffline,
      isConnected,
      isInternetReachable,
      setQaForceOffline,
      toggleQaForceOffline,
    ],
  );

  return (
    <NetworkConnectivityContext.Provider value={value}>
      {children}
    </NetworkConnectivityContext.Provider>
  );
}

export function useNetworkConnectivity(): NetworkConnectivityValue {
  const ctx = useContext(NetworkConnectivityContext);
  if (!ctx) {
    throw new Error('useNetworkConnectivity must be used within NetworkConnectivityProvider');
  }
  return ctx;
}
