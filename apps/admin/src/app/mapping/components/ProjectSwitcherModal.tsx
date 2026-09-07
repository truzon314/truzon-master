'use client';

import React, { useState } from 'react';
import { X, Search, Plus, MapPin, Layers, Check, Calendar } from 'lucide-react';
import type { MapProject } from '@truzon/types';

interface ProjectSwitcherModalProps {
  isOpen: boolean;
  projects: MapProject[];
  activeProject: MapProject | null;
  onSelectProject: (project: MapProject) => void;
  onCreateProject: (name: string, description: string) => void;
  onClose: () => void;
}

export function ProjectSwitcherModal({
  isOpen,
  projects,
  activeProject,
  onSelectProject,
  onCreateProject,
  onClose,
}: ProjectSwitcherModalProps) {
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  if (!isOpen) return null;

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onCreateProject(newName.trim(), newDescription.trim());
    setNewName('');
    setNewDescription('');
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl text-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[#d4af37]" />
            <h3 className="font-bold text-base text-slate-100">
              Map Project Workspace Switcher
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
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Top Actions: Search + Create Trigger */}
          {!isCreating && (
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search map projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <button
                onClick={() => setIsCreating(true)}
                className="bg-[#d4af37] hover:bg-[#c29f2d] text-slate-950 font-bold px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 shrink-0"
              >
                <Plus className="h-4 w-4" /> Create Project
              </button>
            </div>
          )}

          {/* Create Form Drawer */}
          {isCreating ? (
            <form onSubmit={handleCreate} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-xs text-slate-200">New Map Project</span>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Truzon Azure Master Township Plan"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Spatial layout details and boundaries..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 rounded text-xs font-medium text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#d4af37] text-slate-950 font-bold px-4 py-1.5 rounded text-xs hover:bg-[#c29f2d]"
                >
                  Create & Open
                </button>
              </div>
            </form>
          ) : (
            /* Project Selection List */
            <div className="space-y-2.5">
              {filteredProjects.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No map projects found. Click "Create Project" to get started.
                </div>
              ) : (
                filteredProjects.map((project) => {
                  const isSelected = activeProject?.id === project.id;
                  const layerCount = project.layers?.length || 0;

                  return (
                    <div
                      key={project.id}
                      onClick={() => {
                        onSelectProject(project);
                        onClose();
                      }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'border-[#d4af37] bg-[#d4af37]/10 ring-1 ring-[#d4af37]/30'
                          : 'border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-100 truncate">
                            {project.name}
                          </h4>
                          {isSelected && (
                            <span className="bg-[#d4af37] text-slate-950 p-0.5 rounded-full">
                              <Check className="h-3 w-3" />
                            </span>
                          )}
                        </div>

                        {project.description && (
                          <p className="text-xs text-slate-400 line-clamp-1">
                            {project.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                          <span className="flex items-center gap-1 text-[#d4af37]">
                            <Layers className="h-3 w-3" /> {layerCount} Layers
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-slate-500" />{' '}
                            {new Date(project.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <button
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-[#d4af37] text-slate-950'
                            : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        {isSelected ? 'Active' : 'Switch'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
