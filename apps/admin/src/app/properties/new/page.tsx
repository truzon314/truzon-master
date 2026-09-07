'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PropertyForm } from '@/components/properties/PropertyForm';
import { useCreatePropertyMutation } from '@/lib/api-hooks';

export default function NewPropertyPage() {
  const [createProperty] = useCreatePropertyMutation();

  async function handleSubmit(data: any) {
    return createProperty(data).unwrap();
  }

  return (
    <DashboardLayout>
      <div className="py-2">
        <PropertyForm onSubmit={handleSubmit} />
      </div>
    </DashboardLayout>
  );
}
