'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Save, Sparkles, Image as ImageIcon } from 'lucide-react';
import type { BlogPost } from '@/types';

interface BlogFormProps {
  initialData?: Partial<BlogPost>;
  isEdit?: boolean;
  onSubmit: (data: any) => Promise<any>;
}

export function BlogForm({ initialData, isEdit = false, onSubmit }: BlogFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [slugCustomized, setSlugCustomized] = useState(Boolean(initialData?.slug));
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [body, setBody] = useState(initialData?.body || '');
  const [status, setStatus] = useState<string>(initialData?.status || 'PUBLISHED');
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [readingTime, setReadingTime] = useState(initialData?.readingTimeMinutes || 5);
  const [featuredImageUrl, setFeaturedImageUrl] = useState(
    initialData?.featuredImage?.url || ''
  );

  // SEO fields
  const [seoTitle, setSeoTitle] = useState(initialData?.seo?.seoTitle || '');
  const [seoDesc, setSeoDesc] = useState(initialData?.seo?.metaDescription || '');
  const [seoKeywords, setSeoKeywords] = useState(
    initialData?.seo?.keywords?.join(', ') || ''
  );

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slugCustomized) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      setError('Please provide a valid Title and Slug.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const payload: any = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim() || undefined,
        body: body.trim() || undefined,
        status,
        isFeatured,
        readingTimeMinutes: Number(readingTime) || 5,
        seo: {
          seoTitle: seoTitle.trim() || title.trim(),
          metaDescription: seoDesc.trim() || excerpt.trim() || undefined,
          keywords: seoKeywords ? seoKeywords.split(',').map((k) => k.trim()).filter(Boolean) : [],
        },
      };

      await onSubmit(payload);
      router.push('/blogs');
      router.refresh();
    } catch (err: any) {
      setError(err?.data?.message || err?.message || 'Failed to save blog post');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/blogs"
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Blog Post' : 'New Blog Post'}
            </h1>
            <p className="text-gray-500 text-sm">
              {isEdit
                ? 'Update your article details, SEO, and publication status.'
                : 'Write and publish a high-quality article for Truzon Homes.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/blogs">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={submitting}
            className="bg-navy-900 hover:bg-navy-800 text-white min-w-[120px]"
          >
            <Save className="mr-2 h-4 w-4" />
            {submitting ? 'Saving...' : isEdit ? 'Update Post' : 'Publish Post'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="p-5 border-b border-gray-100">
              <CardTitle className="text-base font-semibold text-gray-900">
                Article Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. 5 Reasons Why North Bangalore is Ideal for Luxury Living"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Slug (URL Path) <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <span className="text-xs bg-gray-100 border border-r-0 border-gray-300 px-3 py-2 text-gray-500 rounded-l-md select-none">
                    /blog/
                  </span>
                  <Input
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setSlugCustomized(true);
                    }}
                    placeholder="why-north-bangalore-is-ideal-for-luxury-living"
                    className="rounded-l-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Excerpt (Summary)
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A short compelling overview of the article shown in listings and social previews..."
                  rows={3}
                  className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Article Body (Markdown / Text)
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your article content here in Markdown or plain text..."
                  rows={14}
                  className="w-full font-mono rounded-md border border-gray-300 p-3 text-sm leading-relaxed focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO Metadata */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="p-5 border-b border-gray-100 flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                Search Engine Optimization (SEO)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  SEO Meta Title
                </label>
                <Input
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={title || 'Custom meta title'}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Meta Description
                </label>
                <textarea
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  placeholder={excerpt || 'Brief description for Google search snippets...'}
                  rows={2}
                  className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Keywords (comma separated)
                </label>
                <Input
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  placeholder="bangalore real estate, luxury villas, gated community"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings (1 col) */}
        <div className="space-y-6">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="p-5 border-b border-gray-100">
              <CardTitle className="text-base font-semibold text-gray-900">
                Publishing Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Publication Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PUBLISHED">Published (Live)</option>
                  <option value="DRAFT">Draft (Unpublished)</option>
                  <option value="SCHEDULED">Scheduled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Estimated Reading Time
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={60}
                    value={readingTime}
                    onChange={(e) => setReadingTime(Number(e.target.value))}
                  />
                  <span className="text-sm text-gray-500">minutes</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-800">
                    Feature on Homepage & Blog Top
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image URL */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="p-5 border-b border-gray-100 flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-blue-500" />
                Featured Image
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Image URL / Asset Path
                </label>
                <Input
                  value={featuredImageUrl}
                  onChange={(e) => setFeaturedImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or /images/..."
                />
              </div>
              {featuredImageUrl && (
                <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 max-h-48 bg-gray-50">
                  <img
                    src={featuredImageUrl}
                    alt="Featured preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
