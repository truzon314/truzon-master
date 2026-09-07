'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { useGetUsersQuery } from '@/lib/api-hooks';
import type { User } from '@/types';
import {
  Users,
  Shield,
  Plus,
  Search,
  CheckCircle,
  Mail,
  Phone,
  Lock,
} from 'lucide-react';
import { clsx } from 'clsx';

const MOCK_USERS = [
  {
    id: 'u-1',
    fullName: 'Saam Chelleka (Super Admin)',
    email: 'admin@truzonhomes.com',
    phone: '+91 98450 00143',
    role: { displayName: 'Super Admin', name: 'SUPER_ADMIN' },
    status: 'ACTIVE',
    emailVerified: true,
    phoneVerified: true,
    lastLogin: 'Today, 01:30 PM',
  },
  {
    id: 'u-2',
    fullName: 'Amit Sengupta',
    email: 'amit.s@truzonhomes.com',
    phone: '+91 98451 22334',
    role: { displayName: 'Sales Manager', name: 'SALES_MANAGER' },
    status: 'ACTIVE',
    emailVerified: true,
    phoneVerified: true,
    lastLogin: 'Yesterday, 05:20 PM',
  },
  {
    id: 'u-3',
    fullName: 'Neha Nair',
    email: 'neha.n@truzonhomes.com',
    phone: '+91 97410 88991',
    role: { displayName: 'Sales Executive', name: 'SALES_AGENT' },
    status: 'ACTIVE',
    emailVerified: true,
    phoneVerified: true,
    lastLogin: 'Today, 10:15 AM',
  },
  {
    id: 'u-4',
    fullName: 'Vikram Malhotra',
    email: 'vikram@apexrealty.in',
    phone: '+91 98450 11223',
    role: { displayName: 'Channel Partner Admin', name: 'CP_ADMIN' },
    status: 'ACTIVE',
    emailVerified: true,
    phoneVerified: true,
    lastLogin: '2 days ago',
  },
  {
    id: 'u-5',
    fullName: 'Rohit Verma',
    email: 'rohit.v@truzonhomes.com',
    phone: '+91 99001 44556',
    role: { displayName: 'Content Editor', name: 'CONTENT_EDITOR' },
    status: 'ACTIVE',
    emailVerified: true,
    phoneVerified: false,
    lastLogin: '3 days ago',
  },
];

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const { data: usersData } = useGetUsersQuery({});

  const users = useMemo(() => {
    const list = usersData?.data && usersData.data.length > 0 ? usersData.data : MOCK_USERS;
    return list.filter((u: any) => {
      const name = u.fullName || '';
      const email = u.email || '';
      const matchesSearch =
        !search ||
        name.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = !roleFilter || u.role?.name === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [usersData, search, roleFilter]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Administration & Accounts</h1>
            <p className="text-gray-500 mt-1">
              Manage platform staff, operations executives, sales agents, and channel partner user logins.
            </p>
          </div>
          <Button onClick={() => alert('Invite User Modal')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Invite Platform User
          </Button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user name or email..."
                className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white"
            >
              <option value="">All Roles</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="SALES_MANAGER">Sales Manager</option>
              <option value="SALES_AGENT">Sales Executive</option>
              <option value="CP_ADMIN">CP Partner Admin</option>
              <option value="CONTENT_EDITOR">Content Editor</option>
            </select>
          </div>

          <DataTable
            data={users}
            columns={[
              {
                key: 'user',
                header: 'User Profile',
                render: (_, row: any) => (
                  <div>
                    <p className="font-bold text-xs text-gray-900">{row.fullName}</p>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                      <Mail className="h-3 w-3" /> {row.email}
                    </p>
                  </div>
                ),
              },
              {
                key: 'role',
                header: 'Assigned Role',
                render: (_, row: any) => (
                  <span className="inline-flex items-center gap-1 font-bold text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    <Shield className="h-3 w-3" /> {row.role?.displayName || 'User'}
                  </span>
                ),
              },
              {
                key: 'phone',
                header: 'Phone Number',
                accessor: 'phone',
                render: (v) => <span className="text-xs text-gray-600 font-mono">{v}</span>,
              },
              {
                key: 'status',
                header: 'Status',
                render: (v, row: any) => (
                  <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                    ● Active
                  </span>
                ),
              },
              {
                key: 'login',
                header: 'Last Active',
                render: (_, row: any) => <span className="text-xs text-gray-500">{row.lastLogin || 'Recently'}</span>,
              },
            ]}
            keyExtractor={(row: any) => row.id}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
