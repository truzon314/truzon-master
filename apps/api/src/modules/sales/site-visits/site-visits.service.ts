import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateSiteVisitDto, UpdateSiteVisitDto, SiteVisitQueryDto } from './dto/site-visit.dto';
import { User, RoleType, SiteVisitStatus, Prisma } from '@prisma/client';

@Injectable()
export class SiteVisitsService {
  constructor(private prisma: PrismaService) {}

  async create(createSiteVisitDto: CreateSiteVisitDto, currentUser: User) {
    // Verify lead exists
    const lead = await this.prisma.lead.findUnique({
      where: { id: createSiteVisitDto.leadId },
      include: { assignedUser: true },
    });
    if (!lead) throw new NotFoundException('Lead not found');

    // Verify project exists
    const project = await this.prisma.project.findUnique({
      where: { id: createSiteVisitDto.projectId },
    });
    if (!project) throw new NotFoundException('Project not found');

    // Verify property if provided
    if (createSiteVisitDto.propertyId) {
      const property = await this.prisma.property.findUnique({
        where: { id: createSiteVisitDto.propertyId },
      });
      if (!property || property.projectId !== createSiteVisitDto.projectId) {
        throw new ConflictException('Property not found in this project');
      }
    }

    // Check for scheduling conflicts
    const scheduledAt = new Date(createSiteVisitDto.scheduledAt);
    const duration = createSiteVisitDto.durationMinutes || 60;
    const endTime = new Date(scheduledAt.getTime() + duration * 60 * 1000);

    const conflicts = await this.prisma.siteVisit.findMany({
      where: {
        userId: currentUser.id,
        status: { in: ['SCHEDULED', 'CONFIRMED'] },
        scheduledAt: { lt: endTime },
        // Check if existing visit ends after new visit starts
      },
    });

    for (const conflict of conflicts) {
      const conflictEnd = new Date(conflict.scheduledAt.getTime() + (conflict.durationMinutes || 60) * 60 * 1000);
      if (conflictEnd > scheduledAt && conflict.scheduledAt < endTime) {
        throw new ConflictException('Scheduling conflict with existing site visit');
      }
    }

    const siteVisit = await this.prisma.siteVisit.create({
      data: {
        ...createSiteVisitDto,
        scheduledAt,
        userId: currentUser.id,
      },
      include: {
        lead: { select: { id: true, name: true, phone: true } },
        project: { select: { id: true, name: true } },
        property: { select: { id: true, name: true } },
        user: { select: { id: true, fullName: true } },
      },
    });

    // Create activity on lead
    await this.prisma.leadActivity.create({
      data: {
        leadId: createSiteVisitDto.leadId,
        userId: currentUser.id,
        type: 'SITE_VISIT_SCHEDULED',
        description: `Site visit scheduled for ${project.name} on ${scheduledAt.toLocaleString()}`,
        metadata: { siteVisitId: siteVisit.id, propertyId: createSiteVisitDto.propertyId },
      },
    });

    return siteVisit;
  }

  async findAll(query: SiteVisitQueryDto, currentUser: User) {
    const { page = 1, limit = 20, search, leadId, projectId, propertyId, userId, status, fromDate, toDate, sortBy = 'scheduledAt', sortOrder = 'asc' } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.SiteVisitWhereInput = {};

    // Role-based filtering
    if (currentUser.roleId === RoleType.SALES || currentUser.roleId === RoleType.CP) {
      where.OR = [
        { userId: currentUser.id },
        { lead: { assignedUserId: currentUser.id } },
        { lead: { assignedCp: { users: { some: { userId: currentUser.id } } } } },
      ];
    }

    if (search) {
      where.OR = [
        { lead: { name: { contains: search, mode: 'insensitive' } } },
        { project: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (leadId) where.leadId = leadId;
    if (projectId) where.projectId = projectId;
    if (propertyId) where.propertyId = propertyId;
    if (userId) where.userId = userId;
    if (status) where.status = status as SiteVisitStatus;

    if (fromDate || toDate) {
      where.scheduledAt = {};
      if (fromDate) where.scheduledAt.gte = new Date(fromDate);
      if (toDate) where.scheduledAt.lte = new Date(toDate);
    }

    const [siteVisits, total] = await Promise.all([
      this.prisma.siteVisit.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          lead: { select: { id: true, name: true, phone: true, status: true } },
          project: { select: { id: true, name: true } },
          property: { select: { id: true, name: true } },
          user: { select: { id: true, fullName: true } },
          attendedBy: { select: { id: true, fullName: true } },
        },
      }),
      this.prisma.siteVisit.count({ where }),
    ]);

    return { data: siteVisits, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string, currentUser: User) {
    const siteVisit = await this.prisma.siteVisit.findUnique({
      where: { id },
      include: {
        lead: { include: { project: true, property: true } },
        project: { select: { id: true, name: true, latitude: true, longitude: true } },
        property: { select: { id: true, name: true } },
        user: { select: { id: true, fullName: true, phone: true, email: true } },
        attendedBy: { select: { id: true, fullName: true } },
      },
    });

    if (!siteVisit) throw new NotFoundException('Site visit not found');

    if (!this.canAccess(siteVisit, currentUser)) {
      throw new ForbiddenException('Access denied');
    }

    return siteVisit;
  }

  async update(id: string, updateSiteVisitDto: UpdateSiteVisitDto, currentUser: User) {
    const siteVisit = await this.findById(id, currentUser);

    if (!this.canUpdate(siteVisit, currentUser)) {
      throw new ForbiddenException('Cannot update this site visit');
    }

    const previousStatus = siteVisit.status;
    const data: any = { ...updateSiteVisitDto };

    if (updateSiteVisitDto.scheduledAt) {
      data.scheduledAt = new Date(updateSiteVisitDto.scheduledAt);
    }

    // Handle status transitions
    if (updateSiteVisitDto.status && updateSiteVisitDto.status !== siteVisit.status) {
      if (!this.isValidStatusTransition(siteVisit.status, updateSiteVisitDto.status as SiteVisitStatus)) {
        throw new ConflictException(`Invalid status transition from ${siteVisit.status} to ${updateSiteVisitDto.status}`);
      }

      if (updateSiteVisitDto.status === SiteVisitStatus.COMPLETED) {
        data.attendedById = currentUser.id;
        data.attendedAt = new Date();
      } else if (updateSiteVisitDto.status === SiteVisitStatus.CANCELLED && !updateSiteVisitDto.cancelledReason) {
        throw new ConflictException('Cancellation reason is required');
      }
    }

    const updated = await this.prisma.siteVisit.update({
      where: { id },
      data,
      include: {
        lead: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
        property: { select: { id: true, name: true } },
        user: { select: { id: true, fullName: true } },
      },
    });

    // Create activity on lead
    if (updateSiteVisitDto.status && updateSiteVisitDto.status !== previousStatus) {
      await this.prisma.leadActivity.create({
        data: {
          leadId: siteVisit.leadId,
          userId: currentUser.id,
          type: 'SITE_VISIT_STATUS_CHANGE',
          description: `Site visit status changed to ${updateSiteVisitDto.status}`,
          metadata: { siteVisitId: siteVisit.id, previousStatus, newStatus: updateSiteVisitDto.status },
        },
      });
    }

    return updated;
  }

  async confirm(id: string, currentUser: User) {
    const siteVisit = await this.findById(id, currentUser);
    
    if (siteVisit.status !== SiteVisitStatus.SCHEDULED) {
      throw new ConflictException('Can only confirm scheduled visits');
    }

    return this.update(id, { status: SiteVisitStatus.CONFIRMED }, currentUser);
  }

  async complete(id: string, feedback: string, currentUser: User) {
    const siteVisit = await this.findById(id, currentUser);
    
    if (siteVisit.status !== SiteVisitStatus.CONFIRMED && siteVisit.status !== SiteVisitStatus.SCHEDULED) {
      throw new ConflictException('Can only complete confirmed/scheduled visits');
    }

    return this.update(id, { status: SiteVisitStatus.COMPLETED, feedback }, currentUser);
  }

  async cancel(id: string, reason: string, currentUser: User) {
    const siteVisit = await this.findById(id, currentUser);
    
    if (siteVisit.status === SiteVisitStatus.COMPLETED) {
      throw new ConflictException('Cannot cancel completed site visit');
    }

    return this.update(id, { status: SiteVisitStatus.CANCELLED, cancelledReason: reason }, currentUser);
  }

  async reschedule(id: string, newScheduledAt: string, currentUser: User) {
    const siteVisit = await this.findById(id, currentUser);
    
    if (siteVisit.status === SiteVisitStatus.COMPLETED || siteVisit.status === SiteVisitStatus.CANCELLED) {
      throw new ConflictException('Cannot reschedule completed or cancelled visit');
    }

    return this.update(id, { scheduledAt: newScheduledAt, status: SiteVisitStatus.RESCHEDULED }, currentUser);
  }

  async delete(id: string, currentUser: User) {
    const siteVisit = await this.findById(id, currentUser);

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      throw new ForbiddenException('Only admins can delete site visits');
    }

    await this.prisma.siteVisit.update({ where: { id }, data: { status: 'CANCELLED' as any } });
    return { success: true };
  }

