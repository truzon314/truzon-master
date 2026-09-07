import { IsString, IsOptional, IsUUID, IsEnum, IsNumber, IsDecimal, IsDateString, IsBoolean, Min, Max, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { BookingStatus } from '@prisma/client';

export class CreateBookingDto {
  @ApiProperty()
  @IsUUID()
  leadId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiProperty()
  @IsUUID()
  projectId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @ApiProperty()
  @IsUUID()
  inventoryUnitId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  cpId?: string;

  @ApiProperty({ example: 500000 })
  @IsNumber()
  @Min(0)
  bookingAmount: number;

  @ApiProperty({ example: 50000000 })
  @IsNumber()
  @Min(0)
  totalPrice: number;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number = 0;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxAmount?: number = 0;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

export class UpdateBookingDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['PENDING', 'CONFIRMED', 'CANCELLED', 'EXPIRED', 'COMPLETED'])
  status?: BookingStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxAmount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  cancellationReason?: string;
}

export class BookingQueryDto {
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
  customerId?: string;

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
  inventoryUnitId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  cpId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['PENDING', 'CONFIRMED', 'CANCELLED', 'EXPIRED', 'COMPLETED'])
  status?: BookingStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiProperty({ required: false, example: 'bookingDate' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'bookingDate';

  @ApiProperty({ required: false, enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}