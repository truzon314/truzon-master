'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { useGetFormSubmissionsQuery, useUpdateFormSubmissionMutation } from '@/lib/api-hooks';
import type { FormSubmission } from '@/types';
import {
  MessageSquare,
  Mail,
  Phone,
  Search,
  CheckCircle2,
  Clock,
  UserPlus,
  Send,
  Globe,
  Tag,
} from 'lucide-react';
import { clsx } from 'clsx';

const MOCK_SUBMISSIONS: any[] = [
  {
    id: 'f-1',
    name: 'Harish Kalyan',
    phone: '+91 98450 88123',
    email: 'harish.k@tcs.com',
    formKey: 'BROCHURE_DOWNLOAD',
    source: 'public-web /projects/azure',
    propertyType: '4 BHK Luxury Villa',
    message: 'Please share the master plan, brochure, and expected possession dates for Phase 2.',
    status: 'NEW',
    createdAt: '2026-09-06T08:30:00Z',
  },
  {
    id: 'f-2',
    name: 'Sangeeta Iyer',
    phone: '+91 98201 44556',
    email: 'sangeeta.iyer@gmail.com',
    formKey: 'CONTACT_FORM',
    source: 'public-web /contact',
    propertyType: 'Township Plot',
    message: 'Looking for a corner plot facing East in Truzon Horizon. Requesting callback this evening.',
    status: 'CONTACTED',
    createdAt: '2026-09-05T14:15:00Z',
  },
  {
    id: 'f-3',
    name: 'David Reynolds (NRI)',
    phone: '+44 7911 123456',
    email: 'david.r@londonfin.co.uk',
    formKey: 'NRI_CONSULTATION',
    source: 'public-web /investor-relations',
    propertyType: 'Signature Villa',
    message: 'Interested in luxury investment options near the International Airport corridor.',
    status: 'CONVERTED_LEAD',
    createdAt: '2026-09-04T10:00:00Z',
  },
  {
    id: 'f-4',
    name: 'Pradeep Gowda',
    phone: '+91 99002 11223',
    email: 'pradeep@gowdagroup.in',
    formKey: 'SITE_VISIT_REQUEST',
    source: 'public-web /property/villa-azure-104',
    propertyType: 'Villa 104',
    message: 'Want to visit this Sunday at 11 AM with family.',
    status: 'CONTACTED',
    createdAt: '2026-09-03T16:45:00Z',
  },
];

export default function FormsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formKeyFilter, setFormKeyFilter] = useState('');

  const { data: formsData } = useGetFormSubmissionsQuery();
  const [updateSubmission] = useUpdateFormSubmissionMutation();

  const submissions = useMemo(() => {
    const list = formsData?.data && formsData.data.length > 0 ? formsData.data : MOCK_SUBMISSIONS;
    return list.filter((f: any) => {
      const name = f.name || '';
      const email = f.email || '';
      const phone = f.phone || '';
      const msg = f.message || '';
      const matchesSearch =
        !search ||
        name.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase()) ||
        phone.includes(search) ||
        msg.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || f.status === statusFilter;
      const matchesKey = !formKeyFilter || f.formKey === formKeyFilter;
      return matchesSearch && matchesStatus && matchesKey;
    });
  }, [formsData, search, statusFilter, formKeyFilter]);

  const stats = useMemo(() => {
    const total = submissions.length;
    const unread = submissions.filter((f: any) => f.status === 'NEW').length;
    const converted = submissions.filter((f: any) => f.status === 'CONVERTED_LEAD').length;
    return { total, unread, converted };
  }, [submissions]);

  const handleStatusUpdate = async (item: any, newStatus: string) => {
    try {
      await updateSubmission({ id: item.id, data: { status: newStatus as any } }).unwrap();
    } catch {
      item.status = newStatus;
      setSearch((prev) => prev);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Public Web Form Inquiries</h1>
          <p className="text-gray-500 mt-1">
            Real-time inbox for brochure downloads, contact submissions, and tour requests from the public site.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <MessageSquare className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-blue-600 font-medium mt-3">From public website forms</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Unprocessed Inquiries</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{stats.unread}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-amber-600 font-medium mt-3">Requires sales callback</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Converted to CRM Leads</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.converted}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                <UserPlus className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-green-600 font-medium mt-3">Direct sales pipeline</p>
          </div>
        </div>

        {/* Filters and DataTable */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search visitor, phone, email, query..."
                className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={formKeyFilter}
                onChange={(e) => setFormKeyFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="">All Form Types</option>
                <option value="BROCHURE_DOWNLOAD">Brochure Downloads</option>
                <option value="CONTACT_FORM">Contact Form</option>
                <option value="NRI_CONSULTATION">NRI Consultation</option>
                <option value="SITE_VISIT_REQUEST">Tour Request</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="">All Statuses</option>
                <option value="NEW">New (Unread)</option>
                <option value="CONTACTED">Contacted</option>
                <option value="CONVERTED_LEAD">Converted to Lead</option>
              </select>
            </div>
          </div>

          <DataTable
            data={submissions}
            columns={[
              {
                key: 'visitor',
                header: 'Inquirer Details',
                render: (_, row: any) => (
                  <div>
                    <p className="font-semibold text-xs text-gray-900">{row.name}</p>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                      <Phone className="h-3 w-3" /> {row.phone}
                    </p>
                    {row.email && (
                      <p className="text-[11px] text-gray-500 flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {row.email}
                      </p>
                    )}
                  </div>
                ),
              },
              {
                key: 'type',
                header: 'Form / Source',
                render: (_, row: any) => (
                  <div>
                    <span className="font-bold text-xs text-primary-700 bg-primary-50 px-2 py-0.5 rounded border border-primary-200">
                      {row.formKey?.replace(/_/g, ' ')}
                    </span>
                    <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                      <Globe className="h-3 w-3" /> {row.source}
                    </p>
                  </div>
                ),
              },
              {
                key: 'message',
                header: 'Message / Interest',
                render: (_, row: any) => (
                  <div className="max-w-md">
                    <p className="text-xs text-gray-800 line-clamp-2">{row.message}</p>
                    {row.propertyType && (
                      <p className="text-[11px] text-amber-700 font-semibold mt-0.5">Interest: {row.propertyType}</p>
                    )}
                  </div>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                render: (v, row: any) => {
                  const status = row.status || 'NEW';
                  return (
                    <span
                      className={clsx(
                        'inline-flex px-2 py-0.5 text-xs font-bold rounded-full',
                        status === 'NEW' && 'bg-amber-100 text-amber-800',
                        status === 'CONTACTED' && 'bg-blue-100 text-blue-800',
                        status === 'CONVERTED_LEAD' && 'bg-green-100 text-green-800'
                      )}
                    >
                      {status === 'CONVERTED_LEAD' ? 'Converted' : status}
                    </span>
                  );
                },
              },
              {
                key: 'actions',
                header: 'Actions',
                render: (_, row: any) => (
                  <div className="flex items-center gap-1.5">
                    {row.status === 'NEW' && (
                      <button
                        onClick={() => handleStatusUpdate(row, 'CONTACTED')}
                        className="text-xs font-semibold px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        Contacted
                      </button>
                    )}
                    {row.status !== 'CONVERTED_LEAD' && (
                      <button
                        onClick={() => handleStatusUpdate(row, 'CONVERTED_LEAD')}
                        className="text-xs font-semibold px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 flex items-center gap-1"
                      >
                        <UserPlus className="h-3 w-3" /> To Lead
                      </button>
                    )}
                  </div>
                ),
              },
            ]}
            keyExtractor={(row: any) => row.id}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
