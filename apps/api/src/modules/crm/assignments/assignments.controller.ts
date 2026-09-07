import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LeadAssignmentsService } from './assignments.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RoleType } from '@prisma/client';

@ApiTags('lead-assignments')
@Controller('leads/:leadId/assignments')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class LeadAssignmentsController {
  constructor(private assignmentsService: LeadAssignmentsService) {}

  @Get()
  @RequirePermissions('lead.view')
  @ApiOperation({ summary: 'Get assignment history for a lead' })
  async findByLead(@Param('leadId') leadId: string, @CurrentUser() user: any) {
    return this.assignmentsService.findByLead(leadId, user);
  }

  @Post('reassign')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.MANAGER)
  @RequirePermissions('lead.assign')
  @ApiOperation({ summary: 'Reassign lead to different user/CP' })
  async reassign(
    @Param('leadId') leadId: string,
    @Body('toUserId') toUserId: string | undefined,
    @Body('toCpId') toCpId: string | undefined,
    @Body('reason') reason: string | undefined,
    @CurrentUser() user: any,
  ) {
    return this.assignmentsService.reassignLead(leadId, toUserId, toCpId, reason, user);
  }
}