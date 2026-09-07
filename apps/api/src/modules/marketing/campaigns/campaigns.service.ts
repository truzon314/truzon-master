import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCampaignDto, UpdateCampaignDto, CampaignQueryDto } from './dto/campaign.dto';
import { User, RoleType, CampaignStatus, Prisma } from '@prisma/client';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  async create(createCampaignDto: CreateCampaignDto, currentUser: User) {
    // Verify source exists
    const source = await this.prisma.leadSource.findUnique({
      where: { id: createCampaignDto.sourceId },
    });
    if (!source) throw new NotFoundException('Lead source not found');

    // Check code uniqueness
    const existingCode = await this.prisma.campaign.findUnique({
      where: { code: createCampaignDto.code },
    });
    if (existingCode) throw new ConflictException('Campaign with this code already exists');

    const campaign = await this.prisma.campaign.create({
      data: {
        ...createCampaignDto,
        budget: createCampaignDto.budget ? new Prisma.Decimal(createCampaignDto.budget) : undefined,
        startDate: createCampaignDto.startDate ? new Date(createCampaignDto.startDate) : undefined,
        endDate: createCampaignDto.endDate ? new Date(createCampaignDto.endDate) : undefined,
      },
      include: {
        source: { select: { id: true, name: true, type: true } },
        _count: { select: { leads: true } },
      },
    });

    return campaign;
  }

  async findAll(query: CampaignQueryDto, currentUser: User) {
    const { page = 1, limit = 20, search, sourceId, status, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.CampaignWhereInput = { deletedAt: null };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (sourceId) where.sourceId = sourceId;
    if (status) where.status = status;

    const [campaigns, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          source: { select: { id: true, name: true, type: true } },
          _count: { select: { leads: true } },
        },
      }),
      this.prisma.campaign.count({ where }),
    ]);

    return { data: campaigns, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string, currentUser: User) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id, deletedAt: null },
      include: {
        source: { select: { id: true, name: true, type: true } },
        leads: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: { id: true, name: true, phone: true, status: true, createdAt: true },
        },
        _count: { select: { leads: true } },
      },
    });

    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async update(id: string, updateCampaignDto: UpdateCampaignDto, currentUser: User) {
    const campaign = await this.findById(id, currentUser);

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN && currentUser.roleId !== RoleType.MANAGER) {
      throw new ForbiddenException('Only managers can update campaigns');
    }

    if (updateCampaignDto.code && updateCampaignDto.code !== campaign.code) {
      const existing = await this.prisma.campaign.findUnique({ where: { code: updateCampaignDto.code } });
      if (existing) throw new ConflictException('Campaign with this code already exists');
    }

    const updated = await this.prisma.campaign.update({
      where: { id },
      data: {
        ...updateCampaignDto,
        budget: updateCampaignDto.budget ? new Prisma.Decimal(updateCampaignDto.budget) : undefined,
        startDate: updateCampaignDto.startDate ? new Date(updateCampaignDto.startDate) : undefined,
        endDate: updateCampaignDto.endDate ? new Date(updateCampaignDto.endDate) : undefined,
      },
      include: {
        source: { select: { id: true, name: true, type: true } },
        _count: { select: { leads: true } },
      },
    });

    return updated;
  }

  async activate(id: string, currentUser: User) {
    const campaign = await this.findById(id, currentUser);

    if (campaign.status !== CampaignStatus.DRAFT && campaign.status !== CampaignStatus.PAUSED) {
      throw new ConflictException('Can only activate draft or paused campaigns');
    }

    return this.prisma.campaign.update({
      where: { id },
      data: { status: CampaignStatus.ACTIVE },
      include: { source: { select: { id: true, name: true } } },
    });
  }

  async pause(id: string, currentUser: User) {
    const campaign = await this.findById(id, currentUser);

    if (campaign.status !== CampaignStatus.ACTIVE) {
      throw new ConflictException('Can only pause active campaigns');
    }

    return this.prisma.campaign.update({
      where: { id },
      data: { status: CampaignStatus.PAUSED },
      include: { source: { select: { id: true, name: true } } },
    });
  }

  async complete(id: string, currentUser: User) {
    const campaign = await this.findById(id, currentUser);

    if (campaign.status !== CampaignStatus.ACTIVE && campaign.status !== CampaignStatus.PAUSED) {
      throw new ConflictException('Can only complete active or paused campaigns');
    }

    return this.prisma.campaign.update({
      where: { id },
      data: { status: CampaignStatus.COMPLETED },
      include: { source: { select: { id: true, name: true } } },
    });
  }

  async delete(id: string, currentUser: User) {
    const campaign = await this.findById(id, currentUser);

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      throw new ForbiddenException('Only admins can delete campaigns');
    }

    if (campaign.status === CampaignStatus.ACTIVE) {
      throw new ConflictException('Cannot delete active campaign. Pause it first.');
    }

    await this.prisma.campaign.update({ where: { id }, data: { deletedAt: new Date() } });
    return { success: true };
  }

  async getCampaignStats(id: string, currentUser: User) {
    await this.findById(id, currentUser);

    const [totalLeads, totalSpent] = await Promise.all([
      this.prisma.lead.count({ where: { campaignId: id } }),
      this.prisma.campaign.findUnique({
        where: { id },
        select: { spent: true },
      }),
    ]);

    const leadsByStatus = await this.prisma.lead.groupBy({
      by: ['status'],
      where: { campaignId: id },
      _count: { status: true },
    });

    const convertedLeads = leadsByStatus.find(l => l.status === 'CONVERTED')?._count.status || 0;

    return {
      totalLeads,
      totalSpent: totalSpent?.spent || 0,
      costPerLead: totalLeads > 0 ? (Number(totalSpent?.spent || 0) / totalLeads).toFixed(2) : 0,
      conversionRate: totalLeads > 0 ? (convertedLeads / totalLeads * 100).toFixed(2) : 0,
      leadsByStatus: leadsByStatus.reduce((acc, item) => ({ ...acc, [item.status]: item._count.status }), {}),
    };
  }
}