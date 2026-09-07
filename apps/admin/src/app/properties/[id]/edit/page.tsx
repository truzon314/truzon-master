'use client';

import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PropertyForm } from '@/components/properties/PropertyForm';
import { useGetPropertyQuery, useUpdatePropertyMutation } from '@/lib/api-hooks';

export default function EditPropertyPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: property, isLoading, error } = useGetPropertyQuery(id);
  const [updateProperty] = useUpdatePropertyMutation();

  async function handleSubmit(data: any) {
    return updateProperty({ id, data }).unwrap();
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

  if (error || !property) {
    return (
      <DashboardLayout>
        <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-red-700">
          Failed to load property details.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-2">
        <PropertyForm initialData={property} isEdit onSubmit={handleSubmit} />
      </div>
    </DashboardLayout>
  );
}
