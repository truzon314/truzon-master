'use client';

import Link from 'next/link';
import { clsx } from 'clsx';
import { ArrowRight, Home, MapPin, Tag, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PropertyCard } from '@/components/ui/PropertyCard';

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

interface FeaturedPropertiesProps {
  properties: Property[];
}

export function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  const featuredProps = properties.filter(p => p.is_signature).slice(0, 3);
  const otherProps = properties.filter(p => !p.is_signature).slice(0, 3);
  const allProps = [...featuredProps, ...otherProps].slice(0, 6);

  if (allProps.length === 0) return null;

  return (
    <section className="section bg-gray-50" aria-labelledby="featured-properties-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-gold mb-4 inline-block">Featured Properties</span>
          <h2 id="featured-properties-heading" className="heading-2 mb-4">
            Signature Collections
          </h2>
          <p className="text-lead">
            Handpicked premium properties that define luxury living. Each property is carefully selected for its location, design, and investment potential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allProps.map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/properties">
            <Button variant="outline-light" className="px-8 py-4 text-base">
              View All Properties
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}