  async getUpcomingVisits(currentUser: User, days: number = 7) {
    const where: Prisma.SiteVisitWhereInput = {
      status: { in: ['SCHEDULED', 'CONFIRMED'] },
      scheduledAt: {
        gte: new Date(),
        lte: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      },
    };

    if (currentUser.roleId === RoleType.SALES || currentUser.roleId === RoleType.CP) {
      where.OR = [
        { userId: currentUser.id },
        { lead: { assignedUserId: currentUser.id } },
      ];
    }

    return this.prisma.siteVisit.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
      include: {
        lead: { select: { id: true, name: true, phone: true } },
        project: { select: { id: true, name: true } },
        property: { select: { id: true, name: true } },
      },
    });
  }

  async getSiteVisitStats(currentUser: User) {
    const where: Prisma.SiteVisitWhereInput = {};

    if (currentUser.roleId === RoleType.SALES || currentUser.roleId === RoleType.CP) {
      where.OR = [
        { userId: currentUser.id },
        { lead: { assignedUserId: currentUser.id } },
      ];
    }

    const [total, byStatus, upcoming, completedThisMonth] = await Promise.all([
      this.prisma.siteVisit.count({ where }),
      this.prisma.siteVisit.groupBy({ by: ['status'], where, _count: { status: true } }),
      this.prisma.siteVisit.count({
        where: { ...where, status: { in: ['SCHEDULED', 'CONFIRMED'] }, scheduledAt: { gte: new Date() } },
      }),
      this.prisma.siteVisit.count({
        where: {
          ...where,
          status: SiteVisitStatus.COMPLETED,
          attendedAt: { gte: new Date(new Date().setDate(1)) },
        },
      }),
    ]);

    return {
      total,
      upcoming,
      completedThisMonth,
      byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item.status]: item._count.status }), {}),
      completionRate: total > 0 ? ((byStatus.find(s => s.status === SiteVisitStatus.COMPLETED)?._count.status || 0) / total * 100).toFixed(2) : 0,
    };
  }

  private isValidStatusTransition(from: SiteVisitStatus, to: SiteVisitStatus): boolean {
    const validTransitions: Record<SiteVisitStatus, SiteVisitStatus[]> = {
      [SiteVisitStatus.SCHEDULED]: [SiteVisitStatus.CONFIRMED, SiteVisitStatus.CANCELLED, SiteVisitStatus.RESCHEDULED],
      [SiteVisitStatus.CONFIRMED]: [SiteVisitStatus.COMPLETED, SiteVisitStatus.CANCELLED, SiteVisitStatus.NO_SHOW, SiteVisitStatus.RESCHEDULED],
      [SiteVisitStatus.COMPLETED]: [],
      [SiteVisitStatus.CANCELLED]: [SiteVisitStatus.RESCHEDULED],
      [SiteVisitStatus.NO_SHOW]: [SiteVisitStatus.RESCHEDULED],
      [SiteVisitStatus.RESCHEDULED]: [SiteVisitStatus.SCHEDULED, SiteVisitStatus.CONFIRMED, SiteVisitStatus.CANCELLED],
    };
    return validTransitions[from]?.includes(to) || false;
  }

  private canAccess(siteVisit: any, user: User): boolean {
    if (user.roleId === RoleType.SUPER_ADMIN || user.roleId === RoleType.ADMIN || user.roleId === RoleType.MANAGER) return true;
    if (siteVisit.userId === user.id) return true;
    if (siteVisit.lead?.assignedUserId === user.id) return true;
    if (siteVisit.lead?.assignedCp?.users?.some((u: any) => u.userId === user.id)) return true;
    return false;
  }

  private canUpdate(siteVisit: any, user: User): boolean {
    if (user.roleId === RoleType.SUPER_ADMIN || user.roleId === RoleType.ADMIN || user.roleId === RoleType.MANAGER) return true;
    if (siteVisit.userId === user.id) return true;
    if (siteVisit.lead?.assignedUserId === user.id) return true;
    return false;
  }
}