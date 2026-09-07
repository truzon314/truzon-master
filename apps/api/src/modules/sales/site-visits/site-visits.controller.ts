import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SiteVisitsService } from './site-visits.service';
import { CreateSiteVisitDto, UpdateSiteVisitDto, SiteVisitQueryDto } from './dto/site-visit.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@ApiTags('site-visits')
@Controller('site-visits')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class SiteVisitsController {
  constructor(private siteVisitsService: SiteVisitsService) {}

  @Post()
  @RequirePermissions('site_visit.create')
  @ApiOperation({ summary: 'Schedule a new site visit' })
  @ApiResponse({ status: 201, description: 'Site visit scheduled successfully' })
  @ApiResponse({ status: 409, description: 'Scheduling conflict' })
  async create(@Body() createSiteVisitDto: CreateSiteVisitDto, @CurrentUser() user: any) {
    return this.siteVisitsService.create(createSiteVisitDto, user);
  }

  @Get()
  @RequirePermissions('site_visit.view')
  @ApiOperation({ summary: 'Get all site visits with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'leadId', required: false, type: String })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiQuery({ name: 'propertyId', required: false, type: String })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: ['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED'] })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'Site visits retrieved successfully' })
  async findAll(@Query() query: SiteVisitQueryDto, @CurrentUser() user: any) {
    return this.siteVisitsService.findAll(query, user);
  }

  @Get('upcoming')
  @RequirePermissions('site_visit.view')
  @ApiOperation({ summary: 'Get upcoming site visits (next 7 days)' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Upcoming site visits retrieved successfully' })
  async getUpcoming(@Query('days') days: number = 7, @CurrentUser() user: any) {
    return this.siteVisitsService.getUpcomingVisits(user, days);
  }

  @Get('stats')
  @RequirePermissions('site_visit.view')
  @ApiOperation({ summary: 'Get site visit statistics' })
  @ApiResponse({ status: 200, description: 'Site visit stats retrieved successfully' })
  async getStats(@CurrentUser() user: any) {
    return this.siteVisitsService.getSiteVisitStats(user);
  }

  @Get(':id')
  @RequirePermissions('site_visit.view')
  @ApiOperation({ summary: 'Get site visit by ID' })
  @ApiResponse({ status: 200, description: 'Site visit retrieved successfully' })
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.siteVisitsService.findById(id, user);
  }

  @Patch(':id')
  @RequirePermissions('site_visit.update')
  @ApiOperation({ summary: 'Update site visit' })
  @ApiResponse({ status: 200, description: 'Site visit updated successfully' })
  @ApiResponse({ status: 409, description: 'Invalid status transition' })
  async update(@Param('id') id: string, @Body() updateSiteVisitDto: UpdateSiteVisitDto, @CurrentUser() user: any) {
    return this.siteVisitsService.update(id, updateSiteVisitDto, user);
  }

  @Post(':id/confirm')
  @RequirePermissions('site_visit.update')
  @ApiOperation({ summary: 'Confirm site visit' })
  @ApiResponse({ status: 200, description: 'Site visit confirmed successfully' })
  async confirm(@Param('id') id: string, @CurrentUser() user: any) {
    return this.siteVisitsService.confirm(id, user);
  }

  @Post(':id/complete')
  @RequirePermissions('site_visit.update')
  @ApiOperation({ summary: 'Complete site visit with feedback' })
  @ApiResponse({ status: 200, description: 'Site visit completed successfully' })
  async complete(@Param('id') id: string, @Body('feedback') feedback: string, @CurrentUser() user: any) {
    return this.siteVisitsService.complete(id, feedback, user);
  }

  @Post(':id/cancel')
  @RequirePermissions('site_visit.update')
  @ApiOperation({ summary: 'Cancel site visit' })
  @ApiResponse({ status: 200, description: 'Site visit cancelled successfully' })
  async cancel(@Param('id') id: string, @Body('reason') reason: string, @CurrentUser() user: any) {
    return this.siteVisitsService.cancel(id, reason, user);
  }

  @Post(':id/reschedule')
  @RequirePermissions('site_visit.update')
  @ApiOperation({ summary: 'Reschedule site visit' })
  @ApiResponse({ status: 200, description: 'Site visit rescheduled successfully' })
  async reschedule(@Param('id') id: string, @Body('scheduledAt') scheduledAt: string, @CurrentUser() user: any) {
    return this.siteVisitsService.reschedule(id, scheduledAt, user);
  }

  @Delete(':id')
  @RequirePermissions('site_visit.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete site visit (soft delete)' })
  @ApiResponse({ status: 200, description: 'Site visit deleted successfully' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.siteVisitsService.delete(id, user);
  }
}