'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import RasoiLogo from '@/app/_components/RasoiLogo';
import { setAdminToken } from '@/app/admin/actions';
import { useToast } from '@/app/admin/_components/Toast';
import { AdminCard, PrimaryButton } from '@/app/admin/_components/ui';

export default function LoginForm() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (!response.ok || !result.ok) {
        toast.error(result.error ?? 'Invalid credentials');
        return;
      }

      await setAdminToken(result.data.token);
      toast.success('Signed in successfully.');
      router.push('/admin');
      router.refresh();
    } catch {
      toast.error('Unable to reach the server');
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    'admin-login-input mt-2 w-full rounded-xl border border-[#d9d0c4] bg-white px-4 py-3 text-sm font-medium text-black outline-none transition focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/25 disabled:opacity-60';

  return (
    <div className="relative z-10 w-full max-w-md">
      <div className="mb-8 text-center">
        <RasoiLogo size="lg" className="mx-auto" priority />
        <h1 className="font-display mt-6 text-4xl font-semibold tracking-tight text-white">
          Rasoi Admin
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#b8b0a6]">
          A private studio for curating recipes, sponsors, and member experiences.
        </p>
      </div>

      <AdminCard className="relative z-10 border-[#3a312a] bg-[#1c1714]/95 p-8 text-admin-cream backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="admin-email" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c9b8a8]">
              Email address
            </label>
            <input
              id="admin-email"
              name="email"
              type="text"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={loading}
              placeholder="you@company.com"
              className={`${inputClassName} !text-black`}
              style={{ color: '#000000', WebkitTextFillColor: '#000000' }}
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="admin-password" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c9b8a8]">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="text-xs font-semibold text-[#c9a227] hover:text-[#e8d5a3]"
              >
                {showPassword ? 'Hide' : 'Show'} password
              </button>
            </div>
            <input
              id="admin-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={loading}
              placeholder="Enter your password"
              className={`${inputClassName} !text-black`}
              style={{ color: '#000000', WebkitTextFillColor: '#000000' }}
            />
          </div>

          <div className="pt-2">
            <PrimaryButton type="submit" disabled={loading} className="w-full">
              {loading ? 'Signing in…' : 'Enter console'}
            </PrimaryButton>
          </div>
        </form>
      </AdminCard>

      <p className="mt-6 text-center text-[11px] uppercase tracking-[0.2em] text-[#8f877d]">
        Authorized personnel only
      </p>
    </div>
  );
}
