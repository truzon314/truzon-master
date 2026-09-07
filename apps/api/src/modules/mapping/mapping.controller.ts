import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MappingService } from './mapping.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  CreateMapProjectDto,
  UpdateMapProjectDto,
  UploadMapLayerDto,
  UpdateMapLayerDto,
  UpdateLayerFeaturesDto,
  UpsertMapProviderConfigDto,
  UpsertMapShareLinkDto,
} from './dto/mapping.dto';

@ApiTags('mapping')
@Controller('mapping')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class MappingController {
  constructor(private mappingService: MappingService) {}

  // Projects
  @Get('projects')
  @RequirePermissions('mapping.view')
  @ApiOperation({ summary: 'List all map projects' })
  async findAllProjects(@Query('search') search?: string) {
    return this.mappingService.findAllProjects(search);
  }

  @Post('projects')
  @RequirePermissions('mapping.edit')
  @ApiOperation({ summary: 'Create a map project' })
  async createProject(@Body() dto: CreateMapProjectDto) {
    return this.mappingService.createProject(dto);
  }

  @Get('projects/:id')
  @RequirePermissions('mapping.view')
  @ApiOperation({ summary: 'Get map project by ID' })
  async findProjectById(@Param('id') id: string) {
    return this.mappingService.findProjectById(id);
  }

  @Patch('projects/:id')
  @RequirePermissions('mapping.edit')
  @ApiOperation({ summary: 'Update project settings' })
  async updateProject(@Param('id') id: string, @Body() dto: UpdateMapProjectDto) {
    return this.mappingService.updateProject(id, dto);
  }

  @Delete('projects/:id')
  @RequirePermissions('mapping.edit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete map project' })
  async deleteProject(@Param('id') id: string) {
    return this.mappingService.deleteProject(id);
  }

  // Layers
  @Get('layers')
  @RequirePermissions('mapping.view')
  @ApiOperation({ summary: 'List layers for a project' })
  async findLayers(@Query('projectId') projectId?: string) {
    return this.mappingService.findLayers(projectId);
  }

  @Get('layers/:id')
  @RequirePermissions('mapping.view')
  @ApiOperation({ summary: 'Get layer details' })
  async findLayerById(@Param('id') id: string) {
    return this.mappingService.findLayerById(id);
  }

  @Post('layers/upload')
  @RequirePermissions('mapping.edit')
  @ApiOperation({ summary: 'Upload GIS file & parse layer' })
  async uploadLayer(@Body() dto: UploadMapLayerDto) {
    return this.mappingService.uploadLayer(dto);
  }

  @Patch('layers/:id')
  @RequirePermissions('mapping.edit')
  @ApiOperation({ summary: 'Update layer styling & labels' })
  async updateLayer(@Param('id') id: string, @Body() dto: UpdateMapLayerDto) {
    return this.mappingService.updateLayer(id, dto);
  }

  @Delete('layers/:id')
  @RequirePermissions('mapping.edit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete map layer' })
  async deleteLayer(@Param('id') id: string) {
    return this.mappingService.deleteLayer(id);
  }

  @Put('layers/:id/features')
  @RequirePermissions('mapping.edit')
  @ApiOperation({ summary: 'Update feature properties in GeoJSON' })
  async updateLayerFeatures(@Param('id') id: string, @Body() dto: UpdateLayerFeaturesDto) {
    return this.mappingService.updateLayerFeatures(id, dto.featureId, dto.properties);
  }

  // Share Links
  @Get('share-links')
  @RequirePermissions('mapping.view')
  @ApiOperation({ summary: 'Get project share links' })
  async getShareLinks(@Query('projectId') projectId: string) {
    return this.mappingService.getShareLinks(projectId);
  }

  @Post('share-links')
  @RequirePermissions('mapping.edit')
  @ApiOperation({ summary: 'Upsert project share link' })
  async upsertShareLink(@Body() dto: UpsertMapShareLinkDto, @CurrentUser() user: any) {
    return this.mappingService.upsertShareLink(dto.projectId, {
      ...dto,
      createdById: user?.id,
    });
  }

  // Map Providers
  @Get('providers')
  @RequirePermissions('mapping.view')
  @ApiOperation({ summary: 'List map providers' })
  async getProviders() {
    return this.mappingService.getProviders();
  }

  @Post('providers')
  @RequirePermissions('mapping.edit')
  @ApiOperation({ summary: 'Upsert map provider config' })
  async upsertProvider(@Body() dto: UpsertMapProviderConfigDto) {
    return this.mappingService.upsertProvider(dto);
  }
}