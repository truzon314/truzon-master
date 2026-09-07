'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { useGetBlogPostsQuery, useDeleteBlogPostMutation } from '@/lib/api-hooks';
import {
  Plus,
  Search,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  Edit,
  Trash2,
} from 'lucide-react';
import { clsx } from 'clsx';
import type { BlogPost } from '@/types';

const statusColors: Record<string, string> = {
  PUBLISHED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  DRAFT: 'bg-amber-50 text-amber-700 border-amber-200',
  SCHEDULED: 'bg-blue-50 text-blue-700 border-blue-200',
};

export default function BlogsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useGetBlogPostsQuery({
    page,
    limit,
    search: search || undefined,
    status: statusFilter || undefined,
  });

  const [deleteBlogPost] = useDeleteBlogPostMutation();

  const posts = data?.data || [];
  const meta = data?.meta;

  const stats = {
    total: meta?.total || posts.length,
    published: posts.filter((p) => p.status === 'PUBLISHED').length,
    drafts: posts.filter((p) => p.status === 'DRAFT').length,
    featured: posts.filter((p) => p.isFeatured).length,
  };

  const statCards = [
    { title: 'Total Articles', value: stats.total, icon: FileText, color: 'bg-blue-500' },
    { title: 'Published', value: stats.published, icon: CheckCircle2, color: 'bg-emerald-500' },
    { title: 'Drafts', value: stats.drafts, icon: Clock, color: 'bg-amber-500' },
    { title: 'Featured', value: stats.featured, icon: Sparkles, color: 'bg-purple-500' },
  ];

  async function handleDelete(id: string, title: string) {
    if (confirm(`Are you sure you want to delete the blog post "${title}"?`)) {
      try {
        await deleteBlogPost(id).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete blog post');
      }
    }
  }

  const columns = [
    {
      key: 'title',
      header: 'Title',
      accessor: (row: BlogPost) => (
        <div className="max-w-md">
          <div className="font-semibold text-gray-900 line-clamp-1">{row.title}</div>
          <div className="text-xs text-gray-400 mt-0.5">/{row.slug}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'author',
      header: 'Author',
      accessor: (row: BlogPost) => row.author?.fullName || 'Admin',
    },
    {
      key: 'status',
      header: 'Status',
      accessor: 'status' as const,
      render: (status: string, row: BlogPost) => (
        <span
          className={clsx(
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
            statusColors[status] || 'bg-gray-50 text-gray-700 border-gray-200'
          )}
        >
          {status}
          {row.isFeatured && (
            <span className="text-[10px] bg-purple-100 text-purple-700 px-1 rounded">
              Featured
            </span>
          )}
        </span>
      ),
    },
    {
      key: 'publishedAt',
      header: 'Published Date',
      accessor: (row: BlogPost) =>
        row.publishedAt
          ? new Date(row.publishedAt).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : '-',
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (row: BlogPost) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/blogs/${row.id}/edit`}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit post"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <a
            href={`http://localhost:3003/blog/${row.slug}`}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title="View on public site"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() => handleDelete(row.id, row.title)}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Delete post"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
            <p className="text-gray-500 mt-1">
              Create, curate, and publish real estate guides, market trends, and company news.
            </p>
          </div>
          <Link href="/blogs/new">
            <Button className="bg-navy-900 hover:bg-navy-800 text-white">
              <Plus className="mr-2 h-4 w-4" />
              New Blog Post
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
            <CardTitle className="text-lg font-semibold text-gray-900">All Articles</CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9 h-9 text-sm"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="h-9 px-3 rounded-md border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="SCHEDULED">Scheduled</option>
              </select>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <DataTable
              data={posts}
              columns={columns}
              keyExtractor={(row) => row.id}
              loading={isLoading}
              emptyMessage="No blog posts found. Click 'New Blog Post' to create your first article!"
              pagination={{
                page,
                pageSize: limit,
                total: meta?.total || posts.length,
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
