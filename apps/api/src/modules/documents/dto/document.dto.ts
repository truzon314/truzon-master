import { IsString, IsOptional, IsUUID, IsEnum, IsDateString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '@prisma/client';

export class CreateDocumentDto {
  @ApiProperty({ example: 'Sale Agreement' })
  @IsString()
  name: string;

  @ApiProperty({ enum: DocumentType })
  @IsEnum(DocumentType)
  type: DocumentType;

  @ApiProperty()
  @IsUUID()
  fileId: string;

  @ApiProperty({ example: 'BOOKING' })
  @IsString()
  entityType: string;

  @ApiProperty()
  @IsUUID()
  entityId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateDocumentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED'])
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;
}

export class DocumentQueryDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  limit?: number = 20;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  entityType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  entityId?: string;

  @ApiProperty({ enum: DocumentType, required: false })
  @IsOptional()
  @IsEnum(DocumentType)
  type?: DocumentType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED'])
  status?: string;
}