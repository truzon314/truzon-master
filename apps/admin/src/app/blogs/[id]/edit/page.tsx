'use client';

import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BlogForm } from '@/components/cms/BlogForm';
import { useGetBlogPostQuery, useUpdateBlogPostMutation } from '@/lib/api-hooks';

export default function EditBlogPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: blog, isLoading, error } = useGetBlogPostQuery(id);
  const [updateBlogPost] = useUpdateBlogPostMutation();

  async function handleSubmit(data: any) {
    return updateBlogPost({ id, data }).unwrap();
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

  if (error || !blog) {
    return (
      <DashboardLayout>
        <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-red-700">
          Failed to load blog post details.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-2">
        <BlogForm initialData={blog} isEdit onSubmit={handleSubmit} />
      </div>
    </DashboardLayout>
  );
}
