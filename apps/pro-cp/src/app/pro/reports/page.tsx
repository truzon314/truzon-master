'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BarChart3, TrendingUp, Download, Calendar, Target, Award, ArrowUpRight } from 'lucide-react';

export default function ProReportsPage() {
  const salesLeaderboard = [
    { rank: 1, name: 'Arjun Verma (You)', closed: '₹ 42.8 Cr', deals: 18, quota: '85.6%', badge: 'Top Producer' },
    { rank: 2, name: 'Sneha Kapoor', closed: '₹ 38.5 Cr', deals: 15, quota: '77.0%', badge: 'Senior Exec' },
    { rank: 3, name: 'Devendra Singhal', closed: '₹ 31.0 Cr', deals: 12, quota: '62.0%', badge: 'Exec' },
    { rank: 4, name: 'Ritu Sharma', closed: '₹ 28.5 Cr', deals: 11, quota: '57.0%', badge: 'Associate' },
  ];

  const channelPerformance = [
    { channel: 'Channel Partner (CP) Broker Network', share: '48%', volume: '₹ 68.5 Cr', deals: 26 },
    { channel: 'Direct High-Net-Worth (HNW) Walk-ins', share: '32%', volume: '₹ 45.0 Cr', deals: 16 },
    { channel: 'Digital Campaigns & Private Equity', share: '20%', volume: '₹ 27.5 Cr', deals: 10 },
  ];

  return (
    <DashboardLayout portal="PRO">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0f1c3a] tracking-tight">
              Executive Sales Reports & Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Sales velocity, channel conversions, broker performance, and quota attainment.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              FY 2026 Q3
            </Button>
            <Button variant="primary" size="sm">
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export Analytics PDF
            </Button>
          </div>
        </div>

        {/* Top 3 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card padding="md">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Gross Closed Volume</p>
            <p className="text-3xl font-bold text-[#0f1c3a] mt-2 font-sans">₹ 141.0 Cr</p>
            <p className="text-xs text-emerald-600 mt-2 flex items-center font-medium">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +28.4% vs previous quarter
            </p>
          </Card>

          <Card padding="md">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tour-to-Booking Conversion</p>
            <p className="text-3xl font-bold text-[#0f1c3a] mt-2 font-sans">24.6%</p>
            <p className="text-xs text-emerald-600 mt-2 flex items-center font-medium">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> Industry benchmark: 18.0%
            </p>
          </Card>

          <Card padding="md" variant="gold">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-900">Average Unit Ticket Size</p>
            <p className="text-3xl font-bold text-amber-900 mt-2 font-sans">₹ 4.15 Cr</p>
            <p className="text-xs text-amber-800 mt-2 font-medium">
              Luxury Golf Villa segment leader
            </p>
          </Card>
        </div>

        {/* 2-Column Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Executive Leaderboard */}
          <Card padding="none">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-base text-[#0f1c3a]">Executive Sales Leaderboard</h3>
                <p className="text-xs text-slate-500 mt-0.5">Top-producing executives this quarter</p>
              </div>
              <Badge variant="gold" size="sm">Q3 Ranking</Badge>
            </div>

            <div className="p-5 space-y-4">
              {salesLeaderboard.map((item) => (
                <div key={item.rank} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      item.rank === 1 ? 'bg-[#c2941f] text-white shadow-xs' : 'bg-slate-200 text-slate-700'
                    }`}>
                      #{item.rank}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#0f1c3a]">{item.name}</div>
                      <div className="text-xs text-slate-400">{item.deals} Units Closed</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-[#0f1c3a]">{item.closed}</div>
                    <div className="text-xs text-emerald-600 font-semibold">{item.quota} Quota</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Sourcing Channel Breakdown */}
          <Card padding="none">
            <div className="p-5 border-b border-slate-200">
              <h3 className="font-semibold text-base text-[#0f1c3a]">Channel Attribution Breakdown</h3>
              <p className="text-xs text-slate-500 mt-0.5">Contribution to total sales velocity</p>
            </div>

            <div className="p-5 space-y-5">
              {channelPerformance.map((ch, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span>{ch.channel}</span>
                    <span className="text-[#0f1c3a]">{ch.volume} ({ch.share})</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        idx === 0 ? 'bg-[#c2941f]' : idx === 1 ? 'bg-[#0f1c3a]' : 'bg-slate-400'
                      }`}
                      style={{ width: ch.share }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 text-right">{ch.deals} Units Attributed</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
