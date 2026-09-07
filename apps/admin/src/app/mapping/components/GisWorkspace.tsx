'use client';

import React, { useState, useEffect } from 'react';
import { HeaderBar } from './HeaderBar';
import { LayerPanel } from './LayerPanel';
import { MapCanvas } from './MapCanvas';
import { FeatureInspector } from './FeatureInspector';
import { ProjectSwitcherModal } from './ProjectSwitcherModal';
import { GisUploadModal } from './GisUploadModal';
import { TileProviderModal } from './TileProviderModal';
import { ShareEmbedModal } from './ShareEmbedModal';
import {
  useGetMapProjectsQuery,
  useGetMapProjectQuery,
  useGetMapLayersQuery,
  useCreateMapProjectMutation,
  useUpdateMapProjectMutation,
  useUploadMapLayerMutation,
  useUpdateMapLayerMutation,
  useDeleteMapLayerMutation,
  useUpdateLayerFeaturesMutation,
  useGetMapProvidersQuery,
  useUpsertMapProviderMutation,
  useGetMapShareLinksQuery,
  useUpsertMapShareLinkMutation,
} from '@truzon/api-client';
import type { MapProject, MapLayer, MapProviderConfig } from '@truzon/types';

export function GisWorkspace() {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // Modals visibility
  const [isProjectSwitcherOpen, setIsProjectSwitcherOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isTileProvidersModalOpen, setIsTileProvidersModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Inspector Drawer selection
  const [selectedFeatureInfo, setSelectedFeatureInfo] = useState<{
    layer: MapLayer;
    feature: any;
  } | null>(null);

  // RTK Queries
  const { data: projectsData, refetch: refetchProjects } = useGetMapProjectsQuery();
  const projects: MapProject[] = projectsData?.data || [];

  // Automatically select first project if not set
  useEffect(() => {
    if (!activeProjectId && projects.length > 0) {
      setActiveProjectId(projects[0].id);
    }
  }, [projects, activeProjectId]);

  const { data: activeProjectData } = useGetMapProjectQuery(
    activeProjectId || '',
    { skip: !activeProjectId }
  );
  const activeProject: MapProject | null = activeProjectData || projects.find((p) => p.id === activeProjectId) || null;

  const { data: layersData } = useGetMapLayersQuery(
    activeProjectId || '',
    { skip: !activeProjectId }
  );
  const layers: MapLayer[] = layersData || activeProject?.layers || [];

  const { data: providersData } = useGetMapProvidersQuery();
  const providers: MapProviderConfig[] = providersData || [];
  const activeProvider = providers.find((p) => p.isActive) || null;

  const { data: shareLinksData } = useGetMapShareLinksQuery(
    activeProjectId || '',
    { skip: !activeProjectId }
  );
  const shareLinks = shareLinksData || [];

  // RTK Mutations
  const [createProject] = useCreateMapProjectMutation();
  const [updateProject] = useUpdateMapProjectMutation();
  const [uploadLayer] = useUploadMapLayerMutation();
  const [updateLayer] = useUpdateMapLayerMutation();
  const [deleteLayer] = useDeleteMapLayerMutation();
  const [updateLayerFeatures] = useUpdateLayerFeaturesMutation();
  const [upsertProvider] = useUpsertMapProviderMutation();
  const [upsertShareLink] = useUpsertMapShareLinkMutation();

  // Handlers
  const handleCreateProject = async (name: string, description: string) => {
    try {
      const result = await createProject({ name, description }).unwrap();
      if (result?.id) {
        setActiveProjectId(result.id);
        refetchProjects();
      }
    } catch (err) {
      console.error('Failed to create map project:', err);
    }
  };

  const handleUpdateLayer = async (id: string, updates: Partial<MapLayer>) => {
    try {
      await updateLayer({ id, data: updates }).unwrap();
    } catch (err) {
      console.error('Failed to update map layer:', err);
    }
  };

  const handleDeleteLayer = async (id: string) => {
    if (!activeProjectId) return;
    try {
      await deleteLayer({ id, projectId: activeProjectId }).unwrap();
      if (selectedFeatureInfo?.layer.id === id) {
        setSelectedFeatureInfo(null);
      }
    } catch (err) {
      console.error('Failed to delete map layer:', err);
    }
  };

  const handleReorderLayers = async (reordered: MapLayer[]) => {
    // Update local state and persist positions via patch
    for (const l of reordered) {
      handleUpdateLayer(l.id, { position: l.position });
    }
  };

  const handleUploadLayer = async (data: any) => {
    try {
      await uploadLayer(data).unwrap();
    } catch (err) {
      console.error('Failed to upload GIS layer:', err);
    }
  };

  const handleSaveFeatureProperties = async (
    layerId: string,
    featureId: string,
    properties: Record<string, any>
  ) => {
    try {
      await updateLayerFeatures({ id: layerId, featureId, properties }).unwrap();
    } catch (err) {
      console.error('Failed to update feature properties:', err);
    }
  };

  const handleSaveProvider = async (data: any) => {
    try {
      await upsertProvider(data).unwrap();
    } catch (err) {
      console.error('Failed to save tile provider:', err);
    }
  };

  const handleUpsertShareLink = async (data: any) => {
    try {
      await upsertShareLink(data).unwrap();
    } catch (err) {
      console.error('Failed to update share link:', err);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Top Header Bar */}
      <HeaderBar
        activeProject={activeProject}
        onOpenProjectSwitcher={() => setIsProjectSwitcherOpen(true)}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenTileProvidersModal={() => setIsTileProvidersModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Left Panel - Layer Management */}
        <LayerPanel
          layers={layers}
          onUpdateLayer={handleUpdateLayer}
          onDeleteLayer={handleDeleteLayer}
          onReorderLayers={handleReorderLayers}
        />

        {/* Center Main Viewport - Leaflet Map Canvas */}
        <MapCanvas
          activeProject={activeProject}
          layers={layers}
          activeProvider={activeProvider}
          onSelectFeature={(layer, feature) =>
            setSelectedFeatureInfo({ layer, feature })
          }
        />

        {/* Floating Feature Attribute Inspector Drawer */}
        {selectedFeatureInfo && (
          <FeatureInspector
            layer={selectedFeatureInfo.layer}
            feature={selectedFeatureInfo.feature}
            onSaveFeature={handleSaveFeatureProperties}
            onClose={() => setSelectedFeatureInfo(null)}
          />
        )}
      </div>

      {/* Modals */}
      <ProjectSwitcherModal
        isOpen={isProjectSwitcherOpen}
        projects={projects}
        activeProject={activeProject}
        onSelectProject={(proj) => setActiveProjectId(proj.id)}
        onCreateProject={handleCreateProject}
        onClose={() => setIsProjectSwitcherOpen(false)}
      />

      <GisUploadModal
        isOpen={isUploadModalOpen}
        projectId={activeProjectId}
        onUploadLayer={handleUploadLayer}
        onClose={() => setIsUploadModalOpen(false)}
      />

      <TileProviderModal
        isOpen={isTileProvidersModalOpen}
        providers={providers}
        activeProvider={activeProvider}
        onSaveProvider={handleSaveProvider}
        onClose={() => setIsTileProvidersModalOpen(false)}
      />

      <ShareEmbedModal
        isOpen={isShareModalOpen}
        activeProject={activeProject}
        shareLinks={shareLinks}
        onUpsertShareLink={handleUpsertShareLink}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
}
