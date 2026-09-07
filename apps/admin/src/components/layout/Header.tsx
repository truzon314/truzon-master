'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { clsx } from 'clsx';
import { Bell, Search, Menu, Sun, Moon, User, LogOut, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { useTheme } from 'next-themes';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const user = useSelector((state: RootState) => state.auth.user);
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed top-0 right-0 left-0 z-30 h-16 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2 lg:hidden">
            <Image
              src="/images/favicon.png"
              alt="Truzon Logo"
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
            />
            <span className="font-bold text-sm text-gray-900 tracking-tight">Truzon Admin</span>
          </div>
        </div>

        {/* Center - Search */}
        <div className="hidden md:block flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-700 font-medium text-sm">
                  {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {user?.fullName}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}