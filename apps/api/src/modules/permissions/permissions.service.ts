import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.permission.findMany({
      orderBy: [{ module: 'asc' }, { action: 'asc' }],
    });
  }

  async findByModule(module: string) {
    return this.prisma.permission.findMany({
      where: { module },
      orderBy: { action: 'asc' },
    });
  }

  async getModules() {
    const permissions = await this.prisma.permission.findMany({
      select: { module: true },
      distinct: ['module'],
    });
    return permissions.map(p => p.module);
  }
}