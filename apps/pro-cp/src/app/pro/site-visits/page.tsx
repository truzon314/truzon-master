'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { Calendar, Car, Clock, UserCheck, Plus, Download } from 'lucide-react';

export default function ProSiteVisitsPage() {
  const visits = [
    {
      id: 'SV-101',
      visitor: 'Dr. Vikram Malhotra',
      phone: '+91 98112 34567',
      project: 'The Imperial Highlands',
      villa: 'Villa V-104 (4BHK Golf Villa)',
      dateTime: 'Today, 11:30 AM',
      chauffeur: 'Ramesh Kumar (Mercedes E-Class - DL 1C 4455)',
      status: 'En Route',
      notes: 'VIP Client. Request cold sparkling water & golf cart tour of back 9 holes.',
    },
    {
      id: 'SV-102',
      visitor: 'Ananya Deshmukh',
      phone: '+91 98201 55667',
      project: 'The Grand Meadow',
      villa: 'Courtyard Villa C-302',
      dateTime: 'Today, 02:00 PM',
      chauffeur: 'Kuldeep (Toyota Innova Crysta - DL 2C 8899)',
      status: 'Confirmed',
      notes: 'Interested in private pool customization options and payment schedules.',
    },
    {
      id: 'SV-103',
      visitor: 'Sunil Mittal (NRI Investor)',
      phone: '+971 50 123 4567',
      project: 'Azure Bayfront',
      villa: 'Sky Penthouse P-12',
      dateTime: 'Today, 04:30 PM',
      chauffeur: 'Airport VIP Chauffeur Assigned',
      status: 'Scheduled',
      notes: 'Arriving from Dubai via IGI Airport Terminal 3. Chauffeur airport pickup booked.',
    },
    {
      id: 'SV-104',
      visitor: 'Meera Nambiar',
      phone: '+91 97114 99002',
      project: 'The Imperial Highlands',
      villa: 'Villa V-108',
      dateTime: 'Tomorrow, 10:00 AM',
      chauffeur: 'Self Drive Walk-in',
      status: 'Confirmed',
      notes: 'Re-visit with interior architect to inspect ceiling heights.',
    },
  ];

  const columns = [
    {
      key: 'visitor',
      header: 'Visitor Details',
      render: (_: any, row: any) => (
        <div>
          <div className="font-semibold text-[#0f1c3a]">{row.visitor}</div>
          <div className="text-xs text-slate-400">{row.phone} • {row.id}</div>
        </div>
      ),
    },
    {
      key: 'villa',
      header: 'Walkthrough Villa',
      render: (_: any, row: any) => (
        <div>
          <div className="font-medium text-slate-800">{row.villa}</div>
          <div className="text-xs text-slate-400">{row.project}</div>
        </div>
      ),
    },
    {
      key: 'dateTime',
      header: 'Scheduled Slot',
      render: (v: string) => (
        <div className="flex items-center gap-1.5 text-slate-700 font-medium text-xs">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          {v}
        </div>
      ),
    },
    {
      key: 'chauffeur',
      header: 'Chauffeur Logistics',
      render: (v: string) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <Car className="w-3.5 h-3.5 text-[#c2941f] shrink-0" />
          <span>{v}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (v: string) => {
        const variant = v === 'En Route' ? 'gold' : v === 'Confirmed' ? 'emerald' : 'navy';
        return <Badge variant={variant} size="sm" dot>{v}</Badge>;
      },
    },
  ];

  return (
    <DashboardLayout portal="PRO">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0f1c3a] tracking-tight">
              Site Visits & Chauffeur Logistics
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              VIP property walkthroughs, hospitality logistics, and driver dispatches.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm">
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download Schedule
            </Button>
            <Button variant="primary" size="sm">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Book Walkthrough
            </Button>
          </div>
        </div>

        <DataTable
          data={visits}
          columns={columns}
          keyExtractor={(row) => row.id}
          actions={[
            {
              label: 'Track Driver',
              onClick: (row) => alert(`Tracking chauffeur for ${row.visitor}`),
              variant: 'outline',
            },
            {
              label: 'Log Feedback',
              onClick: (row) => alert(`Log site visit feedback for ${row.visitor}`),
              variant: 'primary',
            },
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
