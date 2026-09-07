import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateVillaDto, CreatePlotDto, CreateInventoryUnitDto, UpdateInventoryUnitDto, InventoryQueryDto } from './dto/inventory.dto';
import { User, RoleType, PropertyType, InventoryStatus, Prisma } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  // ============ VILLAS ============
  async createVilla(createVillaDto: CreateVillaDto, currentUser: User) {
    const project = await this.prisma.project.findUnique({ where: { id: createVillaDto.projectId } });
    if (!project) throw new NotFoundException('Project not found');

    const existing = await this.prisma.villa.findFirst({
      where: { projectId: createVillaDto.projectId, unitNumber: createVillaDto.unitNumber },
    });
    if (existing) throw new ConflictException('Villa with this unit number already exists');

    const villa = await this.prisma.villa.create({
      data: {
        ...createVillaDto,
        plotSize: new Prisma.Decimal(createVillaDto.plotSize),
        builtUpArea: new Prisma.Decimal(createVillaDto.builtUpArea),
        carpetArea: createVillaDto.carpetArea ? new Prisma.Decimal(createVillaDto.carpetArea) : undefined,
        priceValue: new Prisma.Decimal(createVillaDto.priceValue),
        pricePerSqft: createVillaDto.pricePerSqft ? new Prisma.Decimal(createVillaDto.pricePerSqft) : undefined,
      },
      include: {
        project: { select: { id: true, name: true } },
        inventoryUnit: true,
      },
    });

    // Create corresponding inventory unit
    await this.prisma.inventoryUnit.create({
      data: {
        projectId: createVillaDto.projectId,
        villaId: villa.id,
        unitType: PropertyType.VILLA,
        unitNumber: createVillaDto.unitNumber,
        status: createVillaDto.status,
        priceValue: new Prisma.Decimal(createVillaDto.priceValue),
      },
    });

    return villa;
  }

  async findVillas(query: InventoryQueryDto, currentUser: User) {
    const { page = 1, limit = 20, projectId, status, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.VillaWhereInput = { deletedAt: null };
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;

    const [villas, total] = await Promise.all([
      this.prisma.villa.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: { project: { select: { id: true, name: true } }, inventoryUnit: true },
      }),
      this.prisma.villa.count({ where }),
    ]);

    return { data: villas, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findVillaById(id: string) {
    const villa = await this.prisma.villa.findUnique({
      where: { id, deletedAt: null },
      include: { project: true, inventoryUnit: { include: { bookings: true } } },
    });
    if (!villa) throw new NotFoundException('Villa not found');
    return villa;
  }

  async updateVilla(id: string, data: Partial<CreateVillaDto>, currentUser: User) {
    const villa = await this.findVillaById(id);
    if (data.unitNumber && data.unitNumber !== villa.unitNumber) {
      const existing = await this.prisma.villa.findFirst({
        where: { projectId: villa.projectId, unitNumber: data.unitNumber },
      });
      if (existing) throw new ConflictException('Villa with this unit number already exists');
    }

    const updateData: any = { ...data };
    if (data.plotSize) updateData.plotSize = new Prisma.Decimal(data.plotSize);
    if (data.builtUpArea) updateData.builtUpArea = new Prisma.Decimal(data.builtUpArea);
    if (data.carpetArea) updateData.carpetArea = new Prisma.Decimal(data.carpetArea);
    if (data.priceValue) updateData.priceValue = new Prisma.Decimal(data.priceValue);
    if (data.pricePerSqft) updateData.pricePerSqft = new Prisma.Decimal(data.pricePerSqft);

    const updated = await this.prisma.villa.update({
      where: { id },
      data: updateData,
      include: { project: true, inventoryUnit: true },
    });

    // Sync inventory unit
    if (data.status || data.priceValue) {
      await this.prisma.inventoryUnit.update({
        where: { villaId: id },
        data: {
          status: data.status || undefined,
          priceValue: data.priceValue ? new Prisma.Decimal(data.priceValue) : undefined,
        },
      });
    }

    return updated;
  }

  async deleteVilla(id: string, currentUser: User) {
    const villa = await this.findVillaById(id);
    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      throw new ForbiddenException('Only admins can delete villas');
    }

    const bookings = await this.prisma.booking.count({ where: { inventoryUnit: { villaId: id } } });
    if (bookings > 0) throw new ConflictException('Cannot delete villa with existing bookings');

    await this.prisma.$transaction([
      this.prisma.inventoryUnit.delete({ where: { villaId: id } }),
      this.prisma.villa.update({ where: { id }, data: { deletedAt: new Date() } }),
    ]);

    return { success: true };
  }

  // ============ PLOTS ============
  async createPlot(createPlotDto: CreatePlotDto, currentUser: User) {
    const project = await this.prisma.project.findUnique({ where: { id: createPlotDto.projectId } });
    if (!project) throw new NotFoundException('Project not found');

    const existing = await this.prisma.plot.findFirst({
      where: { projectId: createPlotDto.projectId, unitNumber: createPlotDto.unitNumber },
    });
    if (existing) throw new ConflictException('Plot with this unit number already exists');

    const plot = await this.prisma.plot.create({
      data: {
        ...createPlotDto,
        plotSize: new Prisma.Decimal(createPlotDto.plotSize),
        priceValue: new Prisma.Decimal(createPlotDto.priceValue),
        pricePerSqft: createPlotDto.pricePerSqft ? new Prisma.Decimal(createPlotDto.pricePerSqft) : undefined,
        roadWidth: createPlotDto.roadWidth ? new Prisma.Decimal(createPlotDto.roadWidth) : undefined,
      },
      include: { project: { select: { id: true, name: true } }, inventoryUnit: true },
    });

    await this.prisma.inventoryUnit.create({
      data: {
        projectId: createPlotDto.projectId,
        plotId: plot.id,
        unitType: PropertyType.PLOT,
        unitNumber: createPlotDto.unitNumber,
        status: createPlotDto.status,
        priceValue: new Prisma.Decimal(createPlotDto.priceValue),
      },
    });

    return plot;
  }

  async findPlots(query: InventoryQueryDto, currentUser: User) {
    const { page = 1, limit = 20, projectId, status, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.PlotWhereInput = { deletedAt: null };
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;

    const [plots, total] = await Promise.all([
      this.prisma.plot.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: { project: { select: { id: true, name: true } }, inventoryUnit: true },
      }),
      this.prisma.plot.count({ where }),
    ]);

    return { data: plots, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findPlotById(id: string) {
    const plot = await this.prisma.plot.findUnique({
      where: { id, deletedAt: null },
      include: { project: true, inventoryUnit: { include: { bookings: true } } },
    });
    if (!plot) throw new NotFoundException('Plot not found');
    return plot;
  }

  async updatePlot(id: string, data: Partial<CreatePlotDto>, currentUser: User) {
    const plot = await this.findPlotById(id);
    const updateData: any = { ...data };
    if (data.plotSize) updateData.plotSize = new Prisma.Decimal(data.plotSize);
    if (data.priceValue) updateData.priceValue = new Prisma.Decimal(data.priceValue);
    if (data.pricePerSqft) updateData.pricePerSqft = new Prisma.Decimal(data.pricePerSqft);
    if (data.roadWidth) updateData.roadWidth = new Prisma.Decimal(data.roadWidth);

    const updated = await this.prisma.plot.update({
      where: { id },
      data: updateData,
      include: { project: true, inventoryUnit: true },
    });

    if (data.status || data.priceValue) {
      await this.prisma.inventoryUnit.update({
        where: { plotId: id },
        data: { status: data.status, priceValue: data.priceValue ? new Prisma.Decimal(data.priceValue) : undefined },
      });
    }

    return updated;
  }

  async deletePlot(id: string, currentUser: User) {
    const plot = await this.findPlotById(id);
    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      throw new ForbiddenException('Only admins can delete plots');
    }

    const bookings = await this.prisma.booking.count({ where: { inventoryUnit: { plotId: id } } });
    if (bookings > 0) throw new ConflictException('Cannot delete plot with existing bookings');

    await this.prisma.$transaction([
      this.prisma.inventoryUnit.delete({ where: { plotId: id } }),
      this.prisma.plot.update({ where: { id }, data: { deletedAt: new Date() } }),
    ]);

    return { success: true };
  }

  // ============ INVENTORY UNITS ============
  async createInventoryUnit(createDto: CreateInventoryUnitDto, currentUser: User) {
    const project = await this.prisma.project.findUnique({ where: { id: createDto.projectId } });
    if (!project) throw new NotFoundException('Project not found');

    if (createDto.villaId) {
      const villa = await this.prisma.villa.findUnique({ where: { id: createDto.villaId } });
      if (!villa || villa.projectId !== createDto.projectId) throw new ConflictException('Villa not found in project');
    }
    if (createDto.plotId) {
      const plot = await this.prisma.plot.findUnique({ where: { id: createDto.plotId } });
      if (!plot || plot.projectId !== createDto.projectId) throw new ConflictException('Plot not found in project');
    }
    if (createDto.propertyId) {
      const property = await this.prisma.property.findUnique({ where: { id: createDto.propertyId } });
      if (!property || property.projectId !== createDto.projectId) throw new ConflictException('Property not found in project');
    }

    const existing = await this.prisma.inventoryUnit.findFirst({
      where: { projectId: createDto.projectId, unitNumber: createDto.unitNumber },
    });
    if (existing) throw new ConflictException('Inventory unit with this number already exists');

    return this.prisma.inventoryUnit.create({
      data: {
        ...createDto,
        priceValue: new Prisma.Decimal(createDto.priceValue),
      },
      include: {
        project: { select: { id: true, name: true } },
        property: { select: { id: true, name: true } },
        villa: { select: { id: true, unitNumber: true } },
        plot: { select: { id: true, unitNumber: true } },
      },
    });
  }

  async findAll(query: InventoryQueryDto, currentUser: User) {
    const { page = 1, limit = 20, projectId, propertyId, unitType, status, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.InventoryUnitWhereInput = { deletedAt: null };
    if (projectId) where.projectId = projectId;
    if (propertyId) where.propertyId = propertyId;
    if (unitType) where.unitType = unitType;
    if (status) where.status = status;

    const [units, total] = await Promise.all([
      this.prisma.inventoryUnit.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          project: { select: { id: true, name: true } },
          property: { select: { id: true, name: true } },
          villa: { select: { id: true, unitNumber: true } },
          plot: { select: { id: true, unitNumber: true } },
          _count: { select: { bookings: true } },
        },
      }),
      this.prisma.inventoryUnit.count({ where }),
    ]);

    return { data: units, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string, currentUser: User) {
    const unit = await this.prisma.inventoryUnit.findUnique({
      where: { id, deletedAt: null },
      include: {
        project: true,
        property: { include: { categories: true } },
        villa: { include: { project: true } },
        plot: { include: { project: true } },
        bookings: { include: { customer: { select: { firstName: true, lastName: true } } } },
      },
    });
    if (!unit) throw new NotFoundException('Inventory unit not found');
    return unit;
  }

  async update(id: string, updateDto: UpdateInventoryUnitDto, currentUser: User) {
    const unit = await this.findById(id, currentUser);

    // Prevent status changes that would cause conflicts
    if (updateDto.status && updateDto.status !== unit.status) {
      if (unit.status === InventoryStatus.SOLD && updateDto.status !== InventoryStatus.SOLD) {
        throw new ConflictException('Cannot change status of sold unit');
      }
      if (unit.status === InventoryStatus.BOOKED && updateDto.status === InventoryStatus.AVAILABLE) {
        const activeBooking = await this.prisma.booking.findFirst({
          where: { inventoryUnitId: id, status: { in: ['PENDING', 'CONFIRMED'] } },
        });
        if (activeBooking) throw new ConflictException('Cannot make unit available while booked');
      }
    }

    const updated = await this.prisma.inventoryUnit.update({
      where: { id },
      data: {
        ...updateDto,
        priceValue: updateDto.priceValue ? new Prisma.Decimal(updateDto.priceValue) : undefined,
        holdExpiresAt: updateDto.holdExpiresAt ? new Date(updateDto.holdExpiresAt) : undefined,
      },
      include: {
        project: { select: { id: true, name: true } },
        property: { select: { id: true, name: true } },
        villa: { select: { id: true, unitNumber: true } },
        plot: { select: { id: true, unitNumber: true } },
      },
    });

    // Sync with villa/plot if linked
    if (unit.villaId && (updateDto.status || updateDto.priceValue)) {
      await this.prisma.villa.update({
        where: { id: unit.villaId },
        data: { status: updateDto.status, priceValue: updateDto.priceValue ? new Prisma.Decimal(updateDto.priceValue) : undefined },
      });
    }
    if (unit.plotId && (updateDto.status || updateDto.priceValue)) {
      await this.prisma.plot.update({
        where: { id: unit.plotId },
        data: { status: updateDto.status, priceValue: updateDto.priceValue ? new Prisma.Decimal(updateDto.priceValue) : undefined },
      });
    }

    return updated;
  }

  async holdUnit(id: string, expiresAt: Date, reason: string, currentUser: User) {
    const unit = await this.findById(id, currentUser);
    if (unit.status !== InventoryStatus.AVAILABLE) {
      throw new ConflictException('Can only hold available units');
    }

    return this.prisma.inventoryUnit.update({
      where: { id },
      data: { status: InventoryStatus.HOLD, holdExpiresAt: expiresAt, holdReason: reason },
    });
  }

  async releaseHold(id: string, currentUser: User) {
    const unit = await this.findById(id, currentUser);
    if (unit.status !== InventoryStatus.HOLD) {
      throw new ConflictException('Unit is not on hold');
    }

    return this.prisma.inventoryUnit.update({
      where: { id },
      data: { status: InventoryStatus.AVAILABLE, holdExpiresAt: null, holdReason: null },
    });
  }

  async delete(id: string, currentUser: User) {
    const unit = await this.findById(id, currentUser);
    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      throw new ForbiddenException('Only admins can delete inventory units');
    }

    const bookings = await this.prisma.booking.count({ where: { inventoryUnitId: id } });
    if (bookings > 0) throw new ConflictException('Cannot delete unit with existing bookings');

    // Sync delete with villa/plot
    await this.prisma.$transaction(async (tx) => {
      await tx.inventoryUnit.update({ where: { id }, data: { deletedAt: new Date() } });
    });

    return { success: true };
  }

  async getInventoryStats(projectId: string, currentUser: User) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Project not found');

    const [total, available, hold, booked, sold, blocked, totalValue] = await Promise.all([
      this.prisma.inventoryUnit.count({ where: { projectId, deletedAt: null } }),
      this.prisma.inventoryUnit.count({ where: { projectId, status: InventoryStatus.AVAILABLE, deletedAt: null } }),
      this.prisma.inventoryUnit.count({ where: { projectId, status: InventoryStatus.HOLD, deletedAt: null } }),
      this.prisma.inventoryUnit.count({ where: { projectId, status: InventoryStatus.BOOKED, deletedAt: null } }),
      this.prisma.inventoryUnit.count({ where: { projectId, status: InventoryStatus.SOLD, deletedAt: null } }),
      this.prisma.inventoryUnit.count({ where: { projectId, status: InventoryStatus.BLOCKED, deletedAt: null } }),
      this.prisma.inventoryUnit.aggregate({
        where: { projectId, deletedAt: null },
        _sum: { priceValue: true },
      }),
    ]);

    return {
      total,
      available,
      hold,
      booked,
      sold,
      blocked,
      totalValue: totalValue._sum.priceValue || 0,
      availabilityRate: total > 0 ? ((available / total) * 100).toFixed(2) : 0,
    };
  }
}