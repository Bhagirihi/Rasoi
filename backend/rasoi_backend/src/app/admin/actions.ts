'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function setAdminToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('rasoi_admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminToken() {
  const cookieStore = await cookies();
  cookieStore.delete('rasoi_admin_token');
  redirect('/admin/login');
}
