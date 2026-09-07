'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { clsx } from 'clsx';
import { Star, ChevronLeft, ChevronRight, Quote, MapPin, Heart, Building2, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Testimonial {
  id: string;
  name: string;
  designation?: string;
  company?: string;
  content: string;
  rating: number;
  avatar_url?: string;
  project?: { name: string };
  is_featured: boolean;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const itemsPerView = 3;
  const maxIndex = Math.max(0, testimonials.length - 3);

  const next = () => setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1);
  const prev = () => setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || testimonials.length <= 3) return;
    const interval = setInterval(() => {
      next();
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay, testimonials.length, next]);

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + itemsPerView);

  if (testimonials.length === 0) return null;

  return (
    <section className="section bg-gray-50" aria-labelledby="testimonials-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-gold mb-4 inline-block">Testimonials</span>
          <h2 id="testimonials-heading" className="heading-2 mb-4">
            Trusted by Thousands of Happy Homeowners
          </h2>
          <p className="text-lead">
            Hear from families who found their dream homes with Truzon Homes.
          </p>
        </div>

        <div className="relative">
          {/* Carousel */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.slice(currentIndex, currentIndex + 3).map((testimonial, index) => (
              <article
                key={testimonial.id}
                className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-xl hover:border-primary-200 transition-all duration-500 animate-slide-up stagger-{index + 1}"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={clsx(
                        'h-5 w-5',
                        i < testimonial.rating ? 'text-gold-400 fill-current' : 'text-gray-300'
                      )}
                    />
                  ))}
                </div>

                {/* Quote */}
                <Quote className="h-8 w-8 text-primary-200 mb-4" />
                <blockquote className="text-navy-600 text-base leading-relaxed mb-6">
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-gold-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {testimonial.avatar_url ? (
                      <Image
                        src={testimonial.avatar_url}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-heading font-bold text-primary-600">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900">{testimonial.name}</p>
                    <p className="text-sm text-navy-500">
                      {testimonial.designation && `${testimonial.designation}`}
                      {testimonial.designation && testimonial.company && ' · '}
                      {testimonial.company && testimonial.company}
                      {testimonial.project && (
                        <>
                          {' · '}
                          <span className="text-primary-600 font-medium">{testimonial.project.name}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Navigation Arrows */}
          {testimonials.length > 3 && (
            <>
              <button
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -left-12 lg:-left-16 z-10 p-3 bg-white rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 hover:shadow-xl transition-all duration-300"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-6 w-6 text-navy-600" />
              </button>
              <button
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 -right-12 lg:-right-16 z-10 p-3 bg-white rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 hover:shadow-xl transition-all duration-300"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-6 w-6 text-navy-600" />
              </button>
            </>
          )}

          {/* Dots */}
          {testimonials.length > 3 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={clsx(
                    'w-2 h-2 rounded-full transition-all duration-300',
                    currentIndex === i ? 'bg-primary-600 w-6' : 'bg-gray-300 hover:bg-gray-400'
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}

        </div>

        {/* Stats Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard value="10,000+" label="Happy Families" icon={<Heart className="h-8 w-8" />} />
          <StatCard value="98%" label="Customer Satisfaction" icon={<Star className="h-8 w-8 fill-current" />} />
          <StatCard value="50+" label="Projects Delivered" icon={<Building2 className="h-8 w-8" />} />
          <StatCard value="24/7" label="Customer Support" icon={<Headphones className="h-8 w-8" />} />
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <div className="text-center p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-center mb-3 text-primary-600">{icon}</div>
      <p className="text-3xl font-heading font-bold text-navy-900">{value}</p>
      <p className="text-navy-500 text-sm">{label}</p>
    </div>
  );
}