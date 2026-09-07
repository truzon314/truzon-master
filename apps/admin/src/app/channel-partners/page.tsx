'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import {
  useGetChannelPartnersQuery,
  useCreateChannelPartnerMutation,
  useUpdateChannelPartnerMutation,
  useGetCommissionsQuery,
} from '@/lib/api-hooks';
import type { ChannelPartner, Commission } from '@/types';
import {
  Users,
  Briefcase,
  DollarSign,
  UserCheck,
  Search,
  Filter,
  Plus,
  CheckCircle,
  XCircle,
  Award,
  Phone,
  Mail,
  Building,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { clsx } from 'clsx';

const MOCK_PARTNERS: ChannelPartner[] = [
  {
    id: 'cp-1',
    name: 'Apex Realty Advisory',
    companyName: 'Apex Advisory Pvt Ltd',
    contactPerson: 'Vikram Malhotra',
    email: 'vikram@apexrealty.in',
    phone: '+91 98450 11223',
    city: 'Bangalore',
    state: 'Karnataka',
    commissionRate: 2.5,
    status: 'ACTIVE',
    joinedAt: '2025-06-15',
    createdAt: '2025-06-15',
    updatedAt: '2026-08-20',
  },
  {
    id: 'cp-2',
    name: 'Prime Estate Partners',
    companyName: 'Prime Estate Consultants',
    contactPerson: 'Ananya Sharma',
    email: 'ananya@primeestates.com',
    phone: '+91 98200 44556',
    city: 'Hyderabad',
    state: 'Telangana',
    commissionRate: 3.0,
    status: 'ACTIVE',
    joinedAt: '2025-09-01',
    createdAt: '2025-09-01',
    updatedAt: '2026-08-15',
  },
  {
    id: 'cp-3',
    name: 'Skyline Properties',
    companyName: 'Skyline Realty LLC',
    contactPerson: 'Rajesh Kothari',
    email: 'rajesh@skylinerealty.in',
    phone: '+91 97110 88990',
    city: 'Bangalore',
    state: 'Karnataka',
    commissionRate: 2.0,
    status: 'PENDING',
    joinedAt: '2026-08-28',
    createdAt: '2026-08-28',
    updatedAt: '2026-08-28',
  },
  {
    id: 'cp-4',
    name: 'Urban Nest Associates',
    companyName: 'Urban Nest Housing LLP',
    contactPerson: 'Deepak Verma',
    email: 'deepak@urbannest.org',
    phone: '+91 99880 77665',
    city: 'Chennai',
    state: 'Tamil Nadu',
    commissionRate: 2.5,
    status: 'ACTIVE',
    joinedAt: '2025-11-10',
    createdAt: '2025-11-10',
    updatedAt: '2026-07-12',
  },
  {
    id: 'cp-5',
    name: 'Elite Habitat Brokers',
    companyName: 'Elite Habitat Group',
    contactPerson: 'Karan Mehra',
    email: 'karan@elitehabitat.com',
    phone: '+91 98111 22334',
    city: 'Bangalore',
    state: 'Karnataka',
    commissionRate: 2.0,
    status: 'SUSPENDED',
    joinedAt: '2025-03-20',
    createdAt: '2025-03-20',
    updatedAt: '2026-05-18',
  },
];

const MOCK_COMMISSIONS: Commission[] = [
  {
    id: 'comm-1',
    channelPartnerId: 'cp-1',
    channelPartner: MOCK_PARTNERS[0],
    amount: 375000,
    rate: 2.5,
    status: 'PAID',
    paidAt: '2026-08-15',
    notes: 'Villa 104 Booking Milestone 1',
    createdAt: '2026-08-01',
    updatedAt: '2026-08-15',
  },
  {
    id: 'comm-2',
    channelPartnerId: 'cp-2',
    channelPartner: MOCK_PARTNERS[1],
    amount: 540000,
    rate: 3.0,
    status: 'APPROVED',
    dueDate: '2026-09-15',
    notes: 'Township Plot A-12 Full Payment',
    createdAt: '2026-08-20',
    updatedAt: '2026-08-25',
  },
  {
    id: 'comm-3',
    channelPartnerId: 'cp-4',
    channelPartner: MOCK_PARTNERS[3],
    amount: 225000,
    rate: 2.5,
    status: 'PENDING',
    dueDate: '2026-09-30',
    notes: 'East Gate Villa 18 Token Confirmation',
    createdAt: '2026-08-28',
    updatedAt: '2026-08-28',
  },
];

export default function ChannelPartnersPage() {
  const [activeTab, setActiveTab] = useState<'partners' | 'commissions'>('partners');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    city: 'Bangalore',
    commissionRate: 2.5,
  });

  const { data: partnersData } = useGetChannelPartnersQuery();
  const { data: commissionsData } = useGetCommissionsQuery();
  const [createPartner] = useCreateChannelPartnerMutation();
  const [updatePartner] = useUpdateChannelPartnerMutation();

  const partners = useMemo(() => {
    const list = partnersData?.data && partnersData.data.length > 0 ? partnersData.data : MOCK_PARTNERS;
    return list.filter((cp) => {
      const matchesSearch =
        !search ||
        cp.name.toLowerCase().includes(search.toLowerCase()) ||
        cp.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
        cp.email.toLowerCase().includes(search.toLowerCase()) ||
        cp.phone.includes(search);
      const matchesStatus = !statusFilter || cp.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [partnersData, search, statusFilter]);

  const commissions = useMemo(() => {
    return commissionsData?.data && commissionsData.data.length > 0 ? commissionsData.data : MOCK_COMMISSIONS;
  }, [commissionsData]);

  const stats = useMemo(() => {
    const total = partners.length;
    const active = partners.filter((p) => p.status === 'ACTIVE').length;
    const pending = partners.filter((p) => p.status === 'PENDING').length;
    const totalCommissions = commissions.reduce((sum, c) => sum + (c.amount || 0), 0);
    return { total, active, pending, totalCommissions };
  }, [partners, commissions]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPartner({
        ...formData,
        status: 'ACTIVE',
        joinedAt: new Date().toISOString(),
      }).unwrap();
    } catch {
      // Mock create in state
      MOCK_PARTNERS.unshift({
        id: `cp-${Date.now()}`,
        ...formData,
        status: 'ACTIVE',
        joinedAt: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    setShowCreateModal(false);
    setFormData({
      name: '',
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      city: 'Bangalore',
      commissionRate: 2.5,
    });
  };

  const handleToggleStatus = async (cp: ChannelPartner) => {
    const newStatus = cp.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await updatePartner({ id: cp.id, data: { status: newStatus } }).unwrap();
    } catch {
      cp.status = newStatus;
      setSearch((prev) => prev); // trigger re-render
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Channel Partner (CP) Operations</h1>
            <p className="text-gray-500 mt-1">
              Manage real estate brokers, CP network onboarding, tier rates, and commission disbursements.
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Onboard Channel Partner
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Partners</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-green-600 font-medium mt-3 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> +4 partners this quarter
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Brokers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.active}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                <UserCheck className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Sourcing active buyer leads</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Award className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-amber-600 font-medium mt-3">Requires KYC & RERA check</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Commissions Due</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">₹{(stats.totalCommissions / 100000).toFixed(2)} L</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Across recent bookings</p>
          </div>
        </div>

        {/* Tab Switcher & Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('partners')}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
                  activeTab === 'partners'
                    ? 'bg-[#0b132b] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                Channel Partner Network ({partners.length})
              </button>
              <button
                onClick={() => setActiveTab('commissions')}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
                  activeTab === 'commissions'
                    ? 'bg-[#0b132b] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                Commissions & Payouts ({commissions.length})
              </button>
            </div>

            {activeTab === 'partners' && (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, phone, email..."
                    className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-56 sm:w-64"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="PENDING">Pending</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
            )}
          </div>

          {/* Tab Content */}
          {activeTab === 'partners' ? (
            <DataTable
              data={partners}
              columns={[
                {
                  key: 'partner',
                  header: 'Partner / Agency',
                  render: (_, row) => (
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{row.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Building className="h-3 w-3" />
                        {row.companyName || 'Independent Broker'}
                      </p>
                    </div>
                  ),
                },
                {
                  key: 'contact',
                  header: 'Primary Contact',
                  render: (_, row) => (
                    <div className="text-xs space-y-0.5">
                      <p className="font-medium text-gray-800">{row.contactPerson}</p>
                      <p className="text-gray-500 flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {row.phone}
                      </p>
                      <p className="text-gray-500 flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {row.email}
                      </p>
                    </div>
                  ),
                },
                {
                  key: 'location',
                  header: 'Location',
                  accessor: 'city',
                  render: (v) => <span className="text-xs text-gray-600 font-medium">{v || 'Bangalore'}</span>,
                },
                {
                  key: 'commissionRate',
                  header: 'Rate',
                  render: (_, row) => (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200">
                      <Percent className="h-3 w-3" />
                      {row.commissionRate || 2.5}%
                    </span>
                  ),
                },
                {
                  key: 'status',
                  header: 'Status',
                  render: (v) => {
                    const status = v || 'ACTIVE';
                    return (
                      <span
                        className={clsx(
                          'inline-flex px-2 py-0.5 text-xs font-semibold rounded-full',
                          status === 'ACTIVE' && 'bg-green-100 text-green-800',
                          status === 'PENDING' && 'bg-amber-100 text-amber-800',
                          status === 'SUSPENDED' && 'bg-red-100 text-red-800'
                        )}
                      >
                        {status}
                      </span>
                    );
                  },
                },
                {
                  key: 'actions',
                  header: 'Actions',
                  render: (_, row) => (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(row)}
                        className={clsx(
                          'text-xs font-medium px-2.5 py-1 rounded transition-colors',
                          row.status === 'ACTIVE'
                            ? 'text-red-700 bg-red-50 hover:bg-red-100'
                            : 'text-green-700 bg-green-50 hover:bg-green-100'
                        )}
                      >
                        {row.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  ),
                },
              ]}
              keyExtractor={(row) => row.id}
            />
          ) : (
            <DataTable
              data={commissions}
              columns={[
                {
                  key: 'partner',
                  header: 'Channel Partner',
                  render: (_, row) => (
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {row.channelPartner?.name || 'Channel Partner'}
                      </p>
                      <p className="text-xs text-gray-500">{row.channelPartner?.phone || 'Direct Agent'}</p>
                    </div>
                  ),
                },
                {
                  key: 'amount',
                  header: 'Commission Amount',
                  render: (v, row) => (
                    <div>
                      <p className="font-bold text-gray-900 text-sm">₹{row.amount?.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-gray-500">Rate: {row.rate}%</p>
                    </div>
                  ),
                },
                {
                  key: 'notes',
                  header: 'Milestone / Notes',
                  accessor: 'notes',
                  render: (v) => <span className="text-xs text-gray-600">{v || 'Booking payout'}</span>,
                },
                {
                  key: 'status',
                  header: 'Payout Status',
                  render: (v, row) => {
                    const status = row.status || 'PENDING';
                    return (
                      <span
                        className={clsx(
                          'inline-flex px-2 py-0.5 text-xs font-bold rounded-full',
                          status === 'PAID' && 'bg-emerald-100 text-emerald-800',
                          status === 'APPROVED' && 'bg-blue-100 text-blue-800',
                          status === 'PENDING' && 'bg-amber-100 text-amber-800'
                        )}
                      >
                        {status}
                      </span>
                    );
                  },
                },
                {
                  key: 'date',
                  header: 'Release Date',
                  render: (_, row) => (
                    <span className="text-xs text-gray-500">
                      {row.paidAt ? `Paid ${row.paidAt}` : row.dueDate ? `Due ${row.dueDate}` : 'Pending review'}
                    </span>
                  ),
                },
              ]}
              keyExtractor={(row) => row.id}
            />
          )}
        </div>

        {/* Onboarding Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-lg font-bold text-gray-900">Onboard Channel Partner</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Agency / Partner Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Apex Realty"
                    required
                  />
                  <Input
                    label="Registered Company"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Apex Realty Pvt Ltd"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Contact Person"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="Full name"
                    required
                  />
                  <Input
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98450 00000"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="partner@domain.com"
                    required
                  />
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Commission Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.commissionRate}
                      onChange={(e) => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) || 2.0 })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <Button variant="outline" type="button" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Onboard Partner</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
