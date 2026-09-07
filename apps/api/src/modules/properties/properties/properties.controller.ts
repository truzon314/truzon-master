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
import { PropertiesService } from './properties.service';
import { CreatePropertyDto, UpdatePropertyDto, PropertyQueryDto } from './dto/property.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RoleType } from '@prisma/client';

@ApiTags('properties')
@Controller('properties')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class PropertiesController {
  constructor(private propertiesService: PropertiesService) {}

  @Post()
  @RequirePermissions('property.create')
  @ApiOperation({ summary: 'Create a new property' })
  @ApiResponse({ status: 201, description: 'Property created successfully' })
  @ApiResponse({ status: 409, description: 'Property slug already exists in project' })
  async create(@Body() createPropertyDto: CreatePropertyDto, @CurrentUser() user: any) {
    return this.propertiesService.create(createPropertyDto, user);
  }

  @Get()
  @RequirePermissions('property.view')
  @ApiOperation({ summary: 'Get all properties with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiQuery({ name: 'propertyType', required: false, enum: ['VILLA', 'PLOT', 'APARTMENT', 'COMMERCIAL'] })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'budgetBracket', required: false, enum: ['under2', '2to5', '5to10', '10plus'] })
  @ApiQuery({ name: 'isSignature', required: false, type: Boolean })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'Properties retrieved successfully' })
  async findAll(@Query() query: PropertyQueryDto, @CurrentUser() user: any) {
    return this.propertiesService.findAll(query, user);
  }

  @Get('featured')
  @RequirePermissions('property.view')
  @ApiOperation({ summary: 'Get signature/featured properties' })
  @ApiResponse({ status: 200, description: 'Featured properties retrieved successfully' })
  async getFeatured(@CurrentUser() user: any) {
    return this.propertiesService.findAll({ isSignature: true, isActive: true, limit: 10 }, user);
  }

  @Get(':id')
  @RequirePermissions('property.view')
  @ApiOperation({ summary: 'Get property by ID' })
  @ApiResponse({ status: 200, description: 'Property retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.propertiesService.findById(id, user);
  }

  @Get('project/:projectSlug/property/:propertySlug')
  @RequirePermissions('property.view')
  @ApiOperation({ summary: 'Get property by project and property slug (public-friendly)' })
  @ApiResponse({ status: 200, description: 'Property retrieved successfully' })
  async findBySlug(
    @Param('projectSlug') projectSlug: string,
    @Param('propertySlug') propertySlug: string,
    @CurrentUser() user: any,
  ) {
    return this.propertiesService.findBySlug(projectSlug, propertySlug, user);
  }

  @Get(':id/inventory/available')
  @RequirePermissions('property.view')
  @ApiOperation({ summary: 'Get available inventory units for a property' })
  @ApiResponse({ status: 200, description: 'Available inventory retrieved successfully' })
  async getAvailableInventory(@Param('id') id: string, @CurrentUser() user: any) {
    return this.propertiesService.getAvailableInventory(id);
  }

  @Patch(':id')
  @RequirePermissions('property.update')
  @ApiOperation({ summary: 'Update property' })
  @ApiResponse({ status: 200, description: 'Property updated successfully' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  @ApiResponse({ status: 409, description: 'Slug already exists' })
  async update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto, @CurrentUser() user: any) {
    return this.propertiesService.update(id, updatePropertyDto, user);
  }

  @Post(':id/media')
  @RequirePermissions('property.update')
  @ApiOperation({ summary: 'Add media to property' })
  async addMedia(
    @Param('id') id: string,
    @Body('mediaId') mediaId: string,
    @Body('type') type: string,
    @CurrentUser() user: any,
  ) {
    return this.propertiesService.addMedia(id, mediaId, type || 'GALLERY', user);
  }

  @Delete(':id/media/:mediaId')
  @RequirePermissions('property.update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove media from property' })
  async removeMedia(@Param('id') id: string, @Param('mediaId') mediaId: string, @CurrentUser() user: any) {
    return this.propertiesService.removeMedia(id, mediaId, user);
  }

  @Delete(':id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @RequirePermissions('property.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete property (soft delete)' })
  @ApiResponse({ status: 200, description: 'Property deleted successfully' })
  @ApiResponse({ status: 409, description: 'Property has dependencies' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.propertiesService.delete(id, user);
  }
}