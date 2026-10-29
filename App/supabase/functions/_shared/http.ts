export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export function ok<T>(data: T, status = 200): Response {
  return jsonResponse({ ok: true, data }, status);
}

export function fail(message: string, status = 400): Response {
  return jsonResponse({ ok: false, error: message }, status);
}
