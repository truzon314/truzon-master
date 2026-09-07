import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  // Sales Reports
  async getSalesReport(params: { fromDate?: Date; toDate?: Date; userId?: string; projectId?: string }) {
    const { fromDate, toDate, userId, projectId } = params;

    const where: Prisma.BookingWhereInput = { deletedAt: null };
    if (fromDate || toDate) {
      where.bookingDate = {};
      if (fromDate) where.bookingDate.gte = fromDate;
      if (toDate) where.bookingDate.lte = toDate;
    }
    if (userId) where.userId = userId;
    if (projectId) where.projectId = projectId;

    const [totalBookings, totalValue, byStatus, byProject, byMonth] = await Promise.all([
      this.prisma.booking.count({ where }),
      this.prisma.booking.aggregate({ where, _sum: { totalPrice: true, bookingAmount: true } }),
      this.prisma.booking.groupBy({ by: ['status'], where, _count: { status: true }, _sum: { totalPrice: true } }),
      this.prisma.booking.groupBy({
        by: ['projectId'],
        where,
        _count: { projectId: true },
        _sum: { totalPrice: true },
      }),
      this.prisma.$queryRaw`
        SELECT DATE_TRUNC('month', "bookingDate") as month, COUNT(*) as count, SUM("totalPrice") as value
        FROM "Booking"
        WHERE "deletedAt" IS NULL
        ${fromDate ? Prisma.sql`AND "bookingDate" >= ${fromDate}` : Prisma.empty}
        ${toDate ? Prisma.sql`AND "bookingDate" <= ${toDate}` : Prisma.empty}
        GROUP BY DATE_TRUNC('month', "bookingDate")
        ORDER BY month ASC
      `,
    ]);

    return {
      totalBookings,
      totalValue: totalValue._sum.totalPrice || 0,
      totalBookingAmount: totalValue._sum.bookingAmount || 0,
      byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item.status]: { count: item._count.status, value: item._sum.totalPrice || 0 } }), {}),
      byProject,
      byMonth,
    };
  }

  // CP Reports
  async getCPReport(params: { fromDate?: Date; toDate?: Date; cpId?: string }) {
    const { fromDate, toDate, cpId } = params;

    const where: Prisma.CommissionWhereInput = {};
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt.gte = fromDate;
      if (toDate) where.createdAt.lte = toDate;
    }
    if (cpId) where.channelPartnerId = cpId;

    const [totalCommissions, byStatus, byCP, byMonth] = await Promise.all([
      this.prisma.commission.aggregate({ where, _sum: { amount: true }, _count: true }),
      this.prisma.commission.groupBy({ by: ['status'], where, _count: true, _sum: { amount: true } }),
      this.prisma.commission.groupBy({
        by: ['channelPartnerId'],
        where,
        _count: true,
        _sum: { amount: true },
      }),
      this.prisma.$queryRaw`
        SELECT DATE_TRUNC('month', "createdAt") as month, COUNT(*) as count, SUM("amount") as amount
        FROM "Commission"
        WHERE "deletedAt" IS NULL
        ${fromDate ? Prisma.sql`AND "createdAt" >= ${fromDate}` : Prisma.empty}
        ${toDate ? Prisma.sql`AND "createdAt" <= ${toDate}` : Prisma.empty}
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month ASC
      `,
    ]);

    return {
      totalCommissions: totalCommissions._sum.amount || 0,
      totalCount: totalCommissions._count || 0,
      byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item.status]: { count: item._count, amount: item._sum.amount || 0 } }), {}),
      byCP,
      byMonth,
    };
  }

  // Project Inventory Report
  async getProjectInventoryReport(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        inventoryUnits: { where: { deletedAt: null } },
        properties: { where: { deletedAt: null } },
      },
    });

    if (!project) throw new Error('Project not found');

    const inventoryByStatus = project.inventoryUnits.reduce((acc, unit) => {
      acc[unit.status] = (acc[unit.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const inventoryByType = project.inventoryUnits.reduce((acc, unit) => {
      acc[unit.unitType] = (acc[unit.unitType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalValue = project.inventoryUnits.reduce((sum, unit) => sum + Number(unit.priceValue), 0);

    return {
      project: { id: project.id, name: project.name },
      totalUnits: project.inventoryUnits.length,
      byStatus: inventoryByStatus,
      byType: inventoryByType,
      totalInventoryValue: totalValue,
      propertiesCount: project.properties.length,
    };
  }

  // Lead Conversion Report
  async getLeadConversionReport(params: { fromDate?: Date; toDate?: Date; sourceId?: string; projectId?: string }) {
    const { fromDate, toDate, sourceId, projectId } = params;

    const where: Prisma.LeadWhereInput = { deletedAt: null };
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt.gte = fromDate;
      if (toDate) where.createdAt.lte = toDate;
    }
    if (sourceId) where.sourceId = sourceId;
    if (projectId) where.projectId = projectId;

    const [totalLeads, byStatus, bySource, byMonth, convertedValue] = await Promise.all([
      this.prisma.lead.count({ where }),
      this.prisma.lead.groupBy({ by: ['status'], where, _count: true }),
      this.prisma.lead.groupBy({
        by: ['sourceId'],
        where,
        _count: true,
      }),
      this.prisma.$queryRaw`
        SELECT DATE_TRUNC('month', "createdAt") as month, COUNT(*) as count
        FROM "Lead"
        WHERE "deletedAt" IS NULL
        ${fromDate ? Prisma.sql`AND "createdAt" >= ${fromDate}` : Prisma.empty}
        ${toDate ? Prisma.sql`AND "createdAt" <= ${toDate}` : Prisma.empty}
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month ASC
      `,
      this.prisma.lead.aggregate({
        where: { ...where, status: 'CONVERTED' },
        _sum: { budgetMax: true },
      }),
    ]);

    const total = totalLeads;
    const converted = byStatus.find(s => s.status === 'CONVERTED')?._count || 0;

    return {
      totalLeads: total,
      convertedLeads: converted,
      conversionRate: total > 0 ? (converted / total * 100).toFixed(2) : 0,
      convertedValue: convertedValue._sum.budgetMax || 0,
      byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item.status]: item._count }), {}),
      bySource: bySource,
      byMonth,
    };
  }

  // Marketing Report
  async getMarketingReport(params: { fromDate?: Date; toDate?: Date }) {
    const { fromDate, toDate } = params;

    const where: Prisma.CampaignWhereInput = { deletedAt: null };
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt.gte = fromDate;
      if (toDate) where.createdAt.lte = toDate;
    }

    const campaigns = await this.prisma.campaign.findMany({
      where,
      include: {
        _count: { select: { leads: true } },
        source: { select: { name: true, type: true } },
      },
    });

    const campaignsWithMetrics = await Promise.all(campaigns.map(async c => {
      const converted = await this.prisma.lead.count({ where: { campaignId: c.id, status: 'CONVERTED' } });
      return {
        ...c,
        leadsGenerated: c._count.leads,
        costPerLead: c.spent && c._count.leads > 0 ? Number(c.spent) / c._count.leads : 0,
        conversionRate: c._count.leads > 0 ? ((converted / c._count.leads) * 100).toFixed(2) : 0,
      };
    }));

    return { campaigns: campaignsWithMetrics };
  }
}