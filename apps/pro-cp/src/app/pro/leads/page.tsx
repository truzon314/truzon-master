'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { Search, Filter, Phone, Mail, UserPlus, Download, Sparkles } from 'lucide-react';

export default function ProLeadsPage() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const allLeads = [
    {
      id: 'LD-9021',
      name: 'Dr. Vikram Malhotra',
      phone: '+91 98112 34567',
      email: 'dr.malhotra@maxhealthcare.com',
      project: 'The Imperial Highlands',
      unitType: '4BHK Golf Villa (V-104)',
      budget: '₹ 4.80 Cr',
      propensity: 'HIGH (92%)',
      stage: 'SITE_VISIT_SCHEDULED',
      source: 'Direct Walk-in',
      assignedTo: 'Arjun Verma',
      createdAt: '2026-09-05',
    },
    {
      id: 'LD-9018',
      name: 'Pooja Hegde & Family',
      phone: '+91 98200 88991',
      email: 'pooja.hegde@luxurybrands.in',
      project: 'The Grand Meadow',
      unitType: '3BHK Courtyard (C-208)',
      budget: '₹ 3.10 Cr',
      propensity: 'MEDIUM (74%)',
      stage: 'NEGOTIATION',
      source: 'Square Yards Global (CP)',
      assignedTo: 'Arjun Verma',
      createdAt: '2026-09-04',
    },
    {
      id: 'LD-9015',
      name: 'Capt. R. K. Singhania',
      phone: '+91 99801 22334',
      email: 'rksinghania@aviation.org',
      project: 'The Imperial Highlands',
      unitType: '5BHK Signature Manor (M-002)',
      budget: '₹ 6.50 Cr',
      propensity: 'HIGH (96%)',
      stage: 'BOOKED',
      source: 'Investor Network',
      assignedTo: 'Arjun Verma',
      createdAt: '2026-09-02',
    },
    {
      id: 'LD-9009',
      name: 'Sameer Bansal',
      phone: '+91 97110 55667',
      email: 'sameer.b@fintechadvisors.io',
      project: 'Azure Bayfront',
      unitType: '4BHK Sky Penthouse (P-12)',
      budget: '₹ 5.25 Cr',
      propensity: 'HIGH (88%)',
      stage: 'QUALIFIED',
      source: 'Digital Ad Campaign',
      assignedTo: 'Arjun Verma',
      createdAt: '2026-09-01',
    },
    {
      id: 'LD-9004',
      name: 'Nitin Gadkari & Sons',
      phone: '+91 94221 00987',
      email: 'contact@gadkariinfra.com',
      project: 'The Grand Meadow',
      unitType: '4BHK Courtyard (C-110)',
      budget: '₹ 3.85 Cr',
      propensity: 'MEDIUM (68%)',
      stage: 'NEW',
      source: 'Website Form',
      assignedTo: 'Arjun Verma',
      createdAt: '2026-08-30',
    },
  ];

  const filteredLeads = allLeads.filter((l) => {
    const matchesTab = activeTab === 'ALL' || l.stage === activeTab;
    const matchesSearch =
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm) ||
      l.project.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const columns = [
    {
      key: 'name',
      header: 'Buyer Details',
      render: (_: any, row: any) => (
        <div>
          <div className="font-semibold text-[#0f1c3a]">{row.name}</div>
          <div className="text-xs text-slate-400">{row.email}</div>
          <div className="text-xs text-slate-500 font-mono mt-0.5">{row.phone}</div>
        </div>
      ),
    },
    {
      key: 'unitType',
      header: 'Interested Property',
      render: (_: any, row: any) => (
        <div>
          <div className="font-medium text-slate-800">{row.unitType}</div>
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
      key: 'propensity',
      header: 'Intent Propensity',
      render: (v: string) => (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          v.includes('HIGH') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {v}
        </span>
      ),
    },
    {
      key: 'stage',
      header: 'Pipeline Stage',
      render: (v: string) => {
        const stageColors: Record<string, 'gold' | 'navy' | 'emerald' | 'rose' | 'purple' | 'slate'> = {
          SITE_VISIT_SCHEDULED: 'gold',
          NEGOTIATION: 'purple',
          BOOKED: 'emerald',
          QUALIFIED: 'navy',
          NEW: 'slate',
        };
        return (
          <Badge variant={stageColors[v] || 'slate'} size="sm" dot>
            {v.replace(/_/g, ' ')}
          </Badge>
        );
      },
    },
    {
      key: 'source',
      header: 'Attributed Channel',
      render: (v: string) => (
        <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
          {v}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout portal="PRO">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0f1c3a] tracking-tight">
              Leads CRM & Stage Flow
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Active buyer leads assigned to your sales portfolio. Track stage progressions and customer intent.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm">
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export CSV
            </Button>
            <Button variant="primary" size="sm">
              <UserPlus className="w-3.5 h-3.5 mr-1.5" />
              Add New Lead
            </Button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <Card padding="sm" className="space-y-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search leads by name, phone, project..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f1c3a]/20 focus:bg-white focus:border-[#0f1c3a]"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {['ALL', 'NEW', 'QUALIFIED', 'SITE_VISIT_SCHEDULED', 'NEGOTIATION', 'BOOKED'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === tab
                      ? 'bg-[#0f1c3a] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab === 'ALL' ? 'All Leads' : tab.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Leads DataTable */}
        <DataTable
          data={filteredLeads}
          columns={columns}
          keyExtractor={(row) => row.id}
          actions={[
            {
              label: 'Call',
              onClick: (row) => alert(`Calling ${row.name} at ${row.phone}`),
              variant: 'outline',
            },
            {
              label: 'Update Stage',
              onClick: (row) => alert(`Update stage for ${row.name}`),
              variant: 'primary',
            },
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
