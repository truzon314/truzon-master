'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { useGetCareersQuery } from '@/lib/api-hooks';
import type { Career } from '@/types';
import {
  Briefcase,
  MapPin,
  Clock,
  Plus,
  Search,
  CheckCircle,
  Users,
} from 'lucide-react';
import { clsx } from 'clsx';

const MOCK_CAREERS: any[] = [
  {
    id: 'car-1',
    title: 'Senior Luxury Real Estate Relationship Manager',
    department: 'Sales & Client Relations',
    location: 'Bangalore (North)',
    type: 'Full-time',
    experience: '5-8 Years',
    status: 'ACTIVE',
    applicantsCount: 38,
    postedAt: '2026-08-15',
  },
  {
    id: 'car-2',
    title: 'Channel Partner (CP) Acquisition Lead',
    department: 'Channel Partnerships',
    location: 'Bangalore & Hyderabad',
    type: 'Full-time',
    experience: '4-6 Years',
    status: 'ACTIVE',
    applicantsCount: 24,
    postedAt: '2026-08-20',
  },
  {
    id: 'car-3',
    title: 'Landscape & Villa Architectural Designer',
    department: 'Design & Planning',
    location: 'Bangalore',
    type: 'Full-time',
    experience: '3-5 Years',
    status: 'ACTIVE',
    applicantsCount: 19,
    postedAt: '2026-08-25',
  },
  {
    id: 'car-4',
    title: 'Digital Marketing & Growth Specialist (Real Estate)',
    department: 'Marketing',
    location: 'Hybrid (Bangalore)',
    type: 'Full-time',
    experience: '3-6 Years',
    status: 'CLOSED',
    applicantsCount: 52,
    postedAt: '2026-07-10',
  },
];

export default function CareersPage() {
  const [search, setSearch] = useState('');
  const { data: careersData } = useGetCareersQuery();

  const careers = useMemo(() => {
    const list = careersData?.data && careersData.data.length > 0 ? careersData.data : MOCK_CAREERS;
    return list.filter((c: any) => {
      const title = c.title || '';
      const dept = c.department || '';
      return (
        !search ||
        title.toLowerCase().includes(search.toLowerCase()) ||
        dept.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [careersData, search]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Careers & Job Openings</h1>
            <p className="text-gray-500 mt-1">
              Manage open positions, requirements, and applications published on the Public Web careers portal.
            </p>
          </div>
          <Button onClick={() => alert('Post New Position Modal')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Post New Position
          </Button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search job title or department..."
                className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
              />
            </div>
          </div>

          <DataTable
            data={careers}
            columns={[
              {
                key: 'title',
                header: 'Position & Department',
                render: (_, row: any) => (
                  <div>
                    <p className="font-bold text-xs text-gray-900">{row.title}</p>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                      <Briefcase className="h-3 w-3 text-primary-600" /> {row.department}
                    </p>
                  </div>
                ),
              },
              {
                key: 'location',
                header: 'Location & Type',
                render: (_, row: any) => (
                  <div className="text-xs">
                    <p className="text-gray-800 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-400" /> {row.location}
                    </p>
                    <p className="text-[11px] text-gray-500">{row.type} • {row.experience}</p>
                  </div>
                ),
              },
              {
                key: 'applicants',
                header: 'Applicants',
                render: (_, row: any) => (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                    <Users className="h-3 w-3" /> {row.applicantsCount} candidates
                  </span>
                ),
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
                        status === 'CLOSED' && 'bg-gray-100 text-gray-700'
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
                render: () => (
                  <div className="flex items-center gap-2">
                    <button className="text-xs font-medium text-primary-600 hover:text-primary-700">
                      View Resumes
                    </button>
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
