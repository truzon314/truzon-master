import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleType, Permission } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    const existingRole = await this.prisma.role.findUnique({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new ConflictException('Role with this name already exists');
    }

    const permissions = await this.prisma.permission.findMany({
      where: { key: { in: createRoleDto.permissionKeys } },
    });

    const role = await this.prisma.role.create({
      data: {
        name: createRoleDto.name,
        displayName: createRoleDto.displayName,
        description: createRoleDto.description,
        isSystem: false,
        permissions: { connect: permissions.map(p => ({ id: p.id })) },
      },
      include: { permissions: true },
    });

    return role;
  }

  async findAll() {
    const roles = await this.prisma.role.findMany({
      include: { permissions: true },
      orderBy: { name: 'asc' },
    });

    return roles;
  }

  async findById(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { permissions: true },
    });

    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async findByName(name: RoleType) {
    return this.prisma.role.findUnique({
      where: { name },
      include: { permissions: true },
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.findById(id);

    if (role.isSystem) {
      throw new ConflictException('Cannot modify system roles');
    }

    const permissions = await this.prisma.permission.findMany({
      where: { key: { in: updateRoleDto.permissionKeys } },
    });

    const updatedRole = await this.prisma.role.update({
      where: { id },
      data: {
        displayName: updateRoleDto.displayName,
        description: updateRoleDto.description,
        permissions: { set: permissions.map(p => ({ id: p.id })) },
      },
      include: { permissions: true },
    });

    return updatedRole;
  }

  async delete(id: string) {
    const role = await this.findById(id);
    if (role.isSystem) {
      throw new ConflictException('Cannot delete system roles');
    }

    await this.prisma.role.delete({ where: { id } });
    return { success: true };
  }
}