'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Menu as MenuIcon,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  ExternalLink,
  Edit2,
  Save,
  Globe,
} from 'lucide-react';
import { clsx } from 'clsx';

interface MenuItemDef {
  id: string;
  label: string;
  href: string;
  isExternal: boolean;
  openInNewTab: boolean;
}

const INITIAL_MENUS: Record<string, { label: string; items: MenuItemDef[] }> = {
  header: {
    label: 'Main Header Navigation',
    items: [
      { id: 'm-1', label: 'Home', href: '/', isExternal: false, openInNewTab: false },
      { id: 'm-2', label: 'About', href: '/about', isExternal: false, openInNewTab: false },
      { id: 'm-3', label: 'Projects', href: '/projects', isExternal: false, openInNewTab: false },
      { id: 'm-4', label: 'Blog', href: '/blog', isExternal: false, openInNewTab: false },
      { id: 'm-5', label: 'Contact', href: '/contact', isExternal: false, openInNewTab: false },
    ],
  },
  footer_properties: {
    label: 'Footer: Signature Properties',
    items: [
      { id: 'm-6', label: 'Truzon Azure Villas', href: '/projects/azure', isExternal: false, openInNewTab: false },
      { id: 'm-7', label: 'Truzon Emerald Meadows', href: '/projects/emerald', isExternal: false, openInNewTab: false },
      { id: 'm-8', label: 'Truzon Horizon Plots', href: '/projects/horizon', isExternal: false, openInNewTab: false },
    ],
  },
  footer_company: {
    label: 'Footer: Company Links',
    items: [
      { id: 'm-9', label: 'About Us', href: '/about', isExternal: false, openInNewTab: false },
      { id: 'm-10', label: 'Careers', href: '/careers', isExternal: false, openInNewTab: false },
      { id: 'm-11', label: 'Investor Relations', href: '/investor-relations', isExternal: false, openInNewTab: false },
      { id: 'm-12', label: 'Testimonials', href: '/testimonials', isExternal: false, openInNewTab: false },
    ],
  },
  footer_legal: {
    label: 'Footer: Legal & Support',
    items: [
      { id: 'm-13', label: 'Terms of Service', href: '/terms-of-service', isExternal: false, openInNewTab: false },
      { id: 'm-14', label: 'Privacy Policy', href: '/privacy-policy', isExternal: false, openInNewTab: false },
      { id: 'm-15', label: 'RERA Compliance', href: '/rera-compliance', isExternal: false, openInNewTab: false },
    ],
  },
};

export default function MenusPage() {
  const [selectedMenu, setSelectedMenu] = useState<string>('header');
  const [menus, setMenus] = useState(INITIAL_MENUS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ label: '', href: '/', isExternal: false });

  const activeMenu = menus[selectedMenu];

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const items = [...activeMenu.items];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const temp = items[index];
    items[index] = items[targetIdx];
    items[targetIdx] = temp;
    setMenus({
      ...menus,
      [selectedMenu]: { ...activeMenu, items },
    });
  };

  const handleDelete = (id: string) => {
    setMenus({
      ...menus,
      [selectedMenu]: {
        ...activeMenu,
        items: activeMenu.items.filter((item) => item.id !== id),
      },
    });
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const item: MenuItemDef = {
      id: `item-${Date.now()}`,
      label: newItem.label,
      href: newItem.href,
      isExternal: newItem.isExternal,
      openInNewTab: newItem.isExternal,
    };
    setMenus({
      ...menus,
      [selectedMenu]: {
        ...activeMenu,
        items: [...activeMenu.items, item],
      },
    });
    setShowAddModal(false);
    setNewItem({ label: '', href: '/', isExternal: false });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Public Web Menus & Navigation</h1>
            <p className="text-gray-500 mt-1">
              Control the header navbar, footer columns, and mobile menu links of the public website.
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Menu Item
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Menu Selector Sidebar */}
          <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 py-2">Select Menu Location</p>
            {Object.entries(menus).map(([key, m]) => (
              <button
                key={key}
                onClick={() => setSelectedMenu(key)}
                className={clsx(
                  'w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between',
                  selectedMenu === key
                    ? 'bg-[#0b132b] text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <span>{m.label}</span>
                <span className={clsx('text-[11px] px-1.5 py-0.5 rounded', selectedMenu === key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600')}>
                  {m.items.length}
                </span>
              </button>
            ))}
          </div>

          {/* Menu Items Editor */}
          <div className="md:col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{activeMenu.label}</h2>
                <p className="text-xs text-gray-500 mt-0.5">Drag or use arrow buttons to re-order links.</p>
              </div>
              <Button onClick={() => alert('Navigation structure published to Public Web cache!')} className="flex items-center gap-1.5 text-xs">
                <Save className="h-3.5 w-3.5" /> Publish Menus
              </Button>
            </div>

            <div className="space-y-2">
              {activeMenu.items.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary-400 bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 w-5 text-center">{idx + 1}</span>
                    <div>
                      <p className="font-semibold text-xs text-gray-900">{item.label}</p>
                      <p className="font-mono text-[11px] text-gray-500">{item.href}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded hover:bg-gray-200 text-gray-500 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === activeMenu.items.length - 1}
                      className="p-1 rounded hover:bg-gray-200 text-gray-500 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 rounded hover:bg-red-50 text-red-500 ml-2"
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-lg font-bold text-gray-900">Add Menu Item</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-4">
                <Input
                  label="Navigation Label"
                  value={newItem.label}
                  onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                  placeholder="e.g. Signature Villas"
                  required
                />
                <Input
                  label="URL / Route Link"
                  value={newItem.href}
                  onChange={(e) => setNewItem({ ...newItem, href: e.target.value })}
                  placeholder="e.g. /projects/azure"
                  required
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="ext"
                    checked={newItem.isExternal}
                    onChange={(e) => setNewItem({ ...newItem, isExternal: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600"
                  />
                  <label htmlFor="ext" className="text-xs font-medium text-gray-700">Open in new tab (External link)</label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
                  <Button type="submit">Add to Menu</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
