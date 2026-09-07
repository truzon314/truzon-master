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
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadQueryDto } from './dto/lead-query.dto';
import { AssignLeadDto } from './dto/assign-lead.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RoleType } from '@prisma/client';

@ApiTags('leads')
@Controller('leads')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  @Post()
  @RequirePermissions('lead.create')
  @ApiOperation({ summary: 'Create a new lead' })
  @ApiResponse({ status: 201, description: 'Lead created successfully' })
  @ApiResponse({ status: 404, description: 'Source/Campaign/Project/Property not found' })
  async create(@Body() createLeadDto: CreateLeadDto, @CurrentUser() user: any) {
    return this.leadsService.create(createLeadDto, user);
  }

  @Get()
  @RequirePermissions('lead.view')
  @ApiOperation({ summary: 'Get all leads with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: ['NEW', 'CONTACTED', 'INTERESTED', 'SITE_VISIT', 'NEGOTIATION', 'BOOKED', 'CONVERTED', 'LOST', 'NURTURE'] })
  @ApiQuery({ name: 'sourceId', required: false, type: String })
  @ApiQuery({ name: 'campaignId', required: false, type: String })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiQuery({ name: 'propertyId', required: false, type: String })
  @ApiQuery({ name: 'assignedUserId', required: false, type: String })
  @ApiQuery({ name: 'assignedCpId', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'Leads retrieved successfully' })
  async findAll(@Query() query: LeadQueryDto, @CurrentUser() user: any) {
    return this.leadsService.findAll(query, user);
  }

  @Get('stats')
  @RequirePermissions('lead.view')
  @ApiOperation({ summary: 'Get lead statistics' })
  @ApiResponse({ status: 200, description: 'Lead statistics retrieved successfully' })
  async getStats(@CurrentUser() user: any) {
    return this.leadsService.getLeadStats(user);
  }

  @Get(':id')
  @RequirePermissions('lead.view')
  @ApiOperation({ summary: 'Get lead by ID with all relations' })
  @ApiResponse({ status: 200, description: 'Lead retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.leadsService.findById(id, user);
  }

  @Patch(':id')
  @RequirePermissions('lead.update')
  @ApiOperation({ summary: 'Update lead' })
  @ApiResponse({ status: 200, description: 'Lead updated successfully' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 409, description: 'Invalid status transition or missing lost reason' })
  async update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto, @CurrentUser() user: any) {
    return this.leadsService.update(id, updateLeadDto, user);
  }

  @Post(':id/assign')
  @RequirePermissions('lead.assign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign lead to user or channel partner' })
  @ApiResponse({ status: 200, description: 'Lead assigned successfully' })
  @ApiResponse({ status: 403, description: 'Cannot assign lead' })
  async assign(@Param('id') id: string, @Body() assignLeadDto: AssignLeadDto, @CurrentUser() user: any) {
    return this.leadsService.assign(id, assignLeadDto, user);
  }

  @Delete(':id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @RequirePermissions('lead.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete lead (soft delete)' })
  @ApiResponse({ status: 200, description: 'Lead deleted successfully' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  @ApiResponse({ status: 403, description: 'Only admins can delete leads' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.leadsService.delete(id, user);
  }
}