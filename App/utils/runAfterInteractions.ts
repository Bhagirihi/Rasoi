/**
 * Replacement for React Native's InteractionManager (removed in RN 0.88,
 * Expo SDK 58). The supported replacement is the requestIdleCallback
 * global, with a setTimeout fallback for runtimes without it.
 *
 * The returned handle keeps the old `{ cancel }` shape, so existing
 * cleanups (`task.cancel()`) work unchanged.
 */
type IdleGlobals = {
  requestIdleCallback?: (callback: () => void) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export function runAfterInteractions(fn: () => void): { cancel: () => void } {
  const globals = globalThis as unknown as IdleGlobals;
  if (typeof globals.requestIdleCallback === 'function') {
    const handle = globals.requestIdleCallback(fn);
    return {
      cancel: () => {
        globals.cancelIdleCallback?.(handle);
      },
    };
  }
  const timer = setTimeout(fn, 0);
  return { cancel: () => clearTimeout(timer) };
}
