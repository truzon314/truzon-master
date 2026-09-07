'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { FileCheck, Download, Plus, Stamp } from 'lucide-react';

export default function ProAgreementsPage() {
  const agreements = [
    {
      id: 'ATS-2026-031',
      unit: 'M-002 (Imperial Highlands)',
      buyer: 'Capt. R. K. Singhania',
      lawFirm: 'Khaitan & Co. Legal Advocates',
      stage: 'EXECUTED_AND_REGISTERED',
      stampDuty: '₹ 39.0 Lakh (6%) Paid',
      executionDate: '2026-08-30',
      possessionTarget: 'December 2027',
    },
    {
      id: 'ATS-2026-028',
      unit: 'V-102 (Imperial Highlands)',
      buyer: 'Dr. Alok Nath & Sunita Nath',
      lawFirm: 'Shardul Amarchand Mangaldas',
      stage: 'FRANKING_PENDING',
      stampDuty: '₹ 28.5 Lakh (Challan Generated)',
      executionDate: 'In Progress',
      possessionTarget: 'December 2027',
    },
    {
      id: 'ATS-2026-025',
      unit: 'C-104 (The Grand Meadow)',
      buyer: 'Kavita Chawla',
      lawFirm: 'Internal Legal Desk (Truzon)',
      stage: 'DRAFT_SENT_FOR_REVIEW',
      stampDuty: 'Pending Verification',
      executionDate: 'Pending Signatures',
      possessionTarget: 'March 2028',
    },
  ];

  const columns = [
    {
      key: 'id',
      header: 'ATS Document Ref',
      render: (_: any, row: any) => (
        <div>
          <div className="font-semibold text-[#0f1c3a]">{row.id}</div>
          <div className="text-xs text-slate-400">{row.possessionTarget}</div>
        </div>
      ),
    },
    {
      key: 'unit',
      header: 'Contracted Unit',
      render: (_: any, row: any) => (
        <div>
          <div className="font-medium text-slate-800">{row.unit}</div>
          <div className="text-xs text-slate-400">{row.buyer}</div>
        </div>
      ),
    },
    {
      key: 'lawFirm',
      header: 'Drafting Legal Counsel',
      render: (v: string) => <span className="text-xs text-slate-600">{v}</span>,
    },
    {
      key: 'stampDuty',
      header: 'Stamp Duty & Franking',
      render: (v: string) => <span className="text-xs font-semibold text-slate-800">{v}</span>,
    },
    {
      key: 'stage',
      header: 'Execution Status',
      render: (v: string) => (
        <Badge variant={v === 'EXECUTED_AND_REGISTERED' ? 'emerald' : v === 'FRANKING_PENDING' ? 'gold' : 'navy'} size="sm" dot>
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
              ATS Legal Agreements & Franking
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Agreement for Sale (ATS) execution, e-stamping, and government registration workflow.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm">
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export ATS Log
            </Button>
            <Button variant="primary" size="sm">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Generate ATS Draft
            </Button>
          </div>
        </div>

        <DataTable
          data={agreements}
          columns={columns}
          keyExtractor={(row) => row.id}
          actions={[
            {
              label: 'View Agreement',
              onClick: (row) => alert(`Opening signed ATS PDF for ${row.id}`),
              variant: 'outline',
            },
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
