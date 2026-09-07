'use client';

import Image from 'next/image';
import { clsx } from 'clsx';
import { Shield, Award, MapPin, Heart, Truck, Headphones, Sparkles, Building2 } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'DTCP & RERA Approved',
    description: 'Every project carries all necessary government approvals and compliance certifications for complete peace of mind.',
  },
  {
    icon: Award,
    title: 'Transparent Pricing',
    description: 'No hidden costs. What you see is what you pay. Transparent breakdown of all costs including registration and taxes.',
  },
  {
    icon: MapPin,
    title: 'Prime Locations',
    description: 'Strategically located in high-growth corridors with excellent connectivity, infrastructure, and appreciation potential.',
  },
  {
    icon: Heart,
    title: 'Customer Centric',
    description: 'Dedicated relationship managers guide you through every step - from site visit to possession and beyond.',
  },
  {
    icon: Building2,
    title: 'Quality Construction',
    description: 'Premium materials, modern architecture, and rigorous quality checks at every stage of construction.',
  },
  {
    icon: Sparkles,
    title: 'Modern Amenities',
    description: 'Clubhouse, swimming pool, gym, landscaped gardens, 24/7 security, and smart home features in select projects.',
  },
  {
    icon: Truck,
    title: 'Timely Delivery',
    description: 'Track record of on-time project completion with regular progress updates and transparent timelines.',
  },
  {
    icon: Headphones,
    title: 'Post-Sale Support',
    description: 'Dedicated customer care for maintenance, documentation, resale assistance, and rental management.',
  },
];

export function WhyChooseUs({ imageUrl }: { imageUrl?: string }) {
  return (
    <section className="section" aria-labelledby="why-choose-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative">
            {imageUrl ? (
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={imageUrl}
                  alt="Why Choose Truzon Homes"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary-100 to-gold-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <span className="text-6xl">🏠</span>
                  <p className="mt-4 text-navy-600 font-medium">Why Choose Truzon Homes</p>
                </div>
              </div>
            )}
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 lg:-right-8 bg-white shadow-xl rounded-2xl p-6 max-w-xs animate-slide-up stagger-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gold-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <div>
                  <p className="font-heading font-semibold text-navy-900">Award Winning</p>
                  <p className="text-sm text-navy-500">Best Developer 2023</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-navy-600">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>50+ Projects</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>10,000+ Homes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:border-primary-200 hover:-translate-y-1 transition-all duration-500 animate-slide-up"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                <feature.icon className="h-7 w-7 text-primary-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-heading font-semibold text-navy-900 mb-2">{feature.title}</h3>
              <p className="text-navy-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}