'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { Users, Clock, ShieldCheck, Download, Plus, Car } from 'lucide-react';
import Link from 'next/link';

export default function CpMyLeadsPage() {
  const leads = [
    {
      id: 'CP-CL-401',
      name: 'Pooja Hegde & Family',
      phone: '+91 98200 88991',
      email: 'pooja.hegde@luxurybrands.in',
      project: 'The Grand Meadow',
      villa: '3BHK Courtyard (C-208)',
      budget: '₹ 3.10 Cr',
      registeredOn: '2026-08-20',
      daysLeft: '45 Days Remaining',
      status: 'NEGOTIATION',
      estCommission: '₹ 9.30 Lakh',
    },
    {
      id: 'CP-CL-398',
      name: 'Rohan Deshpande',
      phone: '+91 98922 11002',
      email: 'rohan.d@deshpandeconsulting.com',
      project: 'The Imperial Highlands',
      villa: '4BHK Golf Villa (V-112)',
      budget: '₹ 4.80 Cr',
      registeredOn: '2026-08-28',
      daysLeft: '52 Days Remaining',
      status: 'SITE_TOUR_BOOKED',
      estCommission: '₹ 14.40 Lakh',
    },
    {
      id: 'CP-CL-385',
      name: 'Aditya Birla Chemicals (Corporate Client)',
      phone: '+91 98199 44332',
      email: 'invest@adityabirla.com',
      project: 'Azure Bayfront',
      villa: 'Penthouse P-14',
      budget: '₹ 6.00 Cr',
      registeredOn: '2026-08-05',
      daysLeft: '28 Days Remaining',
      status: 'ATS_PENDING',
      estCommission: '₹ 18.00 Lakh',
    },
  ];

  const columns = [
    {
      key: 'name',
      header: 'Protected Client',
      render: (_: any, row: any) => (
        <div>
          <div className="font-semibold text-[#0f1c3a]">{row.name}</div>
          <div className="text-xs text-slate-400">{row.email} • {row.phone}</div>
        </div>
      ),
    },
    {
      key: 'villa',
      header: 'Property of Interest',
      render: (_: any, row: any) => (
        <div>
          <div className="font-medium text-slate-800">{row.villa}</div>
          <div className="text-xs text-slate-400">{row.project}</div>
        </div>
      ),
    },
    {
      key: 'budget',
      header: 'Budget',
      render: (v: string) => <span className="font-semibold text-[#0f1c3a]">{v}</span>,
    },
    {
      key: 'daysLeft',
      header: '60-Day Protection Period',
      render: (v: string) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <Clock className="w-3 h-3 text-emerald-600" />
          {v}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (v: string) => (
        <Badge variant={v === 'ATS_PENDING' ? 'gold' : v === 'NEGOTIATION' ? 'purple' : 'navy'} size="sm" dot>
          {v.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      key: 'estCommission',
      header: 'Commission (3.0%)',
      render: (v: string) => <span className="font-bold text-emerald-700">{v}</span>,
    },
  ];

  return (
    <DashboardLayout portal="CP">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0f1c3a] tracking-tight">
              My Protected Clients
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Active buyer roster with non-circumvention coverage issued to Square Yards Global.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm">
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download Client Registry
            </Button>
            <Link href="/cp/register-lead">
              <Button variant="gold" size="sm">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Register New Buyer
              </Button>
            </Link>
          </div>
        </div>

        <DataTable
          data={leads}
          columns={columns}
          keyExtractor={(row) => row.id}
          actions={[
            {
              label: 'Book Tour',
              onClick: (row) => alert(`Book tour for ${row.name}`),
              variant: 'outline',
            },
            {
              label: 'View Certificate',
              onClick: (row) => alert(`Viewing certificate for ${row.id}`),
              variant: 'primary',
            },
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
