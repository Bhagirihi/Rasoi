const LOG_PREFIX = '[supabase]';
const MAX_BODY_LOG_CHARS = 2_000;

export function isSupabaseRequestLoggingEnabled(): boolean {
  if (process.env.EXPO_PUBLIC_SUPABASE_DEBUG === '1') {
    return true;
  }
  return __DEV__;
}

function summarizeBody(text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) return '(empty)';

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (Array.isArray(parsed)) {
      return { type: 'array', length: parsed.length, preview: parsed.slice(0, 2) };
    }
    if (parsed && typeof parsed === 'object') {
      const record = parsed as Record<string, unknown>;
      if (Array.isArray(record.data)) {
        return {
          type: 'envelope',
          keys: Object.keys(record),
          dataLength: record.data.length,
          preview: record.data.slice(0, 2),
          error: record.error ?? record.message ?? null,
        };
      }
      return {
        type: 'object',
        keys: Object.keys(record),
        preview: record,
      };
    }
    return parsed;
  } catch {
    return trimmed.length > MAX_BODY_LOG_CHARS
      ? `${trimmed.slice(0, MAX_BODY_LOG_CHARS)}…`
      : trimmed;
  }
}

function logRequest(input: RequestInfo | URL, init?: RequestInit): void {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  const method = init?.method ?? (input instanceof Request ? input.method : 'GET');

  let parsedUrl: URL | null = null;
  try {
    parsedUrl = new URL(url);
  } catch {
    parsedUrl = null;
  }

  console.log(`${LOG_PREFIX} → ${method} ${url}`, {
    host: parsedUrl?.host,
    path: parsedUrl?.pathname,
    search: parsedUrl?.search || undefined,
    hasAuth: Boolean(init?.headers && new Headers(init.headers).has('authorization')),
  });
}

async function logResponse(response: Response, startedAt: number): Promise<void> {
  const durationMs = Date.now() - startedAt;
  const clone = response.clone();

  let bodySummary: unknown = '(unread)';
  try {
    const text = await clone.text();
    bodySummary = summarizeBody(text);
  } catch {
    bodySummary = '(failed to read body)';
  }

  const level = response.ok ? 'log' : 'warn';
  console[level](`${LOG_PREFIX} ← ${response.status} ${response.url} (${durationMs}ms)`, {
    ok: response.ok,
    status: response.status,
    body: bodySummary,
  });
}

export function createSupabaseDebugFetch(baseFetch: typeof fetch = fetch): typeof fetch {
  return async (input, init) => {
    if (!isSupabaseRequestLoggingEnabled()) {
      return baseFetch(input, init);
    }

    const startedAt = Date.now();
    logRequest(input, init);

    try {
      const response = await baseFetch(input, init);
      await logResponse(response, startedAt);
      return response;
    } catch (error) {
      console.warn(`${LOG_PREFIX} ✕ request failed (${Date.now() - startedAt}ms)`, error);
      throw error;
    }
  };
}
