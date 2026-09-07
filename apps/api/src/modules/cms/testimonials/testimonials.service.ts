import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { User, RoleType, Prisma } from '@prisma/client';

@Injectable()
export class TestimonialsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: { page?: number; limit?: number; isFeatured?: boolean; isActive?: boolean }, currentUser: User) {
    const { page = 1, limit = 20, isFeatured, isActive } = params;
    const where: Prisma.TestimonialWhereInput = {};
    if (isFeatured !== undefined) where.isFeatured = isFeatured;
    if (isActive !== undefined) where.isActive = isActive;
    if (currentUser.roleId !== 'SUPER_ADMIN' && currentUser.roleId !== 'ADMIN') where.isActive = true;

    const [items, total] = await Promise.all([
      this.prisma.testimonial.findMany({ where, skip: (page - 1) * 20, take: 20, orderBy: { sortOrder: 'asc' }, include: { media: true, project: { select: { id: true, name: true } } } }),
      this.prisma.testimonial.count({ where }),
    ]);
    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string, currentUser: User) {
    const item = await this.prisma.testimonial.findUnique({ where: { id }, include: { media: true, project: true } });
    if (!item) throw new NotFoundException('Testimonial not found');
    if (currentUser.roleId !== 'SUPER_ADMIN' && currentUser.roleId !== 'ADMIN') {
      if (!item.isActive) throw new NotFoundException('Testimonial not found');
    }
    return item;
  }

  async create(data: any, currentUser: User) {
    if (currentUser.roleId !== 'SUPER_ADMIN' && currentUser.roleId !== 'ADMIN') throw new ForbiddenException('Only admins can create testimonials');
    if (data.mediaId) {
      const media = await this.prisma.media.findUnique({ where: { id: data.mediaId } });
      if (!media) throw new NotFoundException('Media not found');
    }
    if (data.projectId) {
      const project = await this.prisma.project.findUnique({ where: { id: data.projectId } });
      if (!project) throw new NotFoundException('Project not found');
    }
    return this.prisma.testimonial.create({ data: { ...data }, include: { media: true, project: true } });
  }

  async update(id: string, data: any, currentUser: User) {
    if (currentUser.roleId !== 'SUPER_ADMIN' && currentUser.roleId !== 'ADMIN') throw new ForbiddenException('Only admins can update testimonials');
    return this.prisma.testimonial.update({ where: { id }, data, include: { media: true, project: true } });
  }

  async delete(id: string, currentUser: User) {
    if (currentUser.roleId !== 'SUPER_ADMIN' && currentUser.roleId !== 'ADMIN') throw new ForbiddenException('Only admins can delete testimonials');
    await this.prisma.testimonial.delete({ where: { id } });
  }
}