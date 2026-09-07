'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { CreditCard, Download, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProPaymentsPage() {
  const payments = [
    {
      id: 'TXN-9901',
      buyer: 'Capt. R. K. Singhania',
      unit: 'M-002 (Imperial Highlands)',
      milestone: 'Plinth Foundation Stage (15%)',
      amount: '₹ 97.5 Lakh',
      method: 'RTGS / HDFC Bank',
      utr: 'HDFCR520260904001',
      date: '2026-09-04',
      status: 'RECONCILED',
    },
    {
      id: 'TXN-9895',
      buyer: 'Dr. Vikram Malhotra',
      unit: 'V-104 (Imperial Highlands)',
      milestone: 'Booking Token (Booking Deposit)',
      amount: '₹ 25.0 Lakh',
      method: 'NEFT / ICICI Bank',
      utr: 'ICICR520260903009',
      date: '2026-09-03',
      status: 'RECONCILED',
    },
    {
      id: 'TXN-9890',
      buyer: 'Pooja Hegde & Family',
      unit: 'C-208 (The Grand Meadow)',
      milestone: 'Booking Token (Deposit)',
      amount: '₹ 20.0 Lakh',
      method: 'Bank Wire / Kotak',
      utr: 'KOTKR520260902044',
      date: '2026-09-02',
      status: 'UNDER_CLEARANCE',
    },
  ];

  const columns = [
    {
      key: 'id',
      header: 'Transaction ID',
      render: (_: any, row: any) => (
        <div>
          <div className="font-semibold text-[#0f1c3a]">{row.id}</div>
          <div className="text-xs text-slate-400">{row.date}</div>
        </div>
      ),
    },
    {
      key: 'buyer',
      header: 'Buyer & Property',
      render: (_: any, row: any) => (
        <div>
          <div className="font-medium text-slate-800">{row.buyer}</div>
          <div className="text-xs text-slate-400">{row.unit}</div>
        </div>
      ),
    },
    {
      key: 'milestone',
      header: 'Milestone Stage',
      render: (v: string) => <span className="text-xs text-slate-600 font-medium">{v}</span>,
    },
    {
      key: 'amount',
      header: 'Disbursed Amount',
      render: (v: string) => <span className="font-bold text-[#0f1c3a]">{v}</span>,
    },
    {
      key: 'utr',
      header: 'Bank UTR & Mode',
      render: (_: any, row: any) => (
        <div>
          <div className="font-mono text-xs text-slate-800">{row.utr}</div>
          <div className="text-[10px] text-slate-400">{row.method}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Reconciliation',
      render: (v: string) => (
        <Badge variant={v === 'RECONCILED' ? 'emerald' : 'gold'} size="sm" dot>
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
              Payment Collections & Reconciliation
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track construction milestone demands, bank transfers, and verified receipts.
            </p>
          </div>

          <Button variant="outline" size="sm">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Bank Report
          </Button>
        </div>

        <DataTable
          data={payments}
          columns={columns}
          keyExtractor={(row) => row.id}
          actions={[
            {
              label: 'Tax Invoice',
              onClick: (row) => alert(`Generating Tax Invoice for ${row.id}`),
              variant: 'outline',
            },
            {
              label: 'Download Receipt',
              onClick: (row) => alert(`Downloading Receipt for ${row.id}`),
              variant: 'primary',
            },
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
