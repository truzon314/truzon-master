import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { RoleType } from '@prisma/client';

@ApiTags('roles')
@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post()
  @Roles(RoleType.SUPER_ADMIN)
  @RequirePermissions('role.create')
  @ApiOperation({ summary: 'Create a new role' })
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @RequirePermissions('role.view')
  @ApiOperation({ summary: 'Get all roles' })
  async findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @RequirePermissions('role.view')
  @ApiOperation({ summary: 'Get role by ID' })
  async findById(@Param('id') id: string) {
    return this.rolesService.findById(id);
  }

  @Patch(':id')
  @Roles(RoleType.SUPER_ADMIN)
  @RequirePermissions('role.update')
  @ApiOperation({ summary: 'Update role' })
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Roles(RoleType.SUPER_ADMIN)
  @RequirePermissions('role.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete role' })
  async delete(@Param('id') id: string) {
    return this.rolesService.delete(id);
  }
}