'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useGetCustomersQuery } from '@/lib/api-hooks';
import type { Customer } from '@truzon/types';
import { Users, Shield, Clock, Calendar, Plus, Filter } from 'lucide-react';
import { clsx } from 'clsx';

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [kycStatus, setKycStatus] = useState('');

  const { data, isLoading } = useGetCustomersQuery({
    page,
    limit,
    search,
    kycStatus: kycStatus || undefined,
  });

  const customers = data?.data || [];
  const meta = data?.meta;

  const totalCustomers = meta?.total || 0;
  const kycVerified = customers.filter((c) => c.kycStatus === 'VERIFIED').length;
  const pendingKyc = customers.filter((c) => c.kycStatus === 'PENDING').length;

  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);
  const thisMonthCount = customers.filter(
    (c) => new Date(c.createdAt) >= thisMonth
  ).length;

  const statCards = [
    { title: 'Total Customers', value: totalCustomers.toString(), icon: Users, color: 'bg-blue-500' },
    { title: 'KYC Verified', value: kycVerified.toString(), icon: Shield, color: 'bg-green-500' },
    { title: 'Pending KYC', value: pendingKyc.toString(), icon: Clock, color: 'bg-yellow-500' },
    { title: 'This Month', value: thisMonthCount.toString(), icon: Calendar, color: 'bg-purple-500' },
  ];

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      header: 'Name',
      accessor: (row) => `${row.firstName} ${row.lastName}`,
      sortable: true,
    },
    { key: 'email', header: 'Email', accessor: 'email', sortable: true },
    { key: 'phone', header: 'Phone', accessor: 'phone', sortable: true },
    { key: 'city', header: 'City', accessor: 'city', sortable: true },
    {
      key: 'kycStatus',
      header: 'KYC Status',
      accessor: 'kycStatus',
      sortable: true,
      render: (value: any) => (
        <span
          className={clsx(
            'inline-flex px-2 py-1 text-xs font-medium rounded-full',
            value === 'VERIFIED' && 'bg-green-100 text-green-800',
            value === 'PENDING' && 'bg-yellow-100 text-yellow-800',
            value === 'REJECTED' && 'bg-red-100 text-red-800',
            !value && 'bg-gray-100 text-gray-800'
          )}
        >
          {value || 'N/A'}
        </span>
      ),
    },
    {
      key: 'leadSource',
      header: 'Lead Source',
      accessor: (row) => row.lead?.source?.name || 'N/A',
      sortable: false,
    },
    {
      key: 'createdAt',
      header: 'Created Date',
      accessor: 'createdAt',
      sortable: true,
      render: (value: any) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-500 mt-1">Manage your customers and their information.</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <div key={stat.title} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={clsx('p-3 rounded-xl', stat.color + '/10')}>
                  <stat.icon className={clsx('h-6 w-6', stat.color)} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search customers..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="max-w-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={kycStatus}
                  onChange={(e) => {
                    setKycStatus(e.target.value);
                    setPage(1);
                  }}
                  className="h-10 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All KYC Status</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="PENDING">Pending</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          </div>
          <div className="p-6">
            <DataTable<Customer>
              data={customers}
              columns={columns}
              keyExtractor={(row) => row.id}
              loading={isLoading}
              emptyMessage="No customers found"
              pagination={{
                page,
                pageSize: limit,
                total: meta?.total || 0,
                totalPages: meta?.totalPages || 0,
                onPageChange: setPage,
                onPageSizeChange: (newLimit) => {
                  setLimit(newLimit);
                  setPage(1);
                },
              }}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
