import { IsString, IsOptional, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateFormSubmissionDto {
  @ApiProperty({ example: 'hero_quick_enquiry' })
  @IsString()
  formKey: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: '+919876543210' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: 'Villas', required: false })
  @IsOptional()
  @IsString()
  propertyTypeInterest?: string;

  @ApiProperty({ example: 'Interested in 3BHK', required: false })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  utmData?: Record<string, any>;
}

export class UpdateFormSubmissionDto {
  @ApiProperty({ enum: ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'SPAM'], required: false })
  @IsOptional()
  @IsEnum(['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'SPAM'])
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  assignedUserId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class FormSubmissionQueryDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  limit?: number = 20;

  @ApiProperty({ required: false })
  @IsOptional()
  formKey?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  assignedUserId?: string;
}