'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useGetGalleryQuery } from '@/lib/api-hooks';
import type { GalleryItem } from '@/types';
import {
  Images,
  Plus,
  Search,
  Star,
  Trash2,
  Tag,
} from 'lucide-react';
import { clsx } from 'clsx';

const MOCK_GALLERY = [
  {
    id: 'gal-1',
    title: 'Boulevard Aerial Perspective',
    category: 'Architecture',
    imageUrl: '/images/hero-township-aerial.jpg',
    featured: true,
    views: 1240,
  },
  {
    id: 'gal-2',
    title: 'Twilight Grand Villa Facade',
    category: 'Exteriors',
    imageUrl: '/images/hero-villa-twilight.jpg',
    featured: true,
    views: 980,
  },
  {
    id: 'gal-3',
    title: 'Signature Villa Tree-Lined Streetscape',
    category: 'Villas',
    imageUrl: '/images/hero-villa-street.jpg',
    featured: false,
    views: 1560,
  },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { data: galleryData } = useGetGalleryQuery();

  const items = useMemo(() => {
    return selectedCategory === 'All'
      ? MOCK_GALLERY
      : MOCK_GALLERY.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Visual Gallery Showcase</h1>
            <p className="text-gray-500 mt-1">
              Curate architectural photos, aerial renderings, and clubhouse views displayed on the Public Web gallery.
            </p>
          </div>
          <Button onClick={() => alert('Add Photo Modal')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Gallery Photos
          </Button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2">
          {['All', 'Architecture', 'Exteriors', 'Villas'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={clsx(
                'px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                selectedCategory === cat
                  ? 'bg-[#0b132b] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm group">
              <div className="h-56 bg-gray-100 relative overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.featured && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center gap-1 shadow">
                    <Star className="h-3 w-3 fill-current" /> Featured
                  </span>
                )}
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xs text-gray-900">{item.title}</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">{item.category} • {item.views} views</p>
                </div>
                <button
                  onClick={() => alert(`Remove ${item.title}`)}
                  className="p-1.5 rounded hover:bg-red-50 text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
