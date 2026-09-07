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
import { BlogsService } from './blogs.service';
import { CreateBlogPostDto, UpdateBlogPostDto, BlogQueryDto } from './dto/blog.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { BlogStatus } from '@prisma/client';

@ApiTags('blogs')
@Controller('blogs')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class BlogsController {
  constructor(private blogsService: BlogsService) {}

  @Post()
  @RequirePermissions('blog.create')
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiResponse({ status: 201, description: 'Blog post created successfully' })
  @ApiResponse({ status: 409, description: 'Slug already exists' })
  async create(@Body() createBlogPostDto: CreateBlogPostDto, @CurrentUser() user: any) {
    return this.blogsService.create(createBlogPostDto, user);
  }

  @Get()
  @RequirePermissions('blog.view')
  @ApiOperation({ summary: 'Get all blog posts with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'authorId', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'tagId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: ['DRAFT', 'SCHEDULED', 'PUBLISHED'] })
  @ApiQuery({ name: 'isFeatured', required: false, type: Boolean })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'Blog posts retrieved successfully' })
  async findAll(@Query() query: BlogQueryDto, @CurrentUser() user: any) {
    return this.blogsService.findAll(query, user);
  }

  @Get('featured')
  @RequirePermissions('blog.view')
  @ApiOperation({ summary: 'Get featured blog posts' })
  @ApiResponse({ status: 200, description: 'Featured blog posts retrieved successfully' })
  async getFeatured(@CurrentUser() user: any) {
    return this.blogsService.findAll({ isFeatured: true, status: 'PUBLISHED', limit: 10 }, user);
  }

  @Get('slug/:slug')
  @RequirePermissions('blog.view')
  @ApiOperation({ summary: 'Get blog post by slug (public)' })
  @ApiResponse({ status: 200, description: 'Blog post retrieved successfully' })
  async findBySlug(@Param('slug') slug: string, @CurrentUser() user: any) {
    return this.blogsService.findBySlug(slug, user);
  }

  @Get(':id')
  @RequirePermissions('blog.view')
  @ApiOperation({ summary: 'Get blog post by ID' })
  @ApiResponse({ status: 200, description: 'Blog post retrieved successfully' })
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.blogsService.findById(id, user);
  }

  @Patch(':id')
  @RequirePermissions('blog.update')
  @ApiOperation({ summary: 'Update blog post' })
  @ApiResponse({ status: 200, description: 'Blog post updated successfully' })
  @ApiResponse({ status: 409, description: 'Slug already exists' })
  async update(@Param('id') id: string, @Body() updateBlogPostDto: UpdateBlogPostDto, @CurrentUser() user: any) {
    return this.blogsService.update(id, updateBlogPostDto, user);
  }

  @Post(':id/publish')
  @RequirePermissions('blog.publish')
  @ApiOperation({ summary: 'Publish blog post' })
  @ApiResponse({ status: 200, description: 'Blog post published successfully' })
  async publish(@Param('id') id: string, @CurrentUser() user: any) {
    return this.blogsService.publish(id, user);
  }

  @Post(':id/unpublish')
  @RequirePermissions('blog.publish')
  @ApiOperation({ summary: 'Unpublish blog post' })
  @ApiResponse({ status: 200, description: 'Blog post unpublished successfully' })
  async unpublish(@Param('id') id: string, @CurrentUser() user: any) {
    return this.blogsService.unpublish(id, user);
  }

  @Delete(':id')
  @RequirePermissions('blog.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete blog post (soft delete)' })
  @ApiResponse({ status: 200, description: 'Blog post deleted successfully' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.blogsService.delete(id, user);
  }
}