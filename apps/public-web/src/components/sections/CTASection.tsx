'use client';

import Link from 'next/link';
import { clsx } from 'clsx';
import { ArrowRight, Phone, Mail, MapPin, Shield, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CTASectionProps {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  phoneDisplay?: string;
  phoneHref?: string;
  backgroundImage?: string;
  showPhoneLink?: boolean;
}

export function CTASection({
  title,
  description,
  primaryLabel,
  primaryHref,
  phoneDisplay,
  phoneHref,
  backgroundImage,
  showPhoneLink = true,
}: CTASectionProps) {
  return (
    <section className="section relative overflow-hidden" aria-labelledby="cta-heading">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {backgroundImage && (
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgroundImage})` }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/90 to-navy-800/80" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v-2h4v-4h-4v-4h-4v4h-4v4h-4v2h4v-2h4z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <span className="badge-gold mb-6 inline-block animate-slide-up">Ready to Find Your Dream Home?</span>

          {/* Title */}
          <h2 id="cta-heading" className="heading-2 text-white mb-6 animate-slide-up stagger-1">
            {title}
          </h2>

          {/* Description */}
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto animate-slide-up stagger-2">
            {description}
          </p>

          {/* Benefits */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 animate-slide-up stagger-3">
            <BenefitItem icon={<Shield className="h-6 w-6" />} title="DTCP & RERA Approved" description="All legal clearances verified" />
            <BenefitItem icon={<CheckCircle className="h-6 w-6" />} title="Transparent Pricing" description="No hidden charges ever" />
            <BenefitItem icon={<Sparkles className="h-6 w-6" />} title="Free Site Visit" description="Complimentary property tour" />
            <BenefitItem icon={<Sparkles className="h-6 w-6" />} title="Dedicated Manager" description="Personal guidance throughout" />
          </div>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up stagger-4">
            <Link href={primaryHref}>
              <Button variant="gold" className="px-8 py-4 text-base">
                {primaryLabel}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="outline-light" className="px-8 py-4 text-base">
                Explore Properties
              </Button>
            </Link>
          </div>

          {/* Contact Info */}
          {showPhoneLink && phoneHref && phoneDisplay && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 border-t border-white/10 animate-slide-up stagger-5">
              <a href={phoneHref} className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Phone className="h-6 w-6 text-gold-400" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-white/60 uppercase tracking-wide">Call Us</p>
                  <p className="font-medium text-lg">{phoneDisplay}</p>
                </div>
              </a>

              <div className="w-px h-10 bg-white/10 hidden sm:block" />

              <a href="mailto:info@truzonhomes.com" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Mail className="h-6 w-6 text-gold-400" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-white/60 uppercase tracking-wide">Email Us</p>
                  <p className="font-medium text-lg">info@truzonhomes.com</p>
                </div>
              </a>

              <a href="/contact" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-gold-400" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-white/60 uppercase tracking-wide">Visit Us</p>
                  <p className="font-medium text-lg">Hyderabad, Telangana</p>
                </div>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function BenefitItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
      <div className="w-12 h-12 bg-gold-500/20 rounded-xl flex items-center justify-center text-gold-400">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-white">{title}</p>
        <p className="text-sm text-white/70">{description}</p>
      </div>
    </div>
  );
}