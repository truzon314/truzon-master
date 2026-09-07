'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import {
  Award,
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  Clock,
  ArrowUpRight,
  Sparkles,
  Plus,
  Car,
  FileCheck,
  Download,
} from 'lucide-react';
import Link from 'next/link';

export default function CpDashboardPage() {
  const statCards = [
    {
      title: 'Partner Tier Status',
      value: 'Platinum (3.0%)',
      desc: 'Top 5% National Broker Network',
      icon: Award,
      variant: 'gold' as const,
      color: 'bg-amber-100 text-amber-900',
    },
    {
      title: 'Protected Clients',
      value: '14 Active',
      desc: '100% Non-Circumvention Shield',
      icon: ShieldCheck,
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Sourced Volume (FY26)',
      value: '₹ 18.5 Cr',
      desc: '4 Confirmed Villa Allotments',
      icon: ShoppingBag,
      color: 'bg-blue-50 text-[#0f1c3a]',
    },
    {
      title: 'Approved Commission',
      value: '₹ 55.5 Lakh',
      desc: '₹ 38.0 L Disbursed • ₹ 17.5 L In Clearing',
      icon: CreditCard,
      color: 'bg-purple-50 text-purple-700',
    },
  ];

  const protectedClients = [
    {
      id: 'CP-CL-401',
      name: 'Pooja Hegde & Family',
      phone: '+91 98200 88991',
      project: 'The Grand Meadow',
      villa: '3BHK Courtyard (C-208)',
      registeredOn: '2026-08-20',
      daysRemaining: '45 Days Remaining',
      status: 'NEGOTIATION',
      estCommission: '₹ 9.30 Lakh (3.0%)',
    },
    {
      id: 'CP-CL-398',
      name: 'Rohan Deshpande',
      phone: '+91 98922 11002',
      project: 'The Imperial Highlands',
      villa: '4BHK Golf Villa (V-112)',
      registeredOn: '2026-08-28',
      daysRemaining: '52 Days Remaining',
      status: 'SITE_TOUR_BOOKED',
      estCommission: '₹ 14.40 Lakh (3.0%)',
    },
    {
      id: 'CP-CL-385',
      name: 'Aditya Birla Chemicals (Corporate)',
      phone: '+91 98199 44332',
      project: 'Azure Bayfront',
      villa: 'Penthouse P-14',
      registeredOn: '2026-08-05',
      daysRemaining: '28 Days Remaining',
      status: 'ATS_PENDING',
      estCommission: '₹ 18.00 Lakh (3.0%)',
    },
  ];

  const clientColumns = [
    {
      key: 'name',
      header: 'Protected Client',
      render: (_: any, row: any) => (
        <div>
          <div className="font-semibold text-[#0f1c3a]">{row.name}</div>
          <div className="text-xs text-slate-400">{row.phone} • {row.id}</div>
        </div>
      ),
    },
    {
      key: 'villa',
      header: 'Interested Property',
      render: (_: any, row: any) => (
        <div>
          <div className="font-medium text-slate-800">{row.villa}</div>
          <div className="text-xs text-slate-400">{row.project}</div>
        </div>
      ),
    },
    {
      key: 'daysRemaining',
      header: 'Protection Period',
      render: (v: string) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <Clock className="w-3 h-3 text-emerald-600" />
          {v}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Stage Status',
      render: (v: string) => (
        <Badge variant={v === 'ATS_PENDING' ? 'gold' : v === 'NEGOTIATION' ? 'purple' : 'navy'} size="sm" dot>
          {v.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      key: 'estCommission',
      header: 'Est. Commission',
      render: (v: string) => <span className="font-semibold text-emerald-700">{v}</span>,
    },
  ];

  return (
    <DashboardLayout portal="CP">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Accredited Broker Desk
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0f1c3a] tracking-tight mt-1">
              Square Yards Global Partner Desk
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Welcome back, <strong className="text-[#0f1c3a]">Rajesh Nair</strong>. Your agency is operating at <strong>Platinum Tier (3.0%)</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/cp/register-lead">
              <Button variant="gold" size="sm">
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                Register Protected Lead
              </Button>
            </Link>
            <Link href="/cp/site-visits">
              <Button variant="outline" size="sm">
                <Car className="w-4 h-4 mr-1.5" />
                Book VIP Client Tour
              </Button>
            </Link>
          </div>
        </div>

        {/* Top 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((stat, idx) => (
            <Card key={idx} padding="md" variant={stat.variant || 'default'} className="hover:border-slate-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-[#0f1c3a] mt-1.5 font-sans">{stat.value}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color} shadow-xs`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500 font-medium">{stat.desc}</p>
            </Card>
          ))}
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 2/3: Protected Clients DataTable */}
          <div className="lg:col-span-2 space-y-4">
            <Card padding="none">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-base text-[#0f1c3a]">Protected Client Roster</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Guaranteed 60-day non-circumvention attribution for all registered buyers
                  </p>
                </div>
                <Link href="/cp/my-leads">
                  <Button variant="outline" size="sm">
                    View All Clients
                  </Button>
                </Link>
              </div>

              <DataTable
                data={protectedClients}
                columns={clientColumns}
                keyExtractor={(row) => row.id}
                className="border-none rounded-t-none"
              />
            </Card>
          </div>

          {/* Right 1/3: Diamond Club Progress & Protection Notice */}
          <div className="space-y-6">
            {/* Diamond Progress Card */}
            <Card padding="md" variant="gold">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Progress to Diamond Apex (3.5%)
                </span>
                <span className="text-base font-bold text-amber-900 font-sans">52.8%</span>
              </div>
              <div className="w-full bg-amber-200/70 rounded-full h-2.5 overflow-hidden mb-3">
                <div className="bg-[#c2941f] h-full rounded-full transition-all duration-500" style={{ width: '52.8%' }} />
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                You have closed <strong>₹ 18.5 Cr</strong> this fiscal. Close <strong>₹ 16.5 Cr</strong> more before March 31 to unlock <strong>3.5% commission</strong> and the Switzerland luxury retreat.
              </p>
              <div className="mt-4 pt-3 border-t border-amber-200/60 flex justify-between items-center text-xs text-amber-900 font-semibold">
                <Link href="/cp/tier-status" className="hover:underline flex items-center gap-1">
                  <span>Explore Incentive Rewards</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>

            {/* Instant Protection Card */}
            <Card padding="md">
              <h3 className="font-semibold text-sm text-[#0f1c3a] mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                60-Day Commission Guarantee
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Every lead registered through your portal receives an official tamper-proof digital certificate ensuring your agency is credited regardless of walk-in path.
              </p>
              <Link href="/cp/register-lead">
                <Button variant="primary" size="sm" className="w-full">
                  Issue Digital Certificate
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
