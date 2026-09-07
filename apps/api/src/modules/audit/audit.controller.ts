import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuditAction, EntityTypeForAudit } from '@prisma/client';

@ApiTags('audit')
@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get()
  @RequirePermissions('audit.view')
  @ApiOperation({ summary: 'Get audit logs with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'entityType', required: false, enum: ['USER', 'ROLE', 'PERMISSION', 'LEAD', 'CUSTOMER', 'PROJECT', 'PROPERTY', 'VILLA', 'PLOT', 'INVENTORY_UNIT', 'CHANNEL_PARTNER', 'ENQUIRY', 'SITE_VISIT', 'BOOKING', 'PAYMENT', 'AGREEMENT', 'CAMPAIGN', 'PAGE', 'BLOG', 'MEDIA', 'SETTING', 'NOTIFICATION', 'DOCUMENT'] })
  @ApiQuery({ name: 'entityId', required: false, type: String })
  @ApiQuery({ name: 'action', required: false, enum: ['CREATE', 'UPDATE', 'DELETE', 'RESTORE', 'ASSIGN', 'UNASSIGN', 'STATUS_CHANGE', 'PERMISSION_CHANGE', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT'] })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('userId') userId?: string,
    @Query('entityType') entityType?: EntityTypeForAudit,
    @Query('entityId') entityId?: string,
    @Query('action') action?: AuditAction,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.auditService.findAll({
      page,
      limit,
      userId,
      entityType,
      entityId,
      action,
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
    });
  }

  @Get('stats')
  @RequirePermissions('audit.view')
  @ApiOperation({ summary: 'Get audit statistics' })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  async getStats(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.auditService.getStats({
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
    });
  }

  @Get('entity/:entityType/:entityId')
  @RequirePermissions('audit.view')
  @ApiOperation({ summary: 'Get audit history for an entity' })
  async getEntityHistory(
    @Param('entityType') entityType: EntityTypeForAudit,
    @Param('entityId') entityId: string,
  ) {
    return this.auditService.getEntityHistory(entityType, entityId);
  }

  @Get('export')
  @RequirePermissions('audit.export')
  @ApiOperation({ summary: 'Export audit logs' })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  @ApiQuery({ name: 'entityType', required: false, enum: ['USER', 'ROLE', 'PERMISSION', 'LEAD', 'CUSTOMER', 'PROJECT', 'PROPERTY', 'VILLA', 'PLOT', 'INVENTORY_UNIT', 'CHANNEL_PARTNER', 'ENQUIRY', 'SITE_VISIT', 'BOOKING', 'PAYMENT', 'AGREEMENT', 'CAMPAIGN', 'PAGE', 'BLOG', 'MEDIA', 'SETTING', 'NOTIFICATION', 'DOCUMENT'] })
  async export(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('entityType') entityType?: EntityTypeForAudit,
  ) {
    return this.auditService.export({
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
      entityType,
    });
  }
}