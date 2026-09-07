import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePropertyDto, UpdatePropertyDto, PropertyQueryDto } from './dto/property.dto';
import { User, RoleType, PropertyType, Prisma } from '@prisma/client';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async create(createPropertyDto: CreatePropertyDto, currentUser: User) {
    // Verify project exists
    const project = await this.prisma.project.findUnique({ where: { id: createPropertyDto.projectId } });
    if (!project) throw new NotFoundException('Project not found');

    // Auto-generate slug
    let slug = createPropertyDto.slug;
    if (!slug) {
      slug = createPropertyDto.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Check slug uniqueness within project
    const existingSlug = await this.prisma.property.findFirst({
      where: { projectId: createPropertyDto.projectId, slug },
    });
    if (existingSlug) throw new ConflictException('Property with this slug already exists in project');

    // Verify categories exist
    if (createPropertyDto.categoryIds?.length) {
      const categories = await this.prisma.category.findMany({
        where: { id: { in: createPropertyDto.categoryIds } },
      });
      if (categories.length !== createPropertyDto.categoryIds.length) {
        throw new NotFoundException('One or more categories not found');
      }
    }

    const property = await this.prisma.property.create({
      data: {
        ...createPropertyDto,
        slug,
        plotSize: createPropertyDto.plotSize ? new Prisma.Decimal(createPropertyDto.plotSize) : undefined,
        builtUpArea: createPropertyDto.builtUpArea ? new Prisma.Decimal(createPropertyDto.builtUpArea) : undefined,
        carpetArea: createPropertyDto.carpetArea ? new Prisma.Decimal(createPropertyDto.carpetArea) : undefined,
        priceValue: createPropertyDto.priceValue ? new Prisma.Decimal(createPropertyDto.priceValue) : undefined,
        pricePerSqft: createPropertyDto.pricePerSqft ? new Prisma.Decimal(createPropertyDto.pricePerSqft) : undefined,
        amenities: createPropertyDto.amenities || [],
        specifications: createPropertyDto.specifications || {},
        categories: createPropertyDto.categoryIds
          ? { connect: createPropertyDto.categoryIds.map(id => ({ id })) }
          : undefined,
      },
      include: {
        project: { select: { id: true, name: true, slug: true } },
        categories: true,
        _count: { select: { inventoryUnits: true, media: true } },
      },
    });

    return property;
  }

  async findAll(query: PropertyQueryDto, currentUser: User) {
    const { page = 1, limit = 20, search, projectId, propertyType, city, budgetBracket, isSignature, isActive, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.PropertyWhereInput = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (projectId) where.projectId = projectId;
    if (propertyType) where.propertyType = propertyType;
    if (isSignature !== undefined) where.isSignature = isSignature;
    if (isActive !== undefined) where.isActive = isActive;

    // Role-based filtering for non-admin users
    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      where.isActive = true;
      where.project = { isActive: true };
    }

    const [properties, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          project: { select: { id: true, name: true, slug: true, city: true, isActive: true } },
          categories: true,
          _count: { select: { inventoryUnits: true, media: true } },
        },
      }),
      this.prisma.property.count({ where }),
    ]);

    return { data: properties, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string, currentUser: User) {
    const property = await this.prisma.property.findUnique({
      where: { id, deletedAt: null },
      include: {
        project: { select: { id: true, name: true, slug: true, city: true, isActive: true } },
        categories: true,
        media: { include: { media: true } },
        inventoryUnits: {
          where: { deletedAt: null },
          include: { bookings: { where: { status: { in: ['PENDING', 'CONFIRMED'] } } } },
        },
        _count: { select: { inventoryUnits: true, media: true, leads: true, enquiries: true } },
      },
    });

    if (!property) throw new NotFoundException('Property not found');

    // Check access
    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      if (!property.isActive || !property.project.isActive) {
        throw new NotFoundException('Property not found');
      }
    }

    return property;
  }

  async findBySlug(projectSlug: string, propertySlug: string, currentUser: User) {
    const property = await this.prisma.property.findFirst({
      where: {
        slug: propertySlug,
        project: { slug: projectSlug },
        deletedAt: null,
      },
      include: {
        project: { select: { id: true, name: true, slug: true, city: true, isActive: true } },
        categories: true,
        media: { include: { media: true } },
        inventoryUnits: {
          where: { deletedAt: null, status: 'AVAILABLE' },
        },
      },
    });

    if (!property) throw new NotFoundException('Property not found');

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      if (!property.isActive || !property.project.isActive) {
        throw new NotFoundException('Property not found');
      }
    }

    return property;
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto, currentUser: User) {
    const property = await this.findById(id, currentUser);

    if (updatePropertyDto.slug && updatePropertyDto.slug !== property.slug) {
      const existing = await this.prisma.property.findFirst({
        where: { projectId: property.projectId, slug: updatePropertyDto.slug },
      });
      if (existing) throw new ConflictException('Property with this slug already exists in project');
    }

    // Verify categories
    if (updatePropertyDto.categoryIds?.length) {
      const categories = await this.prisma.category.findMany({
        where: { id: { in: updatePropertyDto.categoryIds } },
      });
      if (categories.length !== updatePropertyDto.categoryIds.length) {
        throw new NotFoundException('One or more categories not found');
      }
    }

    const updated = await this.prisma.property.update({
      where: { id },
      data: {
        ...updatePropertyDto,
        plotSize: updatePropertyDto.plotSize ? new Prisma.Decimal(updatePropertyDto.plotSize) : undefined,
        builtUpArea: updatePropertyDto.builtUpArea ? new Prisma.Decimal(updatePropertyDto.builtUpArea) : undefined,
        carpetArea: updatePropertyDto.carpetArea ? new Prisma.Decimal(updatePropertyDto.carpetArea) : undefined,
        priceValue: updatePropertyDto.priceValue ? new Prisma.Decimal(updatePropertyDto.priceValue) : undefined,
        pricePerSqft: updatePropertyDto.pricePerSqft ? new Prisma.Decimal(updatePropertyDto.pricePerSqft) : undefined,
        amenities: updatePropertyDto.amenities || undefined,
        specifications: updatePropertyDto.specifications || undefined,
        categories: updatePropertyDto.categoryIds
          ? { set: updatePropertyDto.categoryIds.map(id => ({ id })) }
          : undefined,
      },
      include: {
        project: { select: { id: true, name: true, slug: true } },
        categories: true,
      },
    });

    return updated;
  }

  async delete(id: string, currentUser: User) {
    const property = await this.findById(id, currentUser);

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      throw new ForbiddenException('Only admins can delete properties');
    }

    // Check for dependencies
    const [inventoryCount, bookingsCount, leadsCount] = await Promise.all([
      this.prisma.inventoryUnit.count({ where: { propertyId: id, deletedAt: null } }),
      this.prisma.booking.count({ where: { propertyId: id, deletedAt: null } }),
      this.prisma.lead.count({ where: { propertyId: id, deletedAt: null } }),
    ]);

    if (inventoryCount > 0 || bookingsCount > 0) {
      throw new ConflictException('Cannot delete property with existing inventory or bookings');
    }

    await this.prisma.property.update({ where: { id }, data: { deletedAt: new Date() } });
    return { success: true };
  }

  async addMedia(propertyId: string, mediaId: string, type: string = 'GALLERY', currentUser: User) {
    await this.findById(propertyId, currentUser);

    return this.prisma.propertyMedia.create({
      data: { propertyId, mediaId, type },
      include: { media: true },
    });
  }

  async removeMedia(propertyId: string, mediaId: string, currentUser: User) {
    await this.findById(propertyId, currentUser);
    await this.prisma.propertyMedia.delete({ where: { propertyId_mediaId: { propertyId, mediaId } } });
    return { success: true };
  }

  async getAvailableInventory(propertyId: string) {
    return this.prisma.inventoryUnit.findMany({
      where: { propertyId, status: 'AVAILABLE', deletedAt: null },
      orderBy: { priceValue: 'asc' },
    });
  }
}