'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable, { Column } from '@/components/ui/DataTable';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Download } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  actor: {
    name: string;
    email: string;
    role: string;
  };
  action: string;
  category: 'PUBLIC_WEB' | 'PRO_CRM' | 'CP_OPERATIONS' | 'SECURITY';
  target: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  details: string;
}

const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-101',
    timestamp: '2026-09-06 13:42:18',
    actor: { name: 'Admin Root', email: 'admin@truzon.in', role: 'SUPER_ADMIN' },
    action: 'UNIT_STATUS_OVERRIDE',
    category: 'PRO_CRM',
    target: 'Villa #104 (Emerald Meadows)',
    ipAddress: '49.36.128.45',
    status: 'WARNING',
    details: 'Manually changed status from HOLD to RESERVED for client Rohit Mehra.',
  },
  {
    id: 'aud-102',
    timestamp: '2026-09-06 12:15:02',
    actor: { name: 'Priya Sharma', email: 'priya.s@truzon.in', role: 'MARKETING_ADMIN' },
    action: 'PAGE_PUBLISHED',
    category: 'PUBLIC_WEB',
    target: 'Public Web /township-masterplan',
    ipAddress: '157.34.82.112',
    status: 'SUCCESS',
    details: 'Published revised masterplan vector layers and drone showcase gallery.',
  },
  {
    id: 'aud-103',
    timestamp: '2026-09-06 11:30:45',
    actor: { name: 'Vikram Sengupta', email: 'vikram.s@truzon.in', role: 'CP_MANAGER' },
    action: 'CP_COMMISSION_DISBURSED',
    category: 'CP_OPERATIONS',
    target: 'Square Yards Global (CP-001)',
    ipAddress: '103.21.144.60',
    status: 'SUCCESS',
    details: 'Approved ₹ 3,60,000 commission for Booking #TRZ-BKG-1001 (Villa 101).',
  },
  {
    id: 'aud-104',
    timestamp: '2026-09-06 09:12:33',
    actor: { name: 'Unknown Client', email: 'unknown@external-ip', role: 'ANONYMOUS' },
    action: 'FAILED_LOGIN_ATTEMPT',
    category: 'SECURITY',
    target: 'Admin Auth Endpoint /api/auth/login',
    ipAddress: '185.220.101.5',
    status: 'FAILED',
    details: 'Invalid credentials attempt for user accounts superadmin@truzon.in (Rate limited).',
  },
  {
    id: 'aud-105',
    timestamp: '2026-09-05 18:44:10',
    actor: { name: 'Admin Root', email: 'admin@truzon.in', role: 'SUPER_ADMIN' },
    action: 'ROLE_PERMISSIONS_UPDATE',
    category: 'SECURITY',
    target: 'Role: MARKETING_ADMIN',
    ipAddress: '49.36.128.45',
    status: 'SUCCESS',
    details: 'Granted write access to Media CDN and Careers opening publisher.',
  },
];

export default function AuditLogsPage() {
  const [logs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.name.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.email.toLowerCase().includes(search.toLowerCase()) ||
      log.target.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || log.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const columns: Column<AuditLog>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      accessor: (log: AuditLog) => (
        <span className="font-mono text-xs text-slate-400 whitespace-nowrap">{log.timestamp}</span>
      ),
    },
    {
      key: 'actor',
      header: 'Actor',
      accessor: (log: AuditLog) => (
        <div>
          <div className="font-medium text-slate-200">{log.actor.name}</div>
          <div className="text-[11px] text-slate-400">{log.actor.email}</div>
          <span className="text-[10px] font-mono text-amber-400/90">{log.actor.role}</span>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action / Category',
      accessor: (log: AuditLog) => {
        const catBadge = {
          PUBLIC_WEB: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          PRO_CRM: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          CP_OPERATIONS: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
          SECURITY: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        }[log.category];

        return (
          <div className="space-y-1">
            <code className="text-xs font-mono font-semibold text-white">{log.action}</code>
            <div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${catBadge}`}>
                {log.category}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'target',
      header: 'Target / Entity',
      accessor: (log: AuditLog) => (
        <div>
          <div className="text-xs font-semibold text-slate-200">{log.target}</div>
          <p className="text-[11px] text-slate-400 mt-0.5 max-w-sm">{log.details}</p>
        </div>
      ),
    },
    {
      key: 'ipAddress',
      header: 'IP Address',
      accessor: (log: AuditLog) => (
        <span className="font-mono text-xs text-slate-400">{log.ipAddress}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (log: AuditLog) => {
        const badge = {
          SUCCESS: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          WARNING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          FAILED: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        }[log.status];

        return (
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${badge}`}>
            {log.status}
          </span>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                Compliance & Security
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">Audit Trail & Activity Log</h1>
            <p className="text-sm text-slate-400">
              Immutable record of all administrative modifications across Public Web, CRM, CP Payouts & Auth events
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => alert('Audit logs exported to cryptographically signed CSV file.')}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Audit CSV
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
          <div className="flex-1 w-full">
            <Input
              placeholder="Search by action, actor name, IP, or affected target..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {['ALL', 'PUBLIC_WEB', 'PRO_CRM', 'CP_OPERATIONS', 'SECURITY'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  categoryFilter === cat
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-semibold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
          <DataTable
            data={filteredLogs}
            columns={columns}
            keyExtractor={(item) => item.id}
            loading={false}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
