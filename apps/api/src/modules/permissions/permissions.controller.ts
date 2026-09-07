import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@ApiTags('permissions')
@Controller('permissions')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}

  @Get()
  @RequirePermissions('permission.view')
  @ApiOperation({ summary: 'Get all permissions' })
  async findAll() {
    return this.permissionsService.findAll();
  }

  @Get('modules')
  @RequirePermissions('permission.view')
  @ApiOperation({ summary: 'Get all permission modules' })
  async getModules() {
    return this.permissionsService.getModules();
  }

  @Get('by-module')
  @RequirePermissions('permission.view')
  @ApiOperation({ summary: 'Get permissions by module' })
  async findByModule(@Query('module') module: string) {
    return this.permissionsService.findByModule(module);
  }
}