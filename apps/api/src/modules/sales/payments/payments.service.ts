import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePaymentDto, UpdatePaymentDto, VerifyPaymentDto, PaymentQueryDto } from './dto/payment.dto';
import { User, RoleType, PaymentStatus, PaymentType, BookingStatus, Prisma } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto, currentUser: User) {
    // Verify booking exists
    const booking = await this.prisma.booking.findUnique({
      where: { id: createPaymentDto.bookingId },
      include: { payments: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.status === BookingStatus.CANCELLED || booking.status === BookingStatus.EXPIRED) {
      throw new ConflictException('Cannot create payment for cancelled/expired booking');
    }

    // Check total paid amount doesn't exceed total price
    const totalPaid = booking.payments
      .filter(p => p.status === PaymentStatus.COMPLETED)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    if (totalPaid + createPaymentDto.amount > Number(booking.totalPrice) + Number(booking.taxAmount)) {
      throw new ConflictException('Payment amount exceeds total booking value');
    }

    // Generate payment number
    const paymentNumber = await this.generatePaymentNumber();

    const payment = await this.prisma.payment.create({
      data: {
        ...createPaymentDto,
        paymentNumber: await this.generatePaymentNumber(),
        amount: new Prisma.Decimal(createPaymentDto.amount),
        userId: currentUser.id,
        paidAt: createPaymentDto.paidAt ? new Date(createPaymentDto.paidAt) : undefined,
      },
      include: {
        booking: { select: { id: true, bookingNumber: true, totalPrice: true } },
        customer: { select: { id: true, firstName: true, lastName: true } },
        user: { select: { id: true, fullName: true } },
        verifiedBy: { select: { id: true, fullName: true } },
      },
    });

    // Create activity on lead
    await this.prisma.leadActivity.create({
      data: {
        leadId: booking.leadId,
        userId: currentUser.id,
        type: 'PAYMENT_RECEIVED',
        description: `Payment of ₹${createPaymentDto.amount.toLocaleString()} received for booking ${booking.bookingNumber}`,
        metadata: { paymentId: payment.id, type: createPaymentDto.type, amount: createPaymentDto.amount },
      },
    });

    return payment;
  }

  async findAll(query: PaymentQueryDto, currentUser: User) {
    const { page = 1, limit = 20, search, bookingId, customerId, userId, type, status, fromDate, toDate, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.PaymentWhereInput = {};

    // Role-based filtering
    if (currentUser.roleId === RoleType.SALES || currentUser.roleId === RoleType.CP) {
      where.OR = [
        { userId: currentUser.id },
        { booking: { userId: currentUser.id } },
        { booking: { cpId: (currentUser as any).channelPartnerId } },
      ];
    }

    if (search) {
      where.OR = [
        { paymentNumber: { contains: search, mode: 'insensitive' } },
        { transactionId: { contains: search } },
        { referenceNumber: { contains: search } },
      ];
    }

    if (bookingId) where.bookingId = bookingId;
    if (customerId) where.customerId = customerId;
    if (userId) where.userId = userId;
    if (type) where.type = type;
    if (status) where.status = status;

    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt.gte = new Date(fromDate);
      if (toDate) where.createdAt.lte = new Date(toDate);
    }

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          booking: { select: { id: true, bookingNumber: true, totalPrice: true } },
          customer: { select: { id: true, firstName: true, lastName: true } },
          user: { select: { id: true, fullName: true } },
          verifiedBy: { select: { id: true, fullName: true } },
        },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return { data: payments, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string, currentUser: User) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        booking: { include: { lead: { select: { id: true, name: true } }, project: { select: { name: true } } } },
        customer: { select: { id: true, firstName: true, lastName: true } },
        user: { select: { id: true, fullName: true } },
        verifiedBy: { select: { id: true, fullName: true } },
      },
    });

    if (!payment) throw new NotFoundException('Payment not found');

    if (!this.canAccess(payment, currentUser)) {
      throw new ForbiddenException('Access denied');
    }

    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto, currentUser: User) {
    const payment = await this.findById(id, currentUser);

    if (!this.canUpdate(payment, currentUser)) {
      throw new ForbiddenException('Cannot update this payment');
    }

    return this.prisma.payment.update({
      where: { id },
      data: {
        ...updatePaymentDto,
        amount: updatePaymentDto.amount ? new Prisma.Decimal(updatePaymentDto.amount) : undefined,
        paidAt: updatePaymentDto.paidAt ? new Date(updatePaymentDto.paidAt) : undefined,
        verifiedAt: updatePaymentDto.verifiedAt ? new Date(updatePaymentDto.verifiedAt) : undefined,
      },
      include: {
        booking: { select: { id: true, bookingNumber: true } },
        customer: { select: { id: true, firstName: true, lastName: true } },
        user: { select: { id: true, fullName: true } },
      },
    });
  }

  async verify(id: string, verifyPaymentDto: VerifyPaymentDto, currentUser: User) {
    const payment = await this.findById(id, currentUser);

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN && currentUser.roleId !== RoleType.FINANCE && currentUser.roleId !== RoleType.MANAGER) {
      throw new ForbiddenException('Only finance/managers can verify payments');
    }

    if (payment.status === PaymentStatus.COMPLETED && verifyPaymentDto.status === 'FAILED') {
      throw new ConflictException('Cannot mark completed payment as failed');
    }

    const updated = await this.prisma.payment.update({
      where: { id },
      data: {
        status: verifyPaymentDto.status,
        verifiedAt: new Date(),
        verifiedById: currentUser.id,
        notes: verifyPaymentDto.notes ? `${payment.notes || ''}\n[Verification] ${verifyPaymentDto.notes}`.trim() : payment.notes,
      },
      include: {
        booking: { select: { id: true, bookingNumber: true, leadId: true } },
        customer: { select: { id: true, firstName: true, lastName: true } },
        verifiedBy: { select: { id: true, fullName: true } },
      },
    });

    // Update booking payment status if all payments completed
    if (verifyPaymentDto.status === 'COMPLETED') {
      await this.checkAndUpdateBookingPaymentStatus(payment.bookingId);
    }

    return updated;
  }

  async delete(id: string, currentUser: User) {
    const payment = await this.findById(id, currentUser);

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      throw new ForbiddenException('Only admins can delete payments');
    }

    if (payment.status === PaymentStatus.COMPLETED) {
      throw new ConflictException('Cannot delete completed payment');
    }

    await this.prisma.payment.delete({ where: { id } });
    return { success: true };
  }

  async getPaymentStats(currentUser: User) {
    const where: Prisma.PaymentWhereInput = {};

    if (currentUser.roleId === RoleType.SALES || currentUser.roleId === RoleType.CP) {
      where.OR = [
        { userId: currentUser.id },
        { booking: { userId: currentUser.id } },
      ];
    }

    const [total, byStatus, byType, thisMonth, totalCollected] = await Promise.all([
      this.prisma.payment.count({ where }),
      this.prisma.payment.groupBy({ by: ['status'], where, _count: { status: true }, _sum: { amount: true } }),
      this.prisma.payment.groupBy({ by: ['type'], where, _count: { type: true }, _sum: { amount: true } }),
      this.prisma.payment.count({ where: { ...where, createdAt: { gte: new Date(new Date().setDate(1)) } } }),
      this.prisma.payment.aggregate({
        where: { ...where, status: PaymentStatus.COMPLETED },
        _sum: { amount: true },
      }),
    ]);

    return {
      total,
      thisMonth,
      totalCollected: totalCollected._sum.amount || 0,
      byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item.status]: { count: item._count.status, amount: item._sum.amount || 0 } }), {}),
      byType: byType.reduce((acc, item) => ({ ...acc, [item.type]: { count: item._count.type, amount: item._sum.amount || 0 } }), {}),
    };
  }

  private async generatePaymentNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.payment.count({
      where: { paymentNumber: { startsWith: `PAY-${year}-` } },
    });
    return `PAY-${year}-${String(count + 1).padStart(6, '0')}`;
  }

  private async checkAndUpdateBookingPaymentStatus(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payments: { where: { status: PaymentStatus.COMPLETED } } },
    });

    if (!booking) return;

    const totalPaid = booking.payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const totalDue = Number(booking.totalPrice) + Number(booking.taxAmount);

    if (totalPaid >= totalDue && booking.status !== BookingStatus.COMPLETED) {
      await this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.COMPLETED },
      });
    }
  }

  private canAccess(payment: any, user: User): boolean {
    if (user.roleId === RoleType.SUPER_ADMIN || user.roleId === RoleType.ADMIN || user.roleId === RoleType.FINANCE || user.roleId === RoleType.MANAGER) return true;
    if (payment.userId === user.id) return true;
    if (payment.booking?.userId === user.id) return true;
    if (payment.booking?.cpId === (user as any).channelPartnerId) return true;
    return false;
  }

  private canUpdate(payment: any, user: User): boolean {
    if (user.roleId === RoleType.SUPER_ADMIN || user.roleId === RoleType.ADMIN || user.roleId === RoleType.FINANCE || user.roleId === RoleType.MANAGER) return true;
    if (payment.userId === user.id) return true;
    if (payment.booking?.userId === user.id) return true;
    return false;
  }
}