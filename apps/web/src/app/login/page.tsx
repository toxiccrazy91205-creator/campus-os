'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthActions } from '@/lib/auth-context';
import { useAuthStore } from '@/lib/auth-store';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/Toast';

interface DevAccount {
  email: string;
  label: string;
  description: string;
}

const DEV_ACCOUNTS: DevAccount[] = [
  {
    email: 'principal@demo.campusos.dev',
    label: 'School Admin',
    description: 'Full access within Demo Charter School',
  },
  {
    email: 'teacher@demo.campusos.dev',
    label: 'Teacher (James Rivera)',
    description: '6 classes, take attendance',
  },
  {
    email: 'student@demo.campusos.dev',
    label: 'Student (Maya Chen)',
    description: 'View own attendance and schedule',
  },
  {
    email: 'parent@demo.campusos.dev',
    label: 'Parent (David Chen)',
    description: "Maya Chen's father",
  },
  {
    email: 'vp@demo.campusos.dev',
    label: 'Vice Principal (Linda Park)',
    description: 'School administration and compliance',
  },
  {
    email: 'counsellor@demo.campusos.dev',
    label: 'Counsellor (Marcus Hayes)',
    description: 'Student support and guidance',
  },
];

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const { login } = useAuthActions();
  const status = useAuthStore((s) => s.status);
  const { toast } = useToast();
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') router.replace('/dashboard');
  }, [status, router]);

  const handleLogin = async (email: string) => {
    if (!email) return;
    setBusy(email);
    try {
      await login(email);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      toast(message, 'error');
      setBusy(null);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-campus-700">CampusOS</h1>
          <p className="mt-2 text-sm text-gray-500">
            The School Operating System — sign in to continue
          </p>
        </div>

        <div className="overflow-hidden rounded-card border border-gray-200 bg-white shadow-card">
          <div className="border-b border-gray-100 bg-campus-50 px-5 py-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleLogin(formData.get('email') as string);
              }}
              className="space-y-3"
            >
              <div>
                <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wide text-campus-700">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-campus-500 focus:ring-campus-500"
                />
              </div>
              <button
                type="submit"
                disabled={busy !== null}
                className="w-full rounded-md bg-campus-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-campus-700 focus:outline-none focus:ring-2 focus:ring-campus-500 focus:ring-offset-2 disabled:opacity-60"
              >
                {busy ? <LoadingSpinner size="sm" className="mx-auto" /> : 'Sign In'}
              </button>
            </form>
          </div>

          <div className="bg-gray-50 px-5 py-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Quick Select Accounts
            </p>
          </div>

          <ul className="divide-y divide-gray-100">
            {DEV_ACCOUNTS.map((acc) => {
              const loading = busy === acc.email;
              return (
                <li key={acc.email}>
                  <button
                    type="button"
                    onClick={() => handleLogin(acc.email)}
                    disabled={busy !== null}
                    className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left transition-colors hover:bg-campus-50/40 disabled:opacity-60"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{acc.label}</p>
                      <p className="text-xs text-gray-500">{acc.description}</p>
                      <p className="mt-0.5 font-mono text-[11px] text-gray-400">{acc.email}</p>
                    </div>
                    {loading && <LoadingSpinner size="sm" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Tenant: <span className="font-mono">demo</span>
        </p>
      </div>
    </main>
  );
}
