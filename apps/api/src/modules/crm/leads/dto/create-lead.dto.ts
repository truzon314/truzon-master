import { IsString, IsOptional, IsUUID, IsEnum, IsEmail, IsPhoneNumber, MinLength, MaxLength, IsNumber, IsDecimal } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LeadStatus, LeadSourceType } from '@prisma/client';

export class CreateLeadDto {
  @ApiProperty({ example: 'uuid-source-id' })
  @IsUUID()
  sourceId: string;

  @ApiProperty({ example: 'uuid-campaign-id', required: false })
  @IsOptional()
  @IsUUID()
  campaignId?: string;

  @ApiProperty({ example: 'uuid-project-id', required: false })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiProperty({ example: 'uuid-property-id', required: false })
  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: '+919876543210' })
  @IsPhoneNumber('IN')
  phone: string;

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
}