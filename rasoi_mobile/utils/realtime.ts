import { useEffect, useId, useRef } from 'react';

import { getSupabaseClient, RASOI_REALTIME_SCHEMA } from '@/utils/supabase';

const REALTIME_DEBOUNCE_MS = 400;

/**
 * Subscribe to Postgres changes in the `rasoi` schema.
 * Each hook instance uses its own channel topic so tab screens can subscribe safely.
 */
export function useRasoiRealtimeTables(
  tables: string[],
  onChange: () => void,
  channelSuffix = 'default',
) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const reactId = useId();
  const tablesKey = tables.join(',');

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase || tables.length === 0) {
      return;
    }

    let timeout: ReturnType<typeof setTimeout> | null = null;
    let active = true;

    const scheduleChange = () => {
      if (!active) return;
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        if (active) {
          onChangeRef.current();
        }
      }, REALTIME_DEBOUNCE_MS);
    };

    const channelTopic = `rasoi-mobile:${channelSuffix}:${tablesKey}:${reactId}`;
    const channel = supabase.channel(channelTopic);

    try {
      for (const table of tables) {
        channel.on(
          'postgres_changes',
          {
            event: '*',
            schema: RASOI_REALTIME_SCHEMA,
            table,
          },
          scheduleChange,
        );
      }

      channel.subscribe((status, error) => {
        if (status === 'CHANNEL_ERROR') {
          console.warn(`[useRasoiRealtimeTables] subscription error (${channelTopic})`, error);
        }
      });
    } catch (error) {
      console.warn(`[useRasoiRealtimeTables] setup failed (${channelTopic})`, error);
    }

    return () => {
      active = false;
      if (timeout) {
        clearTimeout(timeout);
      }
      void supabase.removeChannel(channel);
    };
  }, [channelSuffix, reactId, tablesKey, tables.length]);
}
