'use client';

import { useState, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { useGetProjectsQuery } from '@/lib/api-hooks';
import { Building2, Plus, Search, Filter, Star, TrendingUp, Calendar } from 'lucide-react';
import { clsx } from 'clsx';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'UPCOMING', label: 'Upcoming' },
  { value: 'LAUNCHED', label: 'Launched' },
  { value: 'ONGOING', label: 'Ongoing' },
  { value: 'COMPLETED', label: 'Completed' },
];

const statusColors: Record<string, string> = {
  UPCOMING: 'bg-gray-100 text-gray-800',
  LAUNCHED: 'bg-blue-100 text-blue-800',
  ONGOING: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
};

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: projectsData, isLoading } = useGetProjectsQuery({
    page,
    limit: pageSize,
    search: search || undefined,
    status: statusFilter || undefined,
  });

  const projects = projectsData?.data || [];
  const meta = projectsData?.meta;

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const handleStatusFilter = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  }, []);

  const totalProjects = meta?.total || projects.length;
  const activeProjects = projects.filter((p) => p.isActive).length;
  const upcomingProjects = projects.filter((p) => p.status === 'UPCOMING').length;
  const featuredProjects = projects.filter((p) => p.isFeatured).length;

  const columns = [
    {
      key: 'name',
      header: 'Name',
      accessor: 'name' as const,
      sortable: true,
    },
    {
      key: 'city',
      header: 'City',
      accessor: 'city' as const,
      sortable: true,
    },
    {
      key: 'state',
      header: 'State',
      accessor: 'state' as const,
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: 'status' as const,
      render: (value: string) => (
        <span className={clsx('inline-flex px-2 py-1 text-xs font-medium rounded-full', statusColors[value] || 'bg-gray-100 text-gray-800')}>
          {value}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Active',
      accessor: 'isActive' as const,
      render: (value: boolean) => (
        <span className={clsx('inline-flex items-center gap-1 text-sm', value ? 'text-green-600' : 'text-red-600')}>
          <span className={clsx('h-2 w-2 rounded-full', value ? 'bg-green-500' : 'bg-red-500')} />
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'isFeatured',
      header: 'Featured',
      accessor: 'isFeatured' as const,
      render: (value: boolean) => (
        <span className={clsx('inline-flex items-center gap-1 text-sm', value ? 'text-yellow-600' : 'text-gray-400')}>
          <Star className={clsx('h-4 w-4', value ? 'fill-yellow-400' : '')} />
          {value ? 'Featured' : ''}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created Date',
      accessor: 'createdAt' as const,
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    },
  ];

  const tableActions = [
    {
      label: 'View',
      onClick: (row: any) => {
        window.location.href = `/projects/${row.id}`;
      },
      variant: 'ghost' as const,
    },
    {
      label: 'Edit',
      onClick: (row: any) => {
        window.location.href = `/projects/${row.id}/edit`;
      },
      variant: 'ghost' as const,
    },
    {
      label: 'Delete',
      onClick: (row: any) => {
        if (confirm('Are you sure you want to delete this project?')) {
          console.log('Delete project:', row.id);
        }
      },
      variant: 'ghost' as const,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-500 mt-1">Manage your real estate projects.</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalProjects}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50">
                <Building2 className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{activeProjects}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-50">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{upcomingProjects}</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-50">
                <Calendar className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Featured</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{featuredProjects}</p>
              </div>
              <div className="p-3 rounded-xl bg-yellow-50">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search projects..."
                  value={search}
                  onChange={handleSearch}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={handleStatusFilter}
                  className="h-10 px-4 pr-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="p-6">
            <DataTable
              data={projects}
              columns={columns}
              keyExtractor={(row) => row.id}
              loading={isLoading}
              emptyMessage="No projects found"
              pagination={{
                page,
                pageSize,
                total: totalProjects,
                totalPages: meta?.totalPages || Math.ceil(totalProjects / pageSize),
                onPageChange: handlePageChange,
                onPageSizeChange: handlePageSizeChange,
              }}
              actions={tableActions}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
