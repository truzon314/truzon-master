import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class LeadActivitiesService {
  constructor(private prisma: PrismaService) {}

  async findByLead(leadId: string, currentUser: User) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead not found');

    if (!this.canAccess(lead, currentUser)) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.leadActivity.findMany({
      where: { leadId },
      include: { user: { select: { id: true, fullName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createActivity(leadId: string, userId: string, type: string, description: string, metadata?: any) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead not found');

    return this.prisma.leadActivity.create({
      data: { leadId, userId, type, description, metadata },
      include: { user: { select: { id: true, fullName: true } } },
    });
  }

  private canAccess(lead: any, user: User): boolean {
    if (user.roleId === 'SUPER_ADMIN' || user.roleId === 'ADMIN' || user.roleId === 'MANAGER') return true;
    if (lead.assignedUserId === user.id) return true;
    if (lead.assignedCp?.users?.some((u: any) => u.userId === user.id)) return true;
    return false;
  }
}