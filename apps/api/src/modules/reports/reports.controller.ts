import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('sales')
  @RequirePermissions('report.view')
  @ApiOperation({ summary: 'Get sales report' })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  async getSalesReport(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('userId') userId?: string,
    @Query('projectId') projectId?: string,
  ) {
    return this.reportsService.getSalesReport({
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
      userId,
      projectId,
    });
  }

  @Get('cp')
  @RequirePermissions('report.view')
  @ApiOperation({ summary: 'Get CP commission report' })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  @ApiQuery({ name: 'cpId', required: false, type: String })
  async getCPReport(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('cpId') cpId?: string,
  ) {
    return this.reportsService.getCPReport({
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
      cpId,
    });
  }

  @Get('project-inventory/:projectId')
  @RequirePermissions('report.view')
  @ApiOperation({ summary: 'Get project inventory report' })
  async getProjectInventoryReport(@Param('projectId') projectId: string) {
    return this.reportsService.getProjectInventoryReport(projectId);
  }

  @Get('lead-conversion')
  @RequirePermissions('report.view')
  @ApiOperation({ summary: 'Get lead conversion report' })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  @ApiQuery({ name: 'sourceId', required: false, type: String })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  async getLeadConversionReport(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('sourceId') sourceId?: string,
    @Query('projectId') projectId?: string,
  ) {
    return this.reportsService.getLeadConversionReport({
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
      sourceId,
      projectId,
    });
  }

  @Get('marketing')
  @RequirePermissions('report.view')
  @ApiOperation({ summary: 'Get marketing/campaign report' })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  async getMarketingReport(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.reportsService.getMarketingReport({
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
    });
  }
}