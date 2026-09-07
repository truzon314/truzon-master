import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { User, RoleType, Prisma } from '@prisma/client';

@Injectable()
export class CareersService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: { page?: number; limit?: number; search?: string; department?: string; isActive?: boolean }, currentUser: User) {
    const { page = 1, limit = 20, search, department, isActive } = params;
    const where: Prisma.CareerWhereInput = {};
    if (search) where.OR = [{ title: { contains: search, mode: 'insensitive' } }, { slug: { contains: search, mode: 'insensitive' } }];
    if (department) where.department = department;
    if (isActive !== undefined) where.isActive = isActive;

    if (currentUser.roleId !== 'SUPER_ADMIN' && currentUser.roleId !== 'ADMIN') where.isActive = true;

    const [careers, total] = await Promise.all([
      this.prisma.career.findMany({ where, skip: (page - 1) * 20, take: 20, orderBy: { postedAt: 'desc' } }),
      this.prisma.career.count({ where }),
    ]);
    return { data: careers, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string, currentUser: User) {
    const career = await this.prisma.career.findUnique({ where: { id } });
    if (!career) throw new NotFoundException('Career not found');
    if (currentUser.roleId !== 'SUPER_ADMIN' && currentUser.roleId !== 'ADMIN') {
      if (!career.isActive) throw new NotFoundException('Career not found');
    }
    return career;
  }

  async findBySlug(slug: string, currentUser: User) {
    const career = await this.prisma.career.findUnique({ where: { slug } });
    if (!career) throw new NotFoundException('Career not found');
    if (currentUser.roleId !== 'SUPER_ADMIN' && currentUser.roleId !== 'ADMIN') {
      if (!career.isActive) throw new NotFoundException('Career not found');
    }
    return career;
  }

  async create(data: any, currentUser: User) {
    if (currentUser.roleId !== 'SUPER_ADMIN' && currentUser.roleId !== 'ADMIN') throw new ForbiddenException('Only admins can create careers');
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await this.prisma.career.findUnique({ where: { slug } });
    if (existing) throw new Error('Career with this slug already exists');
    return this.prisma.career.create({ data: { ...data, slug } });
  }

  async update(id: string, data: any, currentUser: User) {
    if (currentUser.roleId !== 'SUPER_ADMIN' && currentUser.roleId !== 'ADMIN') throw new ForbiddenException('Only admins can update careers');
    return this.prisma.career.update({ where: { id }, data });
  }

  async delete(id: string, currentUser: User) {
    if (currentUser.roleId !== 'SUPER_ADMIN' && currentUser.roleId !== 'ADMIN') throw new ForbiddenException('Only admins can delete careers');
    await this.prisma.career.update({ where: { id }, data: { isActive: false } });
    return { success: true };
  }
}