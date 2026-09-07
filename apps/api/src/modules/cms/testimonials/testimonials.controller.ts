import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TestimonialsService } from './testimonials.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RoleType } from '@prisma/client';

@ApiTags('testimonials')
@Controller('testimonials')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class TestimonialsController {
  constructor(private testimonialsService: TestimonialsService) {}

  @Post()
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @RequirePermissions('testimonial.create')
  @ApiOperation({ summary: 'Create testimonial' })
  async create(@Body() data: any, @CurrentUser() user: any) {
    return this.testimonialsService.create(data, user);
  }

  @Get()
  @RequirePermissions('testimonial.view')
  @ApiOperation({ summary: 'Get all testimonials' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'isFeatured', required: false, type: Boolean })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  async findAll(@Query() query: any, @CurrentUser() user: any) {
    return this.testimonialsService.findAll(query, user);
  }

  @Get('featured')
  @RequirePermissions('testimonial.view')
  @ApiOperation({ summary: 'Get featured testimonials' })
  async getFeatured(@CurrentUser() user: any) {
    return this.testimonialsService.findAll({ isFeatured: true, isActive: true, limit: 10 }, user);
  }

  @Get(':id')
  @RequirePermissions('testimonial.view')
  @ApiOperation({ summary: 'Get testimonial by ID' })
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.testimonialsService.findById(id, user);
  }

  @Patch(':id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @RequirePermissions('testimonial.update')
  @ApiOperation({ summary: 'Update testimonial' })
  async update(@Param('id') id: string, @Body() data: any, @CurrentUser() user: any) {
    return this.testimonialsService.update(id, data, user);
  }

  @Delete(':id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @RequirePermissions('testimonial.delete')
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.testimonialsService.delete(id, user);
  }
}