'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { useGetCategoriesQuery, useGetTagsQuery } from '@/lib/api-hooks';
import type { Category, Tag } from '@/types';
import {
  Tag as TagIcon,
  FolderTree,
  Plus,
  Search,
  CheckCircle,
  Hash,
} from 'lucide-react';
import { clsx } from 'clsx';

const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Luxury Villas', slug: 'luxury-villas', appliesTo: 'Properties', count: 18 },
  { id: 'cat-2', name: 'Township Plots', slug: 'township-plots', appliesTo: 'Properties', count: 42 },
  { id: 'cat-3', name: 'Real Estate Investment', slug: 'real-estate-investment', appliesTo: 'Blog', count: 12 },
  { id: 'cat-4', name: 'Interior & Architecture', slug: 'interior-architecture', appliesTo: 'Blog', count: 8 },
  { id: 'cat-5', name: 'NRI Buying Guide', slug: 'nri-buying-guide', appliesTo: 'Blog', count: 6 },
  { id: 'cat-6', name: 'Vastu Shastra', slug: 'vastu-shastra', appliesTo: 'Properties & Blog', count: 15 },
];

const MOCK_TAGS = [
  { id: 'tag-1', name: 'Gated Community', slug: 'gated-community', color: '#10B981' },
  { id: 'tag-2', name: 'Private Swimming Pool', slug: 'private-pool', color: '#3B82F6' },
  { id: 'tag-3', name: 'Airport Road', slug: 'airport-road', color: '#8B5CF6' },
  { id: 'tag-4', name: 'Clubhouse 30000 sqft', slug: 'clubhouse', color: '#F59E0B' },
  { id: 'tag-5', name: 'RERA Approved', slug: 'rera-approved', color: '#EF4444' },
];

export default function TaxonomyPage() {
  const [activeTab, setActiveTab] = useState<'categories' | 'tags'>('categories');
  const [search, setSearch] = useState('');

  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: tagsData } = useGetTagsQuery();

  const categories = useMemo(() => {
    return MOCK_CATEGORIES.filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const tags = useMemo(() => {
    return MOCK_TAGS.filter((t) => !search || t.name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Taxonomy (Categories & Tags)</h1>
            <p className="text-gray-500 mt-1">
              Classify property listings and blog posts for filters, navigation menus, and search indexing on Public Web.
            </p>
          </div>
          <Button onClick={() => alert('Add Taxonomy Modal')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add {activeTab === 'categories' ? 'Category' : 'Tag'}
          </Button>
        </div>

        {/* Tab switcher */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('categories')}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
                  activeTab === 'categories'
                    ? 'bg-[#0b132b] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                Categories ({categories.length})
              </button>
              <button
                onClick={() => setActiveTab('tags')}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
                  activeTab === 'tags'
                    ? 'bg-[#0b132b] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                Tags ({tags.length})
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search taxonomy..."
                className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
              />
            </div>
          </div>

          {activeTab === 'categories' ? (
            <DataTable
              data={categories}
              columns={[
                {
                  key: 'name',
                  header: 'Category Name',
                  render: (_, row: any) => (
                    <div>
                      <p className="font-bold text-xs text-gray-900">{row.name}</p>
                      <p className="font-mono text-[11px] text-gray-400">/{row.slug}</p>
                    </div>
                  ),
                },
                {
                  key: 'appliesTo',
                  header: 'Applies To',
                  accessor: 'appliesTo',
                  render: (v) => (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      {v}
                    </span>
                  ),
                },
                {
                  key: 'count',
                  header: 'Active Items',
                  accessor: 'count',
                  render: (v) => <span className="text-xs font-bold text-gray-700">{v} items</span>,
                },
              ]}
              keyExtractor={(row: any) => row.id}
            />
          ) : (
            <DataTable
              data={tags}
              columns={[
                {
                  key: 'name',
                  header: 'Tag Name',
                  render: (_, row: any) => (
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: row.color }} />
                      <div>
                        <p className="font-bold text-xs text-gray-900">{row.name}</p>
                        <p className="font-mono text-[11px] text-gray-400">#{row.slug}</p>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'color',
                  header: 'Color Badge',
                  render: (_, row: any) => (
                    <span
                      className="text-xs font-mono px-2 py-0.5 rounded text-white font-bold"
                      style={{ backgroundColor: row.color }}
                    >
                      {row.color}
                    </span>
                  ),
                },
              ]}
              keyExtractor={(row: any) => row.id}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
