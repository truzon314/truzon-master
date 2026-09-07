import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TaxonomyService } from './taxonomy.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@ApiTags('taxonomy')
@Controller('taxonomy')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class TaxonomyController {
  constructor(private taxonomyService: TaxonomyService) {}

  @Post('categories')
  @RequirePermissions('category.create')
  @ApiOperation({ summary: 'Create category' })
  async createCategory(@Body() data: any, @CurrentUser() user: any) {
    return this.taxonomyService.createCategory(data, user);
  }

  @Get('categories')
  @RequirePermissions('category.view')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'appliesTo', required: false, type: String })
  @ApiQuery({ name: 'parentId', required: false, type: String })
  async findAllCategories(@Query() query: any, @CurrentUser() user: any) {
    return this.taxonomyService.findAllCategories(query, user);
  }

  @Get('categories/:id')
  @RequirePermissions('category.view')
  @ApiOperation({ summary: 'Get category by ID' })
  async findCategoryById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.taxonomyService.findCategoryById(id);
  }

  @Patch('categories/:id')
  @RequirePermissions('category.update')
  @ApiOperation({ summary: 'Update category' })
  async updateCategory(@Param('id') id: string, @Body() data: any, @CurrentUser() user: any) {
    return this.taxonomyService.updateCategory(id, data, user);
  }

  @Delete('categories/:id')
  @RequirePermissions('category.delete')
  async deleteCategory(@Param('id') id: string, @CurrentUser() user: any) {
    return this.taxonomyService.deleteCategory(id, user);
  }

  @Post('tags')
  @RequirePermissions('tag.create')
  @ApiOperation({ summary: 'Create tag' })
  async createTag(@Body() data: any, @CurrentUser() user: any) {
    return this.taxonomyService.createTag(data, user);
  }

  @Get('tags')
  @RequirePermissions('tag.view')
  @ApiOperation({ summary: 'Get all tags' })
  async findAllTags(@Query() query: any, @CurrentUser() user: any) {
    return this.taxonomyService.findAllTags(query, user);
  }

  @Get('tags/:id')
  @RequirePermissions('tag.view')
  @ApiOperation({ summary: 'Get tag by ID' })
  async findTagById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.taxonomyService.findTagById(id);
  }

  @Patch('tags/:id')
  @RequirePermissions('tag.update')
  @ApiOperation({ summary: 'Update tag' })
  async updateTag(@Param('id') id: string, @Body() data: any, @CurrentUser() user: any) {
    return this.taxonomyService.updateTag(id, data, user);
  }

  @Delete('tags/:id')
  @RequirePermissions('tag.delete')
  async deleteTag(@Param('id') id: string, @CurrentUser() user: any) {
    return this.taxonomyService.deleteTag(id, user);
  }
}