'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setUser, DEFAULT_PRO_USER, DEFAULT_CP_USER } from '@/store/slices/authSlice';
import { ShieldAlert, ArrowRight, Lock } from 'lucide-react';

interface PortalGuardProps {
  portal: 'PRO' | 'CP';
  children: React.ReactNode;
}

export function isProRole(roleName?: string): boolean {
  if (!roleName) return false;
  const proRoles = ['SUPER_ADMIN', 'SALES_MANAGER', 'SALES_AGENT', 'SALES_EXECUTIVE', 'PRO_USER', 'ADMIN'];
  return proRoles.includes(roleName.toUpperCase());
}

export function isCpRole(roleName?: string): boolean {
  if (!roleName) return false;
  const cpRoles = ['SUPER_ADMIN', 'CHANNEL_PARTNER', 'CP_ADMIN', 'CP_AGENT', 'BROKER'];
  return cpRoles.includes(roleName.toUpperCase());
}

export function PortalGuard({ portal, children }: PortalGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [authorized, setAuthorized] = useState<boolean>(true);

  useEffect(() => {
    let currentUser = user;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pro_cp_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (!currentUser || currentUser.email !== parsed.email) {
            currentUser = parsed;
            dispatch(setUser(parsed));
          }
        } catch {
          // ignore
        }
      } else {
        // Fallback default for instant preview in development:
        if (portal === 'PRO' && (!currentUser || isCpRole(currentUser?.role?.name))) {
          currentUser = DEFAULT_PRO_USER;
          dispatch(setUser(DEFAULT_PRO_USER));
        } else if (portal === 'CP' && (!currentUser || isProRole(currentUser?.role?.name))) {
          currentUser = DEFAULT_CP_USER;
          dispatch(setUser(DEFAULT_CP_USER));
        }
      }
    }

    const roleName = currentUser?.role?.name || '';
    const isSuper = roleName.toUpperCase() === 'SUPER_ADMIN';

    if (portal === 'PRO') {
      const allowed = isSuper || isProRole(roleName);
      setAuthorized(allowed);
      if (!allowed) {
        console.warn(`[RBAC] Access denied to PRO portal for role: ${roleName}`);
      }
    } else if (portal === 'CP') {
      const allowed = isSuper || isCpRole(roleName);
      setAuthorized(allowed);
      if (!allowed) {
        console.warn(`[RBAC] Access denied to CP portal for role: ${roleName}`);
      }
    }
  }, [user, portal, dispatch]);

  // Strict RBAC Access Denied Screen
  if (authorized === false) {
    const targetPortal = portal === 'PRO' ? 'Pro Real Estate CRM' : 'Channel Partner (CP) Desk';
    const legitimatePortal = portal === 'PRO' ? '/cp/dashboard' : '/pro/dashboard';
    const legitimatePortalName = portal === 'PRO' ? 'CP Partner Portal' : 'Pro CRM Portal';

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
        <div className="max-w-md w-full bg-white border border-rose-200 rounded-2xl p-8 text-center shadow-lg">
          <div className="w-14 h-14 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Lock className="w-7 h-7" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldAlert className="w-3.5 h-3.5" />
            403 RBAC Isolation
          </div>

          <h1 className="text-xl font-bold text-[#0f1c3a] mb-2 font-serif">Restricted Operational Zone</h1>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            Your role <code className="text-rose-700 font-mono font-semibold bg-rose-50 px-1.5 py-0.5 rounded">({user?.role?.displayName || user?.role?.name})</code> is not authorized to access the <strong className="text-[#0f1c3a]">{targetPortal}</strong>.
          </p>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left text-xs text-slate-600 mb-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Authenticated:</span>
              <span className="text-[#0f1c3a] font-semibold">{user?.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Attempted Boundary:</span>
              <span className="text-amber-800 font-semibold">{portal} Isolated Zone</span>
            </div>
          </div>

          <button
            onClick={() => router.push(legitimatePortal)}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0f1c3a] hover:bg-[#16264d] text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
          >
            <span>Go to Authorized {legitimatePortalName}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default PortalGuard;
