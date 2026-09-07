'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Bell, Search, Menu, LogOut, Shield, ChevronDown, User, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface HeaderProps {
  onMenuClick: () => void;
  portal: 'PRO' | 'CP';
}

export function Header({ onMenuClick, portal }: HeaderProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const isPro = portal === 'PRO';

  return (
    <header className="fixed top-0 right-0 left-0 z-30 h-16 bg-white border-b border-slate-200/90 shadow-sm">
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0f1c3a] flex items-center justify-center text-white font-serif font-bold text-base shadow-sm">
                T
              </div>
              <span className="font-serif font-bold text-base text-[#0f1c3a] tracking-tight hidden sm:inline">
                TRUZON
              </span>
            </div>

            <span className="h-4 w-px bg-slate-200 hidden sm:inline" />

            <Badge variant={isPro ? 'navy' : 'gold'} size="sm" dot>
              {isPro ? 'PRO SALES CRM' : 'CHANNEL PARTNER DESK'}
            </Badge>
          </div>
        </div>

        {/* Center - Global Search */}
        <div className="hidden md:block flex-1 max-w-md mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="search"
              placeholder={isPro ? 'Search leads, buyer accounts, bookings...' : 'Search protected clients, vouchers, documents...'}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-[#0f1c3a]/15 focus:bg-white focus:border-[#0f1c3a]"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 relative transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#c2941f] rounded-full ring-2 ring-white" />
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${
                  isPro ? 'bg-[#0f1c3a]' : 'bg-[#c2941f]'
                }`}
              >
                {user?.fullName?.charAt(0) || 'U'}
              </div>

              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-[#0f1c3a] leading-tight">
                  {user?.fullName || (isPro ? 'Arjun Verma' : 'Rajesh Nair')}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {user?.role?.displayName || (isPro ? 'Sales Executive' : 'Square Yards Global')}
                </div>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;