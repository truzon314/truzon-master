'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  ShieldCheck,
  Plus,
  Users,
  CheckCircle,
  XCircle,
  Edit,
} from 'lucide-react';

interface RolePermission {
  id: string;
  name: string;
  code: string;
  description: string;
  userCount: number;
  permissions: {
    publicWeb: { read: boolean; write: boolean; publish: boolean };
    proCrm: { leads: boolean; bookings: boolean; finance: boolean };
    cpOperations: { managePartners: boolean; approvePayouts: boolean };
    systemSettings: { manageUsers: boolean; manageRoles: boolean; viewAudit: boolean };
  };
  isSystem?: boolean;
}

const MOCK_ROLES: RolePermission[] = [
  {
    id: 'role-1',
    name: 'Super Administrator',
    code: 'SUPER_ADMIN',
    description: 'Full unconstrained root access across Public Web, Pro Operations, CP network & System configuration.',
    userCount: 3,
    isSystem: true,
    permissions: {
      publicWeb: { read: true, write: true, publish: true },
      proCrm: { leads: true, bookings: true, finance: true },
      cpOperations: { managePartners: true, approvePayouts: true },
      systemSettings: { manageUsers: true, manageRoles: true, viewAudit: true },
    },
  },
  {
    id: 'role-2',
    name: 'Marketing & CMS Manager',
    code: 'MARKETING_ADMIN',
    description: 'Manages Public Web content, blog publications, media library, campaigns, and lead acquisition forms.',
    userCount: 6,
    permissions: {
      publicWeb: { read: true, write: true, publish: true },
      proCrm: { leads: true, bookings: false, finance: false },
      cpOperations: { managePartners: false, approvePayouts: false },
      systemSettings: { manageUsers: false, manageRoles: false, viewAudit: false },
    },
  },
  {
    id: 'role-3',
    name: 'Sales Director',
    code: 'SALES_DIRECTOR',
    description: 'Full visibility over sales funnel, bookings approvals, payment reconciliation, and unit hold overrides.',
    userCount: 4,
    permissions: {
      publicWeb: { read: true, write: false, publish: false },
      proCrm: { leads: true, bookings: true, finance: true },
      cpOperations: { managePartners: true, approvePayouts: true },
      systemSettings: { manageUsers: false, manageRoles: false, viewAudit: true },
    },
  },
  {
    id: 'role-4',
    name: 'Sales Executive / Agent',
    code: 'SALES_AGENT',
    description: 'Assigned customer leads, site visits scheduling, booking requests generation and milestone tracking.',
    userCount: 18,
    permissions: {
      publicWeb: { read: true, write: false, publish: false },
      proCrm: { leads: true, bookings: true, finance: false },
      cpOperations: { managePartners: false, approvePayouts: false },
      systemSettings: { manageUsers: false, manageRoles: false, viewAudit: false },
    },
  },
  {
    id: 'role-5',
    name: 'Channel Partner (CP) Operations Lead',
    code: 'CP_MANAGER',
    description: 'Onboards broker agencies, monitors CP attribution, validates commission tiering and payout milestones.',
    userCount: 5,
    permissions: {
      publicWeb: { read: true, write: false, publish: false },
      proCrm: { leads: true, bookings: false, finance: false },
      cpOperations: { managePartners: true, approvePayouts: true },
      systemSettings: { manageUsers: false, manageRoles: false, viewAudit: false },
    },
  },
  {
    id: 'role-6',
    name: 'Finance & Compliance Officer',
    code: 'FINANCE_AUDITOR',
    description: 'ATS agreement verification, UTR bank reconciliation, commission payouts approval, tax invoices.',
    userCount: 4,
    permissions: {
      publicWeb: { read: false, write: false, publish: false },
      proCrm: { leads: false, bookings: true, finance: true },
      cpOperations: { managePartners: false, approvePayouts: true },
      systemSettings: { manageUsers: false, manageRoles: false, viewAudit: true },
    },
  },
];

export default function RolesPermissionsPage() {
  const [roles, setRoles] = useState<RolePermission[]>(MOCK_ROLES);
  const [selectedRole, setSelectedRole] = useState<RolePermission>(MOCK_ROLES[0]);
  const [search, setSearch] = useState('');

  const filteredRoles = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.code.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                System & Access Control
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">Roles & Permissions Matrix</h1>
            <p className="text-sm text-slate-400">
              Configure RBAC permissions spanning Public Web CMS, Pro CRM Operations, CP Network, and Security Controls
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              const newRole: RolePermission = {
                id: `role-${Date.now()}`,
                name: 'Custom Team Role',
                code: 'CUSTOM_ROLE_' + Math.floor(Math.random() * 1000),
                description: 'Custom operator access role configured for specialized departmental workflows.',
                userCount: 0,
                permissions: {
                  publicWeb: { read: true, write: false, publish: false },
                  proCrm: { leads: true, bookings: false, finance: false },
                  cpOperations: { managePartners: false, approvePayouts: false },
                  systemSettings: { manageUsers: false, manageRoles: false, viewAudit: false },
                },
              };
              setRoles([newRole, ...roles]);
              setSelectedRole(newRole);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Role
          </Button>
        </div>

        {/* Roles Grid and Detailed Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Role Selector */}
          <div className="space-y-4">
            <Input
              placeholder="Search roles or codes..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
            <div className="space-y-2">
              {filteredRoles.map((role) => {
                const isSelected = selectedRole.id === role.id;
                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/5'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-white">{role.name}</h3>
                          {role.isSystem && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                              System
                            </span>
                          )}
                        </div>
                        <code className="text-[11px] text-amber-400 font-mono">{role.code}</code>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-800/80 px-2 py-1 rounded-md border border-slate-700/50">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {role.userCount}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">{role.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Permission Matrix for Selected Role */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    <h2 className="text-lg font-bold text-white">{selectedRole.name}</h2>
                    <code className="text-xs text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {selectedRole.code}
                    </code>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{selectedRole.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert(`Saved configuration changes for role: ${selectedRole.name}`)}
                >
                  <Edit className="w-4 h-4 mr-1.5" />
                  Save Changes
                </Button>
              </div>

              <div className="mt-6 space-y-6">
                {/* Public Web CMS Scope */}
                <div className="bg-slate-950/40 border border-slate-800/80 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                      Public Web & CMS Controls
                    </span>
                    <span className="text-[11px] text-slate-400">Manage truzon.in pages, blogs, media & forms</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                      <span>View Content</span>
                      {selectedRole.permissions.publicWeb.read ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                      <span>Draft / Edit</span>
                      {selectedRole.permissions.publicWeb.write ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                      <span>Publish Live</span>
                      {selectedRole.permissions.publicWeb.publish ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Pro Portal & CRM Scope */}
                <div className="bg-slate-950/40 border border-slate-800/80 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                      Pro CRM & Sales Engine
                    </span>
                    <span className="text-[11px] text-slate-400">Manage buyer pipeline, unit allocations & finance</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                      <span>Leads & Site Visits</span>
                      {selectedRole.permissions.proCrm.leads ? (
                        <CheckCircle className="w-4 h-4 text-blue-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                      <span>Bookings & Inventory</span>
                      {selectedRole.permissions.proCrm.bookings ? (
                        <CheckCircle className="w-4 h-4 text-blue-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                      <span>Finance & ATS Legal</span>
                      {selectedRole.permissions.proCrm.finance ? (
                        <CheckCircle className="w-4 h-4 text-blue-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                  </div>
                </div>

                {/* CP Network Operations Scope */}
                <div className="bg-slate-950/40 border border-slate-800/80 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                      Channel Partner (CP) Operations
                    </span>
                    <span className="text-[11px] text-slate-400">Broker verification, commission rules & payouts</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                      <span>Broker Onboarding & Directory</span>
                      {selectedRole.permissions.cpOperations.managePartners ? (
                        <CheckCircle className="w-4 h-4 text-purple-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                      <span>Approve Commission Payouts</span>
                      {selectedRole.permissions.cpOperations.approvePayouts ? (
                        <CheckCircle className="w-4 h-4 text-purple-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                  </div>
                </div>

                {/* System & Platform Scope */}
                <div className="bg-slate-950/40 border border-slate-800/80 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                      System Administration
                    </span>
                    <span className="text-[11px] text-slate-400">User accounts, role policies, and audit trails</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                      <span>Manage Users</span>
                      {selectedRole.permissions.systemSettings.manageUsers ? (
                        <CheckCircle className="w-4 h-4 text-amber-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                      <span>Manage Roles</span>
                      {selectedRole.permissions.systemSettings.manageRoles ? (
                        <CheckCircle className="w-4 h-4 text-amber-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                      <span>View Audit Logs</span>
                      {selectedRole.permissions.systemSettings.viewAudit ? (
                        <CheckCircle className="w-4 h-4 text-amber-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
