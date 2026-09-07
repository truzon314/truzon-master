import { IsString, IsOptional, IsEnum, IsArray, IsUUID, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { NotificationType, NotificationChannel } from '@prisma/client';

export class CreateNotificationDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty({ enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ example: 'New Lead Assigned' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'A new lead has been assigned to you', required: false })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  data?: Record<string, any>;

  @ApiProperty({ type: [String], enum: NotificationChannel, default: ['IN_APP'], required: false })
  @IsOptional()
  @IsArray()
  @IsEnum(NotificationChannel, { each: true })
  channels?: NotificationChannel[] = ['IN_APP'];

  @ApiProperty({ example: '/leads/123', required: false })
  @IsOptional()
  @IsString()
  actionUrl?: string;

  @ApiProperty({ example: 'View Lead', required: false })
  @IsOptional()
  @IsString()
  actionLabel?: string;

  @ApiProperty({ example: '2024-01-31T23:59:59Z', required: false })
  @IsOptional()
  expiresAt?: string;
}

export class NotificationQueryDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  limit?: number = 20;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @ApiProperty({ enum: NotificationType, required: false })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;
}