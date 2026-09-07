'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PortalGuard } from '@/components/auth/PortalGuard';
import { clsx } from 'clsx';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
  portal?: 'PRO' | 'CP';
}

export function DashboardLayout({ children, portal }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  // Deduce portal from route if not explicitly passed
  const activePortal: 'PRO' | 'CP' = portal || (pathname.startsWith('/cp') ? 'CP' : 'PRO');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [pathname]);

  return (
    <PortalGuard portal={activePortal}>
      <div className="min-h-screen bg-[#f8fafc] text-[#0f1c3a] font-sans selection:bg-amber-500/20 selection:text-amber-800">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          portal={activePortal}
        />
        <div className={clsx('transition-all duration-300', sidebarOpen ? 'lg:pl-64' : 'lg:pl-20')}>
          <Header
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            portal={activePortal}
          />
          <main className="pt-16 min-h-screen bg-[#f8fafc]">
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </PortalGuard>
  );
}

export default DashboardLayout;