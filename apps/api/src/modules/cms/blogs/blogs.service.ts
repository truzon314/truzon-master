import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateBlogPostDto, UpdateBlogPostDto, BlogQueryDto } from './dto/blog.dto';
import { User, RoleType, BlogStatus, Prisma } from '@prisma/client';

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) {}

  async create(createBlogPostDto: CreateBlogPostDto, currentUser: User) {
    // Auto-generate slug
    let slug = createBlogPostDto.slug;
    if (!slug) {
      slug = createBlogPostDto.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Check slug uniqueness
    const existingSlug = await this.prisma.blogPost.findUnique({ where: { slug } });
    if (existingSlug) throw new ConflictException('Blog post with this slug already exists');

    // Verify featured image
    if (createBlogPostDto.featuredImageId) {
      const media = await this.prisma.media.findUnique({ where: { id: createBlogPostDto.featuredImageId } });
      if (!media) throw new NotFoundException('Featured image not found');
    }

    // Verify SEO
    if (createBlogPostDto.seoId) {
      const seo = await this.prisma.seoMeta.findUnique({ where: { id: createBlogPostDto.seoId } });
      if (!seo) throw new NotFoundException('SEO metadata not found');
    }

    // Verify categories
    if (createBlogPostDto.categoryIds?.length) {
      const categories = await this.prisma.category.findMany({
        where: { id: { in: createBlogPostDto.categoryIds } },
      });
      if (categories.length !== createBlogPostDto.categoryIds.length) {
        throw new NotFoundException('One or more categories not found');
      }
    }

    // Verify tags
    if (createBlogPostDto.tagIds?.length) {
      const tags = await this.prisma.tag.findMany({
        where: { id: { in: createBlogPostDto.tagIds } },
      });
      if (tags.length !== createBlogPostDto.tagIds.length) {
        throw new NotFoundException('One or more tags not found');
      }
    }

    const blogPost = await this.prisma.blogPost.create({
      data: {
        ...createBlogPostDto,
        slug,
        authorId: currentUser.id,
        readingTimeMinutes: createBlogPostDto.body ? Math.ceil(createBlogPostDto.body.split(/\s+/).length / 200) : undefined,
      },
      include: {
        author: { select: { id: true, fullName: true } },
        featuredImage: true,
        seo: true,
        categories: true,
        tags: true,
      },
    });

    // Handle scheduled publishing
    if (createBlogPostDto.status === BlogStatus.SCHEDULED && createBlogPostDto.scheduledAt) {
      // Could add a cron job to handle scheduled publishing
    }

    return blogPost;
  }

  async findAll(query: BlogQueryDto, currentUser: User) {
    const { page = 1, limit = 20, search, authorId, categoryId, tagId, status, isFeatured, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.BlogPostWhereInput = { deletedAt: null };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (authorId) where.authorId = authorId;
    if (categoryId) where.categories = { some: { id: categoryId } };
    if (tagId) where.tags = { some: { id: tagId } };
    if (status) where.status = status;
    if (isFeatured !== undefined) where.isFeatured = isFeatured;

    // Non-admin users only see published posts
    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      where.status = BlogStatus.PUBLISHED;
    }

    const [posts, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          author: { select: { id: true, fullName: true } },
          featuredImage: true,
          seo: true,
          categories: true,
          tags: true,
          _count: { select: {} },
        },
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return { data: posts, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string, currentUser: User) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id, deletedAt: null },
      include: {
        author: { select: { id: true, fullName: true } },
        featuredImage: true,
        seo: true,
        categories: true,
        tags: true,
      },
    });

    if (!post) throw new NotFoundException('Blog post not found');

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      if (post.status !== BlogStatus.PUBLISHED) {
        throw new NotFoundException('Blog post not found');
      }
    }

    return post;
  }

  async findBySlug(slug: string, currentUser: User) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug, deletedAt: null },
      include: {
        author: { select: { id: true, fullName: true } },
        featuredImage: true,
        seo: true,
        categories: true,
        tags: true,
      },
    });

    if (!post) throw new NotFoundException('Blog post not found');

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      if (post.status !== BlogStatus.PUBLISHED) {
        throw new NotFoundException('Blog post not found');
      }
    }

    // Increment view count
    await this.prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });

    return post;
  }

  async update(id: string, updateBlogPostDto: UpdateBlogPostDto, currentUser: User) {
    const post = await this.findById(id, currentUser);

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      if (post.authorId !== currentUser.id) {
        throw new ForbiddenException('Cannot edit posts by other authors');
      }
    }

    if (updateBlogPostDto.slug && updateBlogPostDto.slug !== post.slug) {
      const existing = await this.prisma.blogPost.findUnique({ where: { slug: updateBlogPostDto.slug } });
      if (existing) throw new ConflictException('Blog post with this slug already exists');
    }

    // Verify categories/tags
    if (updateBlogPostDto.categoryIds?.length) {
      const categories = await this.prisma.category.findMany({
        where: { id: { in: updateBlogPostDto.categoryIds } },
      });
      if (categories.length !== updateBlogPostDto.categoryIds.length) {
        throw new NotFoundException('One or more categories not found');
      }
    }

    if (updateBlogPostDto.tagIds?.length) {
      const tags = await this.prisma.tag.findMany({
        where: { id: { in: updateBlogPostDto.tagIds } },
      });
      if (tags.length !== updateBlogPostDto.tagIds.length) {
        throw new NotFoundException('One or more tags not found');
      }
    }

    const data: any = { ...updateBlogPostDto };
    if (updateBlogPostDto.body) {
      data.readingTimeMinutes = Math.ceil(updateBlogPostDto.body.split(/\s+/).length / 200);
    }

    if (updateBlogPostDto.status === BlogStatus.PUBLISHED && post.status !== BlogStatus.PUBLISHED) {
      data.publishedAt = new Date();
    }

    const updated = await this.prisma.blogPost.update({
      where: { id },
      data: {
        ...data,
        categories: updateBlogPostDto.categoryIds
          ? { set: updateBlogPostDto.categoryIds.map(id => ({ id })) }
          : undefined,
        tags: updateBlogPostDto.tagIds
          ? { set: updateBlogPostDto.tagIds.map(id => ({ id })) }
          : undefined,
        categoryIds: undefined,
        tagIds: undefined,
      },
      include: {
        author: { select: { id: true, fullName: true } },
        featuredImage: true,
        seo: true,
        categories: true,
        tags: true,
      },
    });

    return updated;
  }

  async publish(id: string, currentUser: User) {
    const post = await this.findById(id, currentUser);

    if (post.status === BlogStatus.PUBLISHED) {
      throw new ConflictException('Post is already published');
    }

    return this.prisma.blogPost.update({
      where: { id },
      data: {
        status: BlogStatus.PUBLISHED,
        publishedAt: new Date(),
      },
      include: {
        author: { select: { id: true, fullName: true } },
        featuredImage: true,
        seo: true,
        categories: true,
        tags: true,
      },
    });
  }

  async unpublish(id: string, currentUser: User) {
    const post = await this.findById(id, currentUser);

    if (post.status !== BlogStatus.PUBLISHED) {
      throw new ConflictException('Post is not published');
    }

    return this.prisma.blogPost.update({
      where: { id },
      data: {
        status: BlogStatus.DRAFT,
        publishedAt: null,
      },
      include: {
        author: { select: { id: true, fullName: true } },
        featuredImage: true,
        seo: true,
        categories: true,
        tags: true,
      },
    });
  }

  async delete(id: string, currentUser: User) {
    const post = await this.findById(id, currentUser);

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      if (post.authorId !== currentUser.id) {
        throw new ForbiddenException('Cannot delete posts by other authors');
      }
    }

    await this.prisma.blogPost.update({ where: { id }, data: { deletedAt: new Date() } });
    return { success: true };
  }
}