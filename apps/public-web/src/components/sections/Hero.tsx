'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { ArrowRight, Phone, Mail, MapPin, ChevronRight, ChevronDown, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeroSlide {
  heading: string;
  subheading: string;
  imageUrl?: string;
  mobileImageUrl?: string;
}

interface HeroProps {
  slides: HeroSlide[];
  buttonLabel: string;
  buttonHref: string;
  propertyTypes: string[];
}

export function Hero({ slides, buttonLabel, buttonHref, propertyTypes }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setTimeout(() => setIsAnimating(false), 500);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [slides.length]);

  const current = slides[currentSlide];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden" aria-label="Hero slider">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {current.imageUrl && (
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${current.imageUrl})` }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-900/70 to-transparent" />
      </div>

      {/* Floating Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-4xl">
          {/* Property Types Badge */}
          <div className="flex flex-wrap gap-2 mb-8 animate-slide-up">
            {propertyTypes.map((type, i) => (
              <span key={type} className="badge-primary stagger-{i + 1}">
                {type}
              </span>
            ))}
          </div>

          {/* Headline */}
          <h1 className="heading-1 text-white mb-6 animate-slide-up stagger-1">
            {current.heading}
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-primary-100 mb-10 max-w-2xl animate-slide-up stagger-2">
            {current.subheading}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up stagger-3">
            <Link href={buttonHref}>
              <Button variant="gold" className="px-8 py-4 text-base">
                {buttonLabel}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="outline-light" className="px-8 py-4 text-base">
                Explore Properties
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap items-center gap-8 text-primary-200 animate-slide-up stagger-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-gold-400" />
              <span className="font-medium">DTCP & RERA Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-gold-400" />
              <span className="font-medium">Transparent Pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-gold-400" />
              <span className="font-medium">Prime Locations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-gold-400" />
              <span className="font-medium">24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/50" />
        </div>
      </div>

      {/* Contact Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-md border-t border-white/10 px-6 py-4">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-white/80">
                <Phone className="h-5 w-5 text-gold-400" />
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-wide">Call Us</p>
                  <p className="font-medium">+91 40 1234 5678</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <Mail className="h-5 w-5 text-gold-400" />
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-wide">Email Us</p>
                  <p className="font-medium">info@truzonhomes.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <MapPin className="h-5 w-5 text-gold-400" />
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-wide">Visit Us</p>
                  <p className="font-medium">Hyderabad, Telangana</p>
                </div>
              </div>
              <div className="flex-1" />
              <Link href="/contact">
                <Button variant="gold" className="px-8 py-4 text-base">
                  Request a Callback
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}