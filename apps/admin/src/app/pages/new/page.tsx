'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageForm } from '@/components/cms/PageForm';
import { useCreatePageMutation } from '@/lib/api-hooks';

export default function NewLandingPage() {
  const [createPage] = useCreatePageMutation();

  async function handleSubmit(data: any) {
    return createPage(data).unwrap();
  }

  return (
    <DashboardLayout>
      <div className="py-2">
        <PageForm onSubmit={handleSubmit} />
      </div>
    </DashboardLayout>
  );
}
