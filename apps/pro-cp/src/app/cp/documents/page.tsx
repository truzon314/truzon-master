'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FileText, Download, Share2, Eye, Sparkles, FolderDown } from 'lucide-react';

export default function CpDocumentsPage() {
  const marketingKits = [
    {
      title: 'The Imperial Highlands - Master Layout & CAD Blueprints',
      category: 'Masterplans',
      size: '24.5 MB • PDF / CAD',
      updated: 'August 2026',
      badge: 'Official',
      desc: 'High-resolution architectural master layout including 18-hole championship golf course and clubhouse specifications.',
    },
    {
      title: 'Luxury 4BHK & 5BHK Villa Floorplans & Elevations',
      category: 'Unit Floorplans',
      size: '18.2 MB • High-Res PDF',
      updated: 'September 2026',
      badge: 'Updated',
      desc: 'Detailed dimensions, carpet area disclosures (RERA compliant), and structural finishes for Golf & Signature Villas.',
    },
    {
      title: 'WhatsApp One-Pager Digital Sales Kit',
      category: 'Social Marketing',
      size: '4.8 MB • Mobile Ready',
      updated: 'Live Active',
      badge: 'Co-Branded',
      desc: 'Compressed, client-ready sales flyers optimized for instant sharing on WhatsApp with your agency contact footer.',
    },
    {
      title: 'Standard ATS Contract Template & Payment Schedules',
      category: 'Legal & RERA',
      size: '6.1 MB • PDF',
      updated: 'August 2026',
      badge: 'Legal',
      desc: 'Official Agreement for Sale (ATS) format, construction linked milestones, and government statutory disclosure documents.',
    },
  ];

  return (
    <DashboardLayout portal="CP">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0f1c3a] tracking-tight">
              Marketing Sales Kit & Collaterals
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Authorized project masterplans, architectural renders, and co-branded digital brochures for Square Yards Global.
            </p>
          </div>

          <Button variant="gold" size="sm" onClick={() => alert('Downloading Complete Marketing Pack')}>
            <FolderDown className="w-3.5 h-3.5 mr-1.5" />
            Download Complete ZIP Kit
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {marketingKits.map((item, idx) => (
            <Card key={idx} padding="md" className="flex flex-col justify-between hover:border-slate-300">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{item.category}</span>
                  <Badge variant={item.badge === 'Official' ? 'navy' : item.badge === 'Updated' ? 'emerald' : 'gold'} size="sm">
                    {item.badge}
                  </Badge>
                </div>

                <h3 className="font-semibold text-base text-[#0f1c3a] mb-2 leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{item.desc}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">{item.size}</span>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => alert(`Sharing ${item.title}`)}>
                    <Share2 className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    Share
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => alert(`Downloading ${item.title}`)}>
                    <Download className="w-3.5 h-3.5 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
