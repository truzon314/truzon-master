import { IsString, IsOptional, IsUUID, IsEnum, IsDateString, IsNumber, IsBoolean, Min, Max, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateSiteVisitDto {
  @ApiProperty()
  @IsUUID()
  leadId: string;

  @ApiProperty()
  @IsUUID()
  projectId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @ApiProperty({ example: '2024-01-20T10:00:00Z' })
  @IsDateString()
  scheduledAt: string;

  @ApiProperty({ example: 60, required: false })
  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(240)
  durationMinutes?: number = 60;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  transportNeeded?: boolean = false;

  @ApiProperty({ example: 'Pick up from home', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  transportDetails?: string;

  @ApiProperty({ example: 'Client wants to see villa 3BHK', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

export class UpdateSiteVisitDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(240)
  durationMinutes?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED'])
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  feedback?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  cancelledReason?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  transportNeeded?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  transportDetails?: string;
}

export class SiteVisitQueryDto {
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
  @IsEnum(['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED'])
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiProperty({ required: false, example: 'scheduledAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'scheduledAt';

  @ApiProperty({ required: false, enum: ['asc', 'desc'], default: 'asc' })
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'asc';
}