import { Controller, Get, Param, Headers, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MappingService } from './mapping.service';

@ApiTags('public-mapping')
@Controller('public/mapping')
export class PublicMappingController {
  constructor(private mappingService: MappingService) {}

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get public map project metadata & styles' })
  async getPublicProject(@Param('projectId') projectId: string) {
    return this.mappingService.getPublicProject(projectId);
  }

  @Get('project/:projectId/layers/:layerId')
  @ApiOperation({ summary: 'Get public layer GeoJSON data' })
  async getPublicLayerGeoJson(
    @Param('projectId') projectId: string,
    @Param('layerId') layerId: string,
  ) {
    return this.mappingService.getPublicLayerGeoJson(projectId, layerId);
  }

  @Get(':token')
  @ApiOperation({ summary: 'Resolve shared map details by token' })
  async resolveSharedMapByToken(
    @Param('token') token: string,
    @Headers('x-share-password') passwordHeader?: string,
    @Query('password') passwordQuery?: string,
  ) {
    const password = passwordHeader || passwordQuery;
    return this.mappingService.resolveSharedMapByToken(token, password);
  }

  @Get(':token/layers/:layerId')
  @ApiOperation({ summary: 'Resolve shared layer GeoJSON by token' })
  async resolveSharedLayerGeoJsonByToken(
    @Param('token') token: string,
    @Param('layerId') layerId: string,
    @Headers('x-share-password') passwordHeader?: string,
    @Query('password') passwordQuery?: string,
  ) {
    const password = passwordHeader || passwordQuery;
    const { project } = await this.mappingService.resolveSharedMapByToken(token, password);
    return this.mappingService.getPublicLayerGeoJson(project.id, layerId);
  }
}
