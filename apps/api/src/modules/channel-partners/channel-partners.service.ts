import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateChannelPartnerDto, UpdateChannelPartnerDto, CreateChannelPartnerUserDto, ChannelPartnerQueryDto } from './dto/channel-partner.dto';
import { User, RoleType, Prisma } from '@prisma/client';

@Injectable()
export class ChannelPartnersService {
  constructor(private prisma: PrismaService) {}

  async create(createChannelPartnerDto: CreateChannelPartnerDto, currentUser: User) {
    // Check if email already exists
    const existingEmail = await this.prisma.channelPartner.findUnique({
      where: { email: createChannelPartnerDto.email },
    });
    if (existingEmail) throw new ConflictException('Channel partner with this email already exists');

    // Check if phone already exists
    const existingPhone = await this.prisma.channelPartner.findFirst({
      where: { phone: createChannelPartnerDto.phone },
    });
    if (existingPhone) throw new ConflictException('Channel partner with this phone already exists');

    // Check if GST number already exists
    if (createChannelPartnerDto.gstNumber) {
      const existingGst = await this.prisma.channelPartner.findFirst({
        where: { gstNumber: createChannelPartnerDto.gstNumber },
      });
      if (existingGst) throw new ConflictException('Channel partner with this GST number already exists');
    }

    // Check if PAN number already exists
    if (createChannelPartnerDto.panNumber) {
      const existingPan = await this.prisma.channelPartner.findFirst({
        where: { panNumber: createChannelPartnerDto.panNumber },
      });
      if (existingPan) throw new ConflictException('Channel partner with this PAN number already exists');
    }

    const channelPartner = await this.prisma.channelPartner.create({
      data: {
        ...createChannelPartnerDto,
        commissionRate: new Prisma.Decimal(createChannelPartnerDto.commissionRate || 2.5),
        bankAccount: createChannelPartnerDto.bankAccount || {},
      },
      include: {
        users: {
          include: { user: { select: { id: true, fullName: true, email: true } } },
        },
        _count: { select: { assignedLeads: true, commissions: true } },
      },
    });

    return channelPartner;
  }

  async findAll(query: ChannelPartnerQueryDto, currentUser: User) {
    const { page = 1, limit = 20, search, status, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ChannelPartnerWhereInput = { deletedAt: null };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { contactPerson: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    if (status) where.status = status;

    // Non-admin users only see their own channel partner
    if (currentUser.roleId === RoleType.CP) {
      const cpUser = await this.prisma.channelPartnerUser.findUnique({
        where: { userId: currentUser.id },
      });
      if (cpUser) {
        where.id = cpUser.channelPartnerId;
      } else {
        return { data: [], meta: { page, limit, total: 0, totalPages: 0 } };
      }
    }

    const [channelPartners, total] = await Promise.all([
      this.prisma.channelPartner.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          users: { include: { user: { select: { id: true, fullName: true, email: true, phone: true } } } },
          _count: { select: { assignedLeads: true, commissions: true } },
        },
      }),
      this.prisma.channelPartner.count({ where }),
    ]);

    return { data: channelPartners, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string, currentUser: User) {
    const channelPartner = await this.prisma.channelPartner.findUnique({
      where: { id, deletedAt: null },
      include: {
        users: {
          include: { user: { select: { id: true, fullName: true, email: true, phone: true, status: true } } },
        },
        assignedLeads: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: { id: true, name: true, status: true, createdAt: true },
        },
        commissions: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: { id: true, amount: true, status: true, createdAt: true },
        },
      },
    });

    if (!channelPartner) throw new NotFoundException('Channel partner not found');

    if (currentUser.roleId === RoleType.CP) {
      const cpUser = await this.prisma.channelPartnerUser.findUnique({
        where: { userId: currentUser.id },
      });
      if (!cpUser || cpUser.channelPartnerId !== id) {
        throw new ForbiddenException('Access denied');
      }
    }

    return channelPartner;
  }

  async update(id: string, updateChannelPartnerDto: UpdateChannelPartnerDto, currentUser: User) {
    const channelPartner = await this.findById(id, currentUser);

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      throw new ForbiddenException('Only admins can update channel partners');
    }

    // Check unique constraints if updating
    if (updateChannelPartnerDto.email && updateChannelPartnerDto.email !== channelPartner.email) {
      const existing = await this.prisma.channelPartner.findUnique({ where: { email: updateChannelPartnerDto.email } });
      if (existing) throw new ConflictException('Email already exists');
    }
    if (updateChannelPartnerDto.phone && updateChannelPartnerDto.phone !== channelPartner.phone) {
      const existing = await this.prisma.channelPartner.findFirst({ where: { phone: updateChannelPartnerDto.phone } });
      if (existing) throw new ConflictException('Phone already exists');
    }
    if (updateChannelPartnerDto.gstNumber && updateChannelPartnerDto.gstNumber !== channelPartner.gstNumber) {
      const existing = await this.prisma.channelPartner.findFirst({ where: { gstNumber: updateChannelPartnerDto.gstNumber } });
      if (existing) throw new ConflictException('GST number already exists');
    }
    if (updateChannelPartnerDto.panNumber && updateChannelPartnerDto.panNumber !== channelPartner.panNumber) {
      const existing = await this.prisma.channelPartner.findFirst({ where: { panNumber: updateChannelPartnerDto.panNumber } });
      if (existing) throw new ConflictException('PAN number already exists');
    }

    const updated = await this.prisma.channelPartner.update({
      where: { id },
      data: {
        ...updateChannelPartnerDto,
        commissionRate: updateChannelPartnerDto.commissionRate ? new Prisma.Decimal(updateChannelPartnerDto.commissionRate) : undefined,
        bankAccount: updateChannelPartnerDto.bankAccount || undefined,
      },
      include: {
        users: { include: { user: { select: { id: true, fullName: true, email: true } } } },
        _count: { select: { assignedLeads: true, commissions: true } },
      },
    });

    return updated;
  }

  async addUser(id: string, createChannelPartnerUserDto: CreateChannelPartnerUserDto, currentUser: User) {
    const channelPartner = await this.findById(id, currentUser);

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      throw new ForbiddenException('Only admins can add channel partner users');
    }

    // Check if user already belongs to a channel partner
    const existingCpUser = await this.prisma.channelPartnerUser.findUnique({
      where: { userId: createChannelPartnerUserDto.userId },
    });
    if (existingCpUser) throw new ConflictException('User already belongs to a channel partner');

    // Verify user exists and has CP role
    const user = await this.prisma.user.findUnique({
      where: { id: createChannelPartnerUserDto.userId },
      include: { role: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (user.role.name !== RoleType.CP) {
      throw new ConflictException('User must have CP role');
    }

    // If setting as primary, unset other primary users
    if (createChannelPartnerUserDto.isPrimary) {
      await this.prisma.channelPartnerUser.updateMany({
        where: { channelPartnerId: id, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    const cpUser = await this.prisma.channelPartnerUser.create({
      data: {
        channelPartnerId: id,
        userId: createChannelPartnerUserDto.userId,
        role: createChannelPartnerUserDto.role,
        isPrimary: createChannelPartnerUserDto.isPrimary,
      },
      include: { user: { select: { id: true, fullName: true, email: true, phone: true } } },
    });

    return cpUser;
  }

  async removeUser(channelPartnerId: string, userId: string, currentUser: User) {
    await this.findById(channelPartnerId, currentUser);

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      throw new ForbiddenException('Only admins can remove channel partner users');
    }

    await this.prisma.channelPartnerUser.delete({
      where: { userId: userId },
    });

    return { success: true };
  }

  async delete(id: string, currentUser: User) {
    const channelPartner = await this.findById(id, currentUser);

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      throw new ForbiddenException('Only admins can delete channel partners');
    }

    // Check for dependencies
    const [leadsCount, commissionsCount] = await Promise.all([
      this.prisma.lead.count({ where: { assignedCpId: id } }),
      this.prisma.commission.count({ where: { channelPartnerId: id } }),
    ]);

    if (leadsCount > 0 || commissionsCount > 0) {
      throw new ConflictException('Cannot delete channel partner with existing leads or commissions');
    }

    await this.prisma.channelPartner.update({ where: { id }, data: { deletedAt: new Date() } });
    return { success: true };
  }

  async getChannelPartnerStats(id: string, currentUser: User) {
    await this.findById(id, currentUser);

    const [totalLeads, activeLeads, convertedLeads, totalCommissions, paidCommissions, pendingCommissions] = await Promise.all([
      this.prisma.lead.count({ where: { assignedCpId: id } }),
      this.prisma.lead.count({ where: { assignedCpId: id, status: { notIn: ['CONVERTED', 'LOST'] } } }),
      this.prisma.lead.count({ where: { assignedCpId: id, status: 'CONVERTED' } }),
      this.prisma.commission.aggregate({ where: { channelPartnerId: id }, _sum: { amount: true } }),
      this.prisma.commission.aggregate({ where: { channelPartnerId: id, status: 'PAID' }, _sum: { amount: true } }),
      this.prisma.commission.aggregate({ where: { channelPartnerId: id, status: { in: ['PENDING', 'APPROVED'] } }, _sum: { amount: true } }),
    ]);

    return {
      totalLeads,
      activeLeads,
      convertedLeads,
      conversionRate: totalLeads > 0 ? (convertedLeads / totalLeads * 100).toFixed(2) : 0,
      totalCommissions: totalCommissions._sum.amount || 0,
      paidCommissions: paidCommissions._sum.amount || 0,
      pendingCommissions: pendingCommissions._sum.amount || 0,
    };
  }
}