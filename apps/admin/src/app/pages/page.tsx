'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import {
  useGetPagesQuery,
  usePublishPageMutation,
  useUnpublishPageMutation,
  useDeletePageMutation,
} from '@/lib/api-hooks';
import {
  Plus,
  Search,
  FileText,
  CheckCircle2,
  Clock,
  Layers,
  ExternalLink,
  Edit,
  Trash2,
  Globe,
  Radio,
} from 'lucide-react';
import { clsx } from 'clsx';
import type { Page } from '@/types';

const statusColors: Record<string, string> = {
  PUBLISHED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  DRAFT: 'bg-amber-50 text-amber-700 border-amber-200',
  SCHEDULED: 'bg-blue-50 text-blue-700 border-blue-200',
};

export default function PagesManagementPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const { data, isLoading } = useGetPagesQuery({
    page,
    limit,
    search: search || undefined,
    pageType: typeFilter || undefined,
  });

  const [publishPage] = usePublishPageMutation();
  const [unpublishPage] = useUnpublishPageMutation();
  const [deletePage] = useDeletePageMutation();

  const pages = data?.data || [];
  const meta = data?.meta;

  const stats = {
    total: meta?.total || pages.length,
    published: pages.filter((p) => p.status === 'PUBLISHED').length,
    drafts: pages.filter((p) => p.status === 'DRAFT').length,
    landingPages: pages.filter((p) => p.pageType === 'CUSTOM').length,
  };

  const statCards = [
    { title: 'Total Pages', value: stats.total, icon: FileText, color: 'bg-blue-500' },
    { title: 'Published', value: stats.published, icon: CheckCircle2, color: 'bg-emerald-500' },
    { title: 'Drafts', value: stats.drafts, icon: Clock, color: 'bg-amber-500' },
    { title: 'Landing Pages', value: stats.landingPages, icon: Layers, color: 'bg-indigo-500' },
  ];

  async function handleTogglePublish(p: Page) {
    try {
      if (p.status === 'PUBLISHED') {
        if (confirm(`Unpublish page "${p.title}"?`)) {
          await unpublishPage(p.id).unwrap();
        }
      } else {
        await publishPage({ id: p.id, note: 'Published from CMS Admin' }).unwrap();
      }
    } catch (err: any) {
      alert(err?.data?.message || 'Action failed');
    }
  }

  async function handleDelete(p: Page) {
    if (confirm(`Delete landing page "${p.title}"? This cannot be undone.`)) {
      try {
        await deletePage(p.id).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete page');
      }
    }
  }

  const columns = [
    {
      key: 'title',
      header: 'Page Title',
      accessor: (row: Page) => (
        <div className="max-w-md">
          <div className="font-semibold text-gray-900">{row.title}</div>
          <div className="text-xs font-mono text-gray-400 mt-0.5">{row.slug}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'pageType',
      header: 'Type',
      accessor: 'pageType' as const,
      render: (type: string) => (
        <span
          className={clsx(
            'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
            type === 'CUSTOM'
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
              : 'bg-slate-100 text-slate-700 border-slate-200'
          )}
        >
          {type === 'CUSTOM' ? 'Landing Page' : `Core (${type})`}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: 'status' as const,
      render: (status: string) => (
        <span
          className={clsx(
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
            statusColors[status] || 'bg-gray-50 text-gray-700 border-gray-200'
          )}
        >
          <span
            className={clsx(
              'h-1.5 w-1.5 rounded-full',
              status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-500'
            )}
          />
          {status}
        </span>
      ),
    },
    {
      key: 'blocks',
      header: 'Blocks',
      accessor: (row: Page) => (
        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
          {row.blocks?.length || 0} blocks
        </span>
      ),
    },
    {
      key: 'updatedAt',
      header: 'Last Updated',
      accessor: (row: Page) =>
        new Date(row.updatedAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (row: Page) => {
        const publicUrl =
          row.pageType === 'CUSTOM'
            ? `http://localhost:3003/lp${row.slug.startsWith('/') ? '' : '/'}${row.slug}`
            : `http://localhost:3003${row.slug.startsWith('/') ? '' : '/'}${row.slug === '/' ? '' : row.slug}`;

        return (
          <div className="flex items-center gap-2">
            <Link
              href={`/pages/${row.id}/edit`}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit page & blocks"
            >
              <Edit className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => handleTogglePublish(row)}
              className={clsx(
                'p-1.5 rounded-lg transition-colors cursor-pointer',
                row.status === 'PUBLISHED'
                  ? 'text-emerald-600 hover:bg-emerald-50'
                  : 'text-amber-600 hover:bg-amber-50'
              )}
              title={row.status === 'PUBLISHED' ? 'Unpublish page' : 'Publish page'}
            >
              <Radio className="h-4 w-4" />
            </button>
            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="View on public site"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            {row.pageType === 'CUSTOM' && (
              <button
                type="button"
                onClick={() => handleDelete(row)}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Delete landing page"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CMS Pages & Landing Pages</h1>
            <p className="text-gray-500 mt-1">
              Manage website pages, campaign landing pages, and dynamic content blocks.
            </p>
          </div>
          <Link href="/pages/new">
            <Button className="bg-navy-900 hover:bg-navy-800 text-white">
              <Plus className="mr-2 h-4 w-4" />
              New Landing Page
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="border-gray-200 shadow-sm">
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1.5">{stat.value}</p>
                  </div>
                  <div className={clsx('p-3 rounded-xl text-white', stat.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filter bar and Table */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg font-semibold text-gray-900">All Pages</CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title or slug..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9 h-9 text-sm"
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="h-9 px-3 rounded-md border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="CUSTOM">Landing Pages Only</option>
                <option value="HOME">Home</option>
                <option value="ABOUT">About</option>
                <option value="PROJECTS">Projects</option>
                <option value="BLOG">Blog</option>
                <option value="CONTACT">Contact</option>
              </select>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <DataTable
              data={pages}
              columns={columns}
              keyExtractor={(row) => row.id}
              loading={isLoading}
              emptyMessage="No pages found."
              pagination={{
                page,
                pageSize: limit,
                total: meta?.total || pages.length,
                onPageChange: setPage,
                onPageSizeChange: (newLimit) => {
                  setLimit(newLimit);
                  setPage(1);
                },
              }}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
