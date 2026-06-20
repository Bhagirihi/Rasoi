import { useEffect, useRef } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';

import { getSupabaseClient, RASOI_REALTIME_SCHEMA, warmSupabaseClient } from '@/utils/supabase';

const REALTIME_DEBOUNCE_MS = 400;
const SHARED_CHANNEL_TOPIC = 'rasoi-mobile:shared';

/** All Postgres tables the app listens to — one websocket instead of many. */
const REALTIME_TABLES = [
  'Recipe',
  'Sponsor',
  'PartnerLink',
  'KitchenStyle',
  'RegionalCuisineOption',
  'PantrySection',
] as const;

type RealtimeListener = () => void;

const tableListeners = new Map<string, Set<RealtimeListener>>();
const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();
let sharedChannel: RealtimeChannel | null = null;
let subscriberCount = 0;

function scheduleTableChange(table: string): void {
  const listeners = tableListeners.get(table);
  if (!listeners || listeners.size === 0) return;

  const existing = debounceTimers.get(table);
  if (existing) {
    clearTimeout(existing);
  }

  debounceTimers.set(
    table,
    setTimeout(() => {
      debounceTimers.delete(table);
      for (const listener of listeners) {
        listener();
      }
    }, REALTIME_DEBOUNCE_MS),
  );
}

function ensureSharedChannel(): void {
  if (sharedChannel) return;

  const supabase = getSupabaseClient();
  if (!supabase) return;

  sharedChannel = supabase.channel(SHARED_CHANNEL_TOPIC);

  for (const table of REALTIME_TABLES) {
    sharedChannel.on(
      'postgres_changes',
      {
        event: '*',
        schema: RASOI_REALTIME_SCHEMA,
        table,
      },
      () => {
        scheduleTableChange(table);
      },
    );
  }

  sharedChannel.subscribe((status, error) => {
    if (status === 'CHANNEL_ERROR') {
      console.warn(`[realtime] shared channel error (${SHARED_CHANNEL_TOPIC})`, error);
    }
  });
}

function subscribeToTables(tables: string[], listener: RealtimeListener): () => void {
  warmSupabaseClient();
  ensureSharedChannel();

  for (const table of tables) {
    if (!tableListeners.has(table)) {
      tableListeners.set(table, new Set());
    }
    tableListeners.get(table)!.add(listener);
  }

  subscriberCount += 1;

  return () => {
    for (const table of tables) {
      const listeners = tableListeners.get(table);
      listeners?.delete(listener);
      if (listeners?.size === 0) {
        tableListeners.delete(table);
      }
    }

    subscriberCount = Math.max(0, subscriberCount - 1);

    if (subscriberCount === 0 && sharedChannel) {
      const supabase = getSupabaseClient();
      void supabase?.removeChannel(sharedChannel);
      sharedChannel = null;

      for (const timer of debounceTimers.values()) {
        clearTimeout(timer);
      }
      debounceTimers.clear();
    }
  };
}

/**
 * Subscribe to Postgres changes in the `rasoi` schema via a shared Realtime channel.
 */
export function useRasoiRealtimeTables(
  tables: string[],
  onChange: () => void,
  _channelSuffix = 'default',
) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const tablesKey = tables.join(',');

  useEffect(() => {
    if (tables.length === 0) return;

    const listener = () => {
      onChangeRef.current();
    };

    return subscribeToTables(tables, listener);
  }, [tablesKey, tables.length]);
}

/** Connect Realtime early during app launch (optional — hooks also lazy-init). */
export function warmRasoiRealtime(): void {
  warmSupabaseClient();
  ensureSharedChannel();
}
