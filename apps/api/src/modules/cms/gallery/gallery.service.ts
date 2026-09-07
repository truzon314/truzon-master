import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { User, RoleType, Prisma } from '@prisma/client';

@Injectable()
export class GalleryService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: { page?: number; limit?: number; category?: string; projectId?: string; isActive?: boolean }, currentUser: User) {
    const { page = 1, limit = 20, category, projectId, isActive } = params;
    const where: Prisma.GalleryItemWhereInput = {};
    if (category) where.category = category;
    if (projectId) where.projectId = projectId;
    if (isActive !== undefined) where.isActive = isActive;
    if (currentUser.roleId !== 'SUPER_ADMIN' && currentUser.roleId !== 'ADMIN') where.isActive = true;

    const [items, total] = await Promise.all([
      this.prisma.galleryItem.findMany({ where, skip: (page - 1) * 20, take: 20, orderBy: { position: 'asc' }, include: { media: true, project: { select: { id: true, name: true } } } }),
      this.prisma.galleryItem.count({ where }),
    ]);
    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string, currentUser: User) {
    const item = await this.prisma.galleryItem.findUnique({ where: { id }, include: { media: true, project: true } });
    if (!item) throw new NotFoundException('Gallery item not found');
    if (currentUser.roleId !== 'SUPER_ADMIN' && currentUser.roleId !== 'ADMIN') {
      if (!item.isActive) throw new NotFoundException('Gallery item not found');
    }
    return item;
  }

  async create(data: any, currentUser: User) {
    if (currentUser.roleId !== 'SUPER_ADMIN' && currentUser.roleId !== 'ADMIN') throw new ForbiddenException('Only admins can create gallery items');
    const media = await this.prisma.media.findUnique({ where: { id: data.mediaId } });
    if (!media) throw new NotFoundException('Media not found');
    return this.prisma.galleryItem.create({ data: { ...data, media: { connect: { id: data.mediaId } } }, include: { media: true } });
  }

  async update(id: string, data: any, currentUser: User) {
    if (currentUser.roleId !== 'SUPER_ADMIN' && currentUser.roleId !== 'ADMIN') throw new ForbiddenException('Only admins can update gallery items');
    return this.prisma.galleryItem.update({ where: { id }, data, include: { media: true } });
  }

  async delete(id: string, currentUser: User) {
    if (currentUser.roleId !== 'SUPER_ADMIN' && currentUser.roleId !== 'ADMIN') throw new ForbiddenException('Only admins can delete gallery items');
    await this.prisma.galleryItem.delete({ where: { id } });
  }
}