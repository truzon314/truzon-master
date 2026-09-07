'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { useGetLeadsQuery, useGetCustomersQuery, useGetProjectsQuery, useGetPropertiesQuery } from '@/lib/api-hooks';
import { Users, Target, Building2, Home, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { clsx } from 'clsx';

const statCards = [
  { title: 'Total Leads', value: '1,234', change: '+12%', changeType: 'increase', icon: Target, color: 'bg-blue-500' },
  { title: 'Active Customers', value: '567', change: '+8%', changeType: 'increase', icon: Users, color: 'bg-green-500' },
  { title: 'Total Projects', value: '23', change: '+2', changeType: 'increase', icon: Building2, color: 'bg-purple-500' },
  { title: 'Revenue', value: '₹45.2 Cr', change: '+15%', changeType: 'increase', icon: CreditCard, color: 'bg-orange-500' },
];

export default function DashboardPage() {
  const { data: leadsData } = useGetLeadsQuery({ limit: 5 });
  const { data: projectsData } = useGetProjectsQuery({ limit: 5 });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back! Here&apos;s an overview of your business.</p>
          </div>
          <Button>
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Lead
          </Button>
        </div>

        {/* Stats Grid */}
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
              <div className="mt-4 flex items-center gap-2">
                <span className={clsx('text-sm font-medium', stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600')}>
                  {stat.changeType === 'increase' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500">vs last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Leads */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
              <a href="/leads" className="text-sm text-primary-600 hover:text-primary-700">View all</a>
            </div>
            <div className="p-6">
              {leadsData?.data && leadsData.data.length > 0 ? (
                <DataTable
                  data={leadsData.data}
                  columns={[
                    { key: 'name', header: 'Name', accessor: 'name' },
                    { key: 'phone', header: 'Phone', accessor: 'phone' },
                    { key: 'status', header: 'Status', accessor: 'status', render: (v) => (
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        v === 'NEW' ? 'bg-blue-100 text-blue-800' :
                        v === 'CONTACTED' ? 'bg-yellow-100 text-yellow-800' :
                        v === 'INTERESTED' ? 'bg-purple-100 text-purple-800' :
                        v === 'SITE_VISIT' ? 'bg-indigo-100 text-indigo-800' :
                        v === 'NEGOTIATION' ? 'bg-orange-100 text-orange-800' :
                        v === 'BOOKED' ? 'bg-green-100 text-green-800' :
                        v === 'CONVERTED' ? 'bg-emerald-100 text-emerald-800' :
                        v === 'LOST' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>{v}</span>
                    ) },
                    { key: 'createdAt', header: 'Date', accessor: 'createdAt', render: (v) => new Date(v).toLocaleDateString() },
                  ]}
                  keyExtractor={(row) => row.id}
                />
              ) : (
                <p className="text-center text-gray-500 py-8">No leads found</p>
              )}
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
              <a href="/projects" className="text-sm text-primary-600 hover:text-primary-700">View all</a>
            </div>
            <div className="p-6">
              {projectsData?.data && projectsData.data.length > 0 ? (
                <DataTable
                  data={projectsData.data}
                  columns={[
                    { key: 'name', header: 'Name', accessor: 'name' },
                    { key: 'city', header: 'City', accessor: 'city' },
                    { key: 'status', header: 'Status', accessor: 'status', render: (v) => (
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        v === 'UPCOMING' ? 'bg-gray-100 text-gray-800' :
                        v === 'LAUNCHED' ? 'bg-blue-100 text-blue-800' :
                        v === 'ONGOING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>{v}</span>
                    ) },
                    { key: 'isActive', header: 'Active', accessor: 'isActive', render: (v) => (
                      <span className={`inline-flex items-center gap-1 text-sm ${v ? 'text-green-600' : 'text-red-600'}`}>
                        {v ? '● Active' : '● Inactive'}
                      </span>
                    ) },
                  ]}
                  keyExtractor={(row) => row.id}
                />
              ) : (
                <p className="text-center text-gray-500 py-8">No projects found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}