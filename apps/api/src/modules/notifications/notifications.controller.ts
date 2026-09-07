import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto, NotificationQueryDto } from './dto/notification.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Post()
  @RequirePermissions('notification.send')
  @ApiOperation({ summary: 'Create notification (admin)' })
  async create(@Body() createNotificationDto: CreateNotificationDto, @CurrentUser() user: any) {
    return this.notificationsService.create(createNotificationDto, user);
  }

  @Post('bulk')
  @RequirePermissions('notification.send')
  @ApiOperation({ summary: 'Create notifications for multiple users (admin)' })
  async createBulk(
    @Body('userIds') userIds: string[],
    @Body() data: Omit<CreateNotificationDto, 'userId'>,
    @CurrentUser() user: any,
  ) {
    return this.notificationsService.createBulk(userIds, data, user);
  }

  @Get()
  @RequirePermissions('notification.view')
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'isRead', required: false, type: Boolean })
  @ApiQuery({ name: 'type', required: false, enum: ['LEAD_ASSIGNED', 'LEAD_STATUS_CHANGED', 'FOLLOW_UP_REMINDER', 'SITE_VISIT_REMINDER', 'SITE_VISIT_SCHEDULED', 'BOOKING_UPDATE', 'PAYMENT_UPDATE', 'NEW_PROPERTY', 'NEW_PROJECT', 'ADMIN_ANNOUNCEMENT', 'SYSTEM_ALERT', 'COMMISSION_UPDATE', 'DOCUMENT_REQUEST', 'TASK_ASSIGNED'] })
  @ApiResponse({ status: 200, description: 'Notifications retrieved successfully' })
  async findAll(@Query() query: NotificationQueryDto, @CurrentUser() user: any) {
    return this.notificationsService.findAll(query, user);
  }

  @Get('unread-count')
  @RequirePermissions('notification.view')
  @ApiOperation({ summary: 'Get unread notification count' })
  async getUnreadCount(@CurrentUser() user: any) {
    return this.notificationsService.getUnreadCount(user);
  }

  @Get(':id')
  @RequirePermissions('notification.view')
  @ApiOperation({ summary: 'Get notification by ID' })
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.notificationsService.findById(id, user);
  }

  @Patch(':id/read')
  @RequirePermissions('notification.view')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markAsRead(@Param('id') id: string, @CurrentUser() user: any) {
    return this.notificationsService.markAsRead(id, user);
  }

  @Post('read-all')
  @RequirePermissions('notification.view')
  @HttpCode(200)
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(@CurrentUser() user: any) {
    return this.notificationsService.markAllAsRead(user);
  }

  @Delete(':id')
  @RequirePermissions('notification.view')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete notification' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.notificationsService.delete(id, user);
  }
}