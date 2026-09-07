'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import {
  Download,
  Users,
  IndianRupee,
  TrendingUp,
  Building,
  Filter,
} from 'lucide-react';

export default function ReportsAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'cp' | 'sales' | 'marketing'>('overview');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                Cross-Platform Intelligence
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">Operational Reports & Analytics</h1>
            <p className="text-sm text-slate-400">
              Unified intelligence across Public Web traffic, Pro CRM conversions, and Channel Partner contribution
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
              {(['7d', '30d', '90d', '1y'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                    timeRange === range
                      ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => alert(`Exporting ${activeTab.toUpperCase()} report as PDF/CSV for range: ${timeRange}`)}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-800 gap-6">
          {[
            { id: 'overview', label: 'Executive Overview' },
            { id: 'cp', label: 'CP Sourcing & Commission' },
            { id: 'sales', label: 'Unit Sales Velocity' },
            { id: 'marketing', label: 'Public Web Inquiries' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-sm font-medium transition-all relative ${
                activeTab === tab.id
                  ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Gross Booking Value</span>
              <IndianRupee className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white">₹ 42.80 Cr</div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% vs previous period</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">CP Sourced Share</span>
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">68.5%</div>
            <div className="flex items-center gap-1.5 text-xs text-purple-400 mt-2">
              <span>₹ 29.3 Cr through CP Network</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Public Web Leads</span>
              <Filter className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">1,248</div>
            <div className="flex items-center gap-1.5 text-xs text-blue-400 mt-2">
              <span>12.4% Tour Conversion rate</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Units Sold / Total</span>
              <Building className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">38 / 110</div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2">
              <span>Phase 1 72% Sold Out</span>
            </div>
          </div>
        </div>

        {/* Visual breakdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Channel Partner Contribution Chart / List */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">Top Channel Partners by Production</h2>
              <span className="text-xs text-slate-400">Current quarter</span>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Square Yards Global', deals: 12, volume: '₹ 14.4 Cr', cpShare: '35%' },
                { name: 'Anarock Property Consultants', deals: 9, volume: '₹ 11.2 Cr', cpShare: '28%' },
                { name: 'HDFC Realty Network', deals: 6, volume: '₹ 7.8 Cr', cpShare: '18%' },
                { name: 'Direct Truzon Web Inquiries', deals: 8, volume: '₹ 9.4 Cr', cpShare: '19%' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{item.name}</span>
                    <span className="font-mono text-amber-400">{item.volume} ({item.deals} villas)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full"
                      style={{ width: item.cpShare }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Public Web Funnel Performance */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">Public Web Inquiries to Booking Funnel</h2>
              <span className="text-xs text-slate-400">Conversion breakdown</span>
            </div>
            <div className="space-y-3">
              {[
                { stage: '1. Website Pageviews (truzon.in)', count: '48,200', pct: '100%', color: 'bg-slate-700' },
                { stage: '2. Brochure & Contact Form Inquiries', count: '1,248', pct: '2.5%', color: 'bg-blue-600' },
                { stage: '3. Qualified Sales Pipeline Leads', count: '540', pct: '43.2%', color: 'bg-indigo-600' },
                { stage: '4. Physical Site Visits / Villa Tours', count: '168', pct: '31.1%', color: 'bg-purple-600' },
                { stage: '5. Token Bookings & ATS Executions', count: '38', pct: '22.6%', color: 'bg-emerald-600' },
              ].map((step, idx) => (
                <div key={idx} className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-300">{step.stage}</span>
                    <span className="font-mono text-white font-semibold">{step.count} ({step.pct})</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className={`${step.color} h-full rounded-full`} style={{ width: `${Math.max(10, 100 - idx * 20)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
