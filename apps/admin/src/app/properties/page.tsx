'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { useGetPropertiesQuery, useDeletePropertyMutation } from '@/lib/api-hooks';
import { Home, Search, Building2, TreePine, Building, Store, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';

const propertyTypes = [
  { value: '', label: 'All Types' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'PLOT', label: 'Plot' },
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'COMMERCIAL', label: 'Commercial' },
];

function formatPrice(price: number | undefined): string {
  if (!price) return '-';
  const formatted = price.toLocaleString('en-IN');
  return `₹${formatted}`;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getPropertyTypeIcon(type: string) {
  switch (type) {
    case 'VILLA':
      return Home;
    case 'PLOT':
      return TreePine;
    case 'APARTMENT':
      return Building;
    case 'COMMERCIAL':
      return Store;
    default:
      return Building2;
  }
}

export default function PropertiesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [propertyType, setPropertyType] = useState('');

  const { data, isLoading } = useGetPropertiesQuery({
    page,
    limit,
    search: search || undefined,
    propertyType: propertyType || undefined,
  });

  const [deleteProperty] = useDeletePropertyMutation();

  const properties = data?.data || [];
  const meta = data?.meta;

  const stats = {
    total: meta?.total || properties.length,
    villas: properties.filter((p) => p.propertyType === 'VILLA').length,
    plots: properties.filter((p) => p.propertyType === 'PLOT').length,
    apartments: properties.filter((p) => p.propertyType === 'APARTMENT').length,
  };

  const statCards = [
    { title: 'Total Properties', value: stats.total, icon: Building2, color: 'bg-blue-500' },
    { title: 'Villas', value: stats.villas, icon: Home, color: 'bg-green-500' },
    { title: 'Plots', value: stats.plots, icon: TreePine, color: 'bg-purple-500' },
    { title: 'Apartments', value: stats.apartments, icon: Building, color: 'bg-orange-500' },
  ];

  const columns = [
    {
      key: 'name',
      header: 'Name',
      accessor: 'name' as const,
      sortable: true,
    },
    {
      key: 'project',
      header: 'Project',
      accessor: (row: typeof properties[0]) => row.project?.name || '-',
      sortable: false,
    },
    {
      key: 'propertyType',
      header: 'Type',
      accessor: 'propertyType' as const,
      sortable: true,
      render: (value: string) => {
        const Icon = getPropertyTypeIcon(value);
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            <Icon className="h-3.5 w-3.5" />
            {value}
          </span>
        );
      },
    },
    {
      key: 'configuration',
      header: 'Configuration',
      accessor: 'configuration' as const,
      render: (value: string) => value || '-',
    },
    {
      key: 'priceValue',
      header: 'Price',
      accessor: 'priceValue' as const,
      sortable: true,
      render: (value: number) => (
        <span className="font-medium text-gray-900">{formatPrice(value)}</span>
      ),
    },
    {
      key: 'builtUpArea',
      header: 'Area (sqft)',
      accessor: 'builtUpArea' as const,
      sortable: true,
      render: (value: number) => (value ? `${value.toLocaleString('en-IN')} sqft` : '-'),
    },
    {
      key: 'isActive',
      header: 'Status',
      accessor: 'isActive' as const,
      render: (value: boolean) => (
        <span
          className={clsx(
            'inline-flex items-center gap-1.5 text-sm font-medium',
            value ? 'text-green-600' : 'text-red-600'
          )}
        >
          <span
            className={clsx(
              'h-2 w-2 rounded-full',
              value ? 'bg-green-500' : 'bg-red-500'
            )}
          />
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      accessor: 'createdAt' as const,
      sortable: true,
      render: (value: string) => formatDate(value),
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (row: typeof properties[0]) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/properties/${row.id}/edit`}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit property"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <a
            href={`http://localhost:3003/properties/${row.slug}`}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title="View on public site"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={async () => {
              if (confirm(`Delete property "${row.name}"?`)) {
                try {
                  await deleteProperty(row.id).unwrap();
                } catch (err: any) {
                  alert(err?.data?.message || 'Failed to delete property');
                }
              }
            }}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Delete property"
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
            <p className="text-gray-500 mt-1">Manage all properties across projects.</p>
          </div>
          <Link href="/properties/new">
            <Button className="bg-navy-900 hover:bg-navy-800 text-white">
              <Plus className="mr-2 h-4 w-4" />
              New Property
            </Button>
          </Link>
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
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search properties..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                />
              </div>
              <select
                value={propertyType}
                onChange={(e) => {
                  setPropertyType(e.target.value);
                  setPage(1);
                }}
                className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {propertyTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DataTable
            data={properties}
            columns={columns}
            keyExtractor={(row) => row.id}
            loading={isLoading}
            emptyMessage="No properties found"
            pagination={{
              page,
              pageSize: limit,
              total: meta?.total || 0,
              onPageChange: setPage,
              onPageSizeChange: (size) => {
                setLimit(size);
                setPage(1);
              },
            }}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
