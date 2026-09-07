'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  Building2,
  Home,
  MapPin,
  Tag,
  Images,
  Briefcase,
  Quote,
  Globe,
  Menu as MenuIcon,
  MessageSquare,
  Users,
  ShieldCheck,
  History,
  Settings,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Target,
  Calendar,
  CreditCard,
  ShoppingBag,
  Handshake,
  FileCheck,
  Layers,
  Megaphone,
  BarChart3,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: any;
  section: 'OVERVIEW' | 'OPERATIONS' | 'CMS' | 'SYSTEM';
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  // OVERVIEW Section
  { label: 'Master Dashboard', href: '/dashboard', icon: LayoutDashboard, section: 'OVERVIEW' },

  // CP & PRO OPERATIONS Section
  { label: 'Channel Partners', href: '/channel-partners', icon: Handshake, section: 'OPERATIONS', badge: 'CP' },
  { label: 'Leads CRM', href: '/leads', icon: Target, section: 'OPERATIONS' },
  { label: 'Customers', href: '/customers', icon: Users, section: 'OPERATIONS' },
  { label: 'Site Visits', href: '/site-visits', icon: Calendar, section: 'OPERATIONS' },
  { label: 'Bookings', href: '/bookings', icon: ShoppingBag, section: 'OPERATIONS' },
  { label: 'Payments', href: '/payments', icon: CreditCard, section: 'OPERATIONS' },
  { label: 'ATS Agreements', href: '/agreements', icon: FileCheck, section: 'OPERATIONS' },
  { label: 'Unit Inventory', href: '/inventory', icon: Layers, section: 'OPERATIONS' },
  { label: 'Marketing Campaigns', href: '/campaigns', icon: Megaphone, section: 'OPERATIONS' },

  // PUBLIC WEB (CMS) Section
  { label: 'Pages & Landing', href: '/pages', icon: FileText, section: 'CMS' },
  { label: 'Blog & Articles', href: '/blog', icon: Newspaper, section: 'CMS' },
  { label: 'Township Projects', href: '/projects', icon: Building2, section: 'CMS' },
  { label: 'Villas & Properties', href: '/properties', icon: Home, section: 'CMS' },
  { label: 'GIS Map Layers', href: '/mapping', icon: MapPin, section: 'CMS' },
  { label: 'Inquiries & Forms', href: '/forms', icon: MessageSquare, section: 'CMS', badge: 'New' },
  { label: 'Media CDN Library', href: '/media', icon: Images, section: 'CMS' },
  { label: 'Navigation Menus', href: '/menus', icon: MenuIcon, section: 'CMS' },
  { label: 'Careers & Hiring', href: '/careers', icon: Briefcase, section: 'CMS' },
  { label: 'Visual Gallery', href: '/gallery', icon: Images, section: 'CMS' },
  { label: 'Buyer Testimonials', href: '/testimonials', icon: Quote, section: 'CMS' },
  { label: 'Categories & Tags', href: '/taxonomy', icon: Tag, section: 'CMS' },
  { label: 'SEO & Metadata', href: '/seo', icon: Globe, section: 'CMS' },

  // SYSTEM & PLATFORM Section
  { label: 'Admin & Staff Users', href: '/users', icon: Users, section: 'SYSTEM' },
  { label: 'Roles & Matrix', href: '/roles', icon: ShieldCheck, section: 'SYSTEM' },
  { label: 'Analytics Reports', href: '/reports', icon: BarChart3, section: 'SYSTEM' },
  { label: 'Audit Trail', href: '/audit', icon: History, section: 'SYSTEM' },
  { label: 'Platform Settings', href: '/settings', icon: Settings, section: 'SYSTEM' },
];

export function Sidebar({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<{ [key: string]: boolean }>({
    OVERVIEW: false,
    OPERATIONS: false,
    CMS: false,
    SYSTEM: false,
  });

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const filteredItems = NAV_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const overviewItems = filteredItems.filter((item) => item.section === 'OVERVIEW');
  const operationsItems = filteredItems.filter((item) => item.section === 'OPERATIONS');
  const cmsItems = filteredItems.filter((item) => item.section === 'CMS');
  const systemItems = filteredItems.filter((item) => item.section === 'SYSTEM');

  const getInitials = (name?: string) => {
    if (!name) return 'SA';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const renderNavGroup = (
    title: string,
    sectionKey: 'OVERVIEW' | 'OPERATIONS' | 'CMS' | 'SYSTEM',
    items: NavItem[],
    accentColor: string
  ) => {
    if (items.length === 0) return null;

    return (
      <div className="flex flex-col gap-1">
        {isOpen ? (
          <button
            type="button"
            onClick={() => toggleSection(sectionKey)}
            className="flex w-full items-center justify-between px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
          >
            <span className={clsx('tracking-wider', accentColor)}>{title}</span>
            <ChevronDown
              size={12}
              className={clsx('transition-transform text-slate-500', collapsedSections[sectionKey] && '-rotate-90')}
            />
          </button>
        ) : (
          <div className="h-px bg-slate-800 my-2" />
        )}

        {!collapsedSections[sectionKey] && (
          <div className="space-y-0.5">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href === '/dashboard' && (pathname === '/' || pathname === '/dashboard')) ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  title={!isOpen ? item.label : undefined}
                  className={clsx(
                    'flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all group',
                    isActive
                      ? 'bg-[#1a233a] font-semibold text-white border-l-2 border-amber-500 pl-2.5 shadow-sm'
                      : 'text-slate-300 hover:bg-[#1a233a] hover:text-white',
                    !isOpen && 'justify-center px-0'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      size={15}
                      className={clsx(
                        'shrink-0 transition-colors',
                        isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
                      )}
                    />
                    {isOpen && <span className="truncate">{item.label}</span>}
                  </div>
                  {isOpen && item.badge && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={clsx(
        'fixed inset-y-0 left-0 z-50 flex h-screen shrink-0 flex-col justify-between overflow-y-auto border-r border-slate-800 bg-[#0b132b] text-slate-300 shadow-2xl transition-all duration-300 select-none scrollbar-thin scrollbar-thumb-slate-800',
        isOpen ? 'w-64' : 'w-20'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Top Branding */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/10 p-1 ring-1 ring-white/15 shadow-sm">
              <Image
                src="/images/favicon.png"
                alt="Truzon Logo"
                width={32}
                height={32}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            {isOpen && (
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-extrabold text-base tracking-wider text-white">TRUZON</span>
                <span className="rounded-md border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-400 tracking-wider">
                  ADMIN
                </span>
              </div>
            )}
          </Link>
          <button
            type="button"
            onClick={onToggle}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-[#1a233a] hover:text-white transition-colors"
            title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>

        {/* Quick Search */}
        {isOpen && (
          <div className="px-3 pt-3 pb-1 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg bg-[#1a233a] py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              />
            </div>
          </div>
        )}

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4" aria-label="Main navigation">
          {renderNavGroup('Overview', 'OVERVIEW', overviewItems, 'text-amber-400')}
          {renderNavGroup('CP & Pro Operations', 'OPERATIONS', operationsItems, 'text-purple-400')}
          {renderNavGroup('Public Web (CMS)', 'CMS', cmsItems, 'text-emerald-400')}
          {renderNavGroup('System & Platform', 'SYSTEM', systemItems, 'text-blue-400')}
        </nav>

        {/* User Profile Footer */}
        <div className="border-t border-slate-800 p-3 bg-[#080d1e] flex items-center justify-between sticky bottom-0 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-700 text-xs font-bold text-white shadow-sm shrink-0">
              {getInitials(user?.fullName)}
            </div>
            {isOpen && (
              <div className="flex flex-col leading-tight min-w-0">
                <span className="text-xs font-bold text-white truncate max-w-[120px]">
                  {user?.fullName || 'Super Admin'}
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {user?.role?.displayName || 'Master Control'}
                </span>
              </div>
            )}
          </div>
          {isOpen && (
            <button
              type="button"
              onClick={handleLogout}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}