'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  Settings as SettingsIcon,
  Globe,
  Smartphone,
  ShieldCheck,
  Server,
  Check,
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'public-web' | 'pro' | 'cp' | 'integrations'>('general');
  const [savedMessage, setSavedMessage] = useState(false);

  // Form states
  const [platformName, setPlatformName] = useState('Truzon Master Control Plane');
  const [supportEmail, setSupportEmail] = useState('admin@truzon.in');
  const [publicWebUrl, setPublicWebUrl] = useState('http://localhost:3003');
  const [publicMetaTitle, setPublicMetaTitle] = useState('Truzon Living | Luxury Sustainable Townships');
  const [enableMaintenanceMode, setEnableMaintenanceMode] = useState(false);
  const [enableCpAutoApproval, setEnableCpAutoApproval] = useState(false);
  const [defaultCpCommission, setDefaultCpCommission] = useState('2.5');
  const [bookingHoldPeriodHours, setBookingHoldPeriodHours] = useState('48');
  const [leadNotificationPhone, setLeadNotificationPhone] = useState('+91 98765 43210');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                Platform Configuration
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">Platform & Web Apps Settings</h1>
            <p className="text-sm text-slate-400">
              Master control settings governing Public Web frontend, Pro Portal CRM, and CP network parameters
            </p>
          </div>
          {savedMessage && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold">
              <Check className="w-4 h-4" />
              Settings successfully saved!
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-6">
          {[
            { id: 'general', label: 'Global General', icon: SettingsIcon },
            { id: 'public-web', label: 'Public Web CMS', icon: Globe },
            { id: 'pro', label: 'Pro CRM & Sales', icon: Smartphone },
            { id: 'cp', label: 'CP Network Rules', icon: ShieldCheck },
            { id: 'integrations', label: 'API & Gateways', icon: Server },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 pb-3 text-sm font-medium transition-all relative ${
                  activeTab === tab.id
                    ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-6">
              <h2 className="text-base font-bold text-white">General Platform Identity</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Platform Display Name</label>
                  <Input
                    value={platformName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlatformName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Primary System Email</label>
                  <Input
                    type="email"
                    value={supportEmail}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSupportEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">System Maintenance Mode</h3>
                  <p className="text-xs text-slate-400">
                    When enabled, Public Web and Pro portals will display a maintenance notice to external users.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableMaintenanceMode(!enableMaintenanceMode)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 cursor-pointer ${
                    enableMaintenanceMode ? 'bg-amber-500 justify-end' : 'bg-slate-800 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>
            </div>
          )}

          {/* Public Web CMS Tab */}
          {activeTab === 'public-web' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-6">
              <h2 className="text-base font-bold text-white">Public Web Application (@truzon/public-web)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Public Web Base URL</label>
                  <Input
                    value={publicWebUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPublicWebUrl(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Default SEO Meta Title</label>
                  <Input
                    value={publicMetaTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPublicMetaTitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Instant WhatsApp / SMS Alerts Phone</label>
                  <Input
                    value={leadNotificationPhone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLeadNotificationPhone(e.target.value)}
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Target phone number for instant Public Web brochure & lead alerts.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Pro Tab */}
          {activeTab === 'pro' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-6">
              <h2 className="text-base font-bold text-white">Pro Portal & CRM Parameters</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Unit Reservation Hold Window (Hours)</label>
                  <Input
                    type="number"
                    value={bookingHoldPeriodHours}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBookingHoldPeriodHours(e.target.value)}
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Duration a villa unit remains in HOLD status before auto-releasing if token is uncollected.
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Mandatory ATS Agreement Legal Stamp (₹)</label>
                  <Input defaultValue="500" />
                </div>
              </div>
            </div>
          )}

          {/* CP Tab */}
          {activeTab === 'cp' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-6">
              <h2 className="text-base font-bold text-white">Channel Partner Network Rules</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Default Baseline Commission (%)</label>
                  <Input
                    value={defaultCpCommission}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDefaultCpCommission(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Auto-approve Verified RERA Brokers</h3>
                  <p className="text-xs text-slate-400">
                    Automatically onboard channel partners if valid Maharashtra/Karnataka RERA ID is provided.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableCpAutoApproval(!enableCpAutoApproval)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 cursor-pointer ${
                    enableCpAutoApproval ? 'bg-amber-500 justify-end' : 'bg-slate-800 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-6">
              <h2 className="text-base font-bold text-white">Connected Gateways & Services</h2>
              <div className="space-y-4">
                {[
                  { name: 'Payment Gateway (Razorpay)', status: 'Connected', key: 'rzp_live_••••••••8819' },
                  { name: 'WhatsApp Business API (Gupshup)', status: 'Connected', key: 'waba_id_••••••••4102' },
                  { name: 'Transactional Email (SendGrid / Postmark)', status: 'Connected', key: 'SG.••••••••9942' },
                  { name: 'Digital Signatures (Leegality e-Sign)', status: 'Connected', key: 'leg_auth_••••••••1138' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-950/40 rounded-lg border border-slate-800">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200">{item.name}</h4>
                      <code className="text-xs font-mono text-slate-400">{item.key}</code>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="outline">
              Discard
            </Button>
            <Button type="submit" variant="primary">
              Save Master Settings
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
