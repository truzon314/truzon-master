import { Controller, Get, Param, Query, Res, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PublicService } from './public.service';
import { Response } from 'express';

@ApiTags('public')
@Controller('public')
export class PublicController {
  constructor(private publicService: PublicService) {}

  @Get('pages/:pageType')
  @ApiOperation({ summary: 'Get published page by type' })
  @ApiResponse({ status: 200, description: 'Page retrieved successfully' })
  async getPublicPage(@Param('pageType') pageType: string, @Res() res: Response) {
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
    const page = await this.publicService.getPage(pageType as any);
    return res.json({ success: true, data: page });
  }

  @Get('blog')
  @ApiOperation({ summary: 'List published blog posts' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'tag', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  async listPublicBlogPosts(
    @Res() res: Response,
    @Query('page') page?: number,
    @Query('per_page') perPage?: number,
    @Query('category') category?: string,
    @Query('tag') tag?: string,
    @Query('search') search?: string,
  ) {
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
    const result = await this.publicService.listBlogPosts({ page, perPage, category, tag, search });
    return res.json({ success: true, data: result.data, meta: result.meta });
  }

  @Get('blog/:slug')
  @ApiOperation({ summary: 'Get published blog post by slug' })
  async getPublicBlogPost(@Param('slug') slug: string, @Res() res: Response) {
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
    const post = await this.publicService.getBlogPost(slug);
    return res.json({ success: true, data: post });
  }

  @Get('properties')
  @ApiOperation({ summary: 'List published properties' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'budget_bracket', required: false, type: String })
  @ApiQuery({ name: 'signature', required: false, type: Boolean })
  async listPublicProperties(
    @Res() res: Response,
    @Query('page') page?: number,
    @Query('per_page') perPage?: number,
    @Query('city') city?: string,
    @Query('categoryId') categoryId?: string,
    @Query('budget_bracket') budgetBracket?: string,
    @Query('signature') signature?: boolean,
  ) {
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
    const result = await this.publicService.listProperties({ page, perPage, city, categoryId, budgetBracket, signature });
    return res.json({ success: true, data: result.data, meta: result.meta });
  }

  @Get('properties/:slug')
  @ApiOperation({ summary: 'Get published property by slug' })
  async getPublicProperty(@Param('slug') slug: string, @Res() res: Response) {
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
    const property = await this.publicService.getProperty(slug);
    return res.json({ success: true, data: property });
  }

  @Get('careers')
  @ApiOperation({ summary: 'List active careers' })
  async listPublicCareers(@Res() res: Response) {
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
    const careers = await this.publicService.listCareers();
    return res.json({ success: true, data: careers });
  }

  @Get('gallery')
  @ApiOperation({ summary: 'List gallery items' })
  @ApiQuery({ name: 'category', required: false, type: String })
  async listPublicGallery(
    @Res() res: Response,
    @Query('category') category?: string,
  ) {
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
    const items = await this.publicService.listGalleryItems(category);
    return res.json({ success: true, data: items });
  }

  @Get('testimonials')
  @ApiOperation({ summary: 'List testimonials' })
  @ApiQuery({ name: 'featuredOnly', required: false, type: Boolean })
  async listPublicTestimonials(
    @Res() res: Response,
    @Query('featuredOnly') featuredOnly?: boolean,
  ) {
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
    const items = await this.publicService.listTestimonials(featuredOnly);
    return res.json({ success: true, data: items });
  }

  @Get('menus/:key')
  @ApiOperation({ summary: 'Get menu by key' })
  async getPublicMenu(@Param('key') key: string, @Res() res: Response) {
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
    const menu = await this.publicService.getMenu(key);
    return res.json({ success: true, data: menu });
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get public settings' })
  async getPublicSettings(@Res() res: Response) {
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
    const settings = await this.publicService.getSettings();
    return res.json({ success: true, data: settings });
  }

  @Get('sitemap')
  @ApiOperation({ summary: 'Get sitemap entries' })
  async getSitemapData(@Res() res: Response) {
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600');
    const entries = await this.publicService.sitemapEntries();
    return res.json({ success: true, data: entries });
  }

  @Get('robots.txt')
  @ApiOperation({ summary: 'Get robots.txt' })
  async getRobotsTxt(@Res() res: Response) {
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600');
    res.setHeader('Content-Type', 'text/plain');
    const robots = await this.publicService.robotsTxt();
    return res.send(robots);
  }

  @Get('categories')
  @ApiOperation({ summary: 'List public categories' })
  @ApiQuery({ name: 'applies_to', required: false, type: String })
  async listPublicCategories(
    @Res() res: Response,
    @Query('applies_to') appliesTo?: string,
  ) {
    const categories = await this.publicService.listCategories(appliesTo);
    return res.json({ success: true, data: categories });
  }
}