import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateFollowUpDto, UpdateFollowUpDto } from './dto/followup.dto';
import { User } from '@prisma/client';

@Injectable()
export class LeadFollowUpsService {
  constructor(private prisma: PrismaService) {}

  async create(leadId: string, createFollowUpDto: CreateFollowUpDto, currentUser: User) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead not found');

    const followUp = await this.prisma.leadFollowUp.create({
      data: {
        leadId,
        userId: currentUser.id,
        type: createFollowUpDto.type,
        subject: createFollowUpDto.subject,
        notes: createFollowUpDto.notes,
        scheduledAt: new Date(createFollowUpDto.scheduledAt),
        outcome: createFollowUpDto.outcome,
      },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
      },
    });

    // Update lead's next follow-up date
    await this.prisma.lead.update({
      where: { id: leadId },
      data: { nextFollowUpAt: new Date(createFollowUpDto.scheduledAt), lastActivityAt: new Date() },
    });

    // Create activity
    await this.prisma.leadActivity.create({
      data: {
        leadId,
        userId: currentUser.id,
        type: 'FOLLOW_UP_CREATED',
        description: `Follow-up scheduled: ${createFollowUpDto.type}`,
        metadata: { followUpId: followUp.id },
      },
    });

    return followUp;
  }

  async findByLead(leadId: string, currentUser: User) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead not found');

    return this.prisma.leadFollowUp.findMany({
      where: { leadId },
      include: { user: { select: { id: true, fullName: true, email: true } } },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async findById(id: string, currentUser: User) {
    const followUp = await this.prisma.leadFollowUp.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        lead: { select: { id: true, name: true, assignedUserId: true } },
      },
    });

    if (!followUp) throw new NotFoundException('Follow-up not found');

    // Check access
    if (!this.canAccess(followUp.lead, currentUser)) {
      throw new ForbiddenException('Access denied');
    }

    return followUp;
  }

  async update(id: string, updateFollowUpDto: UpdateFollowUpDto, currentUser: User) {
    const followUp = await this.findById(id, currentUser);

    if (followUp.userId !== currentUser.id && currentUser.roleId !== 'SUPER_ADMIN' && currentUser.roleId !== 'ADMIN') {
      throw new ForbiddenException('Can only update own follow-ups');
    }

    const updated = await this.prisma.leadFollowUp.update({
      where: { id },
      data: {
        ...updateFollowUpDto,
        scheduledAt: updateFollowUpDto.scheduledAt ? new Date(updateFollowUpDto.scheduledAt) : undefined,
        completedAt: updateFollowUpDto.completedAt ? new Date(updateFollowUpDto.completedAt) : undefined,
      },
      include: { user: { select: { id: true, fullName: true } } },
    });

    // Update lead's next follow-up if this was the next one
    if (updateFollowUpDto.scheduledAt) {
      const nextFollowUp = await this.prisma.leadFollowUp.findFirst({
        where: { leadId: followUp.leadId, scheduledAt: { gte: new Date() } },
        orderBy: { scheduledAt: 'asc' },
      });
      if (nextFollowUp) {
        await this.prisma.lead.update({
          where: { id: followUp.leadId },
          data: { nextFollowUpAt: nextFollowUp.scheduledAt },
        });
      }
    }

    return updated;
  }

  async complete(id: string, outcome: string, notes?: string, currentUser?: User) {
    const followUp = await this.findById(id, currentUser!);
    
    const updated = await this.prisma.leadFollowUp.update({
      where: { id },
      data: {
        outcome,
        notes: notes ? `${followUp.notes || ''}\n${notes}`.trim() : followUp.notes,
        completedAt: new Date(),
      },
      include: { user: { select: { id: true, fullName: true } } },
    });

    // Create activity
    await this.prisma.leadActivity.create({
      data: {
        leadId: followUp.leadId,
        userId: currentUser!.id,
        type: 'FOLLOW_UP_COMPLETED',
        description: `Follow-up completed: ${outcome}`,
        metadata: { followUpId: followUp.id, outcome },
      },
    });

    return updated;
  }

  async delete(id: string, currentUser: User) {
    const followUp = await this.findById(id, currentUser);

    if (followUp.userId !== currentUser.id && currentUser.roleId !== 'SUPER_ADMIN' && currentUser.roleId !== 'ADMIN') {
      throw new ForbiddenException('Can only delete own follow-ups');
    }

    await this.prisma.leadFollowUp.delete({ where: { id } });
    return { success: true };
  }

  private canAccess(lead: any, user: User): boolean {
    if (user.roleId === 'SUPER_ADMIN' || user.roleId === 'ADMIN' || user.roleId === 'MANAGER') return true;
    if (lead.assignedUserId === user.id) return true;
    return false;
  }
}