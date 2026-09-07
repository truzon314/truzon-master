'use client';

import Link from 'next/link';
import Image from 'next/image';
import { clsx } from 'clsx';
import { ArrowRight, MapPin, Building2, Award, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Project {
  id: string;
  name: string;
  slug: string;
  city?: string;
  state?: string;
  address?: string;
  tagline?: string;
  short_description?: string;
  status?: string;
  is_featured?: boolean;
  featured_image_url?: string;
  latitude?: number;
  longitude?: number;
  rera_number?: string;
  possession_date?: string;
  launch_date?: string;
  _count?: {
    properties: number;
    villas: number;
    plots: number;
  };
}

interface FeaturedProjectsProps {
  projects: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const featuredProjects = projects.filter(p => p.is_featured).slice(0, 3);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 3);

  if (displayProjects.length === 0) return null;

  return (
    <section className="section bg-gray-50" aria-labelledby="featured-projects-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-primary mb-4 inline-block">Featured Projects</span>
          <h2 id="featured-projects-heading" className="heading-2 mb-4">
            Our Signature Projects
          </h2>
          <p className="text-lead">
            Explore our flagship developments that redefine luxury living across prime locations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project, index) => (
            <article
              key={project.id}
              className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 animate-slide-up stagger-{index + 1}"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                {project.featured_image_url ? (
                  <Image
                    src={project.featured_image_url}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-gold-100 flex items-center justify-center">
                    <Building2 className="h-16 w-16 text-primary-300" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  {project.is_featured && (
                    <span className="px-3 py-1 bg-gold-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Featured
                    </span>
                  )}
                  {project.status && (
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      project.status === 'LAUNCHED' ? 'bg-blue-100 text-blue-700' :
                      project.status === 'ONGOING' ? 'bg-yellow-100 text-yellow-700' :
                      project.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {project.status}
                    </span>
                  )}
                </div>

                {/* Location Badge */}
                <div className="absolute bottom-4 left-4 z-10">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-navy-700 text-xs font-medium rounded-full flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {project.city}, {project.state}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-sm text-navy-500">
                  <Building2 className="h-4 w-4 text-navy-400" />
                  <span>{project._count?.properties || 0} Properties</span>
                  <span className="text-navy-300">·</span>
                  <span>{project._count?.villas || 0} Villas</span>
                  {project._count?.plots && project._count.plots > 0 && (
                    <span> · {project._count.plots} Plots</span>
                  )}
                </div>

                <Link href={`/projects/${project.slug}`} className="group">
                  <h3 className="text-xl font-heading font-bold text-navy-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                    {project.name}
                  </h3>
                </Link>

                {project.tagline && (
                  <p className="text-navy-600 text-sm line-clamp-2">{project.tagline}</p>
                )}

                {project.short_description && (
                  <p className="text-navy-500 text-sm line-clamp-3">{project.short_description}</p>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  {project.rera_number && (
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      RERA
                    </span>
                  )}
                  {project.status === 'LAUNCHED' && (
                    <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                      Now Open
                    </span>
                  )}
                  {project.status === 'UPCOMING' && (
                    <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                      Pre-Launch
                    </span>
                  )}
                </div>

                <Link href={`/projects/${project.slug}`}>
                  <Button variant="outline-light" className="w-full px-6 py-3 text-sm">
                    Explore Project
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/projects">
            <Button variant="outline-light" className="px-8 py-4 text-base">
              View All Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}