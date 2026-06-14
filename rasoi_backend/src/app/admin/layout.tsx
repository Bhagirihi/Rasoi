import { ToastProvider } from '@/app/admin/_components/Toast';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
