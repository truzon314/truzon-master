import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateAgreementDto, UpdateAgreementDto, AgreementQueryDto } from './dto/agreement.dto';
import { User, RoleType, AgreementStatus, BookingStatus, Prisma } from '@prisma/client';

@Injectable()
export class AgreementsService {
  constructor(private prisma: PrismaService) {}

  async create(createAgreementDto: CreateAgreementDto, currentUser: User) {
    // Verify booking exists and is confirmed/completed
    const booking = await this.prisma.booking.findUnique({
      where: { id: createAgreementDto.bookingId },
      include: { agreements: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.status !== BookingStatus.CONFIRMED && booking.status !== BookingStatus.COMPLETED) {
      throw new ConflictException('Can only create agreement for confirmed/completed booking');
    }

    // Check if agreement already exists
    if (booking.agreements.length > 0) {
      throw new ConflictException('Agreement already exists for this booking');
    }

    // Verify customer
    const customer = await this.prisma.customer.findUnique({
      where: { id: createAgreementDto.customerId },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    if (customer.leadId !== booking.leadId) {
      throw new ConflictException('Customer does not match booking lead');
    }

    // Generate agreement number
    const agreementNumber = await this.generateAgreementNumber();

    const agreement = await this.prisma.agreement.create({
      data: {
        ...createAgreementDto,
        userId: currentUser.id,
        agreementNumber,
      },
      include: {
        booking: { select: { id: true, bookingNumber: true } },
        customer: { select: { id: true, firstName: true, lastName: true } },
        user: { select: { id: true, fullName: true } },
        template: { select: { id: true, name: true, type: true } },
        document: { select: { id: true, name: true, file: { select: { url: true } } } },
      },
    });

    return agreement;
  }

  async findAll(query: AgreementQueryDto, currentUser: User) {
    const { page = 1, limit = 20, search, bookingId, customerId, userId, status, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.AgreementWhereInput = {};

    // Role-based filtering
    if (currentUser.roleId === RoleType.SALES || currentUser.roleId === RoleType.CP) {
      where.OR = [
        { userId: currentUser.id },
        { booking: { userId: currentUser.id } },
      ];
    }

    if (search) {
      where.OR = [
        { agreementNumber: { contains: search, mode: 'insensitive' } },
        { customer: { firstName: { contains: search, mode: 'insensitive' } } },
        { customer: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (bookingId) where.bookingId = bookingId;
    if (customerId) where.customerId = customerId;
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const [agreements, total] = await Promise.all([
      this.prisma.agreement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          booking: { select: { id: true, bookingNumber: true } },
          customer: { select: { id: true, firstName: true, lastName: true } },
          user: { select: { id: true, fullName: true } },
          template: { select: { id: true, name: true } },
          document: { select: { id: true, name: true, file: { select: { url: true } } } },
        },
      }),
      this.prisma.agreement.count({ where }),
    ]);

    return { data: agreements, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string, currentUser: User) {
    const agreement = await this.prisma.agreement.findUnique({
      where: { id },
      include: {
        booking: { include: { lead: { select: { id: true, name: true } }, project: { select: { name: true } } } },
        customer: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        user: { select: { id: true, fullName: true } },
        template: { select: { id: true, name: true, type: true } },
        document: { include: { file: true } },
      },
    });

    if (!agreement) throw new NotFoundException('Agreement not found');

    if (!this.canAccess(agreement, currentUser)) {
      throw new ForbiddenException('Access denied');
    }

    return agreement;
  }

  async update(id: string, updateAgreementDto: UpdateAgreementDto, currentUser: User) {
    const agreement = await this.findById(id, currentUser);

    if (!this.canUpdate(agreement, currentUser)) {
      throw new ForbiddenException('Cannot update this agreement');
    }

    const previousStatus = agreement.status;
    const data: any = { ...updateAgreementDto };

    if (updateAgreementDto.status && updateAgreementDto.status !== agreement.status) {
      if (!this.isValidStatusTransition(agreement.status, updateAgreementDto.status)) {
        throw new ConflictException(`Invalid status transition from ${agreement.status} to ${updateAgreementDto.status}`);
      }

      if (updateAgreementDto.status === AgreementStatus.SIGNED) {
        data.signedAt = new Date();
      } else if (updateAgreementDto.status === AgreementStatus.CANCELLED) {
        data.cancelledAt = new Date();
        if (!updateAgreementDto.cancellationReason) {
          throw new ConflictException('Cancellation reason is required');
        }
      }
    }

    const updated = await this.prisma.agreement.update({
      where: { id },
      data,
      include: {
        booking: { select: { id: true, bookingNumber: true } },
        customer: { select: { id: true, firstName: true, lastName: true } },
        user: { select: { id: true, fullName: true } },
        template: { select: { id: true, name: true } },
        document: { select: { id: true, name: true } },
      },
    });

    // Create activity on lead
    if (updateAgreementDto.status && updateAgreementDto.status !== previousStatus) {
      await this.prisma.leadActivity.create({
        data: {
          leadId: agreement.booking.leadId,
          userId: currentUser.id,
          type: 'AGREEMENT_STATUS_CHANGE',
          description: `Agreement status changed to ${updateAgreementDto.status}`,
          metadata: { agreementId: agreement.id, previousStatus, newStatus: updateAgreementDto.status },
        },
      });
    }

    return updated;
  }

  async sign(id: string, currentUser: User) {
    const agreement = await this.findById(id, currentUser);

    if (agreement.status !== AgreementStatus.PENDING_SIGNATURE && agreement.status !== AgreementStatus.DRAFT) {
      throw new ConflictException('Agreement is not pending signature');
    }

    if (!agreement.document) {
      throw new ConflictException('No document attached for signing');
    }

    return this.update(id, { status: AgreementStatus.SIGNED }, currentUser);
  }

  async cancel(id: string, reason: string, currentUser: User) {
    const agreement = await this.findById(id, currentUser);

    if (agreement.status === AgreementStatus.SIGNED) {
      throw new ConflictException('Cannot cancel signed agreement');
    }

    return this.update(id, { status: AgreementStatus.CANCELLED, cancellationReason: reason }, currentUser);
  }

  async linkDocument(id: string, documentId: string, currentUser: User) {
    const agreement = await this.findById(id, currentUser);

    if (agreement.status !== AgreementStatus.DRAFT && agreement.status !== AgreementStatus.PENDING_SIGNATURE) {
      throw new ConflictException('Can only link document to draft/pending agreements');
    }

    return this.prisma.agreement.update({
      where: { id },
      data: { documentId },
      include: { document: { include: { file: true } } },
    });
  }

  async delete(id: string, currentUser: User) {
    const agreement = await this.findById(id, currentUser);

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      throw new ForbiddenException('Only admins can delete agreements');
    }

    if (agreement.status === AgreementStatus.SIGNED) {
      throw new ConflictException('Cannot delete signed agreement');
    }

    await this.prisma.agreement.delete({ where: { id } });
    return { success: true };
  }

  async getAgreementStats(currentUser: User) {
    const where: Prisma.AgreementWhereInput = {};

    if (currentUser.roleId === RoleType.SALES || currentUser.roleId === RoleType.CP) {
      where.OR = [
        { userId: currentUser.id },
        { booking: { userId: currentUser.id } },
      ];
    }

    const [total, byStatus, signedThisMonth, expiringSoon] = await Promise.all([
      this.prisma.agreement.count({ where }),
      this.prisma.agreement.groupBy({ by: ['status'], where, _count: { status: true } }),
      this.prisma.agreement.count({
        where: {
          ...where,
          status: AgreementStatus.SIGNED,
          signedAt: { gte: new Date(new Date().setDate(1)) },
        },
      }),
      this.prisma.agreement.count({
        where: {
          ...where,
          status: AgreementStatus.PENDING_SIGNATURE,
          expiresAt: { lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    return {
      total,
      signedThisMonth,
      expiringSoon,
      byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item.status]: item._count.status }), {}),
    };
  }

  private async generateAgreementNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.agreement.count({
      where: { agreementNumber: { startsWith: `AGR-${year}-` } },
    });
    return `AGR-${year}-${String(count + 1).padStart(6, '0')}`;
  }

  private isValidStatusTransition(from: AgreementStatus, to: AgreementStatus): boolean {
    const validTransitions: Record<AgreementStatus, AgreementStatus[]> = {
      [AgreementStatus.DRAFT]: [AgreementStatus.PENDING_SIGNATURE, AgreementStatus.CANCELLED],
      [AgreementStatus.PENDING_SIGNATURE]: [AgreementStatus.SIGNED, AgreementStatus.CANCELLED, AgreementStatus.EXPIRED],
      [AgreementStatus.SIGNED]: [AgreementStatus.CANCELLED],
      [AgreementStatus.EXPIRED]: [],
      [AgreementStatus.CANCELLED]: [],
    };
    return validTransitions[from]?.includes(to) || false;
  }

  private canAccess(agreement: any, user: User): boolean {
    if (user.roleId === RoleType.SUPER_ADMIN || user.roleId === RoleType.ADMIN || user.roleId === RoleType.MANAGER || user.roleId === RoleType.FINANCE) return true;
    if (agreement.userId === user.id) return true;
    if (agreement.booking?.userId === user.id) return true;
    return false;
  }

  private canUpdate(agreement: any, user: User): boolean {
    if (user.roleId === RoleType.SUPER_ADMIN || user.roleId === RoleType.ADMIN || user.roleId === RoleType.MANAGER) return true;
    if (agreement.userId === user.id) return true;
    if (agreement.booking?.userId === user.id) return true;
    return false;
  }
}