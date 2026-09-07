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
import { MediaService } from './media.service';
import { CreateMediaDto, UpdateMediaDto, MediaQueryDto } from './dto/media.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { MediaType } from '@prisma/client';

@ApiTags('media')
@Controller('media')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post()
  @RequirePermissions('media.upload')
  @ApiOperation({ summary: 'Upload media (register uploaded file)' })
  @ApiResponse({ status: 201, description: 'Media registered successfully' })
  async create(@Body() createMediaDto: CreateMediaDto, @CurrentUser() user: any) {
    return this.mediaService.create(createMediaDto, user);
  }

  @Get()
  @RequirePermissions('media.view')
  @ApiOperation({ summary: 'Get all media with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'folderId', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, enum: ['IMAGE', 'VIDEO', 'DOCUMENT', 'OTHER'] })
  @ApiQuery({ name: 'uploadedById', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'Media retrieved successfully' })
  async findAll(@Query() query: MediaQueryDto, @CurrentUser() user: any) {
    return this.mediaService.findAll(query, user);
  }

  @Get('stats')
  @RequirePermissions('media.view')
  @ApiOperation({ summary: 'Get media statistics' })
  @ApiResponse({ status: 200, description: 'Media stats retrieved successfully' })
  async getStats(@CurrentUser() user: any) {
    return this.mediaService.getMediaStats(user);
  }

  @Get(':id')
  @RequirePermissions('media.view')
  @ApiOperation({ summary: 'Get media by ID' })
  @ApiResponse({ status: 200, description: 'Media retrieved successfully' })
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.mediaService.findById(id, user);
  }

  @Patch(':id')
  @RequirePermissions('media.update')
  @ApiOperation({ summary: 'Update media metadata' })
  @ApiResponse({ status: 200, description: 'Media updated successfully' })
  async update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto, @CurrentUser() user: any) {
    return this.mediaService.update(id, updateMediaDto, user);
  }

  @Delete(':id')
  @RequirePermissions('media.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete media (soft delete)' })
  @ApiResponse({ status: 200, description: 'Media deleted successfully' })
  @ApiResponse({ status: 409, description: 'Media is in use' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.mediaService.delete(id, user);
  }
}