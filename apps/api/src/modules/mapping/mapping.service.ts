import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MappingService {
  constructor(private prisma: PrismaService) {}

  // Map Projects
  async createProject(data: {
    name: string;
    description?: string;
    mapProviderType?: string;
    centerLat?: number;
    centerLng?: number;
    zoomLevel?: number;
    bounds?: any;
    isPublic?: boolean;
  }) {
    return this.prisma.mapProject.create({
      data: {
        name: data.name,
        description: data.description,
        mapProviderType: data.mapProviderType || 'openstreetmap',
        centerLat: data.centerLat ?? 13.1986,
        centerLng: data.centerLng ?? 77.7066,
        zoomLevel: data.zoomLevel ?? 12,
        bounds: data.bounds,
        isPublic: data.isPublic ?? true,
      },
      include: {
        layers: { orderBy: { position: 'asc' } },
        shareLink: true,
      },
    });
  }

  async findAllProjects(search?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    const projects = await this.prisma.mapProject.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        layers: {
          select: { id: true, label: true, defaultVisible: true, position: true },
          orderBy: { position: 'asc' },
        },
        shareLink: true,
      },
    });

    return {
      data: projects,
      meta: {
        total: projects.length,
        page: 1,
        perPage: projects.length,
        totalPages: 1,
      },
    };
  }

  async findProjectById(id: string) {
    const project = await this.prisma.mapProject.findUnique({
      where: { id },
      include: {
        layers: { orderBy: { position: 'asc' } },
        shareLink: true,
      },
    });
    if (!project) throw new NotFoundException('Map project not found');
    return project;
  }

  async updateProject(id: string, data: any) {
    await this.findProjectById(id);
    return this.prisma.mapProject.update({
      where: { id },
      data,
      include: { layers: { orderBy: { position: 'asc' } }, shareLink: true },
    });
  }

  async deleteProject(id: string) {
    await this.findProjectById(id);
    await this.prisma.mapProject.delete({ where: { id } });
    return { success: true, message: 'Map project deleted' };
  }

  // Layers
  async findLayers(projectId?: string) {
    const where: any = {};
    if (projectId) where.projectId = projectId;
    return this.prisma.mapLayer.findMany({
      where,
      orderBy: { position: 'asc' },
    });
  }

  async findLayerById(id: string) {
    const layer = await this.prisma.mapLayer.findUnique({ where: { id } });
    if (!layer) throw new NotFoundException('Map layer not found');
    return layer;
  }

  async uploadLayer(data: {
    projectId: string;
    label: string;
    geojson: any;
    strokeColor?: string;
    fillColor?: string;
    fillOpacity?: number;
    strokeWeight?: number;
    strokeStyle?: string;
    defaultVisible?: boolean;
    colorRules?: any;
    labelProperty?: string;
    labelAlignment?: string;
    popupEnabled?: boolean;
    popupProperties?: any;
  }) {
    const project = await this.prisma.mapProject.findUnique({ where: { id: data.projectId } });
    if (!project) throw new NotFoundException('Map project not found');

    const layerCount = await this.prisma.mapLayer.count({ where: { projectId: data.projectId } });

    // Validate GeoJSON
    let geojson = data.geojson;
    if (typeof geojson === 'string') {
      try {
        geojson = JSON.parse(geojson);
      } catch {
        throw new BadRequestException('Invalid GeoJSON string provided');
      }
    }

    if (!geojson || geojson.type !== 'FeatureCollection') {
      geojson = {
        type: 'FeatureCollection',
        features: Array.isArray(geojson?.features) ? geojson.features : [],
      };
    }

    // Ensure features have IDs
    geojson.features = (geojson.features || []).map((feat: any, idx: number) => ({
      ...feat,
      id: feat.id || `feat-${Date.now()}-${idx}`,
      properties: feat.properties || {},
    }));

    return this.prisma.mapLayer.create({
      data: {
        projectId: data.projectId,
        label: data.label,
        geojson,
        strokeColor: data.strokeColor || '#3388ff',
        fillColor: data.fillColor || '#3388ff',
        fillOpacity: data.fillOpacity ?? 0.4,
        strokeWeight: data.strokeWeight ?? 2,
        strokeStyle: data.strokeStyle || 'solid',
        defaultVisible: data.defaultVisible ?? true,
        colorRules: data.colorRules || null,
        labelProperty: data.labelProperty || null,
        labelAlignment: data.labelAlignment || 'center',
        popupEnabled: data.popupEnabled ?? true,
        popupProperties: data.popupProperties || null,
        position: layerCount,
      },
    });
  }

  async updateLayer(id: string, data: any) {
    await this.findLayerById(id);
    return this.prisma.mapLayer.update({
      where: { id },
      data,
    });
  }

  async deleteLayer(id: string) {
    await this.findLayerById(id);
    await this.prisma.mapLayer.delete({ where: { id } });
    return { success: true, message: 'Layer deleted' };
  }

  async updateLayerFeatures(id: string, featureId: string, properties: Record<string, any>) {
    const layer = await this.findLayerById(id);
    const geojson = layer.geojson as any;
    if (!geojson || !Array.isArray(geojson.features)) {
      throw new BadRequestException('Layer contains invalid GeoJSON structure');
    }

    let updated = false;
    geojson.features = geojson.features.map((feat: any, idx: number) => {
      const isTarget =
        feat.id === featureId ||
        String(feat.id) === String(featureId) ||
        feat.properties?.id === featureId ||
        `feat-${idx}` === featureId;

      if (isTarget) {
        updated = true;
        return {
          ...feat,
          properties: { ...properties },
        };
      }
      return feat;
    });

    if (!updated) {
      throw new NotFoundException(`Feature with ID ${featureId} not found in layer GeoJSON`);
    }

    return this.prisma.mapLayer.update({
      where: { id },
      data: { geojson },
    });
  }

  // Tile Providers
  async getProviders() {
    return this.prisma.mapProviderConfig.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async upsertProvider(data: {
    providerType: string;
    apiKey?: string;
    customTileUrl?: string;
    maxZoom?: number;
    isActive?: boolean;
  }) {
    // Set other provider configs isActive to false if activating this one
    if (data.isActive) {
      await this.prisma.mapProviderConfig.updateMany({
        data: { isActive: false },
      });
    }

    return this.prisma.mapProviderConfig.upsert({
      where: { providerType: data.providerType },
      create: {
        providerType: data.providerType,
        apiKey: data.apiKey || null,
        customTileUrl: data.customTileUrl || null,
        maxZoom: data.maxZoom ?? 19,
        isActive: data.isActive ?? true,
      },
      update: {
        apiKey: data.apiKey !== undefined ? data.apiKey : undefined,
        customTileUrl: data.customTileUrl !== undefined ? data.customTileUrl : undefined,
        maxZoom: data.maxZoom !== undefined ? data.maxZoom : undefined,
        isActive: data.isActive !== undefined ? data.isActive : undefined,
      },
    });
  }

  // Share Links
  async getShareLinks(projectId: string) {
    return this.prisma.mapShareLink.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async upsertShareLink(projectId: string, data: {
    isActive?: boolean;
    password?: string;
    expiresAt?: string;
    maxViews?: number;
    createdById?: string;
  }) {
    let passwordHash: string | null | undefined = undefined;
    if (data.password) {
      passwordHash = await bcrypt.hash(data.password, 10);
    }

    const token = `map_sec_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;

    return this.prisma.mapShareLink.upsert({
      where: { projectId },
      create: {
        projectId,
        token,
        isActive: data.isActive ?? true,
        passwordHash: passwordHash || null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        maxViews: data.maxViews || null,
        createdById: data.createdById || undefined,
      },
      update: {
        isActive: data.isActive !== undefined ? data.isActive : undefined,
        passwordHash: passwordHash !== undefined ? passwordHash : undefined,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        maxViews: data.maxViews !== undefined ? data.maxViews : undefined,
      },
    });
  }

  // Public Mapping Resolution
  async getPublicProject(projectId: string) {
    const project = await this.prisma.mapProject.findUnique({
      where: { id: projectId },
      include: {
        layers: {
          where: { defaultVisible: true },
          orderBy: { position: 'asc' },
        },
      },
    });
    if (!project || !project.isPublic) {
      throw new NotFoundException('Public map project not found');
    }
    return {
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        map_provider_type: project.mapProviderType,
        center_lat: project.centerLat,
        center_lng: project.centerLng,
        zoom_level: project.zoomLevel,
        bounds: project.bounds,
      },
      layers: project.layers.map((l) => ({
        id: l.id,
        label: l.label,
        stroke_color: l.strokeColor,
        fill_color: l.fillColor,
        fill_opacity: l.fillOpacity,
        stroke_weight: l.strokeWeight,
        stroke_style: l.strokeStyle as any,
        default_visible: l.defaultVisible,
        color_rules: l.colorRules as any,
        label_property: l.labelProperty,
        label_alignment: l.labelAlignment,
        popup_enabled: l.popupEnabled,
        popup_properties: l.popupProperties as any,
      })),
    };
  }

  async getPublicLayerGeoJson(projectId: string, layerId: string) {
    const layer = await this.prisma.mapLayer.findFirst({
      where: { id: layerId, projectId },
    });
    if (!layer) throw new NotFoundException('Layer not found');
    return layer.geojson || { type: 'FeatureCollection', features: [] };
  }

  async resolveSharedMapByToken(token: string, password?: string) {
    const shareLink = await this.prisma.mapShareLink.findUnique({
      where: { token },
      include: {
        project: {
          include: {
            layers: { orderBy: { position: 'asc' } },
          },
        },
      },
    });

    if (!shareLink || !shareLink.isActive) {
      throw new NotFoundException('Shared map link invalid or disabled');
    }

    if (shareLink.expiresAt && new Date() > shareLink.expiresAt) {
      throw new BadRequestException('Shared map link has expired');
    }

    if (shareLink.maxViews && shareLink.viewCount >= shareLink.maxViews) {
      throw new BadRequestException('Shared map maximum view limit reached');
    }

    if (shareLink.passwordHash) {
      if (!password) {
        throw new UnauthorizedException('Password required for this shared map');
      }
      const valid = await bcrypt.compare(password, shareLink.passwordHash);
      if (!valid) {
        throw new UnauthorizedException('Incorrect password for shared map');
      }
    }

    // Increment view count
    await this.prisma.mapShareLink.update({
      where: { id: shareLink.id },
      data: { viewCount: { increment: 1 } },
    });

    return {
      project: shareLink.project,
      layers: shareLink.project.layers,
      shareLink: {
        id: shareLink.id,
        token: shareLink.token,
        viewCount: shareLink.viewCount + 1,
        expiresAt: shareLink.expiresAt,
        maxViews: shareLink.maxViews,
      },
    };
  }
}