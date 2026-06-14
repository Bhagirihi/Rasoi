import { redirect } from 'next/navigation';

import LoginForm from '@/app/admin/login/LoginForm';
import { getAdminFromCookies } from '@/lib/auth';

export default async function AdminLoginPage() {
  const admin = await getAdminFromCookies();
  if (admin) redirect('/admin');

  return <LoginForm />;
}
