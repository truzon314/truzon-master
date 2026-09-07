import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CareersService } from './careers.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RoleType } from '@prisma/client';

@ApiTags('careers')
@Controller('careers')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class CareersController {
  constructor(private careersService: CareersService) {}

  @Post()
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @RequirePermissions('career.create')
  @ApiOperation({ summary: 'Create career' })
  async create(@Body() data: any, @CurrentUser() user: any) {
    return this.careersService.create(data, user);
  }

  @Get()
  @RequirePermissions('career.view')
  @ApiOperation({ summary: 'Get all careers' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'department', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  async findAll(@Query() query: any, @CurrentUser() user: any) {
    return this.careersService.findAll(query, user);
  }

  @Get('featured')
  @RequirePermissions('career.view')
  @ApiOperation({ summary: 'Get featured careers' })
  async getFeatured(@CurrentUser() user: any) {
    return this.careersService.findAll({ isActive: true, limit: 10 } as any, user);
  }

  @Get('slug/:slug')
  @RequirePermissions('career.view')
  @ApiOperation({ summary: 'Get career by slug' })
  async findBySlug(@Param('slug') slug: string, @CurrentUser() user: any) {
    return this.careersService.findBySlug(slug, user);
  }

  @Get(':id')
  @RequirePermissions('career.view')
  @ApiOperation({ summary: 'Get career by ID' })
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.careersService.findById(id, user);
  }

  @Patch(':id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @RequirePermissions('career.update')
  @ApiOperation({ summary: 'Update career' })
  async update(@Param('id') id: string, @Body() data: any, @CurrentUser() user: any) {
    return this.careersService.update(id, data, user);
  }

  @Delete(':id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @RequirePermissions('career.delete')
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.careersService.delete(id, user);
  }
}