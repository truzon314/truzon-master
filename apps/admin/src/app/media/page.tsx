'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useGetMediaQuery, useDeleteMediaMutation } from '@/lib/api-hooks';
import type { Media } from '@/types';
import {
  Images,
  Upload,
  Search,
  Folder,
  Copy,
  Trash2,
  ExternalLink,
  Check,
  FileText,
  Video,
} from 'lucide-react';
import Image from 'next/image';
import { clsx } from 'clsx';

const MOCK_MEDIA: any[] = [
  {
    id: 'm-1',
    fileName: 'hero-villa-street.jpg',
    url: '/images/hero-villa-street.jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 9351128,
    type: 'IMAGE',
    folder: 'Villas / Aerials',
    dimensions: '3840x2160',
    createdAt: '2026-08-10',
  },
  {
    id: 'm-2',
    fileName: 'hero-township-aerial.jpg',
    url: '/images/hero-township-aerial.jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 1007971,
    type: 'IMAGE',
    folder: 'Townships',
    dimensions: '1920x1080',
    createdAt: '2026-08-12',
  },
  {
    id: 'm-3',
    fileName: 'hero-villa-twilight.jpg',
    url: '/images/hero-villa-twilight.jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 859012,
    type: 'IMAGE',
    folder: 'Villas / Interiors',
    dimensions: '1920x1080',
    createdAt: '2026-08-15',
  },
  {
    id: 'm-4',
    fileName: 'Logo.svg',
    url: '/images/Logo.svg',
    mimeType: 'image/svg+xml',
    sizeBytes: 119797,
    type: 'IMAGE',
    folder: 'Brand Assets',
    dimensions: '6745x4027',
    createdAt: '2026-07-01',
  },
  {
    id: 'm-5',
    fileName: 'truzon-azure-brochure.pdf',
    url: '/documents/truzon-azure-brochure.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 14200000,
    type: 'DOCUMENT',
    folder: 'Brochures',
    dimensions: '24 pages',
    createdAt: '2026-08-20',
  },
];

export default function MediaLibraryPage() {
  const [search, setSearch] = useState('');
  const [folderFilter, setFolderFilter] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: mediaData } = useGetMediaQuery();
  const [deleteMedia] = useDeleteMediaMutation();

  const mediaList = useMemo(() => {
    const list = mediaData?.data && mediaData.data.length > 0 ? mediaData.data : MOCK_MEDIA;
    return list.filter((m: any) => {
      const name = m.fileName || '';
      const folder = m.folder || '';
      const matchesSearch = !search || name.toLowerCase().includes(search.toLowerCase());
      const matchesFolder = !folderFilter || folder.includes(folderFilter);
      return matchesSearch && matchesFolder;
    });
  }, [mediaData, search, folderFilter]);

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media asset?')) return;
    try {
      await deleteMedia(id).unwrap();
    } catch {
      const idx = MOCK_MEDIA.findIndex((m) => m.id === id);
      if (idx !== -1) MOCK_MEDIA.splice(idx, 1);
      setSearch((prev) => prev);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Media Asset Library</h1>
            <p className="text-gray-500 mt-1">
              Central asset management for Public Web heroes, villa galleries, floorplans, and brochures.
            </p>
          </div>
          <Button onClick={() => alert('Media upload dialog: select JPG, PNG, WebP, PDF or MP4 files to upload to Cloudflare R2 / GCS.')} className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Assets
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search media files..."
              className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={folderFilter}
              onChange={(e) => setFolderFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white"
            >
              <option value="">All Folders</option>
              <option value="Villas">Villas</option>
              <option value="Townships">Townships</option>
              <option value="Brand Assets">Brand Assets</option>
              <option value="Brochures">Brochures</option>
            </select>
          </div>
        </div>

        {/* Asset Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {mediaList.map((item: any) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm group hover:shadow-md transition-shadow flex flex-col">
              <div className="h-44 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                {item.mimeType?.startsWith('image/') ? (
                  <img
                    src={item.url}
                    alt={item.fileName}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : item.mimeType === 'application/pdf' ? (
                  <div className="flex flex-col items-center gap-2 text-red-600">
                    <FileText className="h-12 w-12" />
                    <span className="text-xs font-bold uppercase tracking-wider">PDF Brochure</span>
                  </div>
                ) : (
                  <Video className="h-12 w-12 text-blue-600" />
                )}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium backdrop-blur-sm">
                  {item.folder || 'General'}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <p className="font-semibold text-xs text-gray-900 truncate" title={item.fileName}>
                    {item.fileName}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {(item.sizeBytes / 1024 / 1024).toFixed(2)} MB {item.dimensions ? `• ${item.dimensions}` : ''}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleCopyUrl(item.id, item.url)}
                    className="text-xs text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1"
                  >
                    {copiedId === item.id ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedId === item.id ? 'Copied' : 'Copy URL'}
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-xs text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                    title="Delete Asset"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
