'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { ShoppingBag, Download, FileText, CheckCircle2 } from 'lucide-react';

export default function CpMyBookingsPage() {
  const bookings = [
    {
      id: 'BK-CP-079',
      client: 'Pooja Hegde & Family',
      unit: 'C-208 (The Grand Meadow)',
      agreementValue: '₹ 3.10 Cr',
      commissionSlab: '3.0% (Platinum)',
      totalCommission: '₹ 9.30 Lakh',
      disbursed: '₹ 1.86 Lakh (Token 20%)',
      pending: '₹ 7.44 Lakh',
      bookingDate: '2026-09-02',
      status: 'ATS_PENDING',
    },
    {
      id: 'BK-CP-062',
      client: 'Sunil & Ritu Grover',
      unit: 'V-106 (The Imperial Highlands)',
      agreementValue: '₹ 4.80 Cr',
      commissionSlab: '3.0% (Platinum)',
      totalCommission: '₹ 14.40 Lakh',
      disbursed: '₹ 7.20 Lakh (Token + ATS)',
      pending: '₹ 7.20 Lakh (Handover)',
      bookingDate: '2026-07-15',
      status: 'ATS_EXECUTED',
    },
    {
      id: 'BK-CP-051',
      client: 'Dr. Anand Mahindra Trust',
      unit: 'M-001 (The Imperial Highlands)',
      agreementValue: '₹ 6.20 Cr',
      commissionSlab: '3.0% (Platinum)',
      totalCommission: '₹ 18.60 Lakh',
      disbursed: '₹ 18.60 Lakh (100% Cleared)',
      pending: 'Nil',
      bookingDate: '2026-05-20',
      status: 'FULLY_DISBURSED',
    },
  ];

  const columns = [
    {
      key: 'id',
      header: 'Booking Ref',
      render: (_: any, row: any) => (
        <div>
          <div className="font-semibold text-[#0f1c3a]">{row.id}</div>
          <div className="text-xs text-slate-400">{row.bookingDate}</div>
        </div>
      ),
    },
    {
      key: 'client',
      header: 'Client & Property',
      render: (_: any, row: any) => (
        <div>
          <div className="font-medium text-slate-800">{row.client}</div>
          <div className="text-xs text-slate-400">{row.unit}</div>
        </div>
      ),
    },
    {
      key: 'agreementValue',
      header: 'Deal Value',
      render: (v: string) => <span className="font-semibold text-[#0f1c3a]">{v}</span>,
    },
    {
      key: 'totalCommission',
      header: 'Total Brokerage',
      render: (_: any, row: any) => (
        <div>
          <div className="font-bold text-emerald-700">{row.totalCommission}</div>
          <div className="text-[10px] text-[#c2941f] font-medium">{row.commissionSlab}</div>
        </div>
      ),
    },
    {
      key: 'disbursed',
      header: 'Paid to Date',
      render: (v: string) => <span className="text-xs font-semibold text-slate-800">{v}</span>,
    },
    {
      key: 'status',
      header: 'Disbursement Stage',
      render: (v: string) => (
        <Badge variant={v === 'FULLY_DISBURSED' ? 'emerald' : v === 'ATS_EXECUTED' ? 'navy' : 'gold'} size="sm" dot>
          {v.replace(/_/g, ' ')}
        </Badge>
      ),
    },
  ];

  return (
    <DashboardLayout portal="CP">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0f1c3a] tracking-tight">
              My Sourced Deals & Bookings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Confirmed buyer purchases credited to Square Yards Global with full deal value attribution.
            </p>
          </div>

          <Button variant="outline" size="sm">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Download Deals Statement
          </Button>
        </div>

        <DataTable
          data={bookings}
          columns={columns}
          keyExtractor={(row) => row.id}
          actions={[
            {
              label: 'Commission Invoice',
              onClick: (row) => alert(`Downloading Commission Invoice for ${row.id}`),
              variant: 'outline',
            },
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
