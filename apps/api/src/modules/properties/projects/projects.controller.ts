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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto } from './dto/project.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RoleType } from '@prisma/client';

@ApiTags('projects')
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  @RequirePermissions('project.create')
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @ApiResponse({ status: 409, description: 'Project slug already exists' })
  async create(@Body() createProjectDto: CreateProjectDto, @CurrentUser() user: any) {
    return this.projectsService.create(createProjectDto, user);
  }

  @Get()
  @RequirePermissions('project.view')
  @ApiOperation({ summary: 'Get all projects with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: ['UPCOMING', 'LAUNCHED', 'ONGOING', 'COMPLETED'] })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'isFeatured', required: false, type: Boolean })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
  async findAll(@Query() query: ProjectQueryDto, @CurrentUser() user: any) {
    return this.projectsService.findAll(query, user);
  }

  @Get('featured')
  @RequirePermissions('project.view')
  @ApiOperation({ summary: 'Get featured projects' })
  @ApiResponse({ status: 200, description: 'Featured projects retrieved successfully' })
  async getFeatured(@CurrentUser() user: any) {
    return this.projectsService.findAll({ isFeatured: true, isActive: true, limit: 10, sortBy: 'sortOrder', sortOrder: 'asc' }, user);
  }

  @Get('stats/:id')
  @RequirePermissions('project.view')
  @ApiOperation({ summary: 'Get project statistics' })
  @ApiResponse({ status: 200, description: 'Project stats retrieved successfully' })
  async getStats(@Param('id') id: string, @CurrentUser() user: any) {
    return this.projectsService.getProjectStats(id, user);
  }

  @Get(':id')
  @RequirePermissions('project.view')
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.projectsService.findById(id, user);
  }

  @Get('slug/:slug')
  @RequirePermissions('project.view')
  @ApiOperation({ summary: 'Get project by slug (public-friendly)' })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully' })
  async findBySlug(@Param('slug') slug: string, @CurrentUser() user: any) {
    return this.projectsService.findBySlug(slug, user);
  }

  @Patch(':id')
  @RequirePermissions('project.update')
  @ApiOperation({ summary: 'Update project' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 409, description: 'Slug already exists' })
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @CurrentUser() user: any) {
    return this.projectsService.update(id, updateProjectDto, user);
  }

  @Post(':id/media')
  @RequirePermissions('project.update')
  @ApiOperation({ summary: 'Add media to project' })
  async addMedia(@Param('id') id: string, @Body('mediaId') mediaId: string, @CurrentUser() user: any) {
    return this.projectsService.addMedia(id, mediaId, user);
  }

  @Delete(':id/media/:mediaId')
  @RequirePermissions('project.update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove media from project' })
  async removeMedia(@Param('id') id: string, @Param('mediaId') mediaId: string, @CurrentUser() user: any) {
    return this.projectsService.removeMedia(id, mediaId, user);
  }

  @Delete(':id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @RequirePermissions('project.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete project (soft delete)' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 409, description: 'Project has dependencies' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.projectsService.delete(id, user);
  }
}