'use client';

import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { kml } from '@tmcw/togeojson';
import shp from 'shpjs';

interface GisUploadModalProps {
  isOpen: boolean;
  projectId: string | null;
  onUploadLayer: (data: {
    projectId: string;
    label: string;
    geojson: any;
    strokeColor?: string;
    fillColor?: string;
    fillOpacity?: number;
    strokeWeight?: number;
  }) => Promise<void>;
  onClose: () => void;
}

export function GisUploadModal({
  isOpen,
  projectId,
  onUploadLayer,
  onClose,
}: GisUploadModalProps) {
  const [layerName, setLayerName] = useState('');
  const [strokeColor, setStrokeColor] = useState('#3388ff');
  const [fillColor, setFillColor] = useState('#3388ff');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedGeoJson, setParsedGeoJson] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = async (file: File) => {
    setSelectedFile(file);
    setErrorMessage('');
    setParsedGeoJson(null);
    setIsParsing(true);

    if (!layerName) {
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      setLayerName(baseName.replace(/_/g, ' '));
    }

    try {
      const ext = file.name.split('.').pop()?.toLowerCase();

      if (ext === 'geojson' || ext === 'json') {
        const text = await file.text();
        const json = JSON.parse(text);
        if (json.type !== 'FeatureCollection') {
          if (json.type === 'Feature') {
            setParsedGeoJson({ type: 'FeatureCollection', features: [json] });
          } else {
            throw new Error('JSON file must be a valid GeoJSON FeatureCollection');
          }
        } else {
          setParsedGeoJson(json);
        }
      } else if (ext === 'kml') {
        const text = await file.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');
        const converted = kml(xmlDoc);
        setParsedGeoJson(converted);
      } else if (ext === 'zip') {
        const buffer = await file.arrayBuffer();
        const parsed = await shp(buffer);
        let geojson: any;
        if (Array.isArray(parsed)) {
          geojson = {
            type: 'FeatureCollection',
            features: parsed.flatMap((collection: any) => collection.features || []),
          };
        } else {
          geojson = parsed;
        }
        setParsedGeoJson(geojson);
      } else {
        throw new Error('Unsupported file extension. Supported formats: .geojson, .kml, .zip (ESRI Shapefile)');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to parse spatial GIS file');
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !parsedGeoJson || !layerName.trim()) return;

    setIsSubmitting(true);
    try {
      await onUploadLayer({
        projectId,
        label: layerName.trim(),
        geojson: parsedGeoJson,
        strokeColor,
        fillColor,
        fillOpacity: 0.4,
        strokeWeight: 2,
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save GIS layer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const featureCount = parsedGeoJson?.features?.length || 0;

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-[#d4af37]" />
            <h3 className="font-bold text-base text-slate-100">
              Upload GIS Spatial Layer
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* File Dropzone */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Spatial File (.geojson, .kml, .zip Shapefile)
            </label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-700 bg-slate-950/50 hover:bg-slate-950 hover:border-[#d4af37]/60 rounded-xl p-6 text-center cursor-pointer transition-all relative"
            >
              <input
                type="file"
                accept=".geojson,.json,.kml,.zip"
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="flex flex-col items-center justify-center gap-2">
                {isParsing ? (
                  <>
                    <Loader2 className="h-8 w-8 text-[#d4af37] animate-spin" />
                    <span className="text-xs text-slate-400 font-medium">
                      Parsing spatial geometry & DBF attributes...
                    </span>
                  </>
                ) : selectedFile && parsedGeoJson ? (
                  <>
                    <CheckCircle className="h-8 w-8 text-emerald-400" />
                    <div className="text-xs text-slate-200 font-semibold">
                      {selectedFile.name}
                    </div>
                    <span className="text-[11px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded font-mono">
                      Parsed {featureCount} Vector Features
                    </span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-8 w-8 text-slate-500" />
                    <div className="text-xs text-slate-300 font-medium">
                      Drag & Drop GIS File or <span className="text-[#d4af37] underline">Browse</span>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Supports GeoJSON (.geojson), KML (.kml), or ESRI Shapefile (.zip)
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Layer Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Layer Label *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Master Plot Boundaries"
              value={layerName}
              onChange={(e) => setLayerName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Default Colors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Default Fill Color</label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-1.5">
                <input
                  type="color"
                  value={fillColor}
                  onChange={(e) => setFillColor(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="font-mono text-xs uppercase text-slate-300">{fillColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Default Stroke Color</label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-1.5">
                <input
                  type="color"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="font-mono text-xs uppercase text-slate-300">{strokeColor}</span>
              </div>
            </div>
          </div>

          {/* Submit Action */}
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
              disabled={!parsedGeoJson || !layerName.trim() || isSubmitting}
              className="bg-[#d4af37] hover:bg-[#c29f2d] disabled:opacity-40 text-slate-950 font-bold px-5 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                'Save & Render Layer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
