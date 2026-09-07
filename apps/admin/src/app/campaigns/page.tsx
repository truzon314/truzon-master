'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { useGetCampaignsQuery, useCreateCampaignMutation } from '@/lib/api-hooks';
import type { Campaign } from '@/types';
import {
  Megaphone,
  TrendingUp,
  Target,
  DollarSign,
  Search,
  Plus,
  Calendar,
  Share2,
} from 'lucide-react';
import { clsx } from 'clsx';

const MOCK_CAMPAIGNS: any[] = [
  {
    id: 'cmp-1',
    name: 'North Bangalore Luxury Villa Launch',
    channel: 'Google Search & Display',
    budget: 600000,
    spent: 420000,
    targetLeads: 250,
    actualLeads: 310,
    status: 'ACTIVE',
    startDate: '2026-08-01',
    endDate: '2026-09-30',
  },
  {
    id: 'cmp-2',
    name: 'Monsoon Villa Fest 2026',
    channel: 'Meta (Instagram / FB Ads)',
    budget: 450000,
    spent: 390000,
    targetLeads: 200,
    actualLeads: 245,
    status: 'ACTIVE',
    startDate: '2026-08-10',
    endDate: '2026-09-15',
  },
  {
    id: 'cmp-3',
    name: 'NRI Airport Corridor Drive',
    channel: 'LinkedIn Sponsored Content',
    budget: 800000,
    spent: 750000,
    targetLeads: 150,
    actualLeads: 180,
    status: 'ACTIVE',
    startDate: '2026-07-15',
    endDate: '2026-09-15',
  },
  {
    id: 'cmp-4',
    name: 'Channel Partner Roadshow Q2',
    channel: 'Offline CP Events & Webinars',
    budget: 500000,
    spent: 500000,
    targetLeads: 100,
    actualLeads: 120,
    status: 'COMPLETED',
    startDate: '2026-06-01',
    endDate: '2026-06-30',
  },
];

export default function CampaignsPage() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    channel: 'Google Ads',
    budget: '500000',
    targetLeads: '200',
  });

  const { data: campaignsData } = useGetCampaignsQuery();
  const [createCampaign] = useCreateCampaignMutation();

  const campaigns = useMemo(() => {
    const list = campaignsData?.data && campaignsData.data.length > 0 ? campaignsData.data : MOCK_CAMPAIGNS;
    return list.filter((c: any) => {
      const name = c.name || '';
      const channel = c.channel || '';
      return (
        !search ||
        name.toLowerCase().includes(search.toLowerCase()) ||
        channel.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [campaignsData, search]);

  const stats = useMemo(() => {
    const totalSpent = campaigns.reduce((sum: number, c: any) => sum + (c.spent || 0), 0);
    const totalLeads = campaigns.reduce((sum: number, c: any) => sum + (c.actualLeads || 0), 0);
    const avgCpl = totalLeads > 0 ? Math.round(totalSpent / totalLeads) : 0;
    return { activeCount: campaigns.filter((c: any) => c.status === 'ACTIVE').length, totalSpent, totalLeads, avgCpl };
  }, [campaigns]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    MOCK_CAMPAIGNS.unshift({
      id: `cmp-${Date.now()}`,
      name: formData.name,
      channel: formData.channel,
      budget: parseFloat(formData.budget) || 500000,
      spent: 0,
      targetLeads: parseInt(formData.targetLeads) || 200,
      actualLeads: 0,
      status: 'ACTIVE',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-10-31',
    });
    setShowModal(false);
    setFormData({ name: '', channel: 'Google Ads', budget: '500000', targetLeads: '200' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Marketing Campaigns & Source Attribution</h1>
            <p className="text-gray-500 mt-1">
              Track ad spend, digital leads, Cost Per Lead (CPL), CP incentive drives, and campaign ROI.
            </p>
          </div>
          <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Launch Campaign
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeCount}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Megaphone className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-blue-600 font-medium mt-3">Live ad channels</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Ad Spend</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">₹{(stats.totalSpent / 100000).toFixed(1)} L</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-green-600 font-medium mt-3">Current quarter</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Leads Sourced</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{stats.totalLeads}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Target className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-purple-600 font-medium mt-3">Direct attributed buyers</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Average CPL</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">₹{stats.avgCpl}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-amber-600 font-medium mt-3">Cost Per Qualified Lead</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search campaign name or channel..."
                className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
              />
            </div>
          </div>

          <DataTable
            data={campaigns}
            columns={[
              {
                key: 'name',
                header: 'Campaign Name',
                render: (_, row: any) => (
                  <div>
                    <p className="font-bold text-xs text-gray-900">{row.name}</p>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="h-3 w-3" /> {row.startDate} to {row.endDate}
                    </p>
                  </div>
                ),
              },
              {
                key: 'channel',
                header: 'Marketing Channel',
                accessor: 'channel',
                render: (v) => <span className="font-medium text-xs text-gray-800">{v}</span>,
              },
              {
                key: 'budget',
                header: 'Budget & Spent',
                render: (_, row: any) => (
                  <div>
                    <p className="font-bold text-xs text-gray-900">₹{(row.spent / 1000).toFixed(0)}k</p>
                    <p className="text-[11px] text-gray-500">Cap: ₹{(row.budget / 1000).toFixed(0)}k</p>
                  </div>
                ),
              },
              {
                key: 'leads',
                header: 'Leads Generated',
                render: (_, row: any) => (
                  <div>
                    <p className="font-bold text-xs text-purple-700">{row.actualLeads} leads</p>
                    <p className="text-[11px] text-gray-500">Target: {row.targetLeads}</p>
                  </div>
                ),
              },
              {
                key: 'cpl',
                header: 'CPL',
                render: (_, row: any) => {
                  const cpl = row.actualLeads > 0 ? Math.round(row.spent / row.actualLeads) : 0;
                  return <span className="font-bold text-xs text-emerald-700">₹{cpl}</span>;
                },
              },
              {
                key: 'status',
                header: 'Status',
                render: (v, row: any) => {
                  const status = row.status || 'ACTIVE';
                  return (
                    <span
                      className={clsx(
                        'inline-flex px-2 py-0.5 text-xs font-bold rounded-full',
                        status === 'ACTIVE' && 'bg-green-100 text-green-800',
                        status === 'COMPLETED' && 'bg-gray-100 text-gray-800'
                      )}
                    >
                      {status}
                    </span>
                  );
                },
              },
            ]}
            keyExtractor={(row: any) => row.id}
          />
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-lg font-bold text-gray-900">Launch New Marketing Campaign</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <Input
                  label="Campaign Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Airport Corridor Villa Drive"
                  required
                />
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Ad Channel</label>
                  <select
                    value={formData.channel}
                    onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                  >
                    <option value="Google Search & Display">Google Search & Display</option>
                    <option value="Meta (Instagram / FB Ads)">Meta (Instagram / FB Ads)</option>
                    <option value="LinkedIn Sponsored Content">LinkedIn Sponsored Content</option>
                    <option value="Channel Partner Drive">Channel Partner Drive</option>
                    <option value="Hoardings & Print Media">Hoardings & Print Media</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Budget (₹)"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    required
                  />
                  <Input
                    label="Target Leads"
                    value={formData.targetLeads}
                    onChange={(e) => setFormData({ ...formData, targetLeads: e.target.value })}
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit">Launch</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
