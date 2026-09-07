import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePageDto, UpdatePageDto, PublishPageDto, RestoreVersionDto, PageQueryDto } from './dto/page.dto';
import { User, RoleType, PageType, PageStatus, Prisma } from '@prisma/client';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  async create(createPageDto: CreatePageDto, currentUser: User) {
    // Check if page type already exists (only 5 fixed pages)
    const existingPage = await this.prisma.page.findUnique({
      where: { pageType: createPageDto.pageType },
    });
    if (existingPage) throw new ConflictException('Page of this type already exists');

    // Auto-generate slug if not provided
    let slug = createPageDto.slug;
    if (!slug) {
      slug = createPageDto.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      if (slug === '') slug = createPageDto.pageType.toLowerCase();
    }

    // Check slug uniqueness
    const existingSlug = await this.prisma.page.findUnique({ where: { slug } });
    if (existingSlug) throw new ConflictException('Page with this slug already exists');

    // Verify featured image if provided
    if (createPageDto.featuredImageId) {
      const media = await this.prisma.media.findUnique({ where: { id: createPageDto.featuredImageId } });
      if (!media) throw new NotFoundException('Featured image not found');
    }

    // Verify SEO if provided
    if (createPageDto.seoId) {
      const seo = await this.prisma.seoMeta.findUnique({ where: { id: createPageDto.seoId } });
      if (!seo) throw new NotFoundException('SEO metadata not found');
    }

    const page = await this.prisma.$transaction(async (tx) => {
      const page = await tx.page.create({
        data: {
          pageType: createPageDto.pageType,
          slug,
          title: createPageDto.title,
          status: PageStatus.DRAFT,
          featuredImageId: createPageDto.featuredImageId,
          seoId: createPageDto.seoId,
          createdById: currentUser.id,
          updatedById: currentUser.id,
        },
      });

      // Create blocks if provided
      if (createPageDto.blocks?.length) {
        for (const block of createPageDto.blocks) {
          await tx.pageBlock.create({
            data: {
              pageId: page.id,
              blockDefinitionId: block.blockDefinitionId,
              position: block.position,
              config: block.config,
            },
          });
        }
      }

      return page;
    });

    return this.findById(page.id, currentUser);
  }

  async findAll(query: PageQueryDto, currentUser: User) {
    const { page = 1, limit = 20, search, pageType, status, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.PageWhereInput = { deletedAt: null };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (pageType) where.pageType = pageType;
    if (status) where.status = status;

    // Only 5 fixed pages, no role filtering needed
    const [pages, total] = await Promise.all([
      this.prisma.page.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          createdBy: { select: { id: true, fullName: true } },
          updatedBy: { select: { id: true, fullName: true } },
          featuredImage: true,
          seo: true,
          blocks: {
            include: { blockDefinition: true },
            orderBy: { position: 'asc' },
          },
          _count: { select: { blocks: true } },
        },
      }),
      this.prisma.page.count({ where }),
    ]);

    return { data: pages, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string, currentUser: User) {
    const page = await this.prisma.page.findUnique({
      where: { id, deletedAt: null },
      include: {
        createdBy: { select: { id: true, fullName: true } },
        updatedBy: { select: { id: true, fullName: true } },
        featuredImage: true,
        seo: true,
        blocks: {
          include: { blockDefinition: true },
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!page) throw new NotFoundException('Page not found');
    return page;
  }

  async findByPageType(pageType: PageType, currentUser: User) {
    const page = await this.prisma.page.findUnique({
      where: { pageType, deletedAt: null },
      include: {
        featuredImage: true,
        seo: true,
        blocks: {
          include: { blockDefinition: true },
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!page) throw new NotFoundException('Page not found');

    // Return published version for public access
    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      if (page.status !== PageStatus.PUBLISHED) {
        throw new NotFoundException('Page not found');
      }
    }

    return page;
  }

  async findBySlug(slug: string, currentUser: User) {
    const page = await this.prisma.page.findUnique({
      where: { slug, deletedAt: null },
      include: {
        featuredImage: true,
        seo: true,
        blocks: {
          include: { blockDefinition: true },
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!page) throw new NotFoundException('Page not found');

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      if (page.status !== PageStatus.PUBLISHED) {
        throw new NotFoundException('Page not found');
      }
    }

    return page;
  }

  async update(id: string, updatePageDto: UpdatePageDto, currentUser: User) {
    const page = await this.findById(id, currentUser);

    if (updatePageDto.slug && updatePageDto.slug !== page.slug) {
      const existing = await this.prisma.page.findUnique({ where: { slug: updatePageDto.slug } });
      if (existing) throw new ConflictException('Page with this slug already exists');
    }

    // Handle scheduled publishing
    const data: any = { ...updatePageDto, updatedById: currentUser.id };

    if (updatePageDto.status === PageStatus.PUBLISHED && page.status !== PageStatus.PUBLISHED) {
      data.publishedAt = new Date();
    } else if (updatePageDto.status === PageStatus.SCHEDULED && updatePageDto.scheduledAt) {
      data.scheduledAt = new Date(updatePageDto.scheduledAt);
    }

    // Handle blocks update
    if (updatePageDto.blocks?.length) {
      await this.prisma.$transaction(async (tx) => {
        // Delete existing blocks
        await tx.pageBlock.deleteMany({ where: { pageId: id } });

        // Create new blocks
        for (const block of updatePageDto.blocks!) {
          await tx.pageBlock.create({
            data: {
              pageId: id,
              blockDefinitionId: (block as any).blockDefinitionId,
              position: block.position || 0,
              config: block.config || {},
            },
          });
        }
      });
    }

    const updated = await this.prisma.page.update({
      where: { id },
      data,
      include: {
        createdBy: { select: { id: true, fullName: true } },
        updatedBy: { select: { id: true, fullName: true } },
        featuredImage: true,
        seo: true,
        blocks: {
          include: { blockDefinition: true },
          orderBy: { position: 'asc' },
        },
      },
    });

    return updated;
  }

  async publish(id: string, publishPageDto: PublishPageDto, currentUser: User) {
    const page = await this.findById(id, currentUser);

    if (page.status === PageStatus.PUBLISHED) {
      throw new ConflictException('Page is already published');
    }

    // Create version snapshot before publishing
    const blocks = await this.prisma.pageBlock.findMany({
      where: { pageId: id },
      orderBy: { position: 'asc' },
      include: { blockDefinition: true },
    });

    return this.prisma.$transaction(async (tx) => {
      // Update page status
      const updated = await tx.page.update({
        where: { id },
        data: {
          status: PageStatus.PUBLISHED,
          publishedAt: new Date(),
          updatedById: currentUser.id,
        },
        include: {
          featuredImage: true,
          seo: true,
          blocks: { include: { blockDefinition: true }, orderBy: { position: 'asc' } },
        },
      });

      return updated;
    });
  }

  async unpublish(id: string, currentUser: User) {
    const page = await this.findById(id, currentUser);

    if (page.status !== PageStatus.PUBLISHED) {
      throw new ConflictException('Page is not published');
    }

    return this.prisma.page.update({
      where: { id },
      data: {
        status: PageStatus.UNPUBLISHED,
        publishedAt: null,
        updatedById: currentUser.id,
      },
      include: {
        featuredImage: true,
        seo: true,
        blocks: { include: { blockDefinition: true }, orderBy: { position: 'asc' } },
      },
    });
  }

  async restoreVersion(id: string, restoreVersionDto: RestoreVersionDto, currentUser: User) {
    const page = await this.findById(id, currentUser);

    // Versioning not available - just return the current page
    return page;
  }

  async delete(id: string, currentUser: User) {
    const page = await this.findById(id, currentUser);

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      throw new ForbiddenException('Only admins can delete pages');
    }

    // Don't allow deleting the 5 fixed pages
    if (['HOME', 'ABOUT', 'PROJECTS', 'BLOG', 'CONTACT'].includes(page.pageType as string)) {
      throw new ConflictException('Cannot delete fixed pages');
    }

    await this.prisma.page.update({ where: { id }, data: { deletedAt: new Date() } });
    return { success: true };
  }

  async getPageVersions(id: string, currentUser: User) {
    await this.findById(id, currentUser);

    return [];
  }
}