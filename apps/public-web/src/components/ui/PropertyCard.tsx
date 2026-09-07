'use client';

import Link from 'next/link';
import Image from 'next/image';
import { clsx } from 'clsx';
import { MapPin, Tag, Star, Home, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Property {
  id: string;
  name: string;
  slug: string;
  city?: string;
  location_text?: string;
  type?: string;
  price_display?: string;
  budget_bracket?: string;
  spec_a?: string;
  spec_b?: string;
  beds_options?: string[];
  tag_text?: string;
  status_text?: string;
  is_signature: boolean;
  featured_image_url?: string;
  project?: { name: string; slug: string; city?: string };
}

interface PropertyCardProps {
  property: Property;
  index?: number;
  variant?: 'default' | 'compact' | 'featured';
}

export function PropertyCard({ property, index = 0, variant = 'default' }: PropertyCardProps) {
  const imageUrl = property.featured_image_url || '/placeholder-property.jpg';

  const getBracketLabel = (bracket?: string) => {
    switch (bracket) {
      case 'under2': return 'Under ₹2 Cr';
      case '2to5': return '₹2-5 Cr';
      case '5to10': return '₹5-10 Cr';
      case '10plus': return '₹10 Cr+';
      default: return bracket || '';
    }
  };

  const getTypeLabel = (type?: string) => {
    switch (type) {
      case 'VILLA': return 'Villa';
      case 'PLOT': return 'Plot';
      case 'APARTMENT': return 'Apartment';
      default: return type || 'Property';
    }
  };

  return (
    <article className={clsx(
      'group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500',
      index !== undefined && 'animate-slide-up',
      `stagger-${(index || 0) + 1}`
    )}>
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {property.featured_image_url ? (
          <Image
            src={property.featured_image_url}
            alt={property.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-gold-100 flex items-center justify-center">
            <Home className="h-16 w-16 text-primary-300" />
          </div>
        )}
        
        {/* Signature Badge */}
        {property.is_signature && (
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold-500 text-white text-xs font-semibold rounded-full">
              <Star className="h-3 w-3" />
              Signature
            </span>
          </div>
        )}

        {/* Tag */}
        {property.tag_text && (
          <div className="absolute top-4 right-4 z-10">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-navy-700 text-xs font-semibold rounded-full">
              {property.tag_text}
            </span>
          </div>
        )}

        {/* Status */}
        {property.status_text && (
          <div className="absolute bottom-4 left-4 z-10">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-navy-700 text-xs font-medium rounded-full">
              {property.status_text}
            </span>
          </div>
        )}

        {/* Price Tag */}
        {property.price_display && (
          <div className="absolute bottom-4 right-4 z-10">
            <span className="px-4 py-2 bg-white shadow-lg rounded-xl">
              <span className="text-2xl font-bold text-navy-900">{property.price_display}</span>
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Category & Location */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-navy-500">
          <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full font-medium">
            {property.type ? property.type.replace(/_/g, ' ') : 'Property'}
          </span>
          {property.city && (
            <>
              <MapPin className="h-3.5 w-3.5 text-navy-400" />
              <span>{property.city}</span>
            </>
          )}
          {property.project && (
            <>
              <span className="text-navy-300">·</span>
              <span className="font-medium text-navy-600">{property.project.name}</span>
            </>
          )}
        </div>

        {/* Title */}
        <Link href={`/projects/${property.project?.slug}/${property.slug}`} className="group">
          <h3 className="text-xl font-heading font-bold text-navy-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {property.name}
          </h3>
        </Link>

        {/* Location */}
        {property.location_text && (
          <p className="text-navy-500 text-sm flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {property.location_text}
          </p>
        )}

        {/* Specs */}
        <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-100">
          {property.beds_options && property.beds_options.length > 0 && (
            <div className="flex items-center gap-1 text-sm text-navy-600">
              <span className="font-medium">{property.beds_options.join(', ')}</span>
              <span className="text-navy-400">BHK</span>
            </div>
          )}
          {property.spec_a && (
            <div className="flex items-center gap-1 text-sm text-navy-600">
              <span className="font-medium">{property.spec_a}</span>
            </div>
          )}
          {property.spec_b && (
            <div className="flex items-center gap-1 text-sm text-navy-600">
              <span className="font-medium">{property.spec_b}</span>
            </div>
          )}
        </div>

        {/* Price & Budget */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            {property.price_display && (
              <p className="text-2xl font-heading font-bold text-navy-900">{property.price_display}</p>
            )}
            {property.budget_bracket && (
              <p className="text-sm text-navy-500">{getBracketLabel(property.budget_bracket)}</p>
            )}
          </div>
          <Link href={`/projects/${property.project?.slug}/${property.slug}`} className="group">
            <Button variant="outline-light" className="px-4 py-2 text-sm">
              View Details
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}

function getBracketLabel(bracket: string) {
  switch (bracket) {
    case 'under2': return 'Under ₹2 Cr';
    case '2to5': return '₹2-5 Cr';
    case '5to10': return '₹5-10 Cr';
    case '10plus': return '₹10 Cr+';
    default: return bracket;
  }
}