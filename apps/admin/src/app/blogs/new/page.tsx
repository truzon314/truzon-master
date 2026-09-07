'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BlogForm } from '@/components/cms/BlogForm';
import { useCreateBlogPostMutation } from '@/lib/api-hooks';

export default function NewBlogPage() {
  const [createBlogPost] = useCreateBlogPostMutation();

  async function handleSubmit(data: any) {
    return createBlogPost(data).unwrap();
  }

  return (
    <DashboardLayout>
      <div className="py-2">
        <BlogForm onSubmit={handleSubmit} />
      </div>
    </DashboardLayout>
  );
}
