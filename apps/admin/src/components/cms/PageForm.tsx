'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Sparkles,
  Layers,
  LayoutTemplate,
} from 'lucide-react';
import type { Page } from '@/types';

interface PageFormProps {
  initialData?: Partial<Page>;
  isEdit?: boolean;
  onSubmit: (data: any) => Promise<any>;
}

interface BlockItem {
  id?: string;
  type: string;
  position: number;
  config: Record<string, any>;
}

const AVAILABLE_BLOCKS = [
  {
    type: 'hero_banner',
    label: 'Hero Banner',
    description: 'Impactful headline, subheading, and primary action button.',
    defaultConfig: {
      heading: 'Discover Exclusive Living in Bangalore',
      subheading: 'Curated signature villas and master-planned townships crafted for discerning families.',
      buttonLabel: 'Schedule Private Tour',
      buttonHref: '#enquire',
    },
  },
  {
    type: 'features',
    label: 'Feature Highlights',
    description: '3-card highlight grid with icon badges and luxury benefits.',
    defaultConfig: {
      heading: 'World-Class Amenities & Craftsmanship',
      items: [
        { title: 'Prime Connectivity', desc: '15 mins from International Airport and business hubs' },
        { title: '100% Vastu Compliant', desc: 'Positive energy flow, expansive ventilation & daylight' },
        { title: 'Private Clubhouse', desc: 'Heated infinity pool, spa, and squash courts' },
      ],
    },
  },
  {
    type: 'text',
    label: 'Text / Editorial',
    description: 'Rich narrative section with heading and detailed body copy.',
    defaultConfig: {
      heading: 'Designed for Generations',
      body: 'Every residence at Truzon is designed with uncompromising quality, Italian marble finishes, and floor-to-ceiling glass that harmonizes indoor grandeur with lush private landscapes.',
    },
  },
  {
    type: 'faq',
    label: 'FAQ Accordion',
    description: 'Answers to common questions regarding booking, possession, and financing.',
    defaultConfig: {
      heading: 'Frequently Asked Questions',
      items: [
        { q: 'What is the possession timeline?', a: 'Phase 1 possession begins December 2026.' },
        { q: 'Are bank loans approved?', a: 'Yes, approved by HDFC, SBI, ICICI, and Axis Bank.' },
      ],
    },
  },
  {
    type: 'cta',
    label: 'Call to Action Banner',
    description: 'High-conversion banner with prompt to book or call our luxury advisors.',
    defaultConfig: {
      heading: 'Ready to Experience Truzon Homes in Person?',
      body: 'Our private client advisors are available 7 days a week for personalized site tours.',
      buttonLabel: 'Book a Site Visit',
      buttonHref: '/contact',
    },
  },
];

export function PageForm({ initialData, isEdit = false, onSubmit }: PageFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [slugCustomized, setSlugCustomized] = useState(Boolean(initialData?.slug));
  const [pageType, setPageType] = useState<string>(initialData?.pageType || 'CUSTOM');
  const [status, setStatus] = useState<string>(initialData?.status || 'PUBLISHED');

  // SEO fields
  const [seoTitle, setSeoTitle] = useState(initialData?.seo?.seoTitle || '');
  const [seoDesc, setSeoDesc] = useState(initialData?.seo?.metaDescription || '');
  const [seoKeywords, setSeoKeywords] = useState(
    initialData?.seo?.keywords?.join(', ') || ''
  );

  // Blocks
  const [blocks, setBlocks] = useState<BlockItem[]>(() => {
    if (initialData?.blocks && initialData.blocks.length > 0) {
      return (initialData.blocks as any[]).map((b: any, i: number) => ({
        id: b.id,
        type: b.blockDefinition?.key || 'text',
        position: b.position ?? i,
        config: (b.config as any) || {},
      }));
    }
    // Default initial blocks for a new landing page
    return [
      {
        type: 'hero_banner',
        position: 0,
        config: { ...AVAILABLE_BLOCKS[0].defaultConfig },
      },
      {
        type: 'features',
        position: 1,
        config: { ...AVAILABLE_BLOCKS[1].defaultConfig },
      },
      {
        type: 'cta',
        position: 2,
        config: { ...AVAILABLE_BLOCKS[4].defaultConfig },
      },
    ];
  });

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slugCustomized && pageType === 'CUSTOM') {
      const clean = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(clean);
    }
  }

  function addBlock(blockDef: (typeof AVAILABLE_BLOCKS)[0]) {
    setBlocks((prev) => [
      ...prev,
      {
        type: blockDef.type,
        position: prev.length,
        config: JSON.parse(JSON.stringify(blockDef.defaultConfig)),
      },
    ]);
  }

  function removeBlock(index: number) {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  }

  function moveBlock(index: number, direction: 'up' | 'down') {
    setBlocks((prev) => {
      const copy = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy.map((b, i) => ({ ...b, position: i }));
    });
  }

  function updateBlockConfig(index: number, key: string, val: any) {
    setBlocks((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        config: {
          ...copy[index].config,
          [key]: val,
        },
      };
      return copy;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      setError('Please provide a valid Page Title and Slug.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const payload: any = {
        title: title.trim(),
        slug: slug.startsWith('/') ? slug.trim() : `/${slug.trim()}`,
        pageType,
        status,
        blocks: blocks.map((b, i) => ({
          blockDefinitionKey: b.type,
          position: i,
          config: b.config,
        })),
        seo: {
          seoTitle: seoTitle.trim() || title.trim(),
          metaDescription: seoDesc.trim() || undefined,
          keywords: seoKeywords ? seoKeywords.split(',').map((k) => k.trim()).filter(Boolean) : [],
        },
      };

      await onSubmit(payload);
      router.push('/pages');
      router.refresh();
    } catch (err: any) {
      setError(err?.data?.message || err?.message || 'Failed to save page');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/pages"
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Landing Page' : 'Create Landing Page'}
            </h1>
            <p className="text-gray-500 text-sm">
              {isEdit
                ? 'Customize page blocks, layout content, and SEO.'
                : 'Build high-converting landing pages for luxury projects & campaigns.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/pages">
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
            {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Publish Page'}
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
          {/* General info */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="p-5 border-b border-gray-100">
              <CardTitle className="text-base font-semibold text-gray-900">
                Page Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Page Title <span className="text-red-500">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Luxury Villas in North Bangalore | Truzon Sanctuary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  URL Path / Slug <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <span className="text-xs bg-gray-100 border border-r-0 border-gray-300 px-3 py-2 text-gray-500 rounded-l-md select-none font-mono">
                    {pageType === 'CUSTOM' ? '/lp/' : '/'}
                  </span>
                  <Input
                    value={slug.replace(/^\//, '').replace(/^lp\//, '')}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setSlugCustomized(true);
                    }}
                    placeholder="luxury-villas-north-bangalore"
                    className="rounded-l-none font-mono"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Block Builder */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-blue-500" />
                  Dynamic Page Blocks ({blocks.length})
                </CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">
                  Add and configure modular blocks to construct your landing page.
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {blocks.length === 0 ? (
                <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-xl">
                  <LayoutTemplate className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 font-medium">No blocks added yet.</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Select a block below to start building your landing page.
                  </p>
                </div>
              ) : (
                blocks.map((block, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 uppercase px-2 py-0.5 bg-gray-200 rounded">
                          Block {idx + 1}
                        </span>
                        <span className="text-sm font-semibold text-gray-800 capitalize">
                          {block.type.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveBlock(idx, 'up')}
                          className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                          title="Move up"
                        >
                          <MoveUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === blocks.length - 1}
                          onClick={() => moveBlock(idx, 'down')}
                          className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                          title="Move down"
                        >
                          <MoveDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeBlock(idx)}
                          className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
                          title="Remove block"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Block Config Inputs */}
                    <div className="space-y-2 pt-1">
                      {block.config.heading !== undefined && (
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">
                            Heading
                          </label>
                          <Input
                            value={block.config.heading || ''}
                            onChange={(e) => updateBlockConfig(idx, 'heading', e.target.value)}
                            placeholder="Section Heading"
                            className="text-sm bg-white"
                          />
                        </div>
                      )}

                      {block.config.subheading !== undefined && (
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">
                            Subheading / Subtitle
                          </label>
                          <Input
                            value={block.config.subheading || ''}
                            onChange={(e) => updateBlockConfig(idx, 'subheading', e.target.value)}
                            placeholder="Supporting text"
                            className="text-sm bg-white"
                          />
                        </div>
                      )}

                      {block.config.body !== undefined && (
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">
                            Body Text
                          </label>
                          <textarea
                            value={block.config.body || ''}
                            onChange={(e) => updateBlockConfig(idx, 'body', e.target.value)}
                            rows={3}
                            className="w-full text-sm rounded-md border border-gray-300 bg-white p-2.5 outline-none focus:border-blue-500"
                            placeholder="Paragraph content..."
                          />
                        </div>
                      )}

                      {block.config.buttonLabel !== undefined && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">
                              Button Label
                            </label>
                            <Input
                              value={block.config.buttonLabel || ''}
                              onChange={(e) =>
                                updateBlockConfig(idx, 'buttonLabel', e.target.value)
                              }
                              placeholder="e.g. Explore Villas"
                              className="text-sm bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">
                              Button Link
                            </label>
                            <Input
                              value={block.config.buttonHref || ''}
                              onChange={(e) =>
                                updateBlockConfig(idx, 'buttonHref', e.target.value)
                              }
                              placeholder="/contact or #form"
                              className="text-sm bg-white"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}

              {/* Add Block Selector */}
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                  Add a New Block
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {AVAILABLE_BLOCKS.map((b) => (
                    <button
                      key={b.type}
                      type="button"
                      onClick={() => addBlock(b)}
                      className="p-2.5 rounded-lg border border-gray-200 bg-white hover:border-blue-500 hover:bg-blue-50 text-left transition-all cursor-pointer group"
                    >
                      <div className="font-semibold text-xs text-gray-800 group-hover:text-blue-700 flex items-center justify-between">
                        {b.label}
                        <Plus className="h-3.5 w-3.5 text-gray-400 group-hover:text-blue-600" />
                      </div>
                      <div className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                        {b.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO Metadata */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="p-5 border-b border-gray-100">
              <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                SEO Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Meta Title
                </label>
                <Input
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={title || 'Page Meta Title'}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Meta Description
                </label>
                <textarea
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  placeholder="Compelling description for Google search results..."
                  rows={2}
                  className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Keywords
                </label>
                <Input
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  placeholder="luxury villas, gated community, bangalore real estate"
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
                Page Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PUBLISHED">Published (Live)</option>
                  <option value="DRAFT">Draft (Internal)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Page Type
                </label>
                <select
                  value={pageType}
                  onChange={(e) => setPageType(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isEdit && initialData?.pageType !== 'CUSTOM'}
                >
                  <option value="CUSTOM">Custom Landing Page</option>
                  <option value="HOME">Home</option>
                  <option value="ABOUT">About Us</option>
                  <option value="PROJECTS">Projects</option>
                  <option value="BLOG">Blog</option>
                  <option value="CONTACT">Contact</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
