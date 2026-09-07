'use client';

import { Metadata } from 'next';
import { usePathname, useSearchParams } from 'next/navigation';

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  image?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  canonicalUrl?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
}

export function SEOHead({
  title,
  description,
  path,
  type = 'website',
  image,
  noIndex = false,
  noFollow = false,
  canonicalUrl,
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
}: SEOHeadProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const fullUrl = canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${path}`;
  const ogImage = image || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/og-default.jpg`;

  // This is a client component that renders meta tags via next/head equivalent
  // For server-side rendering, we use the metadata export in page.tsx
  // This component is for client-side navigation updates

  if (typeof window === 'undefined') return null;

  // Update meta tags dynamically
  const updateMetaTag = (name: string, content: string, property = false) => {
    const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let meta = document.querySelector(selector) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      if (property) meta.setAttribute('property', name);
      else meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  // Update on mount
  if (typeof document !== 'undefined') {
    document.title = title;
    updateMetaTag('description', description);
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:url', canonicalUrl || window.location.href, true);
    updateMetaTag('og:image', image || '/og-default.jpg', true);
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', image || '/og-default.jpg', true);
    updateMetaTag('robots', (noIndex ? 'noindex' : 'index') + ',' + (noFollow ? 'nofollow' : 'follow'));
    
    // Update canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl || window.location.href;
  }

  return null; // This component doesn't render anything visible
}

export function SEOHeadServer({
  title,
  description,
  path,
  type = 'website',
  image,
  noIndex = false,
  noFollow = false,
  canonicalUrl,
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
}: SEOHeadProps): Metadata {
  const fullUrl = canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${path}`;
  const ogImage = image || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/og-default.jpg`;

  return {
    title,
    description,
    alternates: {
      canonical: fullUrl,
    },
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      type: type as 'website' | 'article',
      url: fullUrl,
      siteName: 'Truzon Homes',
      locale: 'en_IN',
      images: [
        {
          url: image || '/og-default.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors,
        section,
        tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image || '/og-default.jpg'],
    },
  };
}