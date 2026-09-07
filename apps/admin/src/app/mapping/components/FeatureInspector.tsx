'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Layers, Check } from 'lucide-react';
import type { MapLayer } from '@truzon/types';

interface FeatureInspectorProps {
  layer: MapLayer;
  feature: any;
  onSaveFeature: (layerId: string, featureId: string, properties: Record<string, any>) => void;
  onClose: () => void;
}

export function FeatureInspector({
  layer,
  feature,
  onSaveFeature,
  onClose,
}: FeatureInspectorProps) {
  const [properties, setProperties] = useState<Record<string, any>>({});
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  useEffect(() => {
    if (feature?.properties) {
      setProperties({ ...feature.properties });
    } else {
      setProperties({});
    }
  }, [feature]);

  const featureId = feature?.id || feature?.properties?.id || 'selected-feature';
  const geometryType = feature?.geometry?.type || 'Vector Geometry';

  const handlePropertyChange = (key: string, val: string) => {
    setProperties((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleRemoveProperty = (key: string) => {
    setProperties((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleAddField = () => {
    if (!newKey.trim()) return;
    setProperties((prev) => ({
      ...prev,
      [newKey.trim()]: newValue,
    }));
    setNewKey('');
    setNewValue('');
  };

  const handleSave = () => {
    onSaveFeature(layer.id, featureId, properties);
    setIsSavedSuccess(true);
    setTimeout(() => setIsSavedSuccess(false), 2500);
  };

  return (
    <div className="absolute right-4 top-4 bottom-4 w-80 bg-slate-900/95 backdrop-blur border border-slate-800 rounded-2xl shadow-2xl z-[1000] p-5 flex flex-col gap-4 overflow-y-auto text-slate-200">
      {/* Drawer Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#d4af37]" />
          <div>
            <h3 className="font-bold text-sm text-slate-100 line-clamp-1">
              Feature Inspector
            </h3>
            <p className="text-[11px] text-slate-400">
              Layer: <span className="text-slate-300 font-medium">{layer.label}</span>
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Geometry Badge */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between text-xs">
        <span className="text-slate-400 text-[11px]">Type:</span>
        <span className="font-mono font-semibold text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded text-[11px]">
          {geometryType}
        </span>
      </div>

      {/* Attributes Form List */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Attributes & Properties
        </span>

        {Object.keys(properties).length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">
            No properties stored on this feature.
          </p>
        ) : (
          <div className="space-y-2.5">
            {Object.entries(properties).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <label className="font-mono text-slate-300 truncate max-w-[180px]">
                    {key}
                  </label>
                  <button
                    onClick={() => handleRemoveProperty(key)}
                    className="text-slate-500 hover:text-red-400 text-xs"
                    title="Remove Property"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                <input
                  type="text"
                  value={value !== null && value !== undefined ? String(value) : ''}
                  onChange={(e) => handlePropertyChange(key, e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            ))}
          </div>
        )}

        {/* Add New Field Input */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">
            Add Attribute Key
          </span>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Field Key (e.g. plot_status)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#d4af37]"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Value (e.g. Available)"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#d4af37]"
              />
              <button
                type="button"
                onClick={handleAddField}
                disabled={!newKey.trim()}
                className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 shrink-0"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
        <button
          onClick={onClose}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2 rounded-lg text-xs transition-colors"
        >
          Close
        </button>
        <button
          onClick={handleSave}
          className="flex-1 bg-[#d4af37] hover:bg-[#c29f2d] text-slate-950 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
        >
          {isSavedSuccess ? (
            <>
              <Check className="h-4 w-4" /> Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Save Feature
            </>
          )}
        </button>
      </div>
    </div>
  );
}
