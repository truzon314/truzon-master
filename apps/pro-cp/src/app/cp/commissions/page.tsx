'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { CreditCard, Download, CheckCircle2, ArrowUpRight, Upload } from 'lucide-react';

export default function CpCommissionsPage() {
  const statCards = [
    { title: 'Total Commission Earned', value: '₹ 55.50 Lakh', desc: 'FY26 Gross Brokerage' },
    { title: 'Disbursed to Bank Account', value: '₹ 38.00 Lakh', desc: 'Direct RTGS Transfers with UTR' },
    { title: 'Pending Milestone Payouts', value: '₹ 17.50 Lakh', desc: 'ATS Execution / Handover Due' },
  ];

  const payouts = [
    {
      id: 'PAY-CP-8801',
      bookingId: 'BK-CP-079',
      client: 'Pooja Hegde & Family',
      milestone: 'Token Confirmation (20% Advance)',
      grossAmount: '₹ 1.86 Lakh',
      tds: '₹ 9,300 (5% u/s 194H)',
      netPaid: '₹ 1.767 Lakh',
      utr: 'HDFCR520260904991',
      payoutDate: '2026-09-04',
      status: 'PAID',
    },
    {
      id: 'PAY-CP-8750',
      bookingId: 'BK-CP-062',
      client: 'Sunil & Ritu Grover',
      milestone: 'ATS Registered (30% Sourcing)',
      grossAmount: '₹ 4.32 Lakh',
      tds: '₹ 21,600 (5% u/s 194H)',
      netPaid: '₹ 4.104 Lakh',
      utr: 'ICICR520260815123',
      payoutDate: '2026-08-15',
      status: 'PAID',
    },
    {
      id: 'PAY-CP-8710',
      bookingId: 'BK-CP-051',
      client: 'Dr. Anand Mahindra Trust',
      milestone: 'Possession Clearance (50% Completion)',
      grossAmount: '₹ 9.30 Lakh',
      tds: '₹ 46,500 (5% u/s 194H)',
      netPaid: '₹ 8.835 Lakh',
      utr: 'UTIB000293026052',
      payoutDate: '2026-06-01',
      status: 'PAID',
    },
  ];

  const columns = [
    {
      key: 'id',
      header: 'Disbursement Ref',
      render: (_: any, row: any) => (
        <div>
          <div className="font-semibold text-[#0f1c3a]">{row.id}</div>
          <div className="text-xs text-slate-400">{row.payoutDate} • {row.bookingId}</div>
        </div>
      ),
    },
    {
      key: 'client',
      header: 'Buyer Client',
      render: (_: any, row: any) => (
        <div>
          <div className="font-medium text-slate-800">{row.client}</div>
          <div className="text-xs text-slate-400">{row.milestone}</div>
        </div>
      ),
    },
    {
      key: 'grossAmount',
      header: 'Gross Brokerage',
      render: (v: string) => <span className="font-semibold text-[#0f1c3a]">{v}</span>,
    },
    {
      key: 'tds',
      header: 'TDS Deduction (5%)',
      render: (v: string) => <span className="text-xs text-slate-500 font-medium">{v}</span>,
    },
    {
      key: 'netPaid',
      header: 'Net Disbursed',
      render: (v: string) => <span className="font-bold text-emerald-700">{v}</span>,
    },
    {
      key: 'utr',
      header: 'Bank Transfer UTR',
      render: (v: string) => <span className="font-mono text-xs text-slate-700">{v}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (v: string) => <Badge variant="emerald" size="sm" dot>{v}</Badge>,
    },
  ];

  return (
    <DashboardLayout portal="CP">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0f1c3a] tracking-tight">
              Commission Ledger & Payouts
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Transparent milestone disbursements, TDS certificates (Form 16A), and bank UTR confirmations.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm">
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download TDS Summary
            </Button>
            <Button variant="gold" size="sm">
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              Upload GST Invoice
            </Button>
          </div>
        </div>

        {/* Top 3 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {statCards.map((stat, idx) => (
            <Card key={idx} padding="md" variant={idx === 0 ? 'gold' : 'default'}>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{stat.title}</p>
              <p className="text-3xl font-bold text-[#0f1c3a] mt-2 font-sans">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-2 font-medium">{stat.desc}</p>
            </Card>
          ))}
        </div>

        <DataTable
          data={payouts}
          columns={columns}
          keyExtractor={(row) => row.id}
          actions={[
            {
              label: 'Voucher PDF',
              onClick: (row) => alert(`Downloading voucher for ${row.id}`),
              variant: 'outline',
            },
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
