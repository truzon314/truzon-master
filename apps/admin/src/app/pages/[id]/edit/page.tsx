'use client';

import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageForm } from '@/components/cms/PageForm';
import { useGetPageQuery, useUpdatePageMutation } from '@/lib/api-hooks';

export default function EditLandingPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: page, isLoading, error } = useGetPageQuery(id);
  const [updatePage] = useUpdatePageMutation();

  async function handleSubmit(data: any) {
    return updatePage({ id, data }).unwrap();
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-900" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !page) {
    return (
      <DashboardLayout>
        <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-red-700">
          Failed to load page data.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-2">
        <PageForm initialData={page} isEdit onSubmit={handleSubmit} />
      </div>
    </DashboardLayout>
  );
}
