import { IsString, IsOptional, IsUUID, IsEnum, IsEmail, IsPhoneNumber, MinLength, MaxLength, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateEnquiryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  leadId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @ApiProperty({ example: 'WEBSITE' })
  @IsEnum(['WEBSITE', 'MOBILE', 'PHONE', 'WALK_IN', 'CP', 'REFERRAL', 'EMAIL', 'SOCIAL_MEDIA'])
  source: string;

  @ApiProperty({ example: 'PRICING' })
  @IsEnum(['GENERAL', 'PRICING', 'AVAILABILITY', 'SITE_VISIT', 'BROCHURE', 'FLOOR_PLAN', 'PAYMENT_PLAN', 'OTHER'])
  type: string;

  @ApiProperty({ example: 'Interested in 3BHK villa pricing' })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  subject: string;

  @ApiProperty({ example: 'I would like to know the pricing and availability...' })
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  message: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+919876543210', required: false })
  @IsOptional()
  @IsPhoneNumber('IN')
  phone?: string;
}

export class UpdateEnquiryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['GENERAL', 'PRICING', 'AVAILABILITY', 'SITE_VISIT', 'BROCHURE', 'FLOOR_PLAN', 'PAYMENT_PLAN', 'OTHER'])
  type?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  subject?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  message?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(2000)
  response?: string;

  @ApiProperty({ enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], required: false })
  @IsOptional()
  @IsEnum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'])
  status?: string;

  @ApiProperty({ enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'], required: false })
  @IsOptional()
  @IsEnum(['LOW', 'NORMAL', 'HIGH', 'URGENT'])
  priority?: string;
}

export class EnquiryQueryDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 20;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  leadId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['WEBSITE', 'MOBILE', 'PHONE', 'WALK_IN', 'CP', 'REFERRAL', 'EMAIL', 'SOCIAL_MEDIA'])
  source?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['GENERAL', 'PRICING', 'AVAILABILITY', 'SITE_VISIT', 'BROCHURE', 'FLOOR_PLAN', 'PAYMENT_PLAN', 'OTHER'])
  type?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'])
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['LOW', 'NORMAL', 'HIGH', 'URGENT'])
  priority?: string;

  @ApiProperty({ required: false, example: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiProperty({ required: false, enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}