import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { User, RoleType } from '@prisma/client';

@Injectable()
export class LeadAssignmentsService {
  constructor(private prisma: PrismaService) {}

  async findByLead(leadId: string, currentUser: User) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead not found');

    if (!this.canAccess(lead, currentUser)) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.leadAssignment.findMany({
      where: { leadId },
      include: {
        fromUser: { select: { id: true, fullName: true } },
        toUser: { select: { id: true, fullName: true } },
        fromCp: { select: { id: true, name: true } },
        toCp: { select: { id: true, name: true } },
        assignedBy: { select: { id: true, fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async reassignLead(leadId: string, toUserId: string | undefined, toCpId: string | undefined, reason: string | undefined, currentUser: User) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead not found');

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN && currentUser.roleId !== RoleType.MANAGER) {
      throw new ForbiddenException('Only managers can reassign leads');
    }

    const assignment = await this.prisma.leadAssignment.create({
      data: {
        leadId,
        fromUserId: lead.assignedUserId,
        toUserId,
        fromCpId: lead.assignedCpId,
        toCpId,
        assignedById: currentUser.id,
        reason,
      },
      include: {
        fromUser: { select: { id: true, fullName: true } },
        toUser: { select: { id: true, fullName: true } },
        fromCp: { select: { id: true, name: true } },
        toCp: { select: { id: true, name: true } },
        assignedBy: { select: { id: true, fullName: true } },
      },
    });

    await this.prisma.lead.update({
      where: { id: leadId },
      data: { assignedUserId: toUserId, assignedCpId: toCpId, lastActivityAt: new Date() },
    });

    await this.prisma.leadActivity.create({
      data: {
        leadId,
        userId: currentUser.id,
        type: 'REASSIGNMENT',
        description: `Lead reassigned${toUserId ? ` to user` : ''}${toCpId ? ` to channel partner` : ''}`,
        metadata: { fromUserId: lead.assignedUserId, toUserId, fromCpId: lead.assignedCpId, toCpId, reason },
      },
    });

    return assignment;
  }

  private canAccess(lead: any, user: User): boolean {
    if (user.roleId === RoleType.SUPER_ADMIN || user.roleId === RoleType.ADMIN || user.roleId === RoleType.MANAGER) return true;
    if (lead.assignedUserId === user.id) return true;
    return false;
  }
}