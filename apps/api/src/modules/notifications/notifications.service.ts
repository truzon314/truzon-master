import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotificationDto, NotificationQueryDto } from './dto/notification.dto';
import { User, RoleType, NotificationType, NotificationChannel, Prisma } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto, currentUser: User) {
    const notification = await this.prisma.notification.create({
      data: {
        ...createNotificationDto,
        message: createNotificationDto.message || '',
        channels: createNotificationDto.channels || [NotificationChannel.IN_APP],
        expiresAt: createNotificationDto.expiresAt ? new Date(createNotificationDto.expiresAt) : undefined,
      },
      include: { user: { select: { id: true, fullName: true } } },
    });

    // TODO: Send push/email/sms based on channels
    // This would integrate with Firebase, Twilio, etc.

    return notification;
  }

  async createBulk(userIds: string[], data: Omit<CreateNotificationDto, 'userId'>, currentUser: User) {
    const notifications = await this.prisma.notification.createMany({
      data: userIds.map(userId => ({
        ...data,
        userId,
        message: data.message || '',
        channels: data.channels || [NotificationChannel.IN_APP],
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      })),
    });

    return { count: notifications.count };
  }

  async findAll(query: NotificationQueryDto, currentUser: User) {
    const { page = 1, limit = 20, isRead, type } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = { userId: currentUser.id };
    if (isRead !== undefined) where.isRead = isRead;
    if (type) where.type = type;

    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({ where: { userId: currentUser.id, isRead: false } }),
    ]);

    return { data: notifications, meta: { page, limit, total, totalPages: Math.ceil(total / limit), unreadCount } };
  }

  async findById(id: string, currentUser: User) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) throw new NotFoundException('Notification not found');
    if (notification.userId !== currentUser.id) throw new ForbiddenException('Access denied');

    return notification;
  }

  async markAsRead(id: string, currentUser: User) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification) throw new NotFoundException('Notification not found');
    if (notification.userId !== currentUser.id) throw new ForbiddenException('Access denied');

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(currentUser: User) {
    return this.prisma.notification.updateMany({
      where: { userId: currentUser.id, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async delete(id: string, currentUser: User) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification) throw new NotFoundException('Notification not found');
    if (notification.userId !== currentUser.id) throw new ForbiddenException('Access denied');

    await this.prisma.notification.delete({ where: { id } });
    return { success: true };
  }

  async getUnreadCount(currentUser: User) {
    const count = await this.prisma.notification.count({
      where: { userId: currentUser.id, isRead: false },
    });
    return { unreadCount: count };
  }
}