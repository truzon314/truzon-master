'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const MapManagementPage = dynamic(
  () => import('@/modules/mapping/MapManagementPage'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[calc(100vh-8rem)] w-full bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-3 rounded-xl border border-slate-800">
        <div className="w-8 h-8 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
        <span className="font-semibold text-sm">Loading GIS Map Management System...</span>
      </div>
    ),
  }
);

export default function MappingPage() {
  return (
    <DashboardLayout>
      <MapManagementPage />
    </DashboardLayout>
  );
}
