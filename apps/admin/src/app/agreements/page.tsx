'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { useGetAgreementsQuery } from '@/lib/api-hooks';
import type { Agreement } from '@/types';
import {
  FileText,
  FileCheck,
  CheckCircle2,
  Clock,
  Search,
  Download,
  Shield,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { clsx } from 'clsx';

const MOCK_AGREEMENTS: any[] = [
  {
    id: 'agr-1',
    agreementNumber: 'ATS-TRZ-2026-018',
    buyerName: 'Kavita Sundaram',
    unitNumber: 'Villa 104 (4 BHK Luxury)',
    projectName: 'Truzon Azure Signature Villas',
    totalValue: 28500000,
    status: 'SIGNED_BY_BUYER',
    executedAt: '2026-08-25',
    stamped: true,
  },
  {
    id: 'agr-2',
    agreementNumber: 'ATS-TRZ-2026-019',
    buyerName: 'Meera Nambiar',
    unitNumber: 'Villa 42 (3 BHK Premium)',
    projectName: 'Truzon Emerald Meadows',
    totalValue: 21500000,
    status: 'FULLY_EXECUTED',
    executedAt: '2026-08-30',
    stamped: true,
  },
  {
    id: 'agr-3',
    agreementNumber: 'ATS-TRZ-2026-020',
    buyerName: 'Vivek Oberoi',
    unitNumber: 'Plot B-22 (2400 sq.ft)',
    projectName: 'Truzon Horizon Townships',
    totalValue: 12000000,
    status: 'DRAFT_SENT',
    executedAt: '2026-09-01',
    stamped: false,
  },
];

export default function AgreementsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: agreementsData } = useGetAgreementsQuery();

  const agreements = useMemo(() => {
    const list = agreementsData?.data && agreementsData.data.length > 0 ? agreementsData.data : MOCK_AGREEMENTS;
    return list.filter((a: any) => {
      const aNum = a.agreementNumber || '';
      const buyer = a.buyerName || '';
      const proj = a.projectName || '';
      const matchesSearch =
        !search ||
        aNum.toLowerCase().includes(search.toLowerCase()) ||
        buyer.toLowerCase().includes(search.toLowerCase()) ||
        proj.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [agreementsData, search, statusFilter]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sale Agreements & Legal Contracts</h1>
          <p className="text-gray-500 mt-1">
            Manage Agreement to Sell (ATS), e-stamp verification, Aadhaar e-sign, and registered sale deeds.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Agreements</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{agreements.length}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-blue-600 font-medium mt-3">Active contract lifecycle</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Fully Executed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {agreements.filter((a: any) => a.status === 'FULLY_EXECUTED').length}
                </p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileCheck className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-green-600 font-medium mt-3">Signed by Buyer & Developer</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Signatures</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">
                  {agreements.filter((a: any) => a.status !== 'FULLY_EXECUTED').length}
                </p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-amber-600 font-medium mt-3">Draft or buyer sign pending</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search agreement #, buyer, project..."
                className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="">All Contract Statuses</option>
              <option value="DRAFT_SENT">Draft Sent</option>
              <option value="SIGNED_BY_BUYER">Signed by Buyer</option>
              <option value="FULLY_EXECUTED">Fully Executed</option>
            </select>
          </div>

          <DataTable
            data={agreements}
            columns={[
              {
                key: 'agreement',
                header: 'Agreement Number',
                render: (_, row: any) => (
                  <div>
                    <p className="font-mono font-bold text-xs text-primary-700">{row.agreementNumber}</p>
                    <p className="text-[11px] text-gray-500">Date: {row.executedAt}</p>
                  </div>
                ),
              },
              {
                key: 'buyer',
                header: 'Buyer',
                accessor: 'buyerName',
                render: (v) => <p className="font-semibold text-xs text-gray-900">{v}</p>,
              },
              {
                key: 'unit',
                header: 'Project & Unit Allocation',
                render: (_, row: any) => (
                  <div>
                    <p className="font-semibold text-xs text-gray-900">{row.projectName}</p>
                    <p className="text-[11px] text-amber-700 font-semibold">{row.unitNumber}</p>
                  </div>
                ),
              },
              {
                key: 'value',
                header: 'Contract Value',
                render: (_, row: any) => (
                  <span className="font-bold text-xs text-gray-900">
                    ₹{(row.totalValue / 100000).toFixed(1)} L
                  </span>
                ),
              },
              {
                key: 'status',
                header: 'Signing Status',
                render: (v, row: any) => {
                  const status = row.status || 'DRAFT_SENT';
                  return (
                    <span
                      className={clsx(
                        'inline-flex px-2 py-0.5 text-xs font-bold rounded-full',
                        status === 'FULLY_EXECUTED' && 'bg-emerald-100 text-emerald-800',
                        status === 'SIGNED_BY_BUYER' && 'bg-blue-100 text-blue-800',
                        status === 'DRAFT_SENT' && 'bg-amber-100 text-amber-800'
                      )}
                    >
                      {status === 'FULLY_EXECUTED'
                        ? 'Fully Executed'
                        : status === 'SIGNED_BY_BUYER'
                        ? 'Signed by Buyer'
                        : 'Draft Sent'}
                    </span>
                  );
                },
              },
              {
                key: 'actions',
                header: 'Document',
                render: () => (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => alert('Opening signed legal ATS document...')}
                      className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" /> PDF
                    </button>
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
