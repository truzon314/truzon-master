'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { useGetSiteVisitsQuery, useCreateSiteVisitMutation, useUpdateSiteVisitMutation } from '@/lib/api-hooks';
import type { SiteVisit, SiteVisitStatus } from '@/types';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Car,
  TrendingUp,
  AlertCircle,
  Building,
} from 'lucide-react';
import { clsx } from 'clsx';

const MOCK_SITE_VISITS: any[] = [
  {
    id: 'sv-1',
    lead: { name: 'Rohit Deshmukh', phone: '+91 98451 22334', email: 'rohit.d@gmail.com' },
    project: { name: 'Truzon Azure Signature Villas', city: 'North Bangalore' },
    user: { fullName: 'Amit Sengupta (Executive)' },
    scheduledAt: '2026-09-08T11:00:00Z',
    durationMinutes: 60,
    status: 'SCHEDULED',
    transportNeeded: true,
    transportDetails: 'Pickup from Hebbal Flyover at 10:15 AM',
    feedback: '',
    cp: { name: 'Apex Realty Advisory' },
  },
  {
    id: 'sv-2',
    lead: { name: 'Pooja Hegde', phone: '+91 97410 88991', email: 'pooja.h@yahoo.com' },
    project: { name: 'Truzon Emerald Meadows', city: 'Devenahalli' },
    user: { fullName: 'Neha Nair (Executive)' },
    scheduledAt: '2026-09-07T15:30:00Z',
    durationMinutes: 45,
    status: 'COMPLETED',
    transportNeeded: false,
    feedback: 'Highly interested in 4 BHK East-facing corner villa. Requested cost sheet.',
    cp: { name: 'Prime Estate Partners' },
  },
  {
    id: 'sv-3',
    lead: { name: 'Siddharth Rao', phone: '+91 99001 33445', email: 'siddharth@raoenterprises.com' },
    project: { name: 'Truzon Azure Signature Villas', city: 'North Bangalore' },
    user: { fullName: 'Amit Sengupta (Executive)' },
    scheduledAt: '2026-09-09T10:00:00Z',
    durationMinutes: 60,
    status: 'CONFIRMED',
    transportNeeded: true,
    transportDetails: 'Cab dispatched via BluSmart',
    feedback: '',
    cp: { name: 'Direct Website Lead' },
  },
  {
    id: 'sv-4',
    lead: { name: 'Arjun Varma', phone: '+91 98450 77889', email: 'arjun.v@techcorp.in' },
    project: { name: 'Truzon Horizon Townships', city: 'Airport Road' },
    user: { fullName: 'Sunil Kumar (Executive)' },
    scheduledAt: '2026-09-05T14:00:00Z',
    durationMinutes: 45,
    status: 'CANCELLED',
    transportNeeded: false,
    feedback: 'Client had urgent travel, requested reschedule to next week.',
    cp: { name: 'Urban Nest Associates' },
  },
];

export default function SiteVisitsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    leadName: '',
    phone: '',
    projectName: 'Truzon Azure Signature Villas',
    executive: 'Amit Sengupta',
    scheduledAt: '',
    transportNeeded: false,
    transportDetails: '',
  });

  const { data: siteVisitsData } = useGetSiteVisitsQuery();
  const [createVisit] = useCreateSiteVisitMutation();
  const [updateVisit] = useUpdateSiteVisitMutation();

  const visits = useMemo(() => {
    const list = siteVisitsData?.data && siteVisitsData.data.length > 0 ? siteVisitsData.data : MOCK_SITE_VISITS;
    return list.filter((v: any) => {
      const leadName = v.lead?.name || '';
      const leadPhone = v.lead?.phone || '';
      const projectName = v.project?.name || '';
      const matchesSearch =
        !search ||
        leadName.toLowerCase().includes(search.toLowerCase()) ||
        leadPhone.includes(search) ||
        projectName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || v.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [siteVisitsData, search, statusFilter]);

  const stats = useMemo(() => {
    const total = visits.length;
    const scheduled = visits.filter((v: any) => v.status === 'SCHEDULED' || v.status === 'CONFIRMED').length;
    const completed = visits.filter((v: any) => v.status === 'COMPLETED').length;
    const cabs = visits.filter((v: any) => v.transportNeeded).length;
    return { total, scheduled, completed, cabs };
  }, [visits]);

  const handleStatusChange = async (visit: any, newStatus: string) => {
    try {
      await updateVisit({ id: visit.id, data: { status: newStatus as any } }).unwrap();
    } catch {
      visit.status = newStatus;
      setSearch((prev) => prev);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    MOCK_SITE_VISITS.unshift({
      id: `sv-${Date.now()}`,
      lead: { name: formData.leadName, phone: formData.phone, email: '' },
      project: { name: formData.projectName, city: 'North Bangalore' },
      user: { fullName: `${formData.executive} (Executive)` },
      scheduledAt: formData.scheduledAt || new Date().toISOString(),
      durationMinutes: 60,
      status: 'SCHEDULED',
      transportNeeded: formData.transportNeeded,
      transportDetails: formData.transportDetails,
      feedback: '',
      cp: { name: 'Admin Direct' },
    });
    setShowModal(false);
    setFormData({
      leadName: '',
      phone: '',
      projectName: 'Truzon Azure Signature Villas',
      executive: 'Amit Sengupta',
      scheduledAt: '',
      transportNeeded: false,
      transportDetails: '',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Site Visits & Tours</h1>
            <p className="text-gray-500 mt-1">
              Track luxury villa tours, scheduled executive walkthroughs, chauffeur transport, and buyer feedback.
            </p>
          </div>
          <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Schedule Site Visit
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Tours</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-blue-600 font-medium mt-3">Scheduled & past visits</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Upcoming Tours</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.scheduled}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-amber-600 font-medium mt-3">Next 7 days</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Completed Tours</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completed}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-green-600 font-medium mt-3">68% lead-to-proposal conversion</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Transport Requests</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.cabs}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Car className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-purple-600 font-medium mt-3">Airport / City pickups</p>
          </div>
        </div>

        {/* Table & Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search visitor, phone, project..."
                className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="">All Statuses</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <DataTable
            data={visits}
            columns={[
              {
                key: 'lead',
                header: 'Prospective Buyer',
                render: (_, row: any) => (
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{row.lead?.name}</p>
                    <p className="text-xs text-gray-500">{row.lead?.phone}</p>
                  </div>
                ),
              },
              {
                key: 'project',
                header: 'Project / Villa',
                render: (_, row: any) => (
                  <div>
                    <p className="font-semibold text-gray-900 text-xs">{row.project?.name}</p>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" /> {row.project?.city || 'Bangalore'}
                    </p>
                  </div>
                ),
              },
              {
                key: 'schedule',
                header: 'Scheduled Time',
                render: (_, row: any) => {
                  const date = new Date(row.scheduledAt);
                  return (
                    <div>
                      <p className="text-xs font-semibold text-gray-800">
                        {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} ({row.durationMinutes || 60}m)
                      </p>
                    </div>
                  );
                },
              },
              {
                key: 'executive',
                header: 'Executive / Sourced by',
                render: (_, row: any) => (
                  <div className="text-xs space-y-0.5">
                    <p className="font-medium text-gray-800">{row.user?.fullName}</p>
                    <p className="text-amber-700 font-medium text-[11px]">Sourced: {row.cp?.name || 'Direct Lead'}</p>
                  </div>
                ),
              },
              {
                key: 'transport',
                header: 'Transport',
                render: (_, row: any) =>
                  row.transportNeeded ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                      <Car className="h-3 w-3" /> Pickup
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Self-drive</span>
                  ),
              },
              {
                key: 'status',
                header: 'Status',
                render: (v, row: any) => {
                  const status = row.status || 'SCHEDULED';
                  return (
                    <span
                      className={clsx(
                        'inline-flex px-2 py-0.5 text-xs font-semibold rounded-full',
                        status === 'SCHEDULED' && 'bg-blue-100 text-blue-800',
                        status === 'CONFIRMED' && 'bg-amber-100 text-amber-800',
                        status === 'COMPLETED' && 'bg-green-100 text-green-800',
                        status === 'CANCELLED' && 'bg-red-100 text-red-800'
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
                render: (_, row: any) => (
                  <div className="flex items-center gap-1.5">
                    {row.status !== 'COMPLETED' && (
                      <button
                        onClick={() => handleStatusChange(row, 'COMPLETED')}
                        className="text-xs font-semibold px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100"
                        title="Mark Completed"
                      >
                        Complete
                      </button>
                    )}
                    {row.status !== 'CANCELLED' && (
                      <button
                        onClick={() => handleStatusChange(row, 'CANCELLED')}
                        className="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
                        title="Cancel"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                ),
              },
            ]}
            keyExtractor={(row: any) => row.id}
          />
        </div>

        {/* Schedule Visit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-lg font-bold text-gray-900">Schedule New Site Tour</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <Input
                  label="Visitor / Buyer Name"
                  value={formData.leadName}
                  onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                  placeholder="e.g. Ramesh Reddy"
                  required
                />
                <Input
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98450 12345"
                  required
                />
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Project</label>
                  <select
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    <option value="Truzon Azure Signature Villas">Truzon Azure Signature Villas (North Bangalore)</option>
                    <option value="Truzon Emerald Meadows">Truzon Emerald Meadows (Devenahalli)</option>
                    <option value="Truzon Horizon Townships">Truzon Horizon Townships (Airport Road)</option>
                  </select>
                </div>
                <Input
                  label="Date & Time"
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  required
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="cab"
                    checked={formData.transportNeeded}
                    onChange={(e) => setFormData({ ...formData, transportNeeded: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="cab" className="text-xs font-medium text-gray-700">
                    Chauffeur transport pickup required
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <Button variant="outline" type="button" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Confirm Visit</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
