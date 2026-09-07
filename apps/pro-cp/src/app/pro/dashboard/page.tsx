'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import {
  Target,
  Calendar,
  ShoppingBag,
  TrendingUp,
  ArrowUpRight,
  UserPlus,
  PhoneCall,
  Clock,
  Car,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export default function ProDashboardPage() {
  const statCards = [
    {
      title: 'Active CRM Leads',
      value: '48',
      change: '+14% vs last month',
      changeType: 'positive',
      icon: Target,
      color: 'bg-blue-50 text-[#0f1c3a]',
    },
    {
      title: 'Site Walkthroughs Today',
      value: '6',
      change: '2 Chauffeurs dispatched',
      changeType: 'neutral',
      icon: Calendar,
      color: 'bg-amber-50 text-[#c2941f]',
    },
    {
      title: 'MTD Bookings Volume',
      value: '₹ 42.8 Cr',
      change: '18 Units confirmed',
      changeType: 'positive',
      icon: ShoppingBag,
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Sales Quota Pacing',
      value: '81.6%',
      change: 'Target: ₹ 50 Cr',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-700',
    },
  ];

  const recentLeads = [
    {
      id: 'LD-9021',
      name: 'Dr. Vikram Malhotra',
      phone: '+91 98112 34567',
      project: 'The Imperial Highlands',
      unitType: '4BHK Golf Villa (V-104)',
      budget: '₹ 4.80 Cr',
      stage: 'SITE_VISIT_SCHEDULED',
      source: 'Direct Walk-in',
      assignedTo: 'Arjun Verma',
    },
    {
      id: 'LD-9018',
      name: 'Pooja Hegde & Family',
      phone: '+91 98200 88991',
      project: 'The Grand Meadow',
      unitType: '3BHK Courtyard (C-208)',
      budget: '₹ 3.10 Cr',
      stage: 'NEGOTIATION',
      source: 'Square Yards Global (CP)',
      assignedTo: 'Arjun Verma',
    },
    {
      id: 'LD-9015',
      name: 'Capt. R. K. Singhania',
      phone: '+91 99801 22334',
      project: 'The Imperial Highlands',
      unitType: '5BHK Signature Manor (M-002)',
      budget: '₹ 6.50 Cr',
      stage: 'BOOKED',
      source: 'Investor Network',
      assignedTo: 'Arjun Verma',
    },
    {
      id: 'LD-9009',
      name: 'Sameer Bansal',
      phone: '+91 97110 55667',
      project: 'Azure Bayfront',
      unitType: '4BHK Sky Penthouse (P-12)',
      budget: '₹ 5.25 Cr',
      stage: 'QUALIFIED',
      source: 'Digital Ad Campaign',
      assignedTo: 'Arjun Verma',
    },
  ];

  const siteVisitsToday = [
    {
      time: '11:30 AM',
      visitor: 'Dr. Vikram Malhotra',
      villa: 'Villa V-104 (Imperial Highlands)',
      driver: 'Ramesh (Mercedes E-Class - DL 1C 4455)',
      status: 'En Route',
    },
    {
      time: '02:00 PM',
      visitor: 'Ananya Deshmukh',
      villa: 'Courtyard Villa C-302',
      driver: 'Kuldeep (Toyota Innova Crysta)',
      status: 'Confirmed',
    },
    {
      time: '04:30 PM',
      visitor: 'Sunil Mittal (NRI Client)',
      villa: 'Penthouse P-12',
      driver: 'VIP Chauffeur Assigned',
      status: 'Scheduled',
    },
  ];

  const leadColumns = [
    {
      key: 'name',
      header: 'Buyer Details',
      render: (_: any, row: any) => (
        <div>
          <div className="font-semibold text-[#0f1c3a]">{row.name}</div>
          <div className="text-xs text-slate-400">{row.phone} • {row.id}</div>
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
      render: (v: string) => <span className="font-semibold text-slate-900">{v}</span>,
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
      header: 'Lead Channel',
      render: (v: string) => <span className="text-xs text-slate-500">{v}</span>,
    },
  ];

  return (
    <DashboardLayout portal="PRO">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0f1c3a] tracking-tight">
              Master Sales CRM Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Welcome back, <strong className="text-[#0f1c3a]">Arjun Verma</strong>. You have <strong>6 tours</strong> and <strong>₹ 42.8 Cr</strong> in MTD sales.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm">
              Download Pipeline
            </Button>
            <Button variant="primary" size="sm">
              <UserPlus className="w-4 h-4 mr-1.5" />
              Create Direct Lead
            </Button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((stat, idx) => (
            <Card key={idx} padding="md" className="hover:border-slate-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-[#0f1c3a] mt-1.5 font-sans">{stat.value}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color} shadow-xs`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-xs text-slate-500">
                <span className="font-medium text-emerald-600 flex items-center mr-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  {stat.change}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 2/3: Recent Active Leads */}
          <div className="lg:col-span-2 space-y-4">
            <Card padding="none">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-base text-[#0f1c3a]">Priority Qualified Leads</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Real-time buyer accounts requiring immediate follow-up</p>
                </div>
                <Button variant="outline" size="sm">
                  View All Leads
                </Button>
              </div>

              <DataTable
                data={recentLeads}
                columns={leadColumns}
                keyExtractor={(row) => row.id}
                className="border-none rounded-t-none"
              />
            </Card>
          </div>

          {/* Right 1/3: Today's Site Visits & Quota */}
          <div className="space-y-6">
            {/* Site Visits Card */}
            <Card padding="md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-[#0f1c3a]">Site Walkthroughs Today</h3>
                <Badge variant="gold" size="sm">6 Booked</Badge>
              </div>

              <div className="space-y-3">
                {siteVisitsToday.map((visit, vIdx) => (
                  <div key={vIdx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0f1c3a] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {visit.time}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        visit.status === 'En Route' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {visit.status}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-900">{visit.visitor}</div>
                    <div className="text-[11px] text-slate-500">{visit.villa}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-1 border-t border-slate-200/60">
                      <Car className="w-3 h-3 text-slate-500" />
                      {visit.driver}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quota Progress */}
            <Card padding="md" variant="gold">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">MTD Target Pacing</span>
                <span className="text-base font-bold text-amber-900 font-sans">81.6%</span>
              </div>
              <div className="w-full bg-amber-200/70 rounded-full h-2 overflow-hidden mb-2">
                <div className="bg-[#c2941f] h-full rounded-full transition-all duration-500" style={{ width: '81.6%' }} />
              </div>
              <div className="flex justify-between text-xs text-amber-800">
                <span>Closed: ₹ 42.8 Cr</span>
                <span className="font-semibold">Goal: ₹ 50.0 Cr</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
