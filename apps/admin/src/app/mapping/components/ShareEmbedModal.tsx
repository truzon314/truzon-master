'use client';

import React, { useState } from 'react';
import {
  X,
  Share2,
  Lock,
  Code,
  Copy,
  Check,
  Calendar,
  Eye,
  ShieldCheck,
  Globe,
  Loader2,
} from 'lucide-react';
import type { MapProject, MapShareLink } from '@truzon/types';

interface ShareEmbedModalProps {
  isOpen: boolean;
  activeProject: MapProject | null;
  shareLinks: MapShareLink[];
  onUpsertShareLink: (data: {
    projectId: string;
    password?: string;
    expiresAt?: string;
    maxViews?: number;
    isActive?: boolean;
  }) => Promise<void>;
  onClose: () => void;
}

export function ShareEmbedModal({
  isOpen,
  activeProject,
  shareLinks,
  onUpsertShareLink,
  onClose,
}: ShareEmbedModalProps) {
  const [activeTab, setActiveTab] = useState<'public' | 'embed' | 'security'>('public');
  const [password, setPassword] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [maxViews, setMaxViews] = useState<number | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !activeProject) return null;

  const existingShare = shareLinks.length > 0 ? shareLinks[0] : activeProject.shareLink;
  const token = existingShare?.token || `map_sec_${activeProject.id.slice(0, 8)}`;

  const originUrl =
    typeof window !== 'undefined'
      ? window.location.origin.replace(':3001', ':3000')
      : 'https://www.truzonhomes.com';

  const publicLink = `${originUrl}/shared-map/${token}`;
  const embedSnippet = `<iframe src="${originUrl}/embed/${token}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUpsertShareLink({
        projectId: activeProject.id,
        password: password.trim() || undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        maxViews: maxViews || undefined,
        isActive: true,
      });
      setPassword('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-[#d4af37]" />
            <h3 className="font-bold text-base text-slate-100">
              Share & Embed GIS Map
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-5 text-xs font-medium">
          {[
            { id: 'public', label: 'Public Link', icon: Globe },
            { id: 'embed', label: 'HTML Embed Code', icon: Code },
            { id: 'security', label: 'Security & Access', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-colors ${
                  isActive
                    ? 'border-[#d4af37] text-[#d4af37] font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-5 space-y-4">
          {/* Tab 1: Public Link */}
          {activeTab === 'public' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Share this interactive GIS map with clients or external stakeholders via a public URL.
              </p>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Public Shared Map URL
                </label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-1.5">
                  <input
                    type="text"
                    readOnly
                    value={publicLink}
                    className="flex-1 bg-transparent px-2 py-1 text-xs text-slate-200 font-mono focus:outline-none"
                  />
                  <button
                    onClick={() => handleCopy(publicLink, 'link')}
                    className="bg-[#d4af37] hover:bg-[#c29f2d] text-slate-950 font-bold px-3 py-1.5 rounded-md text-xs flex items-center gap-1 shrink-0"
                  >
                    {copiedField === 'link' ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy Link
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* View Count & Security Stats */}
              {existingShare && (
                <div className="grid grid-cols-2 gap-3 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                      Total Views
                    </span>
                    <span className="font-bold text-slate-200 text-sm flex items-center gap-1">
                      <Eye className="h-4 w-4 text-[#d4af37]" /> {existingShare.viewCount || 0}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                      Security Status
                    </span>
                    <span className="font-bold text-emerald-400 text-xs flex items-center gap-1 pt-0.5">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {existingShare.passwordHash ? 'Password Protected' : 'Public Access'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: HTML Embed Code */}
          {activeTab === 'embed' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Copy and paste this HTML <code>&lt;iframe&gt;</code> code into any website or CMS page to embed this GIS map.
              </p>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  HTML Iframe Code
                </label>
                <div className="relative bg-slate-950 border border-slate-800 rounded-lg p-3">
                  <textarea
                    readOnly
                    rows={3}
                    value={embedSnippet}
                    className="w-full bg-transparent text-xs text-slate-300 font-mono resize-none focus:outline-none"
                  />
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => handleCopy(embedSnippet, 'iframe')}
                      className="bg-[#d4af37] hover:bg-[#c29f2d] text-slate-950 font-bold px-3 py-1.5 rounded-md text-xs flex items-center gap-1"
                    >
                      {copiedField === 'iframe' ? (
                        <>
                          <Check className="h-3.5 w-3.5" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" /> Copy Code
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Security & Access Controls */}
          {activeTab === 'security' && (
            <form onSubmit={handleSaveSecurity} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-[#d4af37]" /> Password Protection
                </label>
                <input
                  type="password"
                  placeholder={existingShare?.passwordHash ? '•••••••• (Leave blank to keep existing)' : 'Set access password...'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#d4af37]" /> Expiration Date
                  </label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5 text-[#d4af37]" /> Max Allowed Views
                  </label>
                  <input
                    type="number"
                    placeholder="Unlimited"
                    value={maxViews || ''}
                    onChange={(e) => setMaxViews(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#d4af37] hover:bg-[#c29f2d] text-slate-950 font-bold px-5 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    'Update Security Settings'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
