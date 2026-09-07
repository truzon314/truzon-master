'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ShieldCheck, CheckCircle2, Lock, ArrowRight, FileCheck, Sparkles } from 'lucide-react';

export default function CpRegisterLeadPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    project: 'The Imperial Highlands',
    budgetRange: '₹ 4.0 Cr - ₹ 6.0 Cr',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <DashboardLayout portal="CP">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Agency Protection Protocol
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0f1c3a] tracking-tight mt-1">
            60-Day Client Protection Registration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Register prospective luxury homebuyers to lock in agency non-circumvention rights.
          </p>
        </div>

        {submitted ? (
          <Card padding="lg" variant="gold" className="text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-bold font-serif text-[#0f1c3a]">
                Client Protection Certificate Issued
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Certificate Ref: <strong className="font-mono text-[#0f1c3a]">TRZ-CP-2026-9904</strong>
              </p>
            </div>

            <div className="bg-white/80 p-5 rounded-xl border border-amber-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Protected Client:</span>
                <span className="font-semibold text-slate-900">{formData.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sourcing Agency:</span>
                <span className="font-semibold text-[#0f1c3a]">Square Yards Global</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Commission Slab:</span>
                <span className="font-semibold text-[#c2941f]">3.0% (Platinum Tier)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Protection Period:</span>
                <span className="font-semibold text-emerald-700">60 Days (Expires Nov 5, 2026)</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                Register Another Buyer
              </Button>
              <Button variant="gold" size="sm" onClick={() => alert('Downloading official stamped certificate PDF')}>
                Download Stamped PDF
              </Button>
            </div>
          </Card>
        ) : (
          <Card padding="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Client Full Name *"
                  required
                  placeholder="e.g. Dr. Raghav Singhal"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                />

                <Input
                  label="Client Mobile Number *"
                  required
                  type="tel"
                  placeholder="+91 98XXX XXXXX"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Client Email Address"
                  type="email"
                  placeholder="client@organization.com"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                />

                <div>
                  <label className="block text-xs font-semibold text-[#0f1c3a] mb-1.5">
                    Target Development
                  </label>
                  <select
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f1c3a]/20 focus:border-[#0f1c3a]"
                  >
                    <option>The Imperial Highlands (Golf Villas)</option>
                    <option>The Grand Meadow (Courtyard Residences)</option>
                    <option>Azure Bayfront (Sky Penthouses)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0f1c3a] mb-1.5">
                  Budget Expectation
                </label>
                <select
                  value={formData.budgetRange}
                  onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f1c3a]/20 focus:border-[#0f1c3a]"
                >
                  <option>₹ 2.5 Cr - ₹ 4.0 Cr</option>
                  <option>₹ 4.0 Cr - ₹ 6.0 Cr</option>
                  <option>₹ 6.0 Cr - ₹ 10.0 Cr</option>
                  <option>₹ 10.0 Cr+ (Signature Estate)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0f1c3a] mb-1.5">
                  Specific Requirements or Tour Timing
                </label>
                <textarea
                  rows={3}
                  placeholder="Notes on client preferences, family size, possession expectations..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f1c3a]/20 focus:border-[#0f1c3a]"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" variant="gold" size="lg" className="w-full">
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Generate 60-Day Digital Protection Certificate
                </Button>
              </div>

              <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" /> Tamper-proof digital certificate automatically issued to Square Yards Global
              </p>
            </form>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
