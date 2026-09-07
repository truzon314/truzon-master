import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, PageType, PageStatus, BlogStatus, InventoryStatus } from '@prisma/client';

@Injectable()
export class PublicService {
  constructor(private prisma: PrismaService) {}

  // Pages
  async getPage(identifier: string) {
    const normalizedType = String(identifier).toUpperCase();
    let page: any = null;

    if (Object.values(PageType).includes(normalizedType as any)) {
      page = await this.prisma.page.findUnique({
        where: { pageType: normalizedType as PageType, status: PageStatus.PUBLISHED },
        include: {
          seo: true,
          blocks: {
            include: { blockDefinition: true },
            orderBy: { position: 'asc' },
          },
        },
      });
    }

    if (!page) {
      const slugCandidate = identifier.startsWith('/') ? identifier : `/${identifier}`;
      page = await this.prisma.page.findFirst({
        where: {
          status: PageStatus.PUBLISHED,
          deletedAt: null,
          OR: [
            { slug: identifier },
            { slug: slugCandidate },
            { slug: `/lp${slugCandidate}` },
            { slug: slugCandidate.replace(/^\/lp\//, '/') },
          ],
        },
        include: {
          seo: true,
          blocks: {
            include: { blockDefinition: true },
            orderBy: { position: 'asc' },
          },
        },
      });
    }

    if (!page) throw new NotFoundException('Page not found');
    return this.toPublicPage(page);
  }

  // Blog
  async listBlogPosts(params: { page?: number; perPage?: number; category?: string; tag?: string; search?: string }) {
    const pageNum = Number(params.page) > 0 ? Number(params.page) : 1;
    const perPageNum = Number(params.perPage) > 0 ? Number(params.perPage) : 10;
    const skip = (pageNum - 1) * perPageNum;

    const { category, tag, search } = params;
    const where: Prisma.BlogPostWhereInput = { status: BlogStatus.PUBLISHED, deletedAt: null };
    if (category) where.categories = { some: { id: category } };
    if (tag) where.tags = { some: { id: tag } };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { body: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip,
        take: perPageNum,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: { select: { id: true, fullName: true } },
          featuredImage: true,
          categories: true,
          tags: true,
        },
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return { data: posts.map(p => this.toPublicBlogPostListItem(p)), meta: { page: pageNum, perPage: perPageNum, total, totalPages: Math.ceil(total / perPageNum) } };
  }

  async getBlogPost(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug, status: BlogStatus.PUBLISHED, deletedAt: null },
      include: {
        author: { select: { id: true, fullName: true } },
        featuredImage: true,
        categories: true,
        tags: true,
        seo: true,
      },
    });

    if (!post) throw new NotFoundException('Blog post not found');
    return this.toPublicBlogPost(post);
  }

  // Properties
  async listProperties(params: { page?: number; perPage?: number; city?: string; categoryId?: string; budgetBracket?: string; signature?: boolean }) {
    const pageNum = Number(params.page) > 0 ? Number(params.page) : 1;
    const perPageNum = Number(params.perPage) > 0 ? Number(params.perPage) : 20;
    const skip = (pageNum - 1) * perPageNum;

    const { city, categoryId, budgetBracket, signature } = params;
    const where: Prisma.PropertyWhereInput = { deletedAt: null, isActive: true };
    if (city) where.OR = [{ name: { contains: city, mode: 'insensitive' } }];
    if (categoryId) where.categories = { some: { id: categoryId } };
    if (signature !== undefined) where.isSignature = signature;

    const [properties, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        skip,
        take: perPageNum,
        orderBy: [{ isSignature: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
        include: {
          project: { select: { id: true, name: true, slug: true, city: true } },
          categories: true,
        },
      }),
      this.prisma.property.count({ where }),
    ]);

    return { data: properties.map(p => this.toPublicPropertyListItem(p)), meta: { page: pageNum, perPage: perPageNum, total, totalPages: Math.ceil(total / perPageNum) } };
  }

  async getProperty(slug: string) {
    const property = await this.prisma.property.findUnique({
      where: { slug, deletedAt: null },
      include: {
        project: { select: { id: true, name: true, slug: true } },
        media: { include: { media: true } },
        categories: true,
        inventoryUnits: { where: { status: InventoryStatus.AVAILABLE, deletedAt: null } },
      },
    });

    if (!property) throw new NotFoundException('Property not found');
    return this.toPublicProperty(property);
  }

  // Careers
  async listCareers() {
    const careers = await this.prisma.career.findMany({
      where: { isActive: true },
      orderBy: { postedAt: 'desc' },
    });
    return careers;
  }

  // Gallery
  async listGalleryItems(category?: string) {
    const where: any = { isActive: true };
    if (category) where.category = category;

    const items = await this.prisma.galleryItem.findMany({
      where,
      orderBy: { position: 'asc' },
      include: { media: true, project: { select: { id: true, name: true } } },
    });

    return items.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      imageUrl: item.media?.url,
      category: item.category,
      project: item.project,
    }));
  }

  // Testimonials
  async listTestimonials(featuredOnly?: boolean) {
    const where: any = { isActive: true };
    if (featuredOnly) where.isFeatured = true;

    const items = await this.prisma.testimonial.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: { media: true, project: { select: { id: true, name: true } } },
    });

    return items.map(item => ({
      id: item.id,
      name: item.name,
      designation: item.designation,
      company: item.company,
      content: item.content,
      rating: item.rating,
      avatarUrl: item.media?.url,
      project: item.project,
    }));
  }

  // Menus
  async getMenu(key: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { key, isActive: true },
      include: {
        items: {
          where: { isActive: true, parentId: null },
          orderBy: { position: 'asc' },
          include: {
            children: {
              where: { isActive: true },
              orderBy: { position: 'asc' },
              include: { page: { select: { slug: true } } },
            },
            page: { select: { slug: true } },
          },
        },
      },
    });

    if (!menu) throw new NotFoundException('Menu not found');

    return {
      key: menu.key,
      label: menu.label,
      items: menu.items.map(item => this.toPublicMenuItem(item)),
    };
  }

  // Settings
  async getSettings() {
    const settings = await this.prisma.setting.findMany({
      where: { isPublic: true },
    });

    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, any>);
  }

  // Categories
  async listCategories(appliesTo?: string) {
    const where: any = { isActive: true };
    if (appliesTo) where.appliesTo = { has: appliesTo };

    const categories = await this.prisma.category.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });

    return categories.map(c => ({ id: c.id, name: c.name, slug: c.slug }));
  }

  // Sitemap
  async sitemapEntries() {
    const [pages, properties, blogPosts, careers] = await Promise.all([
      this.prisma.page.findMany({ where: { status: PageStatus.PUBLISHED, deletedAt: null }, select: { slug: true, updatedAt: true } }),
      this.prisma.property.findMany({ where: { deletedAt: null }, select: { slug: true, updatedAt: true } }),
      this.prisma.blogPost.findMany({ where: { status: BlogStatus.PUBLISHED, deletedAt: null }, select: { slug: true, updatedAt: true } }),
      this.prisma.career.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    ]);

    const entries = [
      ...pages.map(p => ({ path: p.slug, lastModified: p.updatedAt?.toISOString() })),
      ...properties.map(p => ({ path: `/projects/${p.slug}`, lastModified: p.updatedAt?.toISOString() })),
      ...blogPosts.map(b => ({ path: `/blog/${b.slug}`, lastModified: b.updatedAt?.toISOString() })),
      ...careers.map(c => ({ path: `/careers/${c.slug}`, lastModified: c.updatedAt?.toISOString() })),
    ];

    return entries;
  }

  async robotsTxt() {
    const baseUrl = process.env.PUBLIC_URL || 'http://localhost:3000';
    return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
  }

  // Mappers
  private toPublicPage(page: any) {
    return {
      page_type: page.pageType,
      slug: page.slug,
      title: page.title,
      seo: page.seo ? {
        seo_title: page.seo.seoTitle,
        meta_description: page.seo.metaDescription,
        keywords: page.seo.keywords,
        canonical_url: page.seo.canonicalUrl,
        og_title: page.seo.ogTitle,
        og_description: page.seo.ogDescription,
        og_image_url: page.seo.ogImage?.url,
        twitter_card_type: page.seo.twitterCard,
        twitter_title: page.seo.twitterTitle,
        twitter_description: page.seo.twitterDescription,
        twitter_image_url: page.seo.twitterImage?.url,
        robots: page.seo.robots,
        schema_jsonld: page.seo.schemaJsonLd,
      } : null,
      blocks: page.blocks.map((b: any) => ({
        id: b.id,
        type: b.blockDefinition.key,
        position: b.position,
        config: b.config,
      })),
    };
  }

  private toPublicBlogPostListItem(post: any) {
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      featured_image_url: post.featuredImage?.url,
      author_name: post.author?.fullName,
      published_at: post.publishedAt,
      reading_time_minutes: post.readingTimeMinutes,
      categories: post.categories.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug })),
      tags: post.tags.map((t: any) => ({ id: t.id, name: t.name, slug: t.slug })),
    };
  }

  private toPublicBlogPost(post: any) {
    return {
      ...this.toPublicBlogPostListItem(post),
      body: post.body,
      seo: post.seo ? {
        seo_title: post.seo.seoTitle,
        meta_description: post.seo.metaDescription,
        keywords: post.seo.keywords,
        canonical_url: post.seo.canonicalUrl,
        og_title: post.seo.ogTitle,
        og_description: post.seo.ogDescription,
        og_image_url: post.seo.ogImage?.url,
        twitter_card_type: post.seo.twitterCard,
        twitter_title: post.seo.twitterTitle,
        twitter_description: post.seo.twitterDescription,
        twitter_image_url: post.seo.twitterImage?.url,
        robots: post.seo.robots,
        schema_jsonld: post.seo.schemaJsonLd,
      } : null,
    };
  }

  private toPublicPropertyListItem(property: any) {
    return {
      id: property.id,
      name: property.name,
      slug: property.slug,
      city: property.city,
      location_text: property.locationText,
      type: property.propertyType,
      price_display: property.priceDisplay,
      budget_bracket: property.budgetBracket,
      spec_a: property.specA,
      spec_b: property.specB,
      beds_options: property.bedsOptions,
      tag_text: property.tagText,
      status_text: property.statusText,
      is_signature: property.isSignature,
      featured_image_url: property.featuredImage?.url,
    };
  }

  private toPublicProperty(property: any) {
    return {
      ...this.toPublicPropertyListItem(property),
      area_sqft: property.areaSqft?.toString(),
      description: property.description,
      amenities: property.amenities || [],
      categories: property.categories.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug })),
      gallery: property.media?.map((m: any) => m.media?.url) || [],
      seo: property.seo ? {
        seo_title: property.seo.seoTitle,
        meta_description: property.seo.metaDescription,
        keywords: property.seo.keywords,
        canonical_url: property.seo.canonicalUrl,
        og_title: property.seo.ogTitle,
        og_description: property.seo.ogDescription,
        og_image_url: property.seo.ogImage?.url,
        twitter_card_type: property.seo.twitterCard,
        twitter_title: property.seo.twitterTitle,
        twitter_description: property.seo.twitterDescription,
        twitter_image_url: property.seo.twitterImage?.url,
        robots: property.seo.robots,
        schema_jsonld: property.seo.schemaJsonLd,
      } : null,
      map_project_id: property.inventoryUnits?.[0]?.villa?.mapProjectId || property.inventoryUnits?.[0]?.plot?.mapProjectId || null,
      brochure_url: property.brochureMedia?.url,
    };
  }

  private toPublicMenuItem(item: any) {
    return {
      label: item.label,
      href: item.href || item.page?.slug,
      is_external: item.isExternal,
      open_in_new_tab: item.openInNewTab,
      children: item.children?.map((c: any) => this.toPublicMenuItem(c)) || [],
    };
  }
}