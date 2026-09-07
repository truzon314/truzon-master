import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    if (createUserDto.phone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone: createUserDto.phone },
      });
      if (existingPhone) {
        throw new ConflictException('User with this phone already exists');
      }
    }

    const passwordHash = await bcrypt.hash(createUserDto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        phone: createUserDto.phone,
        passwordHash,
        fullName: createUserDto.fullName,
        role: createUserDto.roleId ? { connect: { id: createUserDto.roleId } } : undefined as any,
        status: createUserDto.status || 'ACTIVE',
        emailVerified: createUserDto.emailVerified || false,
      },
      include: {
        role: { include: { permissions: true } },
      },
    });

    return this.sanitizeUser(user);
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    roleId?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const { page = 1, limit = 20, search, roleId, status, sortBy = 'createdAt', sortOrder = 'desc' } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    if (roleId) where.roleId = roleId;
    if (status) where.status = status;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          role: { include: { permissions: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map(u => this.sanitizeUser(u)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: {
        role: { include: { permissions: true } },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user);
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        role: { include: { permissions: true } },
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone: updateUserDto.phone },
      });
      if (existingPhone) {
        throw new ConflictException('User with this phone already exists');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        email: updateUserDto.email,
        phone: updateUserDto.phone,
        fullName: updateUserDto.fullName,
        roleId: updateUserDto.roleId,
        status: updateUserDto.status,
        avatarUrl: updateUserDto.avatarUrl,
        twoFactorEnabled: updateUserDto.twoFactorEnabled,
      },
      include: {
        role: { include: { permissions: true } },
      },
    });

    return this.sanitizeUser(updatedUser);
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const isValid = await bcrypt.compare(changePasswordDto.currentPassword, user.passwordHash);
    if (!isValid) throw new ConflictException('Current password is incorrect');

    const passwordHash = await bcrypt.hash(changePasswordDto.newPassword, 12);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id },
        data: { passwordHash },
      }),
      this.prisma.refreshToken.updateMany({
        where: { userId: id, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    return { success: true };
  }

  async resetPassword(id: string, newPassword: string) {
    const passwordHash = await bcrypt.hash(newPassword, 12);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id },
        data: { passwordHash },
      }),
      this.prisma.refreshToken.updateMany({
        where: { userId: id, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    return { success: true };
  }

  async delete(id: string) {
    await this.findById(id);
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { success: true };
  }

  async getUserStats() {
    const [total, active, inactive, pending] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.user.count({ where: { deletedAt: null, status: 'ACTIVE' } }),
      this.prisma.user.count({ where: { deletedAt: null, status: 'INACTIVE' } }),
      this.prisma.user.count({ where: { deletedAt: null, status: 'PENDING_VERIFICATION' } }),
    ]);

    return { total, active, inactive, pending };
  }

  private sanitizeUser(user: any) {
    const { passwordHash, twoFactorSecret, refreshTokens, authTokens, ...sanitized } = user;
    return sanitized;
  }
}