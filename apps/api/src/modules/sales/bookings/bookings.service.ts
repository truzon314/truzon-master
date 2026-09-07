import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateBookingDto, UpdateBookingDto, BookingQueryDto } from './dto/booking.dto';
import { User, RoleType, BookingStatus, InventoryStatus, Prisma } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto, currentUser: User) {
    // Verify lead exists
    const lead = await this.prisma.lead.findUnique({
      where: { id: createBookingDto.leadId },
      include: { assignedUser: true, project: true },
    });
    if (!lead) throw new NotFoundException('Lead not found');

    // Verify project
    const project = await this.prisma.project.findUnique({
      where: { id: createBookingDto.projectId },
    });
    if (!project) throw new NotFoundException('Project not found');

    // Verify inventory unit is available
    const inventoryUnit = await this.prisma.inventoryUnit.findUnique({
      where: { id: createBookingDto.inventoryUnitId },
      include: { bookings: { where: { status: { in: ['PENDING', 'CONFIRMED'] } } } },
    });
    if (!inventoryUnit) throw new NotFoundException('Inventory unit not found');
    if (inventoryUnit.projectId !== createBookingDto.projectId) {
      throw new ConflictException('Inventory unit does not belong to this project');
    }
    if (inventoryUnit.status !== InventoryStatus.AVAILABLE) {
      throw new ConflictException(`Inventory unit is ${inventoryUnit.status.toLowerCase()}, not available for booking`);
    }
    if (inventoryUnit.bookings.length > 0) {
      throw new ConflictException('Inventory unit already has an active booking');
    }

    // Verify property if provided
    if (createBookingDto.propertyId) {
      const property = await this.prisma.property.findUnique({
        where: { id: createBookingDto.propertyId },
      });
      if (!property || property.projectId !== createBookingDto.projectId) {
        throw new ConflictException('Property not found in this project');
      }
    }

    // Verify CP if provided
    if (createBookingDto.cpId) {
      const cp = await this.prisma.channelPartner.findUnique({
        where: { id: createBookingDto.cpId },
      });
      if (!cp) throw new NotFoundException('Channel partner not found');
    }

    // Generate booking number
    const bookingNumber = await this.generateBookingNumber();

    // Use transaction to ensure atomicity
    const booking = await this.prisma.$transaction(async (tx) => {
      // Create booking
      const booking = await tx.booking.create({
        data: {
          ...createBookingDto,
          bookingAmount: new Prisma.Decimal(createBookingDto.bookingAmount),
          totalPrice: new Prisma.Decimal(createBookingDto.totalPrice),
          discount: createBookingDto.discount ? new Prisma.Decimal(createBookingDto.discount) : new Prisma.Decimal(0),
          taxAmount: createBookingDto.taxAmount ? new Prisma.Decimal(createBookingDto.taxAmount) : new Prisma.Decimal(0),
          bookingNumber,
          userId: currentUser.id,
          expiryDate: createBookingDto.expiryDate ? new Date(createBookingDto.expiryDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        include: {
          lead: { select: { id: true, name: true, phone: true } },
          customer: { select: { id: true, firstName: true, lastName: true } },
          project: { select: { id: true, name: true } },
          property: { select: { id: true, name: true } },
          inventoryUnit: { select: { id: true, unitNumber: true, unitType: true } },
          user: { select: { id: true, fullName: true } },
          cp: { select: { id: true, name: true } },
        },
      });

      // Update inventory unit status to BOOKED
      await tx.inventoryUnit.update({
        where: { id: createBookingDto.inventoryUnitId },
        data: { status: InventoryStatus.BOOKED },
      });

      // Update lead status if applicable
      await tx.lead.update({
        where: { id: createBookingDto.leadId },
        data: { 
          status: 'BOOKED',
          lastActivityAt: new Date(),
        },
      });

      // Create activity on lead
      await tx.leadActivity.create({
        data: {
          leadId: createBookingDto.leadId,
          userId: currentUser.id,
          type: 'BOOKING_CREATED',
          description: `Booking created for unit ${inventoryUnit.unitNumber} in ${project.name}`,
          metadata: { bookingId: booking.id, inventoryUnitId: inventoryUnit.id },
        },
      });

      return booking;
    });

    return booking;
  }

  async findAll(query: BookingQueryDto, currentUser: User) {
    const { page = 1, limit = 20, search, leadId, customerId, projectId, propertyId, inventoryUnitId, userId, cpId, status, fromDate, toDate, sortBy = 'bookingDate', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.BookingWhereInput = { deletedAt: null };

    // Role-based filtering
    if (currentUser.roleId === RoleType.SALES || currentUser.roleId === RoleType.CP) {
      where.OR = [
        { userId: currentUser.id },
        { cpId: (currentUser as any).channelPartnerId },
        { lead: { assignedUserId: currentUser.id } },
        { lead: { assignedCp: { users: { some: { userId: currentUser.id } } } } },
      ];
    }

    if (search) {
      where.OR = [
        { bookingNumber: { contains: search, mode: 'insensitive' } },
        { lead: { name: { contains: search, mode: 'insensitive' } } },
        { customer: { firstName: { contains: search, mode: 'insensitive' } } },
        { customer: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (leadId) where.leadId = leadId;
    if (customerId) where.customerId = customerId;
    if (projectId) where.projectId = projectId;
    if (propertyId) where.propertyId = propertyId;
    if (inventoryUnitId) where.inventoryUnitId = inventoryUnitId;
    if (userId) where.userId = userId;
    if (cpId) where.cpId = cpId;
    if (status) where.status = status;

    if (fromDate || toDate) {
      where.bookingDate = {};
      if (fromDate) where.bookingDate.gte = new Date(fromDate);
      if (toDate) where.bookingDate.lte = new Date(toDate);
    }

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          lead: { select: { id: true, name: true, phone: true } },
          customer: { select: { id: true, firstName: true, lastName: true } },
          project: { select: { id: true, name: true } },
          property: { select: { id: true, name: true } },
          inventoryUnit: { select: { id: true, unitNumber: true, unitType: true } },
          user: { select: { id: true, fullName: true } },
          cp: { select: { id: true, name: true } },
          _count: { select: { payments: true, agreements: true } },
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return { data: bookings, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string, currentUser: User) {
    const booking = await this.prisma.booking.findUnique({
      where: { id, deletedAt: null },
      include: {
        lead: { include: { project: true, property: true } },
        customer: { include: { bookings: true } },
        project: { select: { id: true, name: true } },
        property: { select: { id: true, name: true } },
        inventoryUnit: { include: { property: true, villa: true, plot: true } },
        user: { select: { id: true, fullName: true } },
        cp: { select: { id: true, name: true } },
        payments: { orderBy: { createdAt: 'desc' } },
        agreements: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    if (!this.canAccess(booking, currentUser)) {
      throw new ForbiddenException('Access denied');
    }

    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto, currentUser: User) {
    const booking = await this.findById(id, currentUser);

    if (!this.canUpdate(booking, currentUser)) {
      throw new ForbiddenException('Cannot update this booking');
    }

    const previousStatus = booking.status;
    const data: any = { ...updateBookingDto };

    // Handle status transitions
    if (updateBookingDto.status && updateBookingDto.status !== booking.status) {
      if (!this.isValidStatusTransition(booking.status, updateBookingDto.status)) {
        throw new ConflictException(`Invalid status transition from ${booking.status} to ${updateBookingDto.status}`);
      }

      if (updateBookingDto.status === BookingStatus.CONFIRMED) {
        data.confirmationDate = new Date();
      } else if (updateBookingDto.status === BookingStatus.CANCELLED) {
        data.cancelledAt = new Date();
        data.cancelledById = currentUser.id;
        if (!updateBookingDto.cancellationReason) {
          throw new ConflictException('Cancellation reason is required');
        }

        // Release inventory unit
        await this.prisma.inventoryUnit.update({
          where: { id: booking.inventoryUnitId },
          data: { status: InventoryStatus.AVAILABLE },
        });
      } else if (updateBookingDto.status === BookingStatus.COMPLETED) {
        // Mark inventory as SOLD
        await this.prisma.inventoryUnit.update({
          where: { id: booking.inventoryUnitId },
          data: { status: InventoryStatus.SOLD },
        });

        // Update lead status
        await this.prisma.lead.update({
          where: { id: booking.leadId },
          data: { status: 'CONVERTED', convertedAt: new Date() },
        });
      }
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data,
      include: {
        lead: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
        inventoryUnit: { select: { id: true, unitNumber: true } },
        cp: { select: { id: true, name: true } },
      },
    });

    // Create activity on lead
    if (updateBookingDto.status && updateBookingDto.status !== previousStatus) {
      await this.prisma.leadActivity.create({
        data: {
          leadId: booking.leadId,
          userId: currentUser.id,
          type: 'BOOKING_STATUS_CHANGE',
          description: `Booking status changed to ${updateBookingDto.status}`,
          metadata: { bookingId: booking.id, previousStatus, newStatus: updateBookingDto.status },
        },
      });
    }

    return updated;
  }

  async confirm(id: string, currentUser: User) {
    const booking = await this.findById(id, currentUser);
    
    if (booking.status !== BookingStatus.PENDING) {
      throw new ConflictException('Can only confirm pending bookings');
    }

    return this.update(id, { status: BookingStatus.CONFIRMED }, currentUser);
  }

  async cancel(id: string, reason: string, currentUser: User) {
    const booking = await this.findById(id, currentUser);
    
    if (booking.status === BookingStatus.COMPLETED) {
      throw new ConflictException('Cannot cancel completed booking');
    }

    return this.update(id, { status: BookingStatus.CANCELLED, cancellationReason: reason }, currentUser);
  }

  async delete(id: string, currentUser: User) {
    const booking = await this.findById(id, currentUser);

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      throw new ForbiddenException('Only admins can delete bookings');
    }

    if (booking.status === BookingStatus.COMPLETED) {
      throw new ConflictException('Cannot delete completed booking');
    }

    await this.prisma.$transaction([
      this.prisma.booking.update({ where: { id }, data: { deletedAt: new Date() } }),
      this.prisma.inventoryUnit.update({
        where: { id: booking.inventoryUnitId },
        data: { status: InventoryStatus.AVAILABLE },
      }),
    ]);

    return { success: true };
  }

  async getBookingStats(currentUser: User) {
    const where: Prisma.BookingWhereInput = { deletedAt: null };

    if (currentUser.roleId === RoleType.SALES || currentUser.roleId === RoleType.CP) {
      where.OR = [
        { userId: currentUser.id },
        { cpId: (currentUser as any).channelPartnerId },
        { lead: { assignedUserId: currentUser.id } },
      ];
    }

    const [total, byStatus, thisMonth, totalValue] = await Promise.all([
      this.prisma.booking.count({ where }),
      this.prisma.booking.groupBy({ by: ['status'], where, _count: { status: true } }),
      this.prisma.booking.count({
        where: { ...where, bookingDate: { gte: new Date(new Date().setDate(1)) } },
      }),
      this.prisma.booking.aggregate({
        where: { ...where, status: { in: ['CONFIRMED', 'COMPLETED'] } },
        _sum: { totalPrice: true },
      }),
    ]);

    return {
      total,
      thisMonth,
      totalValue: totalValue._sum.totalPrice || 0,
      byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item.status]: item._count.status }), {}),
    };
  }

  private async generateBookingNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.booking.count({
      where: { bookingNumber: { startsWith: `BK-${year}-` } },
    });
    return `BK-${year}-${String(count + 1).padStart(6, '0')}`;
  }

  private isValidStatusTransition(from: BookingStatus, to: BookingStatus): boolean {
    const validTransitions: Record<BookingStatus, BookingStatus[]> = {
      [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED, BookingStatus.EXPIRED],
      [BookingStatus.CONFIRMED]: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
      [BookingStatus.COMPLETED]: [],
      [BookingStatus.CANCELLED]: [],
      [BookingStatus.EXPIRED]: [],
    };
    return validTransitions[from]?.includes(to) || false;
  }

  private canAccess(booking: any, user: User): boolean {
    if (user.roleId === RoleType.SUPER_ADMIN || user.roleId === RoleType.ADMIN || user.roleId === RoleType.MANAGER) return true;
    if (booking.userId === user.id) return true;
    if (booking.cpId === (user as any).channelPartnerId) return true;
    if (booking.lead?.assignedUserId === user.id) return true;
    if (booking.lead?.assignedCp?.users?.some((u: any) => u.userId === user.id)) return true;
    return false;
  }

  private canUpdate(booking: any, user: User): boolean {
    if (user.roleId === RoleType.SUPER_ADMIN || user.roleId === RoleType.ADMIN || user.roleId === RoleType.MANAGER) return true;
    if (booking.userId === user.id) return true;
    if (booking.cpId === (user as any).channelPartnerId) return true;
    return false;
  }
}