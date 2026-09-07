import { IsString, IsOptional, IsUUID, IsEnum, IsNumber, Min, Max, IsBoolean, IsArray, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { MediaType } from '@prisma/client';

export class CreateMediaDto {
  @ApiProperty({ example: 'image.jpg' })
  @IsString()
  @MaxLength(255)
  fileName: string;

  @ApiProperty({ example: 'uploads/2024/01/image.jpg' })
  @IsString()
  @MaxLength(500)
  fileKey: string;

  @ApiProperty({ example: 'https://storage.googleapis.com/bucket/image.jpg' })
  @IsString()
  @MaxLength(1000)
  url: string;

  @ApiProperty({ example: 'image/jpeg' })
  @IsString()
  @MaxLength(255)
  mimeType: string;

  @ApiProperty({ example: 1024000 })
  @IsNumber()
  @Min(1)
  sizeBytes: number;

  @ApiProperty({ example: 1920, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  width?: number;

  @ApiProperty({ example: 1080, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  height?: number;

  @ApiProperty({ example: 30, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number;

  @ApiProperty({ example: 'Luxury villa exterior', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  altText?: string;

  @ApiProperty({ example: 'Villa front view', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  caption?: string;

  @ApiProperty({ enum: MediaType })
  @IsEnum(MediaType)
  type: MediaType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  folderId?: string;

  @ApiProperty({ example: 'GCS', required: false })
  @IsOptional()
  @IsEnum(['GCS', 'R2', 'LOCAL'])
  storageProvider?: string = 'GCS';

  @ApiProperty({ required: false })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateMediaDto {
  @ApiProperty({ example: 'Luxury villa exterior', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  altText?: string;

  @ApiProperty({ example: 'Villa front view', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  caption?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  folderId?: string;
}

export class MediaQueryDto {
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
  folderId?: string;

  @ApiProperty({ enum: MediaType, required: false })
  @IsOptional()
  @IsEnum(MediaType)
  type?: MediaType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  uploadedById?: string;

  @ApiProperty({ required: false, example: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiProperty({ required: false, enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}