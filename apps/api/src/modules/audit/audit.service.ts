import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, AuditAction, EntityTypeForAudit } from '@prisma/client';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(data: {
    userId?: string;
    action: AuditAction;
    entityType: EntityTypeForAudit;
    entityId: string;
    previousValue?: any;
    newValue?: any;
    ipAddress?: string;
    userAgent?: string;
    metadata?: any;
  }) {
    return this.prisma.auditLog.create({
      data: {
        ...data,
        previousValue: data.previousValue ?? Prisma.DbNull,
        newValue: data.newValue ?? Prisma.DbNull,
        metadata: data.metadata ?? Prisma.DbNull,
      },
    });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    userId?: string;
    entityType?: EntityTypeForAudit;
    entityId?: string;
    action?: AuditAction;
    fromDate?: Date;
    toDate?: Date;
  }) {
    const { page = 1, limit = 50, userId, entityType, entityId, action, fromDate, toDate } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.AuditLogWhereInput = {};
    if (userId) where.userId = userId;
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;
    if (action) where.action = action;
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt.gte = fromDate;
      if (toDate) where.createdAt.lte = toDate;
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, fullName: true, email: true } } },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { data: logs, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getEntityHistory(entityType: EntityTypeForAudit, entityId: string) {
    return this.prisma.auditLog.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, fullName: true, email: true } } },
    });
  }

  async getStats(params: { fromDate?: Date; toDate?: Date }) {
    const { fromDate, toDate } = params;
    const where: Prisma.AuditLogWhereInput = {};
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt.gte = fromDate;
      if (toDate) where.createdAt.lte = toDate;
    }

    const [total, byAction, byEntity, byUser] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.groupBy({ by: ['action'], where, _count: true }),
      this.prisma.auditLog.groupBy({ by: ['entityType'], where, _count: true }),
      this.prisma.auditLog.groupBy({ by: ['userId'], where, _count: true, take: 10, orderBy: { _count: { userId: 'desc' } } }),
    ]);

    return {
      total,
      byAction: byAction.reduce((acc, item) => ({ ...acc, [item.action]: item._count }), {}),
      byEntity: byEntity.reduce((acc, item) => ({ ...acc, [item.entityType]: item._count }), {}),
      topUsers: byUser.map(u => ({ userId: u.userId, count: u._count })),
    };
  }

  async export(params: { fromDate?: Date; toDate?: Date; entityType?: EntityTypeForAudit }) {
    const { fromDate, toDate, entityType } = params;
    const where: Prisma.AuditLogWhereInput = {};
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt.gte = fromDate;
      if (toDate) where.createdAt.lte = toDate;
    }
    if (entityType) where.entityType = entityType;

    return this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, fullName: true, email: true } } },
    });
  }
}