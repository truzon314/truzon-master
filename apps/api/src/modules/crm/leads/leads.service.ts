import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadQueryDto } from './dto/lead-query.dto';
import { AssignLeadDto } from './dto/assign-lead.dto';
import { LeadStatus, Prisma, User, RoleType } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class LeadsService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createLeadDto: CreateLeadDto, currentUser: User) {
    // Verify source exists
    const source = await this.prisma.leadSource.findUnique({
      where: { id: createLeadDto.sourceId },
    });
    if (!source) throw new NotFoundException('Lead source not found');

    // Verify campaign if provided
    if (createLeadDto.campaignId) {
      const campaign = await this.prisma.campaign.findUnique({
        where: { id: createLeadDto.campaignId },
      });
      if (!campaign) throw new NotFoundException('Campaign not found');
    }

    // Verify project if provided
    if (createLeadDto.projectId) {
      const project = await this.prisma.project.findUnique({
        where: { id: createLeadDto.projectId },
      });
      if (!project) throw new NotFoundException('Project not found');
    }

    // Verify property if provided
    if (createLeadDto.propertyId) {
      const property = await this.prisma.property.findUnique({
        where: { id: createLeadDto.propertyId },
      });
      if (!property) throw new NotFoundException('Property not found');
    }

    const lead = await this.prisma.lead.create({
      data: {
        ...createLeadDto,
        createdById: currentUser.id,
        budgetMin: createLeadDto.budgetMin ? new Prisma.Decimal(createLeadDto.budgetMin) : undefined,
        budgetMax: createLeadDto.budgetMax ? new Prisma.Decimal(createLeadDto.budgetMax) : undefined,
      },
      include: {
        source: true,
        campaign: true,
        project: true,
        property: true,
        assignedUser: { include: { role: { include: { permissions: true } } } },
        assignedCp: true,
        createdBy: { include: { role: true } },
      },
    });

    // Create initial activity
    await this.createActivity(lead.id, currentUser.id, 'CREATED', 'Lead created');

    // Emit event for notifications
    this.eventEmitter.emit('lead.created', { lead, createdBy: currentUser });

    return lead;
  }

  async findAll(query: LeadQueryDto, currentUser: User) {
    const { page = 1, limit = 20, search, status, sourceId, campaignId, projectId, propertyId, assignedUserId, assignedCpId, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.LeadWhereInput = {
      deletedAt: null,
    };

    // Role-based filtering
    if (currentUser.roleId === RoleType.SALES || currentUser.roleId === RoleType.CP) {
      where.OR = [
        { assignedUserId: currentUser.id },
        { assignedCp: { users: { some: { userId: currentUser.id } } } },
        { createdById: currentUser.id },
      ];
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) where.status = status;
    if (sourceId) where.sourceId = sourceId;
    if (campaignId) where.campaignId = campaignId;
    if (projectId) where.projectId = projectId;
    if (propertyId) where.propertyId = propertyId;
    if (assignedUserId) where.assignedUserId = assignedUserId;
    if (assignedCpId) where.assignedCpId = assignedCpId;

    const [leads, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          source: true,
          campaign: true,
          project: { select: { id: true, name: true, slug: true } },
          property: { select: { id: true, name: true, slug: true } },
          assignedUser: { select: { id: true, fullName: true, email: true } },
          assignedCp: { select: { id: true, name: true } },
          createdBy: { select: { id: true, fullName: true } },
          _count: { select: { followUps: true, activities: true, siteVisits: true, bookings: true } },
        },
      }),
      this.prisma.lead.count({ where }),
    ]);

    return {
      data: leads,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string, currentUser: User) {
    const lead = await this.prisma.lead.findUnique({
      where: { id, deletedAt: null },
      include: {
        source: true,
        campaign: true,
        project: true,
        property: true,
        assignedUser: { include: { role: { include: { permissions: true } } } },
        assignedCp: true,
        createdBy: { include: { role: true } },
        customer: true,
        followUps: {
          include: { user: { select: { id: true, fullName: true } } },
          orderBy: { scheduledAt: 'desc' },
        },
        activities: {
          include: { user: { select: { id: true, fullName: true } } },
          orderBy: { createdAt: 'desc' },
        },
        assignments: {
          include: {
            fromUser: { select: { id: true, fullName: true } },
            toUser: { select: { id: true, fullName: true } },
            fromCp: { select: { id: true, name: true } },
            toCp: { select: { id: true, name: true } },
            assignedBy: { select: { id: true, fullName: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        siteVisits: {
          include: { user: { select: { id: true, fullName: true } } },
          orderBy: { scheduledAt: 'desc' },
        },
        bookings: {
          include: { inventoryUnit: { select: { id: true, unitNumber: true } } },
          orderBy: { bookingDate: 'desc' },
        },
      },
    });

    if (!lead) throw new NotFoundException('Lead not found');

    // Check access permissions
    if (!this.canAccessLead(lead, currentUser)) {
      throw new ForbiddenException('Access denied to this lead');
    }

    return lead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto, currentUser: User) {
    const lead = await this.findById(id, currentUser);

    // Check if user can update this lead
    if (!this.canUpdateLead(lead, currentUser)) {
      throw new ForbiddenException('Cannot update this lead');
    }

    const previousStatus = lead.status;
    const previousAssignedUserId = lead.assignedUserId;
    const previousAssignedCpId = lead.assignedCpId;

    // Handle status transitions
    if (updateLeadDto.status && updateLeadDto.status !== lead.status) {
      await this.validateStatusTransition(lead.status, updateLeadDto.status);
      
      if (updateLeadDto.status === LeadStatus.CONVERTED) {
        (updateLeadDto as any).convertedAt = new Date();
      } else if (updateLeadDto.status === LeadStatus.LOST && !updateLeadDto.lostReason) {
        throw new ConflictException('Lost reason is required when marking lead as lost');
      }
    }

    const updatedLead = await this.prisma.lead.update({
      where: { id },
      data: {
        ...updateLeadDto,
        budgetMin: updateLeadDto.budgetMin ? new Prisma.Decimal(updateLeadDto.budgetMin) : undefined,
        budgetMax: updateLeadDto.budgetMax ? new Prisma.Decimal(updateLeadDto.budgetMax) : undefined,
        lastActivityAt: new Date(),
      },
      include: {
        source: true,
        campaign: true,
        project: true,
        property: true,
        assignedUser: { select: { id: true, fullName: true, email: true } },
        assignedCp: { select: { id: true, name: true } },
      },
    });

    // Create activity for changes
    if (updateLeadDto.status && updateLeadDto.status !== previousStatus) {
      await this.createActivity(
        id,
        currentUser.id,
        'STATUS_CHANGE',
        `Status changed from ${previousStatus} to ${updateLeadDto.status}`,
        { previousStatus, newStatus: updateLeadDto.status }
      );

      this.eventEmitter.emit('lead.status_changed', { lead: updatedLead, previousStatus, changedBy: currentUser });
    }

    if (updateLeadDto.assignedUserId && updateLeadDto.assignedUserId !== previousAssignedUserId) {
      await this.createActivity(
        id,
        currentUser.id,
        'ASSIGNMENT',
        `Lead assigned to user`,
        { previousUserId: previousAssignedUserId, newUserId: updateLeadDto.assignedUserId }
      );
    }

    if (updateLeadDto.assignedCpId && updateLeadDto.assignedCpId !== previousAssignedCpId) {
      await this.createActivity(
        id,
        currentUser.id,
        'ASSIGNMENT',
        `Lead assigned to channel partner`,
        { previousCpId: previousAssignedCpId, newCpId: updateLeadDto.assignedCpId }
      );
    }

    return updatedLead;
  }

  async assign(id: string, assignLeadDto: AssignLeadDto, currentUser: User) {
    const lead = await this.findById(id, currentUser);

    if (!this.canAssignLead(lead, currentUser)) {
      throw new ForbiddenException('Cannot assign this lead');
    }

    const previousUserId = lead.assignedUserId;
    const previousCpId = lead.assignedCpId;

    const assignment = await this.prisma.leadAssignment.create({
      data: {
        leadId: id,
        fromUserId: previousUserId,
        toUserId: assignLeadDto.toUserId,
        fromCpId: previousCpId,
        toCpId: assignLeadDto.toCpId,
        assignedById: currentUser.id,
        reason: assignLeadDto.reason,
      },
      include: {
        fromUser: { select: { id: true, fullName: true } },
        toUser: { select: { id: true, fullName: true } },
        fromCp: { select: { id: true, name: true } },
        toCp: { select: { id: true, name: true } },
        assignedBy: { select: { id: true, fullName: true } },
      },
    });

    // Update lead assignment
    await this.prisma.lead.update({
      where: { id },
      data: {
        assignedUserId: assignLeadDto.toUserId,
        assignedCpId: assignLeadDto.toCpId,
        lastActivityAt: new Date(),
      },
    });

    await this.createActivity(
      id,
      currentUser.id,
      'ASSIGNMENT',
      assignLeadDto.toUserId ? `Assigned to user` : `Assigned to channel partner`,
      { previousUserId, newUserId: assignLeadDto.toUserId, previousCpId, newCpId: assignLeadDto.toCpId }
    );

    this.eventEmitter.emit('lead.assigned', { lead: { ...lead, assignedUserId: assignLeadDto.toUserId, assignedCpId: assignLeadDto.toCpId }, assignment, assignedBy: currentUser });

    return assignment;
  }

  async delete(id: string, currentUser: User) {
    const lead = await this.findById(id, currentUser);

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      throw new ForbiddenException('Only admins can delete leads');
    }

    await this.prisma.lead.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.createActivity(id, currentUser.id, 'DELETE', 'Lead deleted (soft delete)');

    return { success: true };
  }

  async getLeadStats(currentUser: User) {
    const where: Prisma.LeadWhereInput = { deletedAt: null };

    if (currentUser.roleId === RoleType.SALES || currentUser.roleId === RoleType.CP) {
      where.OR = [
        { assignedUserId: currentUser.id },
        { assignedCp: { users: { some: { userId: currentUser.id } } } },
      ];
    }

    const [total, byStatus, thisMonth, converted] = await Promise.all([
      this.prisma.lead.count({ where }),
      this.prisma.lead.groupBy({
        by: ['status'],
        where,
        _count: { status: true },
      }),
      this.prisma.lead.count({
        where: {
          ...where,
          createdAt: { gte: new Date(new Date().setDate(1)) },
        },
      }),
      this.prisma.lead.count({ where: { ...where, status: LeadStatus.CONVERTED } }),
    ]);

    return {
      total,
      byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item.status]: item._count.status }), {}),
      thisMonth,
      conversionRate: total > 0 ? (converted / total * 100).toFixed(2) : 0,
    };
  }

  private async validateStatusTransition(from: LeadStatus, to: LeadStatus) {
    const validTransitions: Record<LeadStatus, LeadStatus[]> = {
      [LeadStatus.NEW]: [LeadStatus.CONTACTED, LeadStatus.LOST, LeadStatus.NURTURE],
      [LeadStatus.CONTACTED]: [LeadStatus.INTERESTED, LeadStatus.LOST, LeadStatus.NURTURE, LeadStatus.NEW],
      [LeadStatus.INTERESTED]: [LeadStatus.SITE_VISIT, LeadStatus.NEGOTIATION, LeadStatus.LOST, LeadStatus.NURTURE, LeadStatus.CONTACTED],
      [LeadStatus.SITE_VISIT]: [LeadStatus.NEGOTIATION, LeadStatus.BOOKED, LeadStatus.LOST, LeadStatus.NURTURE, LeadStatus.INTERESTED],
      [LeadStatus.NEGOTIATION]: [LeadStatus.BOOKED, LeadStatus.CONVERTED, LeadStatus.LOST, LeadStatus.NURTURE, LeadStatus.SITE_VISIT],
      [LeadStatus.BOOKED]: [LeadStatus.CONVERTED, LeadStatus.LOST, LeadStatus.NEGOTIATION],
      [LeadStatus.CONVERTED]: [],
      [LeadStatus.LOST]: [LeadStatus.NURTURE, LeadStatus.NEW],
      [LeadStatus.NURTURE]: [LeadStatus.NEW, LeadStatus.CONTACTED, LeadStatus.INTERESTED, LeadStatus.LOST],
    };

    if (!validTransitions[from]?.includes(to)) {
      throw new ConflictException(`Invalid status transition from ${from} to ${to}`);
    }
  }

  private canAccessLead(lead: any, user: User): boolean {
    if (user.roleId === RoleType.SUPER_ADMIN || user.roleId === RoleType.ADMIN || user.roleId === RoleType.MANAGER) {
      return true;
    }
    if (lead.assignedUserId === user.id) return true;
    if (lead.assignedCp?.users?.some((u: any) => u.userId === user.id)) return true;
    if (lead.createdById === user.id) return true;
    return false;
  }

  private canUpdateLead(lead: any, user: User): boolean {
    if (user.roleId === RoleType.SUPER_ADMIN || user.roleId === RoleType.ADMIN) return true;
    if (lead.assignedUserId === user.id) return true;
    if (lead.assignedCp?.users?.some((u: any) => u.userId === user.id)) return true;
    return false;
  }

  private canAssignLead(lead: any, user: User): boolean {
    if (user.roleId === RoleType.SUPER_ADMIN || user.roleId === RoleType.ADMIN || user.roleId === RoleType.MANAGER) return true;
    return false;
  }

  private async createActivity(leadId: string, userId: string, type: string, description: string, metadata?: any) {
    await this.prisma.leadActivity.create({
      data: { leadId, userId, type, description, metadata },
    });
  }
}