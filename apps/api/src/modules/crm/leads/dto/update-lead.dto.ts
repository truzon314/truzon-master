import { IsString, IsOptional, IsUUID, IsEnum, IsEmail, IsPhoneNumber, MinLength, MaxLength, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LeadStatus } from '@prisma/client';

export class UpdateLeadDto {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiProperty({ example: '+919876543210', required: false })
  @IsOptional()
  @IsPhoneNumber('IN')
  phone?: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'Hyderabad', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: '5000000', required: false })
  @IsOptional()
  @IsNumber()
  budgetMin?: number;

  @ApiProperty({ example: '8000000', required: false })
  @IsOptional()
  @IsNumber()
  budgetMax?: number;

  @ApiProperty({ example: 'Looking for 3BHK villa', required: false })
  @IsOptional()
  @IsString()
  requirement?: string;

  @ApiProperty({ enum: LeadStatus, required: false })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @ApiProperty({ example: 'Not interested at this time', required: false })
  @IsOptional()
  @IsString()
  lostReason?: string;

  @ApiProperty({ example: 'uuid-user-id', required: false })
  @IsOptional()
  @IsUUID()
  assignedUserId?: string;

  @ApiProperty({ example: 'uuid-cp-id', required: false })
  @IsOptional()
  @IsUUID()
  assignedCpId?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', required: false })
  @IsOptional()
  nextFollowUpAt?: Date;
}