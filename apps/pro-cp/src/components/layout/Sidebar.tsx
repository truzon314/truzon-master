'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  Target,
  Users,
  Calendar,
  ShoppingBag,
  CreditCard,
  FileCheck,
  BarChart3,
  ShieldCheck,
  Award,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Building2,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  portal: 'PRO' | 'CP';
}

interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

export function Sidebar({ isOpen, onToggle, portal }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const isPro = portal === 'PRO';

  const proNavSections: Array<{ title: string; items: NavItem[] }> = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Pipeline Dashboard', href: '/pro/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'SALES & CRM OPERATIONS',
      items: [
        { label: 'Leads Pipeline', href: '/pro/leads', icon: Target, badge: 'Active' },
        { label: 'Site Walkthroughs', href: '/pro/site-visits', icon: Calendar },
        { label: 'Buyer Accounts', href: '/pro/customers', icon: Users },
        { label: 'Unit Bookings', href: '/pro/bookings', icon: ShoppingBag },
        { label: 'Payment Ledger', href: '/pro/payments', icon: CreditCard },
        { label: 'ATS Agreements', href: '/pro/agreements', icon: FileCheck },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { label: 'Executive Reports', href: '/pro/reports', icon: BarChart3 },
      ],
    },
  ];

  const cpNavSections: Array<{ title: string; items: NavItem[] }> = [
    {
      title: 'PARTNER DESK',
      items: [
        { label: 'Partner Overview', href: '/cp/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'CLIENT SOURCING',
      items: [
        { label: '60-Day Lead Protection', href: '/cp/register-lead', icon: ShieldCheck, badge: 'Secure', badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
        { label: 'My Protected Clients', href: '/cp/my-leads', icon: Users },
        { label: 'Book VIP Site Tour', href: '/cp/site-visits', icon: Calendar },
      ],
    },
    {
      title: 'COMMISSIONS & ASSETS',
      items: [
        { label: 'Sourced Bookings', href: '/cp/my-bookings', icon: ShoppingBag },
        { label: 'Commission Ledger', href: '/cp/commissions', icon: CreditCard },
        { label: 'Marketing Sales Kit', href: '/cp/documents', icon: FileText },
        { label: 'Tier Slabs & Rewards', href: '/cp/tier-status', icon: Award, badge: '3.0%', badgeColor: 'bg-amber-50 text-amber-900 border-amber-200' },
      ],
    },
  ];

  const sections = isPro ? proNavSections : cpNavSections;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onToggle}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={clsx(
          'fixed top-0 bottom-0 left-0 z-40 bg-white border-r border-slate-200/90 flex flex-col transition-all duration-300 shadow-sm',
          isOpen ? 'w-64' : 'w-20',
          !isOpen && 'hidden lg:flex'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200/80 bg-white">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-[#0f1c3a] flex items-center justify-center text-white font-serif font-bold text-lg shadow-sm shrink-0">
              T
            </div>
            {isOpen && (
              <div className="flex flex-col">
                <span className="font-serif font-bold text-base text-[#0f1c3a] tracking-tight leading-tight">
                  TRUZON
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-[#c2941f] uppercase">
                  {isPro ? 'PRO REALTY CRM' : 'BROKER PARTNER DESK'}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggle}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {isOpen && (
                <h4 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {section.title}
                </h4>
              )}

              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={clsx(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative',
                        isActive
                          ? 'bg-amber-50/80 text-[#0f1c3a] font-semibold border-l-3 border-[#c2941f] shadow-xs'
                          : 'text-slate-600 hover:text-[#0f1c3a] hover:bg-slate-50'
                      )}
                      title={!isOpen ? item.label : undefined}
                    >
                      <item.icon
                        className={clsx(
                          'h-4 w-4 shrink-0 transition-colors',
                          isActive ? 'text-[#c2941f]' : 'text-slate-400 group-hover:text-slate-700'
                        )}
                      />

                      {isOpen && (
                        <span className="truncate flex-1">{item.label}</span>
                      )}

                      {isOpen && item.badge && (
                        <span
                          className={clsx(
                            'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                            item.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Tooltip for collapsed mode */}
                      {!isOpen && (
                        <div className="absolute left-full ml-2 px-2.5 py-1 bg-[#0f1c3a] text-white text-xs rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Area: Switch Persona in Dev */}
        <div className="p-3 border-t border-slate-200/80 bg-slate-50/70">
          {isOpen ? (
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                    isPro ? 'bg-[#0f1c3a]' : 'bg-[#c2941f]'
                  }`}
                >
                  {user?.fullName?.charAt(0) || (isPro ? 'A' : 'R')}
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-[#0f1c3a] truncate">
                    {user?.fullName || (isPro ? 'Arjun Verma' : 'Rajesh Nair')}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {isPro ? 'Senior Sales Exec' : 'Square Yards Global'}
                  </p>
                </div>
              </div>

              <Link
                href={isPro ? '/cp/dashboard' : '/pro/dashboard'}
                className="p-1.5 text-slate-400 hover:text-[#c2941f] hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                title={isPro ? 'Switch to Channel Partner Desk' : 'Switch to Pro CRM'}
              >
                <Sparkles className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="flex justify-center">
              <Link
                href={isPro ? '/cp/dashboard' : '/pro/dashboard'}
                className="p-2 text-slate-400 hover:text-[#c2941f] rounded-lg"
                title="Switch Portal"
              >
                <Sparkles className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;