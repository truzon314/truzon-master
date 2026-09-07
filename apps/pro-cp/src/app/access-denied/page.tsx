'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { isCpRole } from '@/components/auth/PortalGuard';

export default function AccessDeniedPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isCp = isCpRole(user?.role?.name);
  const targetHome = isCp ? '/cp/dashboard' : '/pro/dashboard';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070b19] p-4">
      <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">403 — Forbidden</h1>
        <p className="text-sm text-slate-400 mb-6">
          Your account does not possess the RBAC clearances to access this portal module. Pro CRM operations and Channel Partner desks are strictly segregated.
        </p>
        <Link
          href={targetHome}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Your Portal</span>
        </Link>
      </div>
    </div>
  );
}
