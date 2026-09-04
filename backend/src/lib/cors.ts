const DEFAULT_ORIGINS = [
  'https://rasoiapplication.in',
  'https://www.rasoiapplication.in',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

function allowedOrigins(): string[] {
  const extra = process.env.API_CORS_ORIGINS?.split(',').map((value) => value.trim()).filter(Boolean);
  return extra?.length ? [...DEFAULT_ORIGINS, ...extra] : DEFAULT_ORIGINS;
}

export function resolveCorsOrigin(requestOrigin: string | null): string {
  if (!requestOrigin) return allowedOrigins()[0] ?? '*';
  return allowedOrigins().includes(requestOrigin) ? requestOrigin : allowedOrigins()[0] ?? '*';
}

export function buildCorsHeaders(requestOrigin: string | null): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': resolveCorsOrigin(requestOrigin),
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Rasoi-Guest-Token',
    Vary: 'Origin',
  };
}

export function withCors(response: Response, requestOrigin: string | null): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(buildCorsHeaders(requestOrigin))) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
