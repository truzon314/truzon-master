import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(group: string | undefined, currentUser: any) {
    const where: Prisma.SettingWhereInput = {};
    if (group) where.group = group;

    return this.prisma.setting.findMany({
      where,
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
    });
  }

  async findByKey(key: string, currentUser: any) {
    const setting = await this.prisma.setting.findUnique({ where: { key } });
    if (!setting) throw new NotFoundException(`Setting '${key}' not found`);
    return setting;
  }

  async update(key: string, value: any, currentUser: any) {
    const setting = await this.prisma.setting.findUnique({ where: { key } });
    if (!setting) throw new NotFoundException(`Setting '${key}' not found`);

    return this.prisma.setting.update({
      where: { key },
      data: { value: JSON.stringify(value) },
    });
  }

  async getSettingGroups() {
    const groups = await this.prisma.setting.findMany({
      select: { group: true },
      distinct: ['group'],
      orderBy: { group: 'asc' },
    });
    return groups.map(g => g.group);
  }

  async getPublicSettings() {
    const settings = await this.prisma.setting.findMany({
      where: { isPublic: true },
    });

    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, any>);
  }
}
