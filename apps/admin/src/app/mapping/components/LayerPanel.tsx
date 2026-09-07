'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Eye,
  EyeOff,
  Trash2,
  ChevronDown,
  ChevronRight,
  Plus,
  Palette,
  Tag,
  Search,
  Sliders,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import type { MapLayer, ColorRule } from '@truzon/types';

interface LayerPanelProps {
  layers: MapLayer[];
  onUpdateLayer: (id: string, updates: Partial<MapLayer>) => void;
  onDeleteLayer: (id: string) => void;
  onReorderLayers: (reorderedLayers: MapLayer[]) => void;
}

// Individual Sortable Layer Card Component
function SortableLayerCard({
  layer,
  onUpdateLayer,
  onDeleteLayer,
}: {
  layer: MapLayer;
  onUpdateLayer: (id: string, updates: Partial<MapLayer>) => void;
  onDeleteLayer: (id: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newRuleProp, setNewRuleProp] = useState('');
  const [newRuleVal, setNewRuleVal] = useState('');
  const [newRuleColor, setNewRuleColor] = useState('#22c55e');
  const [newRuleAction, setNewRuleAction] = useState<'color' | 'hide'>('color');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: layer.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Available GeoJSON feature property keys for label dropdown
  const sampleProperties: string[] = React.useMemo(() => {
    if (!layer.geojson || !Array.isArray(layer.geojson.features)) return [];
    const keysSet = new Set<string>();
    layer.geojson.features.slice(0, 10).forEach((feat: any) => {
      if (feat.properties) {
        Object.keys(feat.properties).forEach((k) => keysSet.add(k));
      }
    });
    return Array.from(keysSet);
  }, [layer.geojson]);

  const handleAddRule = () => {
    if (!newRuleProp || !newRuleVal) return;
    const rule: ColorRule = {
      id: `rule-${Date.now()}`,
      property: newRuleProp,
      value: newRuleVal,
      action: newRuleAction,
      color: newRuleAction === 'color' ? newRuleColor : undefined,
    };
    const currentRules = (layer.colorRules as ColorRule[]) || [];
    onUpdateLayer(layer.id, { colorRules: [...currentRules, rule] });
    setNewRuleProp('');
    setNewRuleVal('');
  };

  const handleRemoveRule = (ruleId: string) => {
    const currentRules = (layer.colorRules as ColorRule[]) || [];
    onUpdateLayer(layer.id, {
      colorRules: currentRules.filter((r: ColorRule) => r.id !== ruleId),
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-sm transition-all"
    >
      {/* Header */}
      <div className="p-3.5 flex items-center justify-between gap-2 bg-slate-900/60 border-b border-slate-800/80">
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="text-slate-500 hover:text-slate-300 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-slate-800"
            title="Drag to reorder layer z-index"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          {/* Expand/Collapse Accordion */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-[#d4af37]" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          {/* Visibility Checkbox */}
          <button
            onClick={() =>
              onUpdateLayer(layer.id, { defaultVisible: !layer.defaultVisible })
            }
            className="p-1 rounded text-slate-400 hover:text-white"
            title={layer.defaultVisible ? 'Hide Layer' : 'Show Layer'}
          >
            {layer.defaultVisible ? (
              <Eye className="h-4 w-4 text-emerald-400" />
            ) : (
              <EyeOff className="h-4 w-4 text-slate-600" />
            )}
          </button>

          {/* Title */}
          <span
            onClick={() => setIsExpanded(!isExpanded)}
            className="font-medium text-xs text-slate-200 truncate cursor-pointer hover:text-white flex-1"
          >
            {layer.label}
          </span>
        </div>

        {/* Delete */}
        <button
          onClick={() => onDeleteLayer(layer.id)}
          className="text-slate-500 hover:text-red-400 p-1.5 rounded hover:bg-slate-800 transition-colors"
          title="Delete Layer"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Accordion Settings Body */}
      {isExpanded && (
        <div className="p-4 space-y-4 text-xs bg-slate-950 text-slate-300">
          {/* Section: Basic Styling */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200 text-[11px] uppercase tracking-wider">
              <Palette className="h-3.5 w-3.5 text-[#d4af37]" />
              <span>Layer Styling</span>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Fill Color
                </label>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded p-1.5">
                  <input
                    type="color"
                    value={layer.fillColor || '#3388ff'}
                    onChange={(e) =>
                      onUpdateLayer(layer.id, { fillColor: e.target.value })
                    }
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="font-mono text-[11px] text-slate-300 uppercase">
                    {layer.fillColor || '#3388ff'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Stroke Color
                </label>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded p-1.5">
                  <input
                    type="color"
                    value={layer.strokeColor || '#3388ff'}
                    onChange={(e) =>
                      onUpdateLayer(layer.id, { strokeColor: e.target.value })
                    }
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="font-mono text-[11px] text-slate-300 uppercase">
                    {layer.strokeColor || '#3388ff'}
                  </span>
                </div>
              </div>
            </div>

            {/* Opacity Slider */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Fill Opacity</span>
                <span className="font-medium text-slate-200">
                  {Math.round((layer.fillOpacity ?? 0.4) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={layer.fillOpacity ?? 0.4}
                onChange={(e) =>
                  onUpdateLayer(layer.id, {
                    fillOpacity: parseFloat(e.target.value),
                  })
                }
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
              />
            </div>

            {/* Stroke Weight & Line Style */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Stroke Weight
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={layer.strokeWeight ?? 2}
                  onChange={(e) =>
                    onUpdateLayer(layer.id, {
                      strokeWeight: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Line Style
                </label>
                <select
                  value={layer.strokeStyle || 'solid'}
                  onChange={(e) =>
                    onUpdateLayer(layer.id, {
                      strokeStyle: e.target.value as any,
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-slate-200 focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-slate-800" />

          {/* Section: Text Labels & Alignment Engine */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200 text-[11px] uppercase tracking-wider">
              <Tag className="h-3.5 w-3.5 text-[#d4af37]" />
              <span>Text Labels & Alignment</span>
            </div>

            {/* Label Property Dropdown */}
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Label Attribute Key
              </label>
              <select
                value={layer.labelProperty || ''}
                onChange={(e) =>
                  onUpdateLayer(layer.id, {
                    labelProperty: e.target.value || undefined,
                  })
                }
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-[#d4af37]"
              >
                <option value="">-- Disabled --</option>
                {sampleProperties.map((propKey) => (
                  <option key={propKey} value={propKey}>
                    {propKey}
                  </option>
                ))}
              </select>
            </div>

            {/* Alignment Controls (Top, Center, Bottom, Left, Right) */}
            {layer.labelProperty && (
              <div>
                <label className="block text-[11px] text-slate-400 mb-1.5">
                  Label Alignment
                </label>
                <div className="flex items-center justify-between gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg">
                  {[
                    { id: 'top', icon: ArrowUp, label: 'Top' },
                    { id: 'left', icon: AlignLeft, label: 'Left' },
                    { id: 'center', icon: AlignCenter, label: 'Center' },
                    { id: 'right', icon: AlignRight, label: 'Right' },
                    { id: 'bottom', icon: ArrowDown, label: 'Bottom' },
                  ].map((align) => {
                    const Icon = align.icon;
                    const isActive =
                      (layer.labelAlignment || 'center') === align.id;
                    return (
                      <button
                        key={align.id}
                        type="button"
                        onClick={() =>
                          onUpdateLayer(layer.id, {
                            labelAlignment: align.id as any,
                          })
                        }
                        className={`p-1.5 rounded flex-1 flex justify-center items-center transition-colors ${
                          isActive
                            ? 'bg-[#d4af37] text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                        title={`Align ${align.label}`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <hr className="border-slate-800" />

          {/* Section: Conditional Color Rules */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-[#d4af37]" />
                <span>Conditional Color Rules</span>
              </span>
            </div>

            {/* List Active Rules */}
            {layer.colorRules && (layer.colorRules as ColorRule[]).length > 0 ? (
              <div className="space-y-2">
                {(layer.colorRules as ColorRule[]).map((rule: ColorRule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between bg-slate-900 border border-slate-800 p-2 rounded text-[11px]"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {rule.action === 'color' ? (
                        <span
                          className="w-3 h-3 rounded-full border border-slate-700 shrink-0"
                          style={{ backgroundColor: rule.color || '#22c55e' }}
                        />
                      ) : (
                        <span className="text-red-400 font-bold shrink-0">
                          [HIDDEN]
                        </span>
                      )}
                      <span className="truncate text-slate-300">
                        If <strong>{rule.property}</strong> == "{rule.value}"
                      </span>
                    </div>

                    <button
                      onClick={() => handleRemoveRule(rule.id)}
                      className="text-slate-500 hover:text-red-400 ml-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 italic">
                No conditional styling rules added yet.
              </p>
            )}

            {/* Form to Add Rule */}
            <div className="bg-slate-900/80 border border-slate-800/80 p-2.5 rounded-lg space-y-2">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">
                Add New Rule
              </span>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newRuleProp}
                  onChange={(e) => setNewRuleProp(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-200"
                >
                  <option value="">Select Field...</option>
                  {sampleProperties.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Value (e.g. Sold)"
                  value={newRuleVal}
                  onChange={(e) => setNewRuleVal(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-200"
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <select
                    value={newRuleAction}
                    onChange={(e) =>
                      setNewRuleAction(e.target.value as any)
                    }
                    className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-200"
                  >
                    <option value="color">Apply Color</option>
                    <option value="hide">Hide Feature</option>
                  </select>

                  {newRuleAction === 'color' && (
                    <input
                      type="color"
                      value={newRuleColor}
                      onChange={(e) => setNewRuleColor(e.target.value)}
                      className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                    />
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleAddRule}
                  disabled={!newRuleProp || !newRuleVal}
                  className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-medium px-2.5 py-1 rounded text-[11px] flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> Add Rule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function LayerPanel({
  layers,
  onUpdateLayer,
  onDeleteLayer,
  onReorderLayers,
}: LayerPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredLayers = layers.filter((l) =>
    l.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = layers.findIndex((item) => item.id === active.id);
      const newIndex = layers.findIndex((item) => item.id === over.id);
      const newOrderedLayers = arrayMove(layers, oldIndex, newIndex).map(
        (layer, idx) => ({ ...layer, position: idx })
      );
      onReorderLayers(newOrderedLayers);
    }
  };

  return (
    <aside className="w-96 bg-slate-900 border-r border-slate-800 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      {/* Search Header */}
      <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-900">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
            Map Layers
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-800 text-[#d4af37] border border-[#d4af37]/30">
              {layers.length}
            </span>
          </h2>
        </div>

        <div className="relative">
          <Search className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search layers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
          />
        </div>
      </div>

      {/* Layer List Container with Drag and Drop */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredLayers.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            No map layers found.
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredLayers.map((l) => l.id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredLayers.map((layer) => (
                <SortableLayerCard
                  key={layer.id}
                  layer={layer}
                  onUpdateLayer={onUpdateLayer}
                  onDeleteLayer={onDeleteLayer}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </aside>
  );
}
