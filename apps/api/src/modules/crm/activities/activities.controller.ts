import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LeadActivitiesService } from './activities.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@ApiTags('lead-activities')
@Controller('leads/:leadId/activities')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class LeadActivitiesController {
  constructor(private activitiesService: LeadActivitiesService) {}

  @Get()
  @RequirePermissions('lead.view')
  @ApiOperation({ summary: 'Get all activities for a lead' })
  @ApiResponse({ status: 200, description: 'Activities retrieved successfully' })
  async findByLead(@Param('leadId') leadId: string, @CurrentUser() user: any) {
    return this.activitiesService.findByLead(leadId, user);
  }
}