'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useGetProjectsQuery } from '@/lib/api-hooks';
import { ArrowLeft, Save, Building2, Sparkles, Check } from 'lucide-react';
import type { Property } from '@/types';

interface PropertyFormProps {
  initialData?: Partial<Property>;
  isEdit?: boolean;
  onSubmit: (data: any) => Promise<any>;
}

const PROPERTY_TYPES = [
  { value: 'VILLA', label: 'Luxury Villa' },
  { value: 'PLOT', label: 'Premium Plot / Land' },
  { value: 'APARTMENT', label: 'High-End Apartment' },
  { value: 'COMMERCIAL', label: 'Commercial Space' },
];

const FACING_OPTIONS = ['East', 'North', 'North-East', 'West', 'South'];

const COMMON_AMENITIES = [
  'Private Swimming Pool',
  'Clubhouse',
  '100% Vastu Compliant',
  'Private Garden & Lawn',
  '24/7 Multi-Tier Security',
  'EV Charging Bay',
  'Smart Home Automation',
  'Gymnasium & Yoga Deck',
  'Tennis & Badminton Court',
  'Rainwater Harvesting',
];

export function PropertyForm({ initialData, isEdit = false, onSubmit }: PropertyFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { data: projectsData } = useGetProjectsQuery({ limit: 100 });
  const projects = projectsData?.data || [];

  const [projectId, setProjectId] = useState(initialData?.projectId || '');
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [slugCustomized, setSlugCustomized] = useState(Boolean(initialData?.slug));
  const [propertyType, setPropertyType] = useState(initialData?.propertyType || 'VILLA');
  const [configuration, setConfiguration] = useState(initialData?.configuration || '4 BHK Villa');
  const [facing, setFacing] = useState(initialData?.facing || 'East');

  const [bedrooms, setBedrooms] = useState(initialData?.bedrooms || 4);
  const [bathrooms, setBathrooms] = useState(initialData?.bathrooms || 4);
  const [balconies, setBalconies] = useState(initialData?.balconies || 2);

  const [builtUpArea, setBuiltUpArea] = useState(initialData?.builtUpArea || 3200);
  const [carpetArea, setCarpetArea] = useState(initialData?.carpetArea || 2600);
  const [plotSize, setPlotSize] = useState(initialData?.plotSize || 2400);

  const [priceDisplay, setPriceDisplay] = useState(initialData?.priceDisplay || '₹3.25 Cr*');
  const [priceValue, setPriceValue] = useState(initialData?.priceValue || 32500000);
  const [pricePerSqft, setPricePerSqft] = useState(initialData?.pricePerSqft || 10156);

  const [isSignature, setIsSignature] = useState(initialData?.isSignature ?? true);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || '');
  const [description, setDescription] = useState(initialData?.description || '');

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(() => {
    if (Array.isArray(initialData?.amenities)) {
      return (initialData.amenities as any[]).map((a) => (typeof a === 'string' ? a : a.name));
    }
    return ['Private Swimming Pool', 'Clubhouse', '100% Vastu Compliant', '24/7 Multi-Tier Security'];
  });

  function handleNameChange(val: string) {
    setName(val);
    if (!slugCustomized) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  }

  function toggleAmenity(item: string) {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !slug.trim() || !projectId) {
      setError('Please select a project and provide a valid Name and Slug.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const payload: any = {
        projectId,
        name: name.trim(),
        slug: slug.trim(),
        propertyType,
        configuration: configuration.trim() || undefined,
        facing: facing || undefined,
        bedrooms: Number(bedrooms) || undefined,
        bathrooms: Number(bathrooms) || undefined,
        balconies: Number(balconies) || undefined,
        builtUpArea: Number(builtUpArea) || undefined,
        carpetArea: Number(carpetArea) || undefined,
        plotSize: Number(plotSize) || undefined,
        priceDisplay: priceDisplay.trim() || undefined,
        priceValue: Number(priceValue) || undefined,
        pricePerSqft: Number(pricePerSqft) || undefined,
        isSignature,
        isActive,
        shortDescription: shortDescription.trim() || undefined,
        description: description.trim() || undefined,
        amenities: selectedAmenities.map((name) => ({ name })),
      };

      await onSubmit(payload);
      router.push('/properties');
      router.refresh();
    } catch (err: any) {
      setError(err?.data?.message || err?.message || 'Failed to save property');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/properties"
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Property Listing' : 'New Property Listing'}
            </h1>
            <p className="text-gray-500 text-sm">
              {isEdit
                ? 'Update property specs, pricing, and signature status.'
                : 'Publish a villa, plot, or apartment to Truzon Signature Collections.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/properties">
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
            {submitting ? 'Saving...' : isEdit ? 'Update Property' : 'Save Property'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Columns (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="p-5 border-b border-gray-100">
              <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-500" />
                Primary Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Parent Project <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Project</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Property Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. 4 BHK Grand Villa - Type A"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Slug (URL Key) <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <span className="text-xs bg-gray-100 border border-r-0 border-gray-300 px-3 py-2 text-gray-500 rounded-l-md select-none">
                    /properties/
                  </span>
                  <Input
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setSlugCustomized(true);
                    }}
                    placeholder="4-bhk-grand-villa-type-a"
                    className="rounded-l-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Configuration
                  </label>
                  <Input
                    value={configuration}
                    onChange={(e) => setConfiguration(e.target.value)}
                    placeholder="e.g. 4 BHK + Maid's Room"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Facing Direction
                  </label>
                  <select
                    value={facing}
                    onChange={(e) => setFacing(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {FACING_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {f} Facing
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dimension & Floor Plan Specs */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="p-5 border-b border-gray-100">
              <CardTitle className="text-base font-semibold text-gray-900">
                Specifications & Dimensions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Bedrooms
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Bathrooms
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Balconies
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={balconies}
                    onChange={(e) => setBalconies(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Built-up Area (sq.ft)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={builtUpArea}
                    onChange={(e) => setBuiltUpArea(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Carpet Area (sq.ft)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={carpetArea}
                    onChange={(e) => setCarpetArea(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Plot Size (sq.ft)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={plotSize}
                    onChange={(e) => setPlotSize(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Overview / Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Architectural features, Italian marble flooring, double-height ceiling..."
                  rows={4}
                  className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Curated Amenities */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="p-5 border-b border-gray-100">
              <CardTitle className="text-base font-semibold text-gray-900">
                Amenities & Features
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {COMMON_AMENITIES.map((item) => {
                  const isChecked = selectedAmenities.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleAmenity(item)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
                        isChecked
                          ? 'border-blue-500 bg-blue-50 text-blue-900 font-semibold'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded flex items-center justify-center border ${
                          isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="h-3 w-3" />}
                      </div>
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings (1 col) */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="p-5 border-b border-gray-100">
              <CardTitle className="text-base font-semibold text-gray-900">
                Pricing Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Display Price <span className="text-red-500">*</span>
                </label>
                <Input
                  value={priceDisplay}
                  onChange={(e) => setPriceDisplay(e.target.value)}
                  placeholder="e.g. ₹2.85 Cr*"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Price Value (INR Numeric)
                </label>
                <Input
                  type="number"
                  min={0}
                  value={priceValue}
                  onChange={(e) => setPriceValue(Number(e.target.value))}
                  placeholder="28500000"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Price per Sq.Ft (INR)
                </label>
                <Input
                  type="number"
                  min={0}
                  value={pricePerSqft}
                  onChange={(e) => setPricePerSqft(Number(e.target.value))}
                  placeholder="9500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Visibility & Highlight Status */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="p-5 border-b border-gray-100">
              <CardTitle className="text-base font-semibold text-gray-900">
                Status & Highlights
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <label className="flex items-start gap-3 p-3 rounded-xl border border-purple-100 bg-purple-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSignature}
                  onChange={(e) => setIsSignature(e.target.checked)}
                  className="h-4 w-4 mt-0.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <span className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                    Signature Collection
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Showcase prominently on homepage slider and signature luxury grid.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-semibold text-gray-900">Active Listing</span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Make visible for search queries, brochures, and site visit enquiries.
                  </p>
                </div>
              </label>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
