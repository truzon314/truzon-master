import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { User, RoleType, Prisma } from '@prisma/client';

@Injectable()
export class TaxonomyService {
  constructor(private prisma: PrismaService) {}

  // Categories
  async createCategory(data: { name: string; slug?: string; description?: string; parentId?: string; appliesTo?: string[] }, currentUser: User) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await this.prisma.category.findUnique({ where: { slug } });
    if (existing) throw new ConflictException('Category with this slug already exists');

    return this.prisma.category.create({
      data: { ...data, slug },
      include: { children: true },
    });
  }

  async findAllCategories(params: { page?: number; limit?: number; search?: string; appliesTo?: string; parentId?: string }, currentUser: User) {
    const { page = 1, limit = 20, search, appliesTo, parentId } = params;
    const where: Prisma.CategoryWhereInput = {};
    if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { slug: { contains: search, mode: 'insensitive' } }];
    if (appliesTo) where.appliesTo = { has: appliesTo };
    if (parentId) where.parentId = parentId;

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { sortOrder: 'asc' }, include: { children: true } }),
      this.prisma.category.count({ where }),
    ]);
    return { data: categories, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findCategoryById(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id }, include: { children: true } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async updateCategory(id: string, data: any, currentUser: User) {
    if (currentUser.roleId !== 'SUPER_ADMIN' && currentUser.roleId !== 'ADMIN') throw new ForbiddenException('Only admins can update categories');
    return this.prisma.category.update({ where: { id }, data, include: { children: true } });
  }

  async deleteCategory(id: string, currentUser: User) {
    if (currentUser.roleId !== 'SUPER_ADMIN' && currentUser.roleId !== 'ADMIN') throw new ForbiddenException('Only admins can delete categories');
    await this.prisma.category.delete({ where: { id } });
    return { success: true };
  }

  // Tags
  async createTag(data: { name: string; slug?: string; description?: string; color?: string }, currentUser: User) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await this.prisma.tag.findUnique({ where: { slug } });
    if (existing) throw new ConflictException('Tag with this slug already exists');

    return this.prisma.tag.create({ data: { ...data, slug } });
  }

  async findAllTags(params: { page?: number; limit?: number; search?: string }, currentUser: User) {
    const { page = 1, limit = 20, search } = params;
    const where: Prisma.TagWhereInput = {};
    if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { slug: { contains: search, mode: 'insensitive' } }];

    const [tags, total] = await Promise.all([
      this.prisma.tag.findMany({ where, skip: (page - 1) * 20, take: 20, orderBy: { createdAt: 'desc' } }),
      this.prisma.tag.count({ where }),
    ]);
    return { data: tags, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findTagById(id: string) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) throw new NotFoundException('Tag not found');
    return tag;
  }

  async updateTag(id: string, data: any, currentUser: User) {
    if (currentUser.roleId !== 'SUPER_ADMIN' && currentUser.roleId !== 'ADMIN') throw new ForbiddenException('Only admins can update tags');
    return this.prisma.tag.update({ where: { id }, data });
  }

  async deleteTag(id: string, currentUser: User) {
    if (currentUser.roleId !== 'SUPER_ADMIN' && currentUser.roleId !== 'ADMIN') throw new ForbiddenException('Only admins can delete tags');
    await this.prisma.tag.delete({ where: { id } });
    return { success: true };
  }
}