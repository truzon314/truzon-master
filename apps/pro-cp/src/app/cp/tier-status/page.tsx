'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Award, Sparkles, Check, ArrowUpRight, Plane, Gift } from 'lucide-react';

export default function CpTierStatusPage() {
  const tiers = [
    {
      name: 'Silver Partner',
      slab: '2.0% Commission',
      threshold: 'Up to ₹ 5 Cr Volume',
      perks: ['Standard Lead Protection (30 Days)', 'Digital Marketing Kit Access', 'Monthly Payout Cycle'],
      current: false,
    },
    {
      name: 'Gold Partner',
      slab: '2.5% Commission',
      threshold: '₹ 5 Cr - ₹ 15 Cr Volume',
      perks: ['Extended Lead Protection (45 Days)', 'Priority Luxury Chauffeur Booking', 'Bi-Weekly Payout Cycle', 'Quarterly Incentive Pool'],
      current: false,
    },
    {
      name: 'Platinum Partner',
      slab: '3.0% Commission',
      threshold: '₹ 15 Cr - ₹ 35 Cr Volume',
      perks: ['Full 60-Day Non-Circumvention Protection', 'Dedicated Executive Relationship Manager', 'Instant Weekly Payouts', 'Annual Switzerland Retreat for Top Producers'],
      current: true,
    },
    {
      name: 'Diamond Apex Club',
      slab: '3.5% Commission',
      threshold: '₹ 35 Cr+ Volume',
      perks: ['Unrestricted 90-Day Protection', 'Custom Co-Branded Marketing Campaigns', 'Direct Board Access & Land Sharehold Options', 'Luxury Sedan Vehicle Incentive'],
      current: false,
    },
  ];

  return (
    <DashboardLayout portal="CP">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Agency Recognition & Incentives
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0f1c3a] tracking-tight mt-1">
            Broker Tier Slabs & Incentive Rewards
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Square Yards Global is currently accredited at <strong className="text-amber-800">Platinum Partner (3.0%)</strong> based on FY26 performance.
          </p>
        </div>

        {/* Current Standing Hero Card */}
        <Card padding="lg" variant="gold" className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Your Current Accreditation</span>
            <h2 className="text-2xl font-bold text-[#0f1c3a] font-serif mt-1 flex items-center gap-2">
              <span>Platinum Tier Partner (3.0%)</span>
              <Sparkles className="w-5 h-5 text-[#c2941f]" />
            </h2>
            <p className="text-xs text-slate-600 mt-2 max-w-lg leading-relaxed">
              Your closed volume is <strong>₹ 18.5 Cr</strong> this fiscal year. You need only <strong>₹ 16.5 Cr</strong> in additional sales before March 31 to unlock <strong>Diamond Club (3.5%)</strong> and the all-expenses-paid Switzerland luxury retreat.
            </p>
          </div>

          <div className="w-full md:w-72 bg-white p-5 rounded-xl border border-amber-200 shadow-sm space-y-3 shrink-0">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-semibold text-slate-500">Progress to Diamond</span>
              <span className="text-xl font-bold text-[#c2941f] font-sans">52.8%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div className="bg-[#c2941f] h-full rounded-full transition-all duration-500" style={{ width: '52.8%' }} />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Current: ₹ 18.5 Cr</span>
              <span className="text-slate-800 font-semibold">Target: ₹ 35.0 Cr</span>
            </div>
          </div>
        </Card>

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, idx) => (
            <Card
              key={idx}
              padding="md"
              variant={tier.current ? 'gold' : 'default'}
              className={`flex flex-col justify-between ${tier.current ? 'ring-2 ring-[#c2941f]/30' : ''}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[#0f1c3a]">{tier.name}</h3>
                  {tier.current && (
                    <Badge variant="gold" size="sm" dot>
                      Active Tier
                    </Badge>
                  )}
                </div>

                <div className={`text-2xl font-bold font-sans tracking-tight mb-1 ${tier.current ? 'text-[#c2941f]' : 'text-[#0f1c3a]'}`}>
                  {tier.slab}
                </div>
                <p className="text-xs text-slate-500 mb-4">{tier.threshold}</p>

                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  {tier.perks.map((perk, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
