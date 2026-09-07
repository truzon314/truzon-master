'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { Calendar, Car, Clock, Plus, Download, CheckCircle2 } from 'lucide-react';

export default function CpSiteVisitsPage() {
  const [showModal, setShowModal] = useState(false);

  const visits = [
    {
      id: 'CP-TOUR-102',
      client: 'Pooja Hegde & Family',
      property: 'Courtyard Villa C-208 (The Grand Meadow)',
      dateTime: 'Friday, Sept 11 • 11:30 AM',
      pickupLocation: 'Bandra Kurla Complex (BKC), Mumbai',
      chauffeur: 'Assigned: Mercedes-Benz E-Class',
      status: 'CONFIRMED',
    },
    {
      id: 'CP-TOUR-099',
      client: 'Rohan Deshpande',
      property: '4BHK Golf Villa V-112 (Imperial Highlands)',
      dateTime: 'Saturday, Sept 12 • 03:00 PM',
      pickupLocation: 'JW Marriott, Juhu',
      chauffeur: 'Assigned: Toyota Innova Crysta VIP',
      status: 'CONFIRMED',
    },
  ];

  const columns = [
    {
      key: 'client',
      header: 'Client Details',
      render: (_: any, row: any) => (
        <div>
          <div className="font-semibold text-[#0f1c3a]">{row.client}</div>
          <div className="text-xs text-slate-400">{row.id}</div>
        </div>
      ),
    },
    {
      key: 'property',
      header: 'Walkthrough Villa',
      render: (v: string) => <span className="font-medium text-slate-800">{v}</span>,
    },
    {
      key: 'dateTime',
      header: 'Scheduled Date & Time',
      render: (v: string) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          {v}
        </div>
      ),
    },
    {
      key: 'chauffeur',
      header: 'Chauffeur Logistics',
      render: (_: any, row: any) => (
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-800">
            <Car className="w-3.5 h-3.5 text-[#c2941f]" />
            <span className="font-medium">{row.chauffeur}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Pickup: {row.pickupLocation}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (v: string) => (
        <Badge variant="emerald" size="sm" dot>
          {v}
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
              VIP Client Tours & Chauffeur Booking
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Arrange complimentary luxury car pickup and private sales gallery appointments for your high-net-worth clients.
            </p>
          </div>

          <Button variant="gold" size="sm" onClick={() => setShowModal(true)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Book VIP Tour & Chauffeur
          </Button>
        </div>

        <DataTable
          data={visits}
          columns={columns}
          keyExtractor={(row) => row.id}
          actions={[
            {
              label: 'Chauffeur Details',
              onClick: (row) => alert(`Chauffeur dispatched for ${row.client}`),
              variant: 'outline',
            },
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
