'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { Users, Download, UserCheck, Shield, FileText } from 'lucide-react';

export default function ProCustomersPage() {
  const customers = [
    {
      id: 'CUST-8821',
      name: 'Capt. R. K. Singhania',
      email: 'rksinghania@aviation.org',
      phone: '+91 99801 22334',
      unit: 'M-002 (Signature Manor)',
      project: 'The Imperial Highlands',
      agreementValue: '₹ 6.50 Cr',
      paidAmount: '₹ 1.30 Cr (20%)',
      kycStatus: 'VERIFIED',
      atsStatus: 'EXECUTED',
      allotmentDate: '2026-08-15',
    },
    {
      id: 'CUST-8815',
      name: 'Dr. Alok Nath & Sunita Nath',
      email: 'alok.nath@medcity.in',
      phone: '+91 98450 11223',
      unit: 'V-102 (Golf Villa)',
      project: 'The Imperial Highlands',
      agreementValue: '₹ 4.75 Cr',
      paidAmount: '₹ 95.0 Lakh (20%)',
      kycStatus: 'VERIFIED',
      atsStatus: 'FRANKING_PENDING',
      allotmentDate: '2026-08-01',
    },
    {
      id: 'CUST-8809',
      name: 'Kavita Chawla',
      email: 'kavita@chawlagroup.com',
      phone: '+91 98100 77665',
      unit: 'C-104 (Courtyard Villa)',
      project: 'The Grand Meadow',
      agreementValue: '₹ 3.40 Cr',
      paidAmount: '₹ 68.0 Lakh (20%)',
      kycStatus: 'UNDER_REVIEW',
      atsStatus: 'DRAFTING',
      allotmentDate: '2026-07-20',
    },
  ];

  const columns = [
    {
      key: 'name',
      header: 'Customer Details',
      render: (_: any, row: any) => (
        <div>
          <div className="font-semibold text-[#0f1c3a]">{row.name}</div>
          <div className="text-xs text-slate-400">{row.email} • {row.id}</div>
        </div>
      ),
    },
    {
      key: 'unit',
      header: 'Allotted Property',
      render: (_: any, row: any) => (
        <div>
          <div className="font-medium text-slate-800">{row.unit}</div>
          <div className="text-xs text-slate-400">{row.project}</div>
        </div>
      ),
    },
    {
      key: 'agreementValue',
      header: 'Agreement Value',
      render: (v: string) => <span className="font-semibold text-[#0f1c3a]">{v}</span>,
    },
    {
      key: 'paidAmount',
      header: 'Collected (MTD)',
      render: (v: string) => <span className="text-xs font-semibold text-emerald-700">{v}</span>,
    },
    {
      key: 'kycStatus',
      header: 'KYC Verification',
      render: (v: string) => (
        <Badge variant={v === 'VERIFIED' ? 'emerald' : 'gold'} size="sm" dot>
          {v}
        </Badge>
      ),
    },
    {
      key: 'atsStatus',
      header: 'ATS Status',
      render: (v: string) => (
        <Badge variant={v === 'EXECUTED' ? 'emerald' : 'navy'} size="sm">
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
              Customer Accounts & KYC
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Confirmed buyers, allotted inventory, PAN/Aadhaar verification, and legal documentation.
            </p>
          </div>

          <Button variant="outline" size="sm">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Customer Records
          </Button>
        </div>

        <DataTable
          data={customers}
          columns={columns}
          keyExtractor={(row) => row.id}
          actions={[
            {
              label: 'View Dossier',
              onClick: (row) => alert(`Viewing buyer dossier for ${row.name}`),
              variant: 'outline',
            },
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
