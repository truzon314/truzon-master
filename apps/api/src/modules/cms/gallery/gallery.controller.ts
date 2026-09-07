import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { GalleryService } from './gallery.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RoleType } from '@prisma/client';

@ApiTags('gallery')
@Controller('gallery')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class GalleryController {
  constructor(private galleryService: GalleryService) {}

  @Post()
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @RequirePermissions('gallery.create')
  @ApiOperation({ summary: 'Create gallery item' })
  async create(@Body() data: any, @CurrentUser() user: any) {
    return this.galleryService.create(data, user);
  }

  @Get()
  @RequirePermissions('gallery.view')
  @ApiOperation({ summary: 'Get all gallery items' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  async findAll(@Query() query: any, @CurrentUser() user: any) {
    return this.galleryService.findAll(query, user);
  }

  @Get(':id')
  @RequirePermissions('gallery.view')
  @ApiOperation({ summary: 'Get gallery item by ID' })
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.galleryService.findById(id, user);
  }

  @Patch(':id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @RequirePermissions('gallery.update')
  @ApiOperation({ summary: 'Update gallery item' })
  async update(@Param('id') id: string, @Body() data: any, @CurrentUser() user: any) {
    return this.galleryService.update(id, data, user);
  }

  @Delete(':id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @RequirePermissions('gallery.delete')
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.galleryService.delete(id, user);
  }
}