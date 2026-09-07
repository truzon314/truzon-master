import { IsString, IsOptional, IsUUID, IsEnum, IsNumber, IsDecimal, IsDateString, IsBoolean, Min, Max, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PaymentStatus, PaymentType } from '@prisma/client';

export class CreatePaymentDto {
  @ApiProperty()
  @IsUUID()
  bookingId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiProperty({ example: 1000000 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ enum: PaymentType })
  @IsEnum(PaymentType)
  type: PaymentType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['BANK_TRANSFER', 'CHEQUE', 'CASH', 'UPI', 'CARD', 'ONLINE', 'RTGS', 'NEFT', 'IMPS'])
  method?: string;

  @ApiProperty({ example: 'TXN123456789', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  transactionId?: string;

  @ApiProperty({ example: 'REF123456', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  referenceNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  paidAt?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  receiptUrl?: string;
}

export class UpdatePaymentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  amount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['PENDING', 'PARTIAL', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED'])
  status?: PaymentStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  transactionId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  referenceNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  paidAt?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  verifiedAt?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  receiptUrl?: string;
}

export class VerifyPaymentDto {
  @ApiProperty({ enum: ['COMPLETED', 'FAILED'] })
  @IsEnum(['COMPLETED', 'FAILED'])
  status: 'COMPLETED' | 'FAILED';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

export class PaymentQueryDto {
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
  bookingId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(PaymentType)
  type?: PaymentType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiProperty({ required: false, example: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiProperty({ required: false, enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}