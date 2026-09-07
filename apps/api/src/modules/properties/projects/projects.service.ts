import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto } from './dto/project.dto';
import { User, RoleType } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto, currentUser: User) {
    // Auto-generate slug if not provided
    let slug = createProjectDto.slug;
    if (!slug) {
      slug = createProjectDto.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Check slug uniqueness
    const existingSlug = await this.prisma.project.findUnique({ where: { slug } });
    if (existingSlug) {
      throw new ConflictException('Project with this slug already exists');
    }

    const project = await this.prisma.project.create({
      data: {
        ...createProjectDto,
        slug,
        latitude: createProjectDto.latitude ? new Prisma.Decimal(createProjectDto.latitude) : undefined,
        longitude: createProjectDto.longitude ? new Prisma.Decimal(createProjectDto.longitude) : undefined,
        possessionDate: createProjectDto.possessionDate ? new Date(createProjectDto.possessionDate) : undefined,
        launchDate: createProjectDto.launchDate ? new Date(createProjectDto.launchDate) : undefined,
        createdById: currentUser.id,
        updatedById: currentUser.id,
        city: (createProjectDto as any).city || '',
        state: (createProjectDto as any).state || '',
        address: (createProjectDto as any).address || '',
      },
      include: {
        createdBy: { select: { id: true, fullName: true } },
        updatedBy: { select: { id: true, fullName: true } },
        _count: { select: { properties: true, villas: true, plots: true, inventoryUnits: true } },
      },
    });

    return project;
  }

  async findAll(query: ProjectQueryDto, currentUser: User) {
    const { page = 1, limit = 20, search, city, status, isActive, isFeatured, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ProjectWhereInput = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (city) where.city = { equals: city, mode: 'insensitive' };
    if (status) where.status = status;
    if (isActive !== undefined) where.isActive = isActive;
    if (isFeatured !== undefined) where.isFeatured = isFeatured;

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          createdBy: { select: { id: true, fullName: true } },
          updatedBy: { select: { id: true, fullName: true } },
          _count: { select: { properties: true, villas: true, plots: true, inventoryUnits: true } },
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    return { data: projects, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string, currentUser: User) {
    const project = await this.prisma.project.findUnique({
      where: { id, deletedAt: null },
      include: {
        createdBy: { select: { id: true, fullName: true } },
        updatedBy: { select: { id: true, fullName: true } },
        properties: {
          include: { categories: true, mapProject: { include: { layers: true } }, _count: { select: { inventoryUnits: true } } },
          where: { deletedAt: null },
        },
        _count: { select: { properties: true, villas: true, plots: true, inventoryUnits: true, leads: true, enquiries: true, siteVisits: true, bookings: true } },
      },
    });

    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async findBySlug(slug: string, currentUser: User) {
    const project = await this.prisma.project.findUnique({
      where: { slug, deletedAt: null },
      include: {
        properties: {
          where: { deletedAt: null, isActive: true },
          include: { categories: true, mapProject: { include: { layers: true } } },
        },
      },
    });

    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, currentUser: User) {
    const project = await this.findById(id, currentUser);

    // Check slug uniqueness if changing
    if (updateProjectDto.slug && updateProjectDto.slug !== project.slug) {
      const existing = await this.prisma.project.findUnique({ where: { slug: updateProjectDto.slug } });
      if (existing) throw new ConflictException('Project with this slug already exists');
    }

    const updated = await this.prisma.project.update({
      where: { id },
      data: {
        ...updateProjectDto,
        latitude: updateProjectDto.latitude ? new Prisma.Decimal(updateProjectDto.latitude) : undefined,
        longitude: updateProjectDto.longitude ? new Prisma.Decimal(updateProjectDto.longitude) : undefined,
        possessionDate: updateProjectDto.possessionDate ? new Date(updateProjectDto.possessionDate) : undefined,
        launchDate: updateProjectDto.launchDate ? new Date(updateProjectDto.launchDate) : undefined,
        updatedById: currentUser.id,
      },
      include: {
        createdBy: { select: { id: true, fullName: true } },
        updatedBy: { select: { id: true, fullName: true } },
      },
    });

    return updated;
  }

  async delete(id: string, currentUser: User) {
    const project = await this.findById(id, currentUser);

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      throw new ForbiddenException('Only admins can delete projects');
    }

    // Check for dependencies
    const [propertiesCount, inventoryCount, bookingsCount] = await Promise.all([
      this.prisma.property.count({ where: { projectId: id, deletedAt: null } }),
      this.prisma.inventoryUnit.count({ where: { projectId: id, deletedAt: null } }),
      this.prisma.booking.count({ where: { projectId: id, deletedAt: null } }),
    ]);

    if (propertiesCount > 0 || inventoryCount > 0 || bookingsCount > 0) {
      throw new ConflictException('Cannot delete project with existing properties, inventory, or bookings');
    }

    await this.prisma.project.update({ where: { id }, data: { deletedAt: new Date() } });
    return { success: true };
  }

  async getProjectStats(id: string, currentUser: User) {
    await this.findById(id, currentUser);

    const [totalProperties, availableUnits, bookedUnits, soldUnits, totalValue] = await Promise.all([
      this.prisma.property.count({ where: { projectId: id, deletedAt: null } }),
      this.prisma.inventoryUnit.count({ where: { projectId: id, status: 'AVAILABLE', deletedAt: null } }),
      this.prisma.inventoryUnit.count({ where: { projectId: id, status: 'BOOKED', deletedAt: null } }),
      this.prisma.inventoryUnit.count({ where: { projectId: id, status: 'SOLD', deletedAt: null } }),
      this.prisma.inventoryUnit.aggregate({
        where: { projectId: id, deletedAt: null },
        _sum: { priceValue: true },
      }),
    ]);

    return {
      totalProperties,
      availableUnits,
      bookedUnits,
      soldUnits,
      totalInventoryValue: totalValue._sum.priceValue || 0,
    };
  }

  async addMedia(projectId: string, mediaId: string, currentUser: User) {
    await this.findById(projectId, currentUser);

    return this.prisma.media.update({
      where: { id: mediaId },
      data: { projectMedia: { connect: { id: projectId } } },
    });
  }

  async removeMedia(projectId: string, mediaId: string, currentUser: User) {
    await this.findById(projectId, currentUser);

    return this.prisma.media.update({
      where: { id: mediaId },
      data: { projectMedia: { disconnect: { id: projectId } } },
    });
  }
}