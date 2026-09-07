import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateEnquiryDto, UpdateEnquiryDto, EnquiryQueryDto } from './dto/enquiry.dto';
import { User, RoleType, Prisma } from '@prisma/client';

@Injectable()
export class EnquiriesService {
  constructor(private prisma: PrismaService) {}

  async create(createEnquiryDto: CreateEnquiryDto, currentUser: User) {
    // If leadId provided, verify and link
    if (createEnquiryDto.leadId) {
      const lead = await this.prisma.lead.findUnique({ where: { id: createEnquiryDto.leadId } });
      if (!lead) throw new NotFoundException('Lead not found');
    }

    // Verify project/property if provided
    if (createEnquiryDto.projectId) {
      const project = await this.prisma.project.findUnique({ where: { id: createEnquiryDto.projectId } });
      if (!project) throw new NotFoundException('Project not found');
    }

    if (createEnquiryDto.propertyId) {
      const property = await this.prisma.property.findUnique({ where: { id: createEnquiryDto.propertyId } });
      if (!property) throw new NotFoundException('Property not found');
    }

    const enquiry = await this.prisma.enquiry.create({
      data: {
        ...createEnquiryDto,
        userId: currentUser.id,
        leadId: createEnquiryDto.leadId || '',
      },
      include: {
        lead: { select: { id: true, name: true, phone: true } },
        project: { select: { id: true, name: true } },
        property: { select: { id: true, name: true } },
        user: { select: { id: true, fullName: true } },
      },
    });

    // Create activity on lead if linked
    if (createEnquiryDto.leadId) {
      await this.prisma.leadActivity.create({
        data: {
          leadId: createEnquiryDto.leadId,
          userId: currentUser.id,
          type: 'ENQUIRY_CREATED',
          description: `Enquiry received: ${createEnquiryDto.subject}`,
          metadata: { enquiryId: enquiry.id, type: createEnquiryDto.type },
        },
      });
    }

    return enquiry;
  }

  async findAll(query: EnquiryQueryDto, currentUser: User) {
    const { page = 1, limit = 20, search, leadId, projectId, propertyId, userId, source, type, status, priority, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.EnquiryWhereInput = {};

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
        { subject: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (leadId) where.leadId = leadId;
    if (projectId) where.projectId = projectId;
    if (propertyId) where.propertyId = propertyId;
    if (userId) where.userId = userId;
    if (source) where.source = source;
    if (type) where.type = type;
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const [enquiries, total] = await Promise.all([
      this.prisma.enquiry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          lead: { select: { id: true, name: true, phone: true, status: true } },
          project: { select: { id: true, name: true } },
          property: { select: { id: true, name: true } },
          user: { select: { id: true, fullName: true } },
          respondedBy: { select: { id: true, fullName: true } },
        },
      }),
      this.prisma.enquiry.count({ where }),
    ]);

    return { data: enquiries, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string, currentUser: User) {
    const enquiry = await this.prisma.enquiry.findUnique({
      where: { id },
      include: {
        lead: { include: { project: true, property: true, assignedUser: { select: { id: true, fullName: true } } } },
        project: { select: { id: true, name: true } },
        property: { select: { id: true, name: true } },
        user: { select: { id: true, fullName: true } },
        respondedBy: { select: { id: true, fullName: true } },
      },
    });

    if (!enquiry) throw new NotFoundException('Enquiry not found');

    if (!this.canAccess(enquiry, currentUser)) {
      throw new ForbiddenException('Access denied');
    }

    return enquiry;
  }

  async update(id: string, updateEnquiryDto: UpdateEnquiryDto, currentUser: User) {
    const enquiry = await this.findById(id, currentUser);

    if (!this.canUpdate(enquiry, currentUser)) {
      throw new ForbiddenException('Cannot update this enquiry');
    }

    const data: any = { ...updateEnquiryDto };

    if (updateEnquiryDto.status && updateEnquiryDto.status !== enquiry.status) {
      data.respondedById = currentUser.id;
      data.respondedAt = new Date();

      if (enquiry.leadId) {
        await this.prisma.leadActivity.create({
          data: {
            leadId: enquiry.leadId,
            userId: currentUser.id,
            type: 'ENQUIRY_STATUS_CHANGE',
            description: `Enquiry status changed to ${updateEnquiryDto.status}`,
            metadata: { enquiryId: enquiry.id, previousStatus: enquiry.status, newStatus: updateEnquiryDto.status },
          },
        });
      }
    }

    return this.prisma.enquiry.update({
      where: { id },
      data,
      include: {
        lead: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
        property: { select: { id: true, name: true } },
        user: { select: { id: true, fullName: true } },
        respondedBy: { select: { id: true, fullName: true } },
      },
    });
  }

  async respond(id: string, response: string, currentUser: User) {
    const enquiry = await this.findById(id, currentUser);

    if (!this.canUpdate(enquiry, currentUser)) {
      throw new ForbiddenException('Cannot respond to this enquiry');
    }

    return this.prisma.enquiry.update({
      where: { id },
      data: {
        response,
        status: 'RESOLVED',
        respondedById: currentUser.id,
        respondedAt: new Date(),
      },
      include: {
        lead: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
        property: { select: { id: true, name: true } },
      },
    });
  }

  async delete(id: string, currentUser: User) {
    const enquiry = await this.findById(id, currentUser);

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      throw new ForbiddenException('Only admins can delete enquiries');
    }

    await this.prisma.enquiry.delete({ where: { id } });
    return { success: true };
  }

  async getEnquiryStats(currentUser: User) {
    const where: Prisma.EnquiryWhereInput = {};

    if (currentUser.roleId === RoleType.SALES || currentUser.roleId === RoleType.CP) {
      where.OR = [
        { userId: currentUser.id },
        { lead: { assignedUserId: currentUser.id } },
      ];
    }

    const [total, byStatus, bySource, byType, openCount] = await Promise.all([
      this.prisma.enquiry.count({ where }),
      this.prisma.enquiry.groupBy({ by: ['status'], where, _count: { status: true } }),
      this.prisma.enquiry.groupBy({ by: ['source'], where, _count: { source: true } }),
      this.prisma.enquiry.groupBy({ by: ['type'], where, _count: { type: true } }),
      this.prisma.enquiry.count({ where: { ...where, status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
    ]);

    return {
      total,
      open: openCount,
      byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item.status]: item._count.status }), {}),
      bySource: bySource.reduce((acc, item) => ({ ...acc, [item.source]: item._count.source }), {}),
      byType: byType.reduce((acc, item) => ({ ...acc, [item.type]: item._count.type }), {}),
    };
  }

  private canAccess(enquiry: any, user: User): boolean {
    if (user.roleId === RoleType.SUPER_ADMIN || user.roleId === RoleType.ADMIN || user.roleId === RoleType.MANAGER) return true;
    if (enquiry.userId === user.id) return true;
    if (enquiry.lead?.assignedUserId === user.id) return true;
    if (enquiry.lead?.assignedCp?.users?.some((u: any) => u.userId === user.id)) return true;
    return false;
  }

  private canUpdate(enquiry: any, user: User): boolean {
    if (user.roleId === RoleType.SUPER_ADMIN || user.roleId === RoleType.ADMIN || user.roleId === RoleType.MANAGER) return true;
    if (enquiry.userId === user.id) return true;
    if (enquiry.lead?.assignedUserId === user.id) return true;
    return false;
  }
}