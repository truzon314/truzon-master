'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { isCpRole } from '@/components/auth/PortalGuard';

export default function RootGatewayPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check role and redirect to appropriate portal
    if (user?.role?.name) {
      if (isCpRole(user.role.name)) {
        router.replace('/cp/dashboard');
      } else {
        router.replace('/pro/dashboard');
      }
    } else {
      // Default to Pro portal for development preview
      router.replace('/pro/dashboard');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070b19]">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-amber-500 border-t-transparent" />
        <p className="text-xs text-slate-400 font-medium tracking-wide">Routing to authorized portal workspace...</p>
      </div>
    </div>
  );
}