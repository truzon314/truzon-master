import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LeadFollowUpsService } from './followups.service';
import { CreateFollowUpDto, UpdateFollowUpDto } from './dto/followup.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@ApiTags('lead-followups')
@Controller('leads/:leadId/followups')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class LeadFollowUpsController {
  constructor(private followUpsService: LeadFollowUpsService) {}

  @Post()
  @RequirePermissions('lead.update')
  @ApiOperation({ summary: 'Create a follow-up for a lead' })
  @ApiResponse({ status: 201, description: 'Follow-up created successfully' })
  async create(@Param('leadId') leadId: string, @Body() createFollowUpDto: CreateFollowUpDto, @CurrentUser() user: any) {
    return this.followUpsService.create(leadId, createFollowUpDto, user);
  }

  @Get()
  @RequirePermissions('lead.view')
  @ApiOperation({ summary: 'Get all follow-ups for a lead' })
  @ApiResponse({ status: 200, description: 'Follow-ups retrieved successfully' })
  async findByLead(@Param('leadId') leadId: string, @CurrentUser() user: any) {
    return this.followUpsService.findByLead(leadId, user);
  }

  @Get(':id')
  @RequirePermissions('lead.view')
  @ApiOperation({ summary: 'Get follow-up by ID' })
  @ApiResponse({ status: 200, description: 'Follow-up retrieved successfully' })
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.followUpsService.findById(id, user);
  }

  @Patch(':id')
  @RequirePermissions('lead.update')
  @ApiOperation({ summary: 'Update follow-up' })
  @ApiResponse({ status: 200, description: 'Follow-up updated successfully' })
  async update(@Param('id') id: string, @Body() updateFollowUpDto: UpdateFollowUpDto, @CurrentUser() user: any) {
    return this.followUpsService.update(id, updateFollowUpDto, user);
  }

  @Post(':id/complete')
  @RequirePermissions('lead.update')
  @ApiOperation({ summary: 'Mark follow-up as completed' })
  @ApiResponse({ status: 200, description: 'Follow-up completed successfully' })
  async complete(
    @Param('id') id: string,
    @Body('outcome') outcome: string,
    @Body('notes') notes: string | undefined,
    @CurrentUser() user: any,
  ) {
    return this.followUpsService.complete(id, outcome, notes, user);
  }

  @Delete(':id')
  @RequirePermissions('lead.update')
  @ApiOperation({ summary: 'Delete follow-up' })
  @ApiResponse({ status: 200, description: 'Follow-up deleted successfully' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.followUpsService.delete(id, user);
  }
}