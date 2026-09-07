'use client';

import Link from 'next/link';
import Image from 'next/image';
import { clsx } from 'clsx';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  body?: string;
  featured_image_url?: string;
  author?: { full_name: string };
  published_at?: string;
  reading_time_minutes?: number;
  is_featured: boolean;
  categories?: { id: string; name: string; slug: string }[];
  tags?: { id: string; name: string; slug: string }[];
}

interface LatestBlogPostsProps {
  posts: BlogPost[];
}

export function LatestBlogPosts({ posts }: LatestBlogPostsProps) {
  const featuredPost = posts.find(p => p.is_featured);
  const otherPosts = posts.filter(p => !p.is_featured).slice(0, 2);
  const displayPosts = featuredPost ? [featuredPost, ...otherPosts] : posts.slice(0, 3);

  if (displayPosts.length === 0) return null;

  return (
    <section className="section" aria-labelledby="blog-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12 gap-4">
          <div>
            <span className="badge-primary mb-4 inline-block">Latest Insights</span>
            <h2 id="blog-heading" className="heading-2 mb-2">
              Latest from Our Blog
            </h2>
            <p className="text-navy-600">Expert insights, market trends, and home buying guides.</p>
          </div>
          <Link href="/blog">
            <Button variant="outline-light">
              View All Articles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPosts.map((post, index) => (
            <article
              key={post.id}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 animate-slide-up stagger-{index + 1}"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                {post.featured_image_url ? (
                  <Image
                    src={post.featured_image_url}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-gold-100 flex items-center justify-center">
                    <span className="text-4xl">📝</span>
                  </div>
                )}
                
                {/* Featured Badge */}
                {post.is_featured && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-gold-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                      Featured
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Category & Date */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-navy-500">
                  {post.categories && post.categories.length > 0 && (
                    <>
                      <Tag className="h-3.5 w-3.5 text-navy-400" />
                      <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full font-medium">
                        {post.categories[0].name}
                      </span>
                    </>
                  )}
                  <time dateTime={post.published_at} className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : ''}
                  </time>
                  {post.reading_time_minutes && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.reading_time_minutes} min read
                    </span>
                  )}
                </div>

                {/* Title */}
                <Link href={`/blog/${post.slug}`} className="group">
                  <h3 className="text-xl font-heading font-bold text-navy-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </Link>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-navy-500 text-base leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                )}

                {/* Author & Read More */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-medium text-sm">
                        {post.author?.full_name?.charAt(0).toUpperCase() || 'A'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy-900">{post.author?.full_name || 'Truzon Homes'}</p>
                      <p className="text-xs text-navy-500">Author</p>
                    </div>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <Button variant="outline-light" className="px-4 py-2 text-sm">
                      Read More
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/blog">
            <Button variant="outline-light" className="px-8 py-4 text-base">
              View All Articles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}