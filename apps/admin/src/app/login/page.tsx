'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { useLoginMutation } from '@/lib/api-hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { clsx } from 'clsx';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [login, { isLoading }] = useLoginMutation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const result = await login(formData).unwrap();
      dispatch(setCredentials({
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      }));
      router.push('/dashboard');
    } catch (err: any) {
      // Demo credentials fallback when API server is offline
      if (
        formData.email.trim() === 'admin@truzonhomes.com' &&
        formData.password === 'TruzonCMS@143'
      ) {
        dispatch(setCredentials({
          user: {
            id: 'admin-super',
            email: 'admin@truzonhomes.com',
            fullName: 'Super Admin',
            role: {
              id: 'role-super-admin',
              name: 'SUPER_ADMIN',
              displayName: 'Super Admin',
              permissions: [{ key: '*' }],
            },
            status: 'ACTIVE',
            emailVerified: true,
            phoneVerified: true,
          },
          accessToken: 'demo-admin-access-token',
          refreshToken: 'demo-admin-refresh-token',
        }));
        router.push('/dashboard');
        return;
      }
      setError(err.data?.error?.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center p-2 shadow-md ring-1 ring-slate-800">
              <Image
                src="/images/favicon.png"
                alt="Truzon Logo"
                width={40}
                height={40}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div className="flex items-center gap-1.5 text-left">
              <span className="text-2xl font-bold text-gray-900 tracking-tight">Truzon</span>
              <span className="rounded-md border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-xs font-bold text-amber-600 tracking-wider">
                ADMIN
              </span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-gray-600">Enter your credentials to access the dashboard</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@truzonhomes.com"
                  required
                  autoComplete="email"
                />
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" loading={isLoading} size="lg">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Admin: <code className="text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded text-xs">admin@truzonhomes.com</code> / <code className="text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded text-xs font-semibold">TruzonCMS@143</code>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}