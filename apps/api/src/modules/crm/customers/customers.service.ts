import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { User, RoleType } from '@prisma/client';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto, currentUser: User) {
    // Verify lead exists and is converted
    const lead = await this.prisma.lead.findUnique({
      where: { id: createCustomerDto.leadId },
    });
    if (!lead) throw new NotFoundException('Lead not found');
    if (lead.status !== 'CONVERTED') {
      throw new ConflictException('Can only create customer from converted lead');
    }

    // Check if customer already exists for this lead
    const existing = await this.prisma.customer.findUnique({
      where: { leadId: createCustomerDto.leadId },
    });
    if (existing) throw new ConflictException('Customer already exists for this lead');

    const customer = await this.prisma.customer.create({
      data: {
        ...createCustomerDto,
      },
      include: {
        lead: { select: { id: true, name: true, project: { select: { name: true } } } },
      },
    });

    // Create activity on lead
    await this.prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        userId: currentUser.id,
        type: 'CUSTOMER_CREATED',
        description: 'Customer profile created from lead',
        metadata: { customerId: customer.id },
      },
    });

    return customer;
  }

  async findAll(params: { page?: number; limit?: number; search?: string; kycStatus?: string }, currentUser: User) {
    const { page = 1, limit = 20, search, kycStatus } = params;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (currentUser.roleId === RoleType.SALES || currentUser.roleId === RoleType.CP) {
      where.OR = [
        { lead: { assignedUserId: currentUser.id } },
        { lead: { assignedCp: { users: { some: { userId: currentUser.id } } } } },
      ];
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    if (kycStatus) where.kycStatus = kycStatus;

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          lead: { select: { id: true, name: true, project: { select: { name: true } } } },
          bookings: { select: { id: true, status: true, inventoryUnit: { select: { unitNumber: true } } } },
        },
      }),
      this.prisma.customer.count({ where }),
    ]);

    return { data: customers, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string, currentUser: User) {
    const customer = await this.prisma.customer.findUnique({
      where: { id, deletedAt: null },
      include: {
        lead: { include: { project: true, property: true, assignedUser: { select: { id: true, fullName: true } } } },
        bookings: { include: { inventoryUnit: true, project: { select: { name: true } } } },
      },
    });

    if (!customer) throw new NotFoundException('Customer not found');

    if (!this.canAccess(customer, currentUser)) {
      throw new ForbiddenException('Access denied');
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto, currentUser: User) {
    const customer = await this.findById(id, currentUser);

    const updated = await this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
      include: { lead: { select: { id: true, name: true } } },
    });

    await this.prisma.leadActivity.create({
      data: {
        leadId: customer.leadId,
        userId: currentUser.id,
        type: 'CUSTOMER_UPDATED',
        description: 'Customer profile updated',
      },
    });

    return updated;
  }

  async verifyKyc(id: string, currentUser: User) {
    const customer = await this.findById(id, currentUser);

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN && currentUser.roleId !== RoleType.MANAGER) {
      throw new ForbiddenException('Only managers can verify KYC');
    }

    const updated = await this.prisma.customer.update({
      where: { id },
      data: { kycStatus: 'VERIFIED', kycVerifiedAt: new Date() },
    });

    await this.prisma.leadActivity.create({
      data: {
        leadId: customer.leadId,
        userId: currentUser.id,
        type: 'KYC_VERIFIED',
        description: 'Customer KYC verified',
      },
    });

    return updated;
  }

  async delete(id: string, currentUser: User) {
    const customer = await this.findById(id, currentUser);

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      throw new ForbiddenException('Only admins can delete customers');
    }

    await this.prisma.customer.update({ where: { id }, data: { deletedAt: new Date() } });
    return { success: true };
  }

  private canAccess(customer: any, user: User): boolean {
    if (user.roleId === RoleType.SUPER_ADMIN || user.roleId === RoleType.ADMIN || user.roleId === RoleType.MANAGER) return true;
    if (customer.lead?.assignedUserId === user.id) return true;
    if (customer.lead?.assignedCp?.users?.some((u: any) => u.userId === user.id)) return true;
    return false;
  }
}