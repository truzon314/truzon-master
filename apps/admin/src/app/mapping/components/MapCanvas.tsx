'use client';

import React, { useEffect, useRef } from 'react';
import type { MapProject, MapLayer, MapProviderConfig } from '@truzon/types';

interface MapCanvasProps {
  activeProject: MapProject | null;
  layers: MapLayer[];
  activeProvider: MapProviderConfig | null;
  onSelectFeature: (layer: MapLayer, feature: any) => void;
}

export function MapCanvas({
  activeProject,
  layers,
  activeProvider,
  onSelectFeature,
}: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const leafletLayersRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Import Leaflet dynamically client-side
    import('leaflet').then((L) => {
      // Fix default marker icon assets
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Guard against double init stamp in React Strict Mode
      delete (containerRef.current as unknown as { _leaflet_id?: unknown })._leaflet_id;

      const initialLat = activeProject?.centerLat ?? 13.1986;
      const initialLng = activeProject?.centerLng ?? 77.7066;
      const initialZoom = activeProject?.zoomLevel ?? 12;

      const map = L.map(containerRef.current!, {
        zoomControl: false,
        attributionControl: false,
      }).setView([initialLat, initialLng], initialZoom);

      L.control.zoom({ position: 'topleft' }).addTo(map);
      L.control.scale({ position: 'bottomleft', imperial: false }).addTo(map);

      mapRef.current = map;
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Base Tile Layer when activeProvider changes
  useEffect(() => {
    if (!mapRef.current) return;

    import('leaflet').then((L) => {
      const map = mapRef.current;
      if (!map) return;

      // Remove existing tile layers
      map.eachLayer((layer: any) => {
        if (layer instanceof L.TileLayer) {
          map.removeLayer(layer);
        }
      });

      let tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      let maxZoom = 19;

      if (activeProvider?.isActive) {
        if (activeProvider.providerType === 'custom' && activeProvider.customTileUrl) {
          tileUrl = activeProvider.customTileUrl;
        } else if (activeProvider.providerType === 'mapbox' && activeProvider.apiKey) {
          tileUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}?access_token=${activeProvider.apiKey}`;
        } else if (activeProvider.providerType === 'google' && activeProvider.apiKey) {
          tileUrl = `https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}`;
        }
        if (activeProvider.maxZoom) maxZoom = activeProvider.maxZoom;
      }

      L.tileLayer(tileUrl, { maxZoom, subdomains: ['a', 'b', 'c'] }).addTo(map);
    });
  }, [activeProvider]);

  // Update View when activeProject changes
  useEffect(() => {
    if (!mapRef.current || !activeProject) return;
    if (activeProject.centerLat && activeProject.centerLng) {
      mapRef.current.setView(
        [activeProject.centerLat, activeProject.centerLng],
        activeProject.zoomLevel || 12
      );
    }
  }, [activeProject]);

  // Render Vector GeoJSON Layers and Text Labels
  useEffect(() => {
    if (!mapRef.current) return;

    import('leaflet').then((L) => {
      const map = mapRef.current;
      if (!map) return;

      // Clear old vector layers
      leafletLayersRef.current.forEach((layerGroup) => {
        map.removeLayer(layerGroup);
      });
      leafletLayersRef.current.clear();

      const boundsGroup = L.featureGroup();

      // Render layers according to their order (position/z-index)
      const sortedLayers = [...layers].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

      sortedLayers.forEach((layer) => {
        if (!layer.defaultVisible || !layer.geojson) return;

        const layerGroup = L.featureGroup();

        // Helper for dash array
        const dashArray =
          layer.strokeStyle === 'dashed'
            ? '10, 8'
            : layer.strokeStyle === 'dotted'
            ? '3, 6'
            : undefined;

        // Function to evaluate color rules for a feature
        const getFeatureStyle = (feature: any) => {
          let fillColor = layer.fillColor || '#3388ff';
          let strokeColor = layer.strokeColor || '#3388ff';
          let fillOpacity = layer.fillOpacity ?? 0.4;
          let isHidden = false;

          if (layer.colorRules && Array.isArray(layer.colorRules) && feature?.properties) {
            for (const rule of layer.colorRules) {
              const actual = feature.properties[rule.property];
              if (
                actual !== undefined &&
                actual !== null &&
                String(actual).trim().toLowerCase() === String(rule.value).trim().toLowerCase()
              ) {
                if (rule.action === 'hide') {
                  isHidden = true;
                } else if (rule.action === 'color' && rule.color) {
                  fillColor = rule.color;
                  strokeColor = rule.color;
                }
              }
            }
          }

          if (isHidden) {
            return { opacity: 0, fillOpacity: 0, stroke: false };
          }

          return {
            color: strokeColor,
            fillColor,
            fillOpacity,
            weight: layer.strokeWeight ?? 2,
            dashArray,
          };
        };

        const geoJsonLayer = L.geoJSON(layer.geojson as any, {
          style: getFeatureStyle,
          onEachFeature: (feature, leafletFeatureLayer) => {
            // Bind click to open Feature Inspector
            leafletFeatureLayer.on('click', (e) => {
              L.DomEvent.stopPropagation(e);
              onSelectFeature(layer, feature);
            });

            // Bind tooltip/popup if enabled
            if (layer.popupEnabled && feature.properties) {
              const propsHtml = Object.entries(feature.properties)
                .slice(0, 5)
                .map(([k, v]) => `<div className="text-xs"><strong>${k}:</strong> ${String(v)}</div>`)
                .join('');

              leafletFeatureLayer.bindTooltip(
                `<div class="p-1 font-sans text-xs">
                  <div class="font-bold border-b border-slate-300 pb-1 mb-1">${layer.label}</div>
                  ${propsHtml || '<span class="text-slate-400">No properties</span>'}
                </div>`,
                { sticky: true }
              );
            }

            // Render centroid text labels if configured
            if (layer.labelProperty && feature.properties?.[layer.labelProperty]) {
              const labelText = String(feature.properties[layer.labelProperty]);
              const centroid = getCentroid(feature.geometry);

              if (centroid) {
                const alignOffset = getAlignmentOffset(layer.labelAlignment || 'center');
                const labelIcon = L.divIcon({
                  className: 'gis-map-label-marker',
                  html: `<span style="
                    display: inline-block;
                    transform: translate(${alignOffset.x}, ${alignOffset.y});
                    font-size: 11px;
                    font-weight: 700;
                    color: #0f172a;
                    background: rgba(255,255,255,0.85);
                    padding: 1px 4px;
                    border-radius: 4px;
                    border: 1px solid rgba(0,0,0,0.15);
                    white-space: nowrap;
                    pointer-events: none;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                  ">${escapeHtml(labelText)}</span>`,
                  iconSize: [0, 0],
                  iconAnchor: [0, 0],
                });

                L.marker([centroid.lat, centroid.lng], {
                  icon: labelIcon,
                  interactive: false,
                }).addTo(layerGroup);
              }
            }
          },
        });

        geoJsonLayer.addTo(layerGroup);
        layerGroup.addTo(map);
        boundsGroup.addLayer(layerGroup);
        leafletLayersRef.current.set(layer.id, layerGroup);
      });

      // Automatically fit bounds if features exist and activeProject changed
      if (boundsGroup.getLayers().length > 0) {
        try {
          const bounds = boundsGroup.getBounds();
          if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [40, 40], maxZoom: 18 });
          }
        } catch {
          // ignore invalid bounds
        }
      }
    });
  }, [layers]);

  return (
    <div className="flex-1 relative h-[calc(100vh-64px)] bg-slate-950">
      <div ref={containerRef} className="w-full h-full z-0" />

      {/* Floating Basemap Indicator at Top-Right */}
      <div className="absolute top-4 right-4 z-[500] bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 shadow-lg flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>
          Tile Provider:{' '}
          <strong className="text-white capitalize">
            {activeProvider?.providerType || 'OpenStreetMap'}
          </strong>
        </span>
      </div>
    </div>
  );
}

// Utility: Compute geometry centroid
function getCentroid(geometry: any): { lat: number; lng: number } | null {
  if (!geometry) return null;
  if (geometry.type === 'Point') {
    return { lat: geometry.coordinates[1], lng: geometry.coordinates[0] };
  }
  let ring: number[][] | undefined;
  if (geometry.type === 'Polygon') ring = geometry.coordinates?.[0];
  else if (geometry.type === 'MultiPolygon') ring = geometry.coordinates?.[0]?.[0];
  else if (geometry.type === 'LineString') ring = geometry.coordinates;

  if (!ring || ring.length === 0) return null;
  let sumLat = 0;
  let sumLng = 0;
  for (const [lng, lat] of ring) {
    sumLat += lat;
    sumLng += lng;
  }
  return { lat: sumLat / ring.length, lng: sumLng / ring.length };
}

// Utility: Label alignment offsets
function getAlignmentOffset(alignment: string): { x: string; y: string } {
  switch (alignment) {
    case 'top':
      return { x: '-50%', y: '-140%' };
    case 'bottom':
      return { x: '-50%', y: '40%' };
    case 'left':
      return { x: '-110%', y: '-50%' };
    case 'right':
      return { x: '10%', y: '-50%' };
    case 'center':
    default:
      return { x: '-50%', y: '-50%' };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
