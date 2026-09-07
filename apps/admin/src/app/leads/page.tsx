'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { useGetLeadsQuery, useGetLeadStatsQuery } from '@/lib/api-hooks';
import type { Lead } from '@truzon/types';
import { UserPlus, Search, Filter, Target, Phone, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'INTERESTED', label: 'Interested' },
  { value: 'SITE_VISIT', label: 'Site Visit' },
  { value: 'NEGOTIATION', label: 'Negotiation' },
  { value: 'BOOKED', label: 'Booked' },
  { value: 'CONVERTED', label: 'Converted' },
  { value: 'LOST', label: 'Lost' },
  { value: 'NURTURE', label: 'Nurture' },
];

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  CONTACTED: 'bg-yellow-100 text-yellow-800',
  INTERESTED: 'bg-purple-100 text-purple-800',
  SITE_VISIT: 'bg-indigo-100 text-indigo-800',
  NEGOTIATION: 'bg-orange-100 text-orange-800',
  BOOKED: 'bg-green-100 text-green-800',
  CONVERTED: 'bg-emerald-100 text-emerald-800',
  LOST: 'bg-red-100 text-red-800',
  NURTURE: 'bg-gray-100 text-gray-800',
};

export default function LeadsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: leadsData, isLoading } = useGetLeadsQuery({
    page,
    limit,
    search: search || undefined,
    status: statusFilter || undefined,
  });

  const { data: statsData } = useGetLeadStatsQuery();

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(1);
  }, []);

  const leads = leadsData?.data || [];
  const meta = leadsData?.meta;

  const statCards = [
    { title: 'Total Leads', value: statsData?.total || leads.length, icon: Target, color: 'bg-blue-500' },
    { title: 'New', value: statsData?.new || 0, icon: UserPlus, color: 'bg-blue-600' },
    { title: 'Contacted', value: statsData?.contacted || 0, icon: Phone, color: 'bg-yellow-500' },
    { title: 'Converted', value: statsData?.converted || 0, icon: CheckCircle, color: 'bg-emerald-500' },
  ];

  const columns = [
    {
      key: 'name',
      header: 'Name',
      accessor: 'name' as keyof Lead,
      sortable: true,
      render: (value: string, row: Lead) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {row.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            {row.email && <p className="text-xs text-gray-500">{row.email}</p>}
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      accessor: 'phone' as keyof Lead,
      render: (value: string) => (
        <span className="text-gray-600">{value}</span>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      accessor: (row: Lead) => row.email || '-',
      render: (value: string) => (
        <span className="text-gray-600">{value}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: 'status' as keyof Lead,
      render: (value: string) => (
        <span className={clsx('inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium', STATUS_COLORS[value] || 'bg-gray-100 text-gray-800')}>
          {value?.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'source',
      header: 'Source',
      accessor: (row: Lead) => row.source?.name || '-',
      render: (value: string) => (
        <span className="text-gray-600">{value}</span>
      ),
    },
    {
      key: 'assignedUser',
      header: 'Assigned To',
      accessor: (row: Lead) => row.assignedUser?.fullName || 'Unassigned',
      render: (value: string) => (
        <span className={clsx('text-sm', value === 'Unassigned' ? 'text-gray-400' : 'text-gray-600')}>
          {value}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created Date',
      accessor: 'createdAt' as keyof Lead,
      sortable: true,
      render: (value: string) => (
        <span className="text-gray-600">
          {new Date(value).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
  ];

  const handleViewLead = (lead: Lead) => {
    router.push(`/leads/${lead.id}`);
  };

  const handleEditLead = (lead: Lead) => {
    router.push(`/leads/${lead.id}/edit`);
  };

  const actions = [
    {
      label: 'View',
      onClick: handleViewLead,
      variant: 'ghost' as const,
    },
    {
      label: 'Edit',
      onClick: handleEditLead,
      variant: 'ghost' as const,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
            <p className="text-gray-500 mt-1">Manage and track all your leads.</p>
          </div>
          <Button onClick={() => router.push('/leads/new')}>
            <UserPlus className="mr-2 h-4 w-4" />
            New Lead
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={clsx('p-3 rounded-xl', stat.color + '/10')}>
                    <stat.icon className={clsx('h-6 w-6', stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search leads by name, phone, or email..."
                  value={search}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={handleStatusChange}
                  className="h-10 px-4 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardHeader>
          <DataTable
            data={leads}
            columns={columns}
            keyExtractor={(row) => row.id}
            loading={isLoading}
            emptyMessage="No leads found. Create your first lead to get started."
            pagination={{
              page,
              pageSize: limit,
              total: meta?.total || 0,
              onPageChange: setPage,
              onPageSizeChange: (newSize) => {
                setLimit(newSize);
                setPage(1);
              },
            }}
            actions={actions}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}
