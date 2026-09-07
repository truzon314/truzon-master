import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RoleType } from '@prisma/client';

@ApiTags('settings')
@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  @RequirePermissions('setting.view')
  @ApiOperation({ summary: 'Get all settings' })
  @ApiQuery({ name: 'group', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Settings retrieved successfully' })
  async findAll(@Query('group') group: string | undefined, @CurrentUser() user: any) {
    return this.settingsService.findAll(group, user);
  }

  @Get('groups')
  @RequirePermissions('setting.view')
  @ApiOperation({ summary: 'Get all setting groups' })
  @ApiResponse({ status: 200, description: 'Setting groups retrieved successfully' })
  async getGroups() {
    return this.settingsService.getSettingGroups();
  }

  @Get('public')
  @ApiOperation({ summary: 'Get public settings (no auth required)' })
  @ApiResponse({ status: 200, description: 'Public settings retrieved successfully' })
  async getPublicSettings() {
    return this.settingsService.getPublicSettings();
  }

  @Get(':key')
  @RequirePermissions('setting.view')
  @ApiOperation({ summary: 'Get setting by key' })
  @ApiResponse({ status: 200, description: 'Setting retrieved successfully' })
  async findByKey(@Param('key') key: string, @CurrentUser() user: any) {
    return this.settingsService.findByKey(key, user);
  }

  @Patch(':key')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @RequirePermissions('setting.update')
  @ApiOperation({ summary: 'Update setting' })
  @ApiResponse({ status: 200, description: 'Setting updated successfully' })
  async update(@Param('key') key: string, @Body('value') value: any, @CurrentUser() user: any) {
    return this.settingsService.update(key, value, user);
  }
}