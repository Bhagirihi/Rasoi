'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { RASOI_REALTIME_SCHEMA } from '@/lib/realtime-tables';
import { createClient } from '@/utils/supabase/client';

/** Debounce burst events, then enforce a minimum gap between full page refreshes. */
const REFRESH_DEBOUNCE_MS = 600;
const MIN_REFRESH_INTERVAL_MS = 8_000;

/** Tables that should not trigger admin reloads (high churn from mobile / cron). */
const IGNORED_REALTIME_TABLES = new Set([
  'PushToken',
  'AffiliateEvent',
  'MealNotificationLog',
]);

/**
 * Subscribes to Postgres changes in the `rasoi` schema via Supabase Realtime
 * and refreshes server-rendered admin data when rows change.
 */
export default function RealtimeRefresh() {
  const router = useRouter();
  const pathname = usePathname();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRefreshAtRef = useRef(0);
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
      return;
    }

    const supabase = createClient();
    const scheduleRefresh = (table?: string) => {
      if (table && IGNORED_REALTIME_TABLES.has(table)) {
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        const currentPath = pathnameRef.current ?? '';
        // Avoid resetting unsaved edits on recipe edit forms.
        if (/^\/admin\/recipes\/[^/]+$/.test(currentPath) && currentPath !== '/admin/recipes/new') {
          return;
        }

        const now = Date.now();
        if (now - lastRefreshAtRef.current < MIN_REFRESH_INTERVAL_MS) {
          return;
        }
        lastRefreshAtRef.current = now;
        router.refresh();
      }, REFRESH_DEBOUNCE_MS);
    };

    const channel = supabase
      .channel('rasoi-admin-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: RASOI_REALTIME_SCHEMA,
        },
        (payload: { table?: string }) => {
          scheduleRefresh(payload.table);
        },
      )
      .subscribe((status, error) => {
        if (status === 'CHANNEL_ERROR') {
          console.error('[RealtimeRefresh] subscription error', error);
        }
      });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
