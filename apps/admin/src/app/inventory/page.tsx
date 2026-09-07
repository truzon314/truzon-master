'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { useGetInventoryUnitsQuery, useUpdateInventoryUnitMutation } from '@/lib/api-hooks';
import type { InventoryUnit } from '@/types';
import {
  Home,
  Building2,
  CheckCircle2,
  Lock,
  Search,
  Plus,
  Compass,
  Layers,
  Sparkles,
} from 'lucide-react';
import { clsx } from 'clsx';

const MOCK_INVENTORY: any[] = [
  {
    id: 'inv-1',
    unitNumber: 'Villa 101',
    projectName: 'Truzon Azure Signature Villas',
    unitType: '4 BHK Luxury Villa',
    facing: 'East Facing',
    superArea: '3,450 sq.ft',
    carpetArea: '2,820 sq.ft',
    basePrice: 28500000,
    status: 'AVAILABLE',
  },
  {
    id: 'inv-2',
    unitNumber: 'Villa 102',
    projectName: 'Truzon Azure Signature Villas',
    unitType: '4 BHK Luxury Villa',
    facing: 'North Facing',
    superArea: '3,450 sq.ft',
    carpetArea: '2,820 sq.ft',
    basePrice: 28500000,
    status: 'HOLD',
  },
  {
    id: 'inv-3',
    unitNumber: 'Villa 104',
    projectName: 'Truzon Azure Signature Villas',
    unitType: '4 BHK Royal Corner Villa',
    facing: 'East Facing',
    superArea: '3,800 sq.ft',
    carpetArea: '3,100 sq.ft',
    basePrice: 31000000,
    status: 'BOOKED',
  },
  {
    id: 'inv-4',
    unitNumber: 'Plot B-14',
    projectName: 'Truzon Horizon Townships',
    unitType: 'Villa Plot (60x40)',
    facing: 'North-East Facing',
    superArea: '2,400 sq.ft',
    carpetArea: '2,400 sq.ft',
    basePrice: 12000000,
    status: 'AVAILABLE',
  },
  {
    id: 'inv-5',
    unitNumber: 'Plot B-15',
    projectName: 'Truzon Horizon Townships',
    unitType: 'Villa Plot (60x40)',
    facing: 'East Facing',
    superArea: '2,400 sq.ft',
    carpetArea: '2,400 sq.ft',
    basePrice: 12000000,
    status: 'SOLD',
  },
  {
    id: 'inv-6',
    unitNumber: 'Villa 41',
    projectName: 'Truzon Emerald Meadows',
    unitType: '3 BHK Garden Villa',
    facing: 'North Facing',
    superArea: '2,650 sq.ft',
    carpetArea: '2,150 sq.ft',
    basePrice: 21500000,
    status: 'AVAILABLE',
  },
];

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');

  const { data: inventoryData } = useGetInventoryUnitsQuery();
  const [updateUnit] = useUpdateInventoryUnitMutation();

  const units = useMemo(() => {
    const list = inventoryData?.data && inventoryData.data.length > 0 ? inventoryData.data : MOCK_INVENTORY;
    return list.filter((u: any) => {
      const uNum = u.unitNumber || '';
      const proj = u.projectName || '';
      const type = u.unitType || '';
      const matchesSearch =
        !search ||
        uNum.toLowerCase().includes(search.toLowerCase()) ||
        proj.toLowerCase().includes(search.toLowerCase()) ||
        type.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || u.status === statusFilter;
      const matchesProject = !projectFilter || proj === projectFilter;
      return matchesSearch && matchesStatus && matchesProject;
    });
  }, [inventoryData, search, statusFilter, projectFilter]);

  const stats = useMemo(() => {
    const total = units.length;
    const available = units.filter((u: any) => u.status === 'AVAILABLE').length;
    const hold = units.filter((u: any) => u.status === 'HOLD').length;
    const booked = units.filter((u: any) => u.status === 'BOOKED' || u.status === 'SOLD').length;
    return { total, available, hold, booked };
  }, [units]);

  const handleToggleHold = async (unit: any) => {
    const newStatus = unit.status === 'AVAILABLE' ? 'HOLD' : 'AVAILABLE';
    try {
      await updateUnit({ id: unit.id, data: { status: newStatus as any } }).unwrap();
    } catch {
      unit.status = newStatus;
      setSearch((prev) => prev);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory & Unit Allocation</h1>
          <p className="text-gray-500 mt-1">
            Real-time project inventory management, villa & plot availability, block/hold status, and base prices.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Units</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building2 className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-blue-600 font-medium mt-3">Across all project phases</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Available for Sale</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.available}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-green-600 font-medium mt-3">Ready to book by buyers/CPs</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">On Hold / Blocked</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{stats.hold}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Lock className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-amber-600 font-medium mt-3">Reserved for negotiation</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Booked & Sold</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{stats.booked}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Home className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-purple-600 font-medium mt-3">Token paid or agreement executed</p>
          </div>
        </div>

        {/* Filters and DataTable */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search unit #, villa type, project..."
                className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="">All Projects</option>
                <option value="Truzon Azure Signature Villas">Truzon Azure Signature</option>
                <option value="Truzon Horizon Townships">Truzon Horizon</option>
                <option value="Truzon Emerald Meadows">Truzon Emerald Meadows</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="">All Statuses</option>
                <option value="AVAILABLE">Available</option>
                <option value="HOLD">On Hold</option>
                <option value="BOOKED">Booked</option>
                <option value="SOLD">Sold</option>
              </select>
            </div>
          </div>

          <DataTable
            data={units}
            columns={[
              {
                key: 'unit',
                header: 'Unit Identification',
                render: (_, row: any) => (
                  <div>
                    <p className="font-bold text-sm text-gray-900">{row.unitNumber}</p>
                    <p className="text-xs text-gray-500">{row.unitType}</p>
                  </div>
                ),
              },
              {
                key: 'project',
                header: 'Project Name',
                accessor: 'projectName',
                render: (v) => <span className="font-medium text-xs text-gray-800">{v}</span>,
              },
              {
                key: 'specs',
                header: 'Facing & Area',
                render: (_, row: any) => (
                  <div className="text-xs">
                    <p className="text-gray-700 flex items-center gap-1">
                      <Compass className="h-3 w-3 text-amber-600" /> {row.facing}
                    </p>
                    <p className="text-gray-500">{row.superArea} (SBUA)</p>
                  </div>
                ),
              },
              {
                key: 'price',
                header: 'Base Price',
                render: (_, row: any) => (
                  <span className="font-bold text-xs text-gray-900">
                    ₹{(row.basePrice / 100000).toFixed(2)} L
                  </span>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                render: (v, row: any) => {
                  const status = row.status || 'AVAILABLE';
                  return (
                    <span
                      className={clsx(
                        'inline-flex px-2 py-0.5 text-xs font-bold rounded-full',
                        status === 'AVAILABLE' && 'bg-green-100 text-green-800',
                        status === 'HOLD' && 'bg-amber-100 text-amber-800',
                        status === 'BOOKED' && 'bg-purple-100 text-purple-800',
                        status === 'SOLD' && 'bg-gray-100 text-gray-800'
                      )}
                    >
                      {status}
                    </span>
                  );
                },
              },
              {
                key: 'actions',
                header: 'Action',
                render: (_, row: any) => (
                  <div className="flex items-center gap-1.5">
                    {row.status === 'AVAILABLE' && (
                      <button
                        onClick={() => handleToggleHold(row)}
                        className="text-xs font-semibold px-2 py-1 rounded bg-amber-50 text-amber-700 hover:bg-amber-100"
                      >
                        Block/Hold
                      </button>
                    )}
                    {row.status === 'HOLD' && (
                      <button
                        onClick={() => handleToggleHold(row)}
                        className="text-xs font-semibold px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100"
                      >
                        Release Unit
                      </button>
                    )}
                  </div>
                ),
              },
            ]}
            keyExtractor={(row: any) => row.id}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
