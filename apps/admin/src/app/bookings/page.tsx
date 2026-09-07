'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { useGetBookingsQuery, useCreateBookingMutation, useUpdateBookingMutation } from '@/lib/api-hooks';
import type { Booking, BookingStatus } from '@/types';
import {
  ShoppingBag,
  Building2,
  DollarSign,
  User,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  FileText,
  CreditCard,
  Percent,
} from 'lucide-react';
import { clsx } from 'clsx';

const MOCK_BOOKINGS: any[] = [
  {
    id: 'bk-101',
    bookingNumber: 'TRZ-BK-2026-089',
    lead: { name: 'Kavita Sundaram', phone: '+91 98450 33445', email: 'kavita.s@gmail.com' },
    project: { name: 'Truzon Azure Signature Villas', city: 'North Bangalore' },
    inventoryUnit: { unitNumber: 'Villa 104 (4 BHK Luxury)' },
    cp: { name: 'Apex Realty Advisory' },
    bookingAmount: 500000,
    totalPrice: 28500000,
    status: 'CONFIRMED',
    bookingDate: '2026-08-14',
  },
  {
    id: 'bk-102',
    bookingNumber: 'TRZ-BK-2026-092',
    lead: { name: 'Vivek Oberoi', phone: '+91 98221 44556', email: 'vivek@venturecap.in' },
    project: { name: 'Truzon Horizon Townships', city: 'Airport Road' },
    inventoryUnit: { unitNumber: 'Plot B-22 (2400 sq.ft)' },
    cp: { name: 'Prime Estate Partners' },
    bookingAmount: 200000,
    totalPrice: 12000000,
    status: 'TOKEN_PAID',
    bookingDate: '2026-08-22',
  },
  {
    id: 'bk-103',
    bookingNumber: 'TRZ-BK-2026-095',
    lead: { name: 'Meera Nambiar', phone: '+91 97411 99001', email: 'meera.n@hotmail.com' },
    project: { name: 'Truzon Emerald Meadows', city: 'Devenahalli' },
    inventoryUnit: { unitNumber: 'Villa 42 (3 BHK Premium)' },
    cp: { name: 'Direct Website Lead' },
    bookingAmount: 500000,
    totalPrice: 21500000,
    status: 'AGREEMENT_SIGNED',
    bookingDate: '2026-08-29',
  },
  {
    id: 'bk-104',
    bookingNumber: 'TRZ-BK-2026-098',
    lead: { name: 'Naveen Jindal', phone: '+91 99880 12345', email: 'naveen@jindalgroup.in' },
    project: { name: 'Truzon Azure Signature Villas', city: 'North Bangalore' },
    inventoryUnit: { unitNumber: 'Villa 112 (Signature Royal)' },
    cp: { name: 'Skyline Properties' },
    bookingAmount: 1000000,
    totalPrice: 38000000,
    status: 'DRAFT',
    bookingDate: '2026-09-02',
  },
];

export default function BookingsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    buyerName: '',
    phone: '',
    projectName: 'Truzon Azure Signature Villas',
    unitNumber: '',
    bookingAmount: '500000',
    totalPrice: '25000000',
    cpName: 'Direct Booking',
  });

  const { data: bookingsData } = useGetBookingsQuery();
  const [createBooking] = useCreateBookingMutation();
  const [updateBooking] = useUpdateBookingMutation();

  const bookings = useMemo(() => {
    const list = bookingsData?.data && bookingsData.data.length > 0 ? bookingsData.data : MOCK_BOOKINGS;
    return list.filter((b: any) => {
      const buyer = b.lead?.name || '';
      const bNum = b.bookingNumber || '';
      const proj = b.project?.name || '';
      const unit = b.inventoryUnit?.unitNumber || '';
      const matchesSearch =
        !search ||
        buyer.toLowerCase().includes(search.toLowerCase()) ||
        bNum.toLowerCase().includes(search.toLowerCase()) ||
        proj.toLowerCase().includes(search.toLowerCase()) ||
        unit.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookingsData, search, statusFilter]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter((b: any) => b.status === 'CONFIRMED' || b.status === 'AGREEMENT_SIGNED').length;
    const tokens = bookings.filter((b: any) => b.status === 'TOKEN_PAID').length;
    const grossValue = bookings.reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0);
    return { total, confirmed, tokens, grossValue };
  }, [bookings]);

  const handleStatusChange = async (booking: any, newStatus: string) => {
    try {
      await updateBooking({ id: booking.id, data: { status: newStatus as any } }).unwrap();
    } catch {
      booking.status = newStatus;
      setSearch((prev) => prev);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    MOCK_BOOKINGS.unshift({
      id: `bk-${Date.now()}`,
      bookingNumber: `TRZ-BK-2026-${Math.floor(100 + Math.random() * 900)}`,
      lead: { name: formData.buyerName, phone: formData.phone },
      project: { name: formData.projectName, city: 'North Bangalore' },
      inventoryUnit: { unitNumber: formData.unitNumber },
      cp: { name: formData.cpName },
      bookingAmount: parseFloat(formData.bookingAmount) || 500000,
      totalPrice: parseFloat(formData.totalPrice) || 25000000,
      status: 'TOKEN_PAID',
      bookingDate: new Date().toISOString().split('T')[0],
    });
    setShowModal(false);
    setFormData({
      buyerName: '',
      phone: '',
      projectName: 'Truzon Azure Signature Villas',
      unitNumber: '',
      bookingAmount: '500000',
      totalPrice: '25000000',
      cpName: 'Direct Booking',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bookings & Unit Reservations</h1>
            <p className="text-gray-500 mt-1">
              Track token deposits, unit locks, booking verification, and partner attribution.
            </p>
          </div>
          <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Booking
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-blue-600 font-medium mt-3">All project portfolios</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Confirmed Units</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.confirmed}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-green-600 font-medium mt-3">Token verified & locked</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Token In Review</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.tokens}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-amber-600 font-medium mt-3">Bank clearance pending</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gross Booking Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">₹{(stats.grossValue / 10000000).toFixed(2)} Cr</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-indigo-600 font-medium mt-3">Pipeline transaction volume</p>
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
                placeholder="Search booking #, buyer, unit..."
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
                <option value="DRAFT">Draft</option>
                <option value="TOKEN_PAID">Token Paid</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="AGREEMENT_SIGNED">Agreement Signed</option>
              </select>
            </div>
          </div>

          <DataTable
            data={bookings}
            columns={[
              {
                key: 'booking',
                header: 'Booking Number',
                render: (_, row: any) => (
                  <div>
                    <p className="font-mono font-bold text-xs text-primary-700">{row.bookingNumber}</p>
                    <p className="text-[11px] text-gray-500">{row.bookingDate}</p>
                  </div>
                ),
              },
              {
                key: 'buyer',
                header: 'Buyer Details',
                render: (_, row: any) => (
                  <div>
                    <p className="font-semibold text-gray-900 text-xs">{row.lead?.name}</p>
                    <p className="text-[11px] text-gray-500">{row.lead?.phone}</p>
                  </div>
                ),
              },
              {
                key: 'unit',
                header: 'Project & Unit',
                render: (_, row: any) => (
                  <div>
                    <p className="font-semibold text-gray-900 text-xs">{row.project?.name}</p>
                    <p className="text-[11px] text-amber-700 font-semibold">{row.inventoryUnit?.unitNumber}</p>
                  </div>
                ),
              },
              {
                key: 'commercials',
                header: 'Financials',
                render: (_, row: any) => (
                  <div>
                    <p className="font-bold text-xs text-gray-900">₹{(row.totalPrice / 100000).toFixed(1)} L</p>
                    <p className="text-[11px] text-green-600 font-medium">
                      Token: ₹{(row.bookingAmount / 1000).toFixed(0)}k
                    </p>
                  </div>
                ),
              },
              {
                key: 'cp',
                header: 'Sourced By',
                render: (_, row: any) => (
                  <span className="text-xs text-gray-600 font-medium">{row.cp?.name || 'Direct'}</span>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                render: (v, row: any) => {
                  const status = row.status || 'CONFIRMED';
                  return (
                    <span
                      className={clsx(
                        'inline-flex px-2 py-0.5 text-xs font-bold rounded-full',
                        status === 'CONFIRMED' && 'bg-green-100 text-green-800',
                        status === 'AGREEMENT_SIGNED' && 'bg-emerald-100 text-emerald-800',
                        status === 'TOKEN_PAID' && 'bg-blue-100 text-blue-800',
                        status === 'DRAFT' && 'bg-amber-100 text-amber-800'
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
                    {row.status === 'TOKEN_PAID' && (
                      <button
                        onClick={() => handleStatusChange(row, 'CONFIRMED')}
                        className="text-xs font-semibold px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100"
                      >
                        Confirm
                      </button>
                    )}
                    {row.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleStatusChange(row, 'AGREEMENT_SIGNED')}
                        className="text-xs font-semibold px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        Sign ATS
                      </button>
                    )}
                  </div>
                ),
              },
            ]}
            keyExtractor={(row: any) => row.id}
          />
        </div>

        {/* Create Booking Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-lg font-bold text-gray-900">Record New Unit Booking</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <Input
                  label="Buyer Name"
                  value={formData.buyerName}
                  onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                  placeholder="e.g. Ramesh Reddy"
                  required
                />
                <Input
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98450 12345"
                  required
                />
                <Input
                  label="Unit Allocated"
                  value={formData.unitNumber}
                  onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                  placeholder="e.g. Villa 105 (4 BHK East)"
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Token Amount (₹)"
                    value={formData.bookingAmount}
                    onChange={(e) => setFormData({ ...formData, bookingAmount: e.target.value })}
                    required
                  />
                  <Input
                    label="Total Price (₹)"
                    value={formData.totalPrice}
                    onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                    required
                  />
                </div>
                <Input
                  label="Sourced By (Channel Partner / Agent)"
                  value={formData.cpName}
                  onChange={(e) => setFormData({ ...formData, cpName: e.target.value })}
                />

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <Button variant="outline" type="button" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Record Booking</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
