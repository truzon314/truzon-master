import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MenusService } from './menus.service';
import { CreateMenuDto, UpdateMenuDto, MenuQueryDto } from './dto/menu.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@ApiTags('menus')
@Controller('menus')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class MenusController {
  constructor(private menusService: MenusService) {}

  @Post()
  @RequirePermissions('menu.create')
  @ApiOperation({ summary: 'Create a new menu' })
  @ApiResponse({ status: 201, description: 'Menu created successfully' })
  async create(@Body() createMenuDto: CreateMenuDto, @CurrentUser() user: any) {
    return this.menusService.create(createMenuDto, user);
  }

  @Get()
  @RequirePermissions('menu.view')
  @ApiOperation({ summary: 'Get all menus with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Menus retrieved successfully' })
  async findAll(@Query() query: MenuQueryDto, @CurrentUser() user: any) {
    return this.menusService.findAll(query, user);
  }

  @Get('key/:key')
  @RequirePermissions('menu.view')
  @ApiOperation({ summary: 'Get menu by key (public)' })
  @ApiResponse({ status: 200, description: 'Menu retrieved successfully' })
  async findByKey(@Param('key') key: string, @CurrentUser() user: any) {
    return this.menusService.findByKey(key, user);
  }

  @Get(':id')
  @RequirePermissions('menu.view')
  @ApiOperation({ summary: 'Get menu by ID with items' })
  @ApiResponse({ status: 200, description: 'Menu retrieved successfully' })
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.menusService.findById(id, user);
  }

  @Patch(':id')
  @RequirePermissions('menu.update')
  @ApiOperation({ summary: 'Update menu' })
  @ApiResponse({ status: 200, description: 'Menu updated successfully' })
  async update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto, @CurrentUser() user: any) {
    return this.menusService.update(id, updateMenuDto, user);
  }

  @Delete(':id')
  @RequirePermissions('menu.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete menu (soft delete)' })
  @ApiResponse({ status: 200, description: 'Menu deleted successfully' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.menusService.delete(id, user);
  }
}