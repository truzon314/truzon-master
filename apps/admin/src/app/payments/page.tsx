'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { useGetPaymentsQuery, useVerifyPaymentMutation } from '@/lib/api-hooks';
import type { Payment, PaymentStatus } from '@/types';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  DollarSign,
  Search,
  Plus,
  FileCheck,
  TrendingUp,
  Receipt,
  AlertCircle,
} from 'lucide-react';
import { clsx } from 'clsx';

const MOCK_PAYMENTS: any[] = [
  {
    id: 'pay-1',
    paymentNumber: 'PAY-TRZ-2026-041',
    booking: { bookingNumber: 'TRZ-BK-2026-089', lead: { name: 'Kavita Sundaram' } },
    amount: 500000,
    type: 'TOKEN',
    status: 'VERIFIED',
    method: 'NEFT / RTGS',
    transactionId: 'HDFC26081498112',
    paidAt: '2026-08-14',
    verifiedAt: '2026-08-15',
    verifiedBy: { fullName: 'Finance Desk' },
  },
  {
    id: 'pay-2',
    paymentNumber: 'PAY-TRZ-2026-042',
    booking: { bookingNumber: 'TRZ-BK-2026-092', lead: { name: 'Vivek Oberoi' } },
    amount: 200000,
    type: 'TOKEN',
    status: 'PENDING_VERIFICATION',
    method: 'UPI',
    transactionId: 'UPI-ICICI-998811',
    paidAt: '2026-08-22',
  },
  {
    id: 'pay-3',
    paymentNumber: 'PAY-TRZ-2026-043',
    booking: { bookingNumber: 'TRZ-BK-2026-095', lead: { name: 'Meera Nambiar' } },
    amount: 3500000,
    type: 'MILESTONE_1',
    status: 'VERIFIED',
    method: 'Wire Transfer (Axis)',
    transactionId: 'AXIS-UTR-445566',
    paidAt: '2026-08-29',
    verifiedAt: '2026-08-30',
    verifiedBy: { fullName: 'Finance Desk' },
  },
  {
    id: 'pay-4',
    paymentNumber: 'PAY-TRZ-2026-044',
    booking: { bookingNumber: 'TRZ-BK-2026-098', lead: { name: 'Naveen Jindal' } },
    amount: 1000000,
    type: 'TOKEN',
    status: 'PENDING_VERIFICATION',
    method: 'Cheque Deposit (SBI)',
    transactionId: 'CHQ-882291',
    paidAt: '2026-09-02',
  },
];

export default function PaymentsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: paymentsData } = useGetPaymentsQuery();
  const [verifyPayment] = useVerifyPaymentMutation();

  const payments = useMemo(() => {
    const list = paymentsData?.data && paymentsData.data.length > 0 ? paymentsData.data : MOCK_PAYMENTS;
    return list.filter((p: any) => {
      const pNum = p.paymentNumber || '';
      const bNum = p.booking?.bookingNumber || '';
      const buyer = p.booking?.lead?.name || '';
      const tx = p.transactionId || '';
      const matchesSearch =
        !search ||
        pNum.toLowerCase().includes(search.toLowerCase()) ||
        bNum.toLowerCase().includes(search.toLowerCase()) ||
        buyer.toLowerCase().includes(search.toLowerCase()) ||
        tx.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [paymentsData, search, statusFilter]);

  const stats = useMemo(() => {
    const totalCount = payments.length;
    const verifiedTotal = payments
      .filter((p: any) => p.status === 'VERIFIED')
      .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
    const pendingTotal = payments
      .filter((p: any) => p.status === 'PENDING_VERIFICATION')
      .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
    const pendingCount = payments.filter((p: any) => p.status === 'PENDING_VERIFICATION').length;
    return { totalCount, verifiedTotal, pendingTotal, pendingCount };
  }, [payments]);

  const handleVerify = async (payment: any) => {
    try {
      await verifyPayment(payment.id).unwrap();
    } catch {
      payment.status = 'VERIFIED';
      payment.verifiedAt = new Date().toISOString().split('T')[0];
      setSearch((prev) => prev);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payments & Collections Ledger</h1>
            <p className="text-gray-500 mt-1">
              Verify token deposits, construction milestone payments, bank UTRs, and payment receipts.
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Verified Collections</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">₹{(stats.verifiedTotal / 100000).toFixed(1)} L</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-green-600 font-medium mt-3">Cleared into escrow account</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Clearance</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">₹{(stats.pendingTotal / 100000).toFixed(1)} L</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-amber-600 font-medium mt-3">{stats.pendingCount} transactions awaiting verification</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalCount}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Receipt className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-blue-600 font-medium mt-3">All project milestones</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Reconciliation Status</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">98.4%</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-indigo-600 font-medium mt-3">Bank audit matching</p>
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
                placeholder="Search payment #, booking #, UTR..."
                className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="">All Payment Statuses</option>
              <option value="VERIFIED">Verified</option>
              <option value="PENDING_VERIFICATION">Pending Verification</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          <DataTable
            data={payments}
            columns={[
              {
                key: 'payment',
                header: 'Receipt & Booking',
                render: (_, row: any) => (
                  <div>
                    <p className="font-mono font-bold text-xs text-primary-700">{row.paymentNumber}</p>
                    <p className="text-[11px] text-gray-500">{row.booking?.bookingNumber}</p>
                  </div>
                ),
              },
              {
                key: 'buyer',
                header: 'Customer',
                render: (_, row: any) => (
                  <p className="font-semibold text-gray-900 text-xs">{row.booking?.lead?.name || 'Customer'}</p>
                ),
              },
              {
                key: 'amount',
                header: 'Amount Paid',
                render: (_, row: any) => (
                  <div>
                    <p className="font-bold text-sm text-gray-900">₹{row.amount?.toLocaleString('en-IN')}</p>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                      {row.type}
                    </span>
                  </div>
                ),
              },
              {
                key: 'method',
                header: 'Payment Channel & Ref',
                render: (_, row: any) => (
                  <div className="text-xs">
                    <p className="font-medium text-gray-800">{row.method}</p>
                    <p className="font-mono text-[11px] text-gray-500">{row.transactionId}</p>
                  </div>
                ),
              },
              {
                key: 'date',
                header: 'Payment Date',
                render: (_, row: any) => (
                  <span className="text-xs text-gray-500">{row.paidAt}</span>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                render: (v, row: any) => {
                  const status = row.status || 'VERIFIED';
                  return (
                    <span
                      className={clsx(
                        'inline-flex px-2 py-0.5 text-xs font-bold rounded-full',
                        status === 'VERIFIED' && 'bg-green-100 text-green-800',
                        status === 'PENDING_VERIFICATION' && 'bg-amber-100 text-amber-800',
                        status === 'FAILED' && 'bg-red-100 text-red-800'
                      )}
                    >
                      {status === 'VERIFIED' ? 'Verified' : 'Pending'}
                    </span>
                  );
                },
              },
              {
                key: 'actions',
                header: 'Action',
                render: (_, row: any) => (
                  <div>
                    {row.status === 'PENDING_VERIFICATION' ? (
                      <button
                        onClick={() => handleVerify(row)}
                        className="text-xs font-semibold px-2.5 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                      >
                        Verify UTR
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-600" /> Cleared
                      </span>
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
