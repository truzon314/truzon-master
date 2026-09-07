'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { useGetTestimonialsQuery } from '@/lib/api-hooks';
import type { Testimonial } from '@/types';
import {
  Quote,
  Star,
  Plus,
  Search,
  CheckCircle,
  ThumbsUp,
  User,
} from 'lucide-react';
import { clsx } from 'clsx';

const MOCK_TESTIMONIALS = [
  {
    id: 't-1',
    clientName: 'Dr. Suresh Venkatesh & Family',
    clientRole: 'Chief of Cardiology, Manipal Hospital',
    projectName: 'Truzon Azure Signature Villas',
    rating: 5,
    quote: 'The craftsmanship, 12-ft ceiling heights, and serene greenery at Truzon Azure exceeded our expectations. The entire handover was transparent and prompt.',
    isFeatured: true,
    isActive: true,
    createdAt: '2026-08-10',
  },
  {
    id: 't-2',
    clientName: 'Anil & Shalini Singhal (NRI)',
    clientRole: 'Tech Directors, London',
    projectName: 'Truzon Horizon Townships',
    rating: 5,
    quote: 'Being based in the UK, buying a plot in North Bangalore was stressful until Truzon stepped in. Clear titles, automated video progress reports, and seamless registration.',
    isFeatured: true,
    isActive: true,
    createdAt: '2026-08-18',
  },
  {
    id: 't-3',
    clientName: 'Rohit Kulkarni',
    clientRole: 'Managing Partner, Kulkarni Law',
    projectName: 'Truzon Emerald Meadows',
    rating: 5,
    quote: 'Outstanding private clubhouse, Olympic lap pool, and 100% Vastu compliance. Best luxury gated community in Devanahalli.',
    isFeatured: false,
    isActive: true,
    createdAt: '2026-08-25',
  },
];

export default function TestimonialsPage() {
  const [search, setSearch] = useState('');
  const { data: testimonialsData } = useGetTestimonialsQuery();

  const testimonials = useMemo(() => {
    return MOCK_TESTIMONIALS.filter(
      (t) =>
        !search ||
        t.clientName.toLowerCase().includes(search.toLowerCase()) ||
        t.projectName.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Client Testimonials & Endorsements</h1>
            <p className="text-gray-500 mt-1">
              Curate verified buyer testimonials, star ratings, and homeowner stories featured on Public Web.
            </p>
          </div>
          <Button onClick={() => alert('Add Testimonial Modal')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Testimonial
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
                placeholder="Search client name or project..."
                className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
              />
            </div>
          </div>

          <DataTable
            data={testimonials}
            columns={[
              {
                key: 'client',
                header: 'Homeowner',
                render: (_, row: any) => (
                  <div>
                    <p className="font-bold text-xs text-gray-900">{row.clientName}</p>
                    <p className="text-[11px] text-gray-500">{row.clientRole}</p>
                  </div>
                ),
              },
              {
                key: 'project',
                header: 'Property Purchased',
                accessor: 'projectName',
                render: (v) => <span className="font-semibold text-xs text-primary-700">{v}</span>,
              },
              {
                key: 'rating',
                header: 'Rating',
                render: (_, row: any) => (
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(row.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                ),
              },
              {
                key: 'quote',
                header: 'Feedback Quote',
                render: (_, row: any) => (
                  <p className="text-xs text-gray-700 italic line-clamp-2 max-w-lg">&quot;{row.quote}&quot;</p>
                ),
              },
              {
                key: 'featured',
                header: 'Featured',
                render: (_, row: any) => (
                  <span
                    className={clsx(
                      'text-xs font-bold px-2 py-0.5 rounded-full',
                      row.isFeatured ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'
                    )}
                  >
                    {row.isFeatured ? 'Homepage' : 'Archive'}
                  </span>
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
