'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { ShoppingBag, Download, Plus, Receipt } from 'lucide-react';

export default function ProBookingsPage() {
  const bookings = [
    {
      id: 'BK-2026-081',
      unit: 'V-104 (4BHK Golf Villa)',
      project: 'The Imperial Highlands',
      buyer: 'Dr. Vikram Malhotra',
      tokenAmount: '₹ 25.0 Lakh',
      agreementValue: '₹ 4.80 Cr',
      date: '2026-09-04',
      status: 'TOKEN_CONFIRMED',
      brokerChannel: 'Direct Walk-in',
      brokerFee: 'Nil',
    },
    {
      id: 'BK-2026-079',
      unit: 'C-208 (3BHK Courtyard)',
      project: 'The Grand Meadow',
      buyer: 'Pooja Hegde & Family',
      tokenAmount: '₹ 20.0 Lakh',
      agreementValue: '₹ 3.10 Cr',
      date: '2026-09-02',
      status: 'ALLOTMENT_ISSUED',
      brokerChannel: 'Square Yards Global (CP)',
      brokerFee: '3.0% (₹ 9.30 L)',
    },
    {
      id: 'BK-2026-074',
      unit: 'M-002 (5BHK Signature Manor)',
      project: 'The Imperial Highlands',
      buyer: 'Capt. R. K. Singhania',
      tokenAmount: '₹ 50.0 Lakh',
      agreementValue: '₹ 6.50 Cr',
      date: '2026-08-28',
      status: 'ATS_EXECUTED',
      brokerChannel: 'Investor Referral',
      brokerFee: '2.0% (₹ 13.0 L)',
    },
  ];

  const columns = [
    {
      key: 'id',
      header: 'Booking Ref',
      render: (_: any, row: any) => (
        <div>
          <div className="font-semibold text-[#0f1c3a]">{row.id}</div>
          <div className="text-xs text-slate-400">{row.date}</div>
        </div>
      ),
    },
    {
      key: 'unit',
      header: 'Allocated Property',
      render: (_: any, row: any) => (
        <div>
          <div className="font-medium text-slate-800">{row.unit}</div>
          <div className="text-xs text-slate-400">{row.project}</div>
        </div>
      ),
    },
    {
      key: 'buyer',
      header: 'Buyer Account',
      render: (v: string) => <span className="font-medium text-slate-900">{v}</span>,
    },
    {
      key: 'tokenAmount',
      header: 'Token Received',
      render: (v: string) => <span className="font-semibold text-emerald-700">{v}</span>,
    },
    {
      key: 'agreementValue',
      header: 'Agreement Value',
      render: (v: string) => <span className="font-semibold text-[#0f1c3a]">{v}</span>,
    },
    {
      key: 'brokerChannel',
      header: 'Channel Attribution',
      render: (_: any, row: any) => (
        <div>
          <div className="text-xs font-medium text-slate-800">{row.brokerChannel}</div>
          <div className="text-[10px] text-amber-800 font-semibold">{row.brokerFee}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Stage Status',
      render: (v: string) => (
        <Badge variant={v === 'ATS_EXECUTED' ? 'emerald' : 'gold'} size="sm" dot>
          {v.replace(/_/g, ' ')}
        </Badge>
      ),
    },
  ];

  return (
    <DashboardLayout portal="PRO">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0f1c3a] tracking-tight">
              Bookings & Unit Allotment
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Token transactions, allotment letters, and broker commission eligibility tags.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm">
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download Allotments
            </Button>
            <Button variant="primary" size="sm">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Record Booking
            </Button>
          </div>
        </div>

        <DataTable
          data={bookings}
          columns={columns}
          keyExtractor={(row) => row.id}
          actions={[
            {
              label: 'Allotment Letter',
              onClick: (row) => alert(`Generating Allotment Letter for ${row.id}`),
              variant: 'outline',
            },
            {
              label: 'Receipt',
              onClick: (row) => alert(`Downloading official receipt for ${row.id}`),
              variant: 'primary',
            },
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
