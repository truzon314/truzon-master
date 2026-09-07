'use client';

import React, { useState } from 'react';
import { X, Compass, Check, Key, Globe } from 'lucide-react';
import type { MapProviderConfig } from '@truzon/types';

interface TileProviderModalProps {
  isOpen: boolean;
  providers: MapProviderConfig[];
  activeProvider: MapProviderConfig | null;
  onSaveProvider: (data: {
    providerType: string;
    apiKey?: string;
    customTileUrl?: string;
    maxZoom?: number;
    isActive?: boolean;
  }) => Promise<void>;
  onClose: () => void;
}

export function TileProviderModal({
  isOpen,
  providers,
  activeProvider,
  onSaveProvider,
  onClose,
}: TileProviderModalProps) {
  const [selectedType, setSelectedType] = useState<string>(
    activeProvider?.providerType || 'openstreetmap'
  );
  const [apiKey, setApiKey] = useState<string>(activeProvider?.apiKey || '');
  const [customTileUrl, setCustomTileUrl] = useState<string>(
    activeProvider?.customTileUrl || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  );
  const [maxZoom, setMaxZoom] = useState<number>(activeProvider?.maxZoom || 19);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSelectType = (type: string) => {
    setSelectedType(type);
    const existing = providers.find((p) => p.providerType === type);
    if (existing) {
      setApiKey(existing.apiKey || '');
      setCustomTileUrl(existing.customTileUrl || '');
      setMaxZoom(existing.maxZoom || 19);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveProvider({
        providerType: selectedType,
        apiKey: apiKey.trim() || undefined,
        customTileUrl: customTileUrl.trim() || undefined,
        maxZoom,
        isActive: true,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-[#d4af37]" />
            <h3 className="font-bold text-base text-slate-100">
              Basemap Tile Providers
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-slate-400">
            Select and configure the default satellite or vector basemap tile layer rendered on Leaflet maps.
          </p>

          {/* Provider Selection Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                id: 'openstreetmap',
                label: 'OpenStreetMap',
                subText: 'Free Standard XYZ Tiles',
              },
              {
                id: 'mapbox',
                label: 'Mapbox Satellite',
                subText: 'Requires Access Token',
              },
              {
                id: 'google',
                label: 'Google Maps',
                subText: 'Satellite / Hybrid Tiles',
              },
              {
                id: 'custom',
                label: 'Custom XYZ Server',
                subText: 'Custom Tile Server URL',
              },
            ].map((prov) => {
              const isSelected = selectedType === prov.id;
              return (
                <div
                  key={prov.id}
                  onClick={() => handleSelectType(prov.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#d4af37] bg-[#d4af37]/10 ring-1 ring-[#d4af37]/30'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-200">{prov.label}</span>
                    {isSelected && (
                      <span className="bg-[#d4af37] text-slate-950 p-0.5 rounded-full">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">{prov.subText}</span>
                </div>
              );
            })}
          </div>

          {/* Dynamic Provider Input Fields */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            {selectedType === 'mapbox' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-[#d4af37]" /> Mapbox Access Token *
                </label>
                <input
                  type="text"
                  required
                  placeholder="pk.eyJ1Ijo..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            )}

            {selectedType === 'google' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-[#d4af37]" /> Google Maps API Key
                </label>
                <input
                  type="text"
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            )}

            {selectedType === 'custom' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-[#d4af37]" /> Custom Tile Template URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://{s}.tile.example.com/{z}/{x}/{y}.png"
                  value={customTileUrl}
                  onChange={(e) => setCustomTileUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Max Zoom Level ({maxZoom})
              </label>
              <input
                type="number"
                min="10"
                max="22"
                value={maxZoom}
                onChange={(e) => setMaxZoom(parseInt(e.target.value) || 19)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* Action */}
          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#d4af37] hover:bg-[#c29f2d] text-slate-950 font-bold px-5 py-2 rounded-lg text-xs shadow-md active:scale-95 transition-all"
            >
              {isSaving ? 'Saving...' : 'Activate Tile Provider'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
