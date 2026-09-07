import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateMenuDto, UpdateMenuDto, MenuQueryDto, CreateMenuItemDto, UpdateMenuItemDto } from './dto/menu.dto';
import { User, RoleType, Prisma } from '@prisma/client';

@Injectable()
export class MenusService {
  constructor(private prisma: PrismaService) {}

  async create(createMenuDto: CreateMenuDto, currentUser: User) {
    const existingMenu = await this.prisma.menu.findUnique({ where: { key: createMenuDto.key } });
    if (existingMenu) throw new ConflictException('Menu with this key already exists');

    const menu = await this.prisma.$transaction(async (tx) => {
      const menu = await tx.menu.create({
        data: {
          key: createMenuDto.key,
          label: createMenuDto.label,
          description: createMenuDto.description,
          isActive: createMenuDto.isActive,
        },
      });

      if (createMenuDto.items?.length) {
        for (const item of createMenuDto.items) {
          await tx.menuItem.create({
            data: {
              menuId: menu.id,
              ...item,
            },
          });
        }
      }

      return menu;
    });

    return this.findById(menu.id, currentUser);
  }

  async findAll(query: MenuQueryDto, currentUser: User) {
    const { page = 1, limit = 20, search, isActive } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.MenuWhereInput = {};
    if (search) where.OR = [{ key: { contains: search, mode: 'insensitive' } }, { label: { contains: search, mode: 'insensitive' } }];
    if (isActive !== undefined) where.isActive = isActive;

    const [menus, total] = await Promise.all([
      this.prisma.menu.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
        include: { items: { where: { isActive: true }, orderBy: { position: 'asc' } } },
      }),
      this.prisma.menu.count({ where }),
    ]);

    return { data: menus, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string, currentUser: User) {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
      include: { items: { where: { isActive: true }, orderBy: { position: 'asc' }, include: { children: { where: { isActive: true }, orderBy: { position: 'asc' } } } } },
    });
    if (!menu) throw new NotFoundException('Menu not found');
    return menu;
  }

  async findByKey(key: string, currentUser: User) {
    const menu = await this.prisma.menu.findUnique({
      where: { key },
      include: { items: { where: { isActive: true }, orderBy: { position: 'asc' }, include: { children: { where: { isActive: true }, orderBy: { position: 'asc' } } } } },
    });
    if (!menu) throw new NotFoundException('Menu not found');
    if (currentUser.roleId !== 'SUPER_ADMIN' && currentUser.roleId !== 'ADMIN') {
      if (!menu.isActive) throw new NotFoundException('Menu not found');
    }
    return menu;
  }

  async update(id: string, updateMenuDto: UpdateMenuDto, currentUser: User) {
    const menu = await this.findById(id, currentUser);

    if (currentUser.roleId !== 'SUPER_ADMIN' && currentUser.roleId !== 'ADMIN') {
      throw new ForbiddenException('Only admins can update menus');
    }

    if (updateMenuDto.items?.length) {
      await this.prisma.$transaction(async (tx) => {
        await tx.menuItem.deleteMany({ where: { menuId: id } });
        for (const item of updateMenuDto.items!) {
          await tx.menuItem.create({ data: { menuId: id, label: item.label || '', ...item } });
        }
      });
    }

    return this.prisma.menu.update({
      where: { id },
      data: { label: updateMenuDto.label, description: updateMenuDto.description, isActive: updateMenuDto.isActive },
      include: { items: { where: { isActive: true }, orderBy: { position: 'asc' }, include: { children: { where: { isActive: true }, orderBy: { position: 'asc' } } } } },
    });
  }

  async delete(id: string, currentUser: User) {
    const menu = await this.findById(id, currentUser);
    if (currentUser.roleId !== 'SUPER_ADMIN' && currentUser.roleId !== 'ADMIN') throw new ForbiddenException('Only admins can delete menus');
    await this.prisma.menu.delete({ where: { id } });
    return { success: true };
  }
}