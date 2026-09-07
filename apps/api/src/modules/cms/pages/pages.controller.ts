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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PagesService } from './pages.service';
import { CreatePageDto, UpdatePageDto, PublishPageDto, RestoreVersionDto, PageQueryDto } from './dto/page.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { PageType, PageStatus } from '@prisma/client';

@ApiTags('pages')
@Controller('pages')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class PagesController {
  constructor(private pagesService: PagesService) {}

  @Post()
  @RequirePermissions('page.create')
  @ApiOperation({ summary: 'Create a new page' })
  @ApiResponse({ status: 201, description: 'Page created successfully' })
  @ApiResponse({ status: 409, description: 'Page type already exists' })
  async create(@Body() createPageDto: CreatePageDto, @CurrentUser() user: any) {
    return this.pagesService.create(createPageDto, user);
  }

  @Get()
  @RequirePermissions('page.view')
  @ApiOperation({ summary: 'Get all pages with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'pageType', required: false, enum: ['HOME', 'ABOUT', 'PROJECTS', 'BLOG', 'CONTACT', 'CUSTOM'] })
  @ApiQuery({ name: 'status', required: false, enum: ['DRAFT', 'SCHEDULED', 'PUBLISHED', 'UNPUBLISHED'] })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'Pages retrieved successfully' })
  async findAll(@Query() query: PageQueryDto, @CurrentUser() user: any) {
    return this.pagesService.findAll(query, user);
  }

  @Get('type/:pageType')
  @RequirePermissions('page.view')
  @ApiOperation({ summary: 'Get page by type (HOME, ABOUT, PROJECTS, BLOG, CONTACT)' })
  @ApiResponse({ status: 200, description: 'Page retrieved successfully' })
  async findByPageType(@Param('pageType') pageType: PageType, @CurrentUser() user: any) {
    return this.pagesService.findByPageType(pageType, user);
  }

  @Get('slug/:slug')
  @RequirePermissions('page.view')
  @ApiOperation({ summary: 'Get page by slug' })
  @ApiResponse({ status: 200, description: 'Page retrieved successfully' })
  async findBySlug(@Param('slug') slug: string, @CurrentUser() user: any) {
    return this.pagesService.findBySlug(slug, user);
  }

  @Get(':id')
  @RequirePermissions('page.view')
  @ApiOperation({ summary: 'Get page by ID with blocks and versions' })
  @ApiResponse({ status: 200, description: 'Page retrieved successfully' })
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.pagesService.findById(id, user);
  }

  @Get(':id/versions')
  @RequirePermissions('page.view')
  @ApiOperation({ summary: 'Get page version history' })
  @ApiResponse({ status: 200, description: 'Page versions retrieved successfully' })
  async getVersions(@Param('id') id: string, @CurrentUser() user: any) {
    return this.pagesService.getPageVersions(id, user);
  }

  @Patch(':id')
  @RequirePermissions('page.update')
  @ApiOperation({ summary: 'Update page (title, status, blocks, featured image, SEO)' })
  @ApiResponse({ status: 200, description: 'Page updated successfully' })
  @ApiResponse({ status: 409, description: 'Slug already exists' })
  async update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto, @CurrentUser() user: any) {
    return this.pagesService.update(id, updatePageDto, user);
  }

  @Post(':id/publish')
  @RequirePermissions('page.publish')
  @ApiOperation({ summary: 'Publish page (creates version snapshot)' })
  @ApiResponse({ status: 200, description: 'Page published successfully' })
  async publish(@Param('id') id: string, @Body() publishPageDto: PublishPageDto, @CurrentUser() user: any) {
    return this.pagesService.publish(id, publishPageDto, user);
  }

  @Post(':id/unpublish')
  @RequirePermissions('page.publish')
  @ApiOperation({ summary: 'Unpublish page' })
  @ApiResponse({ status: 200, description: 'Page unpublished successfully' })
  async unpublish(@Param('id') id: string, @CurrentUser() user: any) {
    return this.pagesService.unpublish(id, user);
  }

  @Post(':id/restore-version')
  @RequirePermissions('page.publish')
  @ApiOperation({ summary: 'Restore page to a previous version' })
  @ApiResponse({ status: 200, description: 'Page restored successfully' })
  async restoreVersion(@Param('id') id: string, @Body() restoreVersionDto: RestoreVersionDto, @CurrentUser() user: any) {
    return this.pagesService.restoreVersion(id, restoreVersionDto, user);
  }

  @Delete(':id')
  @RequirePermissions('page.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete page (soft delete) - cannot delete fixed pages' })
  @ApiResponse({ status: 200, description: 'Page deleted successfully' })
  @ApiResponse({ status: 409, description: 'Cannot delete fixed pages' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.pagesService.delete(id, user);
  }
}