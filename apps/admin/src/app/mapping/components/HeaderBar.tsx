'use client';

import React from 'react';
import { MapPin, Plus, Layers, Share2, ChevronDown, Compass } from 'lucide-react';
import type { MapProject } from '@truzon/types';

interface HeaderBarProps {
  activeProject: MapProject | null;
  onOpenProjectSwitcher: () => void;
  onOpenUploadModal: () => void;
  onOpenTileProvidersModal: () => void;
  onOpenShareModal: () => void;
}

export function HeaderBar({
  activeProject,
  onOpenProjectSwitcher,
  onOpenUploadModal,
  onOpenTileProvidersModal,
  onOpenShareModal,
}: HeaderBarProps) {
  return (
    <header className="h-16 bg-[#080f20] text-white flex items-center justify-between px-6 border-b border-slate-800 shadow-md">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <span>Dashboard</span>
        <span className="text-slate-600">/</span>
        <span className="font-semibold text-slate-200">GIS MAP Layers</span>
      </div>

      {/* Center: Active Project Selector Pill */}
      <button
        onClick={onOpenProjectSwitcher}
        className="bg-slate-900 hover:bg-slate-800 text-[#d4af37] border border-[#d4af37]/30 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all shadow-sm group"
      >
        <MapPin className="h-4 w-4 text-[#d4af37] group-hover:scale-110 transition-transform" />
        <span className="max-w-[280px] truncate font-semibold">
          {activeProject ? activeProject.name : 'Select Map Project'}
        </span>
        <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors ml-1" />
      </button>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenUploadModal}
          className="bg-[#d4af37] hover:bg-[#c29f2d] text-[#080f20] font-semibold px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-all shadow-sm active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Upload GIS Layer</span>
        </button>

        <button
          onClick={onOpenTileProvidersModal}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
          title="Configure Map Tile Providers"
        >
          <Compass className="h-4 w-4 text-slate-400" />
          <span className="hidden sm:inline">Tile Providers</span>
        </button>

        <button
          onClick={onOpenShareModal}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
          title="Share Map or Get Embed Code"
        >
          <Share2 className="h-4 w-4 text-slate-400" />
          <span className="hidden sm:inline">Share / Embed</span>
        </button>
      </div>
    </header>
  );
}
