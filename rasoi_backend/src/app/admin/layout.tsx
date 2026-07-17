import type { Metadata } from 'next';

import { ToastProvider } from '@/app/admin/_components/Toast';
import { ADMIN_NOINDEX_METADATA } from '@/lib/seo';

export const metadata: Metadata = {
  ...ADMIN_NOINDEX_METADATA,
  title: 'Rasoi Admin',
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
