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
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto, UpdateCampaignDto, CampaignQueryDto } from './dto/campaign.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RoleType } from '@prisma/client';
import { CampaignStatus } from '@prisma/client';

@ApiTags('campaigns')
@Controller('campaigns')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class CampaignsController {
  constructor(private campaignsService: CampaignsService) {}

  @Post()
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.MANAGER)
  @RequirePermissions('campaign.create')
  @ApiOperation({ summary: 'Create a new campaign' })
  @ApiResponse({ status: 201, description: 'Campaign created successfully' })
  @ApiResponse({ status: 409, description: 'Campaign code already exists' })
  async create(@Body() createCampaignDto: CreateCampaignDto, @CurrentUser() user: any) {
    return this.campaignsService.create(createCampaignDto, user);
  }

  @Get()
  @RequirePermissions('campaign.view')
  @ApiOperation({ summary: 'Get all campaigns with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sourceId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: ['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED'] })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'Campaigns retrieved successfully' })
  async findAll(@Query() query: CampaignQueryDto, @CurrentUser() user: any) {
    return this.campaignsService.findAll(query, user);
  }

  @Get('stats/:id')
  @RequirePermissions('campaign.view')
  @ApiOperation({ summary: 'Get campaign statistics' })
  @ApiResponse({ status: 200, description: 'Campaign stats retrieved successfully' })
  async getStats(@Param('id') id: string, @CurrentUser() user: any) {
    return this.campaignsService.getCampaignStats(id, user);
  }

  @Get(':id')
  @RequirePermissions('campaign.view')
  @ApiOperation({ summary: 'Get campaign by ID' })
  @ApiResponse({ status: 200, description: 'Campaign retrieved successfully' })
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.campaignsService.findById(id, user);
  }

  @Patch(':id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.MANAGER)
  @RequirePermissions('campaign.update')
  @ApiOperation({ summary: 'Update campaign' })
  @ApiResponse({ status: 200, description: 'Campaign updated successfully' })
  @ApiResponse({ status: 409, description: 'Campaign code already exists' })
  async update(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto, @CurrentUser() user: any) {
    return this.campaignsService.update(id, updateCampaignDto, user);
  }

  @Post(':id/activate')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.MANAGER)
  @RequirePermissions('campaign.update')
  @ApiOperation({ summary: 'Activate campaign' })
  @ApiResponse({ status: 200, description: 'Campaign activated successfully' })
  async activate(@Param('id') id: string, @CurrentUser() user: any) {
    return this.campaignsService.activate(id, user);
  }

  @Post(':id/pause')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.MANAGER)
  @RequirePermissions('campaign.update')
  @ApiOperation({ summary: 'Pause campaign' })
  @ApiResponse({ status: 200, description: 'Campaign paused successfully' })
  async pause(@Param('id') id: string, @CurrentUser() user: any) {
    return this.campaignsService.pause(id, user);
  }

  @Post(':id/complete')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.MANAGER)
  @RequirePermissions('campaign.update')
  @ApiOperation({ summary: 'Complete campaign' })
  @ApiResponse({ status: 200, description: 'Campaign completed successfully' })
  async complete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.campaignsService.complete(id, user);
  }

  @Delete(':id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @RequirePermissions('campaign.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete campaign (soft delete)' })
  @ApiResponse({ status: 200, description: 'Campaign deleted successfully' })
  @ApiResponse({ status: 409, description: 'Cannot delete active campaign' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.campaignsService.delete(id, user);
  }
}