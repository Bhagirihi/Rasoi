import { jsonError } from '@/lib/api';

/** Legacy phone login without OTP — disabled for security. Use email OTP via Supabase. */
export async function POST() {
  return jsonError(
    'Phone-only login is no longer supported. Sign in with your email and one-time code.',
    410,
  );
}
