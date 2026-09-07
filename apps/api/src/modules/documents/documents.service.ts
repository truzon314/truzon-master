import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDocumentDto, UpdateDocumentDto, DocumentQueryDto } from './dto/document.dto';
import { User, RoleType, DocumentType, Prisma } from '@prisma/client';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async create(createDocumentDto: CreateDocumentDto, currentUser: User) {
    // Verify file exists
    const file = await this.prisma.media.findUnique({ where: { id: createDocumentDto.fileId } });
    if (!file) throw new NotFoundException('File not found');

    const document = await this.prisma.document.create({
      data: {
        ...createDocumentDto,
        uploadedById: currentUser.id,
        status: 'PENDING',
      },
      include: { file: true, uploadedBy: { select: { id: true, fullName: true } } },
    });

    return document;
  }

  async findAll(query: DocumentQueryDto, currentUser: User) {
    const { page = 1, limit = 20, entityType, entityId, type, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.DocumentWhereInput = {};
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;
    if (type) where.type = type;
    if (status) where.status = status;

    // Role-based filtering
    if (currentUser.roleId === RoleType.SALES || currentUser.roleId === RoleType.CP) {
      where.OR = [
        { uploadedById: currentUser.id },
        { entityType: 'LEAD', entityId: { in: await this.getAccessibleLeadIds(currentUser) } },
        { entityType: 'CUSTOMER', entityId: { in: await this.getAccessibleCustomerIds(currentUser) } },
        { entityType: 'BOOKING', entityId: { in: await this.getAccessibleBookingIds(currentUser) } },
      ];
    }

    const [documents, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          file: true,
          uploadedBy: { select: { id: true, fullName: true } },
          verifiedBy: { select: { id: true, fullName: true } },
        },
      }),
      this.prisma.document.count({ where }),
    ]);

    return { data: documents, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string, currentUser: User) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: {
        file: true,
        uploadedBy: { select: { id: true, fullName: true } },
        verifiedBy: { select: { id: true, fullName: true } },
      },
    });

    if (!document) throw new NotFoundException('Document not found');

    if (!this.canAccess(document, currentUser)) {
      throw new ForbiddenException('Access denied');
    }

    return document;
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto, currentUser: User) {
    const document = await this.findById(id, currentUser);

    if (!this.canUpdate(document, currentUser)) {
      throw new ForbiddenException('Cannot update this document');
    }

    const data: any = { ...updateDocumentDto };

    if (updateDocumentDto.status === 'VERIFIED') {
      data.verifiedAt = new Date();
      data.verifiedById = currentUser.id;
    }

    return this.prisma.document.update({
      where: { id },
      data,
      include: {
        file: true,
        uploadedBy: { select: { id: true, fullName: true } },
        verifiedBy: { select: { id: true, fullName: true } },
      },
    });
  }

  async verify(id: string, currentUser: User) {
    const document = await this.findById(id, currentUser);

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN && currentUser.roleId !== RoleType.MANAGER) {
      throw new ForbiddenException('Only managers can verify documents');
    }

    return this.prisma.document.update({
      where: { id },
      data: { status: 'VERIFIED', verifiedAt: new Date(), verifiedById: currentUser.id },
      include: { file: true, verifiedBy: { select: { id: true, fullName: true } } },
    });
  }

  async delete(id: string, currentUser: User) {
    const document = await this.findById(id, currentUser);

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      throw new ForbiddenException('Only admins can delete documents');
    }

    await this.prisma.document.delete({ where: { id } });
    return { success: true };
  }

  private async getAccessibleLeadIds(currentUser: User): Promise<string[]> {
    const leads = await this.prisma.lead.findMany({
      where: {
        OR: [
          { assignedUserId: currentUser.id },
          { assignedCp: { users: { some: { userId: currentUser.id } } } },
        ],
      },
      select: { id: true },
    });
    return leads.map(l => l.id);
  }

  private async getAccessibleCustomerIds(currentUser: User): Promise<string[]> {
    const customers = await this.prisma.customer.findMany({
      where: {
        lead: {
          OR: [
            { assignedUserId: currentUser.id },
            { assignedCp: { users: { some: { userId: currentUser.id } } } },
          ],
        },
      },
      select: { id: true },
    });
    return customers.map(c => c.id);
  }

  private async getAccessibleBookingIds(currentUser: User): Promise<string[]> {
    const bookings = await this.prisma.booking.findMany({
      where: {
        OR: [
          { userId: currentUser.id },
          { cpId: (currentUser as any).channelPartner?.channelPartnerId },
        ],
      },
      select: { id: true },
    });
    return bookings.map(b => b.id);
  }

  private canAccess(document: any, user: User): boolean {
    if (user.roleId === RoleType.SUPER_ADMIN || user.roleId === RoleType.ADMIN || user.roleId === RoleType.MANAGER) return true;
    if (document.uploadedById === user.id) return true;
    return false;
  }

  private canUpdate(document: any, user: User): boolean {
    if (user.roleId === RoleType.SUPER_ADMIN || user.roleId === RoleType.ADMIN || user.roleId === RoleType.MANAGER) return true;
    if (document.uploadedById === user.id) return true;
    return false;
  }
}