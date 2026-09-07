import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateMediaDto, UpdateMediaDto, MediaQueryDto } from './dto/media.dto';
import { User, RoleType, MediaType, Prisma } from '@prisma/client';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async create(createMediaDto: CreateMediaDto, currentUser: User) {
    // Verify folder if provided
    if (createMediaDto.folderId) {
      const folder = await this.prisma.mediaFolder.findUnique({ where: { id: createMediaDto.folderId } });
      if (!folder) throw new NotFoundException('Folder not found');
    }

    const media = await this.prisma.media.create({
      data: {
        ...createMediaDto,
        uploadedById: currentUser.id,
        sizeBytes: BigInt(createMediaDto.sizeBytes),
      },
      include: {
        folder: true,
        uploadedBy: { select: { id: true, fullName: true } },
      },
    });

    return media;
  }

  async findAll(query: MediaQueryDto, currentUser: User) {
    const { page = 1, limit = 20, search, folderId, type, uploadedById, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.MediaWhereInput = { deletedAt: null };

    if (search) {
      where.OR = [
        { fileName: { contains: search, mode: 'insensitive' } },
        { altText: { contains: search, mode: 'insensitive' } },
        { caption: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (folderId) where.folderId = folderId;
    if (type) where.type = type;
    if (uploadedById) where.uploadedById = uploadedById;

    // Non-admin users see only their uploads
    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      where.uploadedById = currentUser.id;
    }

    const [media, total] = await Promise.all([
      this.prisma.media.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          folder: true,
          uploadedBy: { select: { id: true, fullName: true } },
          _count: { select: { usages: true } },
        },
      }),
      this.prisma.media.count({ where }),
    ]);

    return { data: media, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string, currentUser: User) {
    const media = await this.prisma.media.findUnique({
      where: { id, deletedAt: null },
      include: {
        folder: true,
        uploadedBy: { select: { id: true, fullName: true } },
        usages: { include: { media: true } },
      },
    });

    if (!media) throw new NotFoundException('Media not found');

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      if (media.uploadedById !== currentUser.id) {
        throw new ForbiddenException('Access denied');
      }
    }

    return media;
  }

  async update(id: string, updateMediaDto: UpdateMediaDto, currentUser: User) {
    const media = await this.findById(id, currentUser);

    // Verify folder if provided
    if (updateMediaDto.folderId) {
      const folder = await this.prisma.mediaFolder.findUnique({ where: { id: updateMediaDto.folderId } });
      if (!folder) throw new NotFoundException('Folder not found');
    }

    return this.prisma.media.update({
      where: { id },
      data: updateMediaDto,
      include: {
        folder: true,
        uploadedBy: { select: { id: true, fullName: true } },
      },
    });
  }

  async delete(id: string, currentUser: User) {
    const media = await this.findById(id, currentUser);

    // Check if media is in use
    const usageCount = await this.prisma.mediaUsage.count({ where: { mediaId: id } });
    if (usageCount > 0) {
      throw new ForbiddenException('Cannot delete media that is in use');
    }

    await this.prisma.media.update({ where: { id }, data: { deletedAt: new Date() } });
    return { success: true };
  }

  async getMediaStats(currentUser: User) {
    const where: Prisma.MediaWhereInput = { deletedAt: null };

    if (currentUser.roleId !== RoleType.SUPER_ADMIN && currentUser.roleId !== RoleType.ADMIN) {
      where.uploadedById = currentUser.id;
    }

    const [total, byType, totalSize] = await Promise.all([
      this.prisma.media.count({ where }),
      this.prisma.media.groupBy({ by: ['type'], where, _count: { type: true }, _sum: { sizeBytes: true } }),
      this.prisma.media.aggregate({ where, _sum: { sizeBytes: true } }),
    ]);

    return {
      total,
      totalSizeBytes: totalSize._sum.sizeBytes?.toString() || '0',
      byType: byType.reduce((acc, item) => ({
        ...acc,
        [item.type]: { count: item._count.type, sizeBytes: item._sum.sizeBytes?.toString() || '0' }
      }), {}),
    };
  }
}