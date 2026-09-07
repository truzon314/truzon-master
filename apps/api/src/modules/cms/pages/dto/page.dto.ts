import { IsString, IsOptional, IsEnum, IsUUID, IsArray, IsNumber, Min, Max, MinLength, MaxLength, ValidateNested, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { PageType, PageStatus } from '@prisma/client';

export class CreatePageBlockDto {
  @ApiProperty()
  @IsUUID()
  blockDefinitionId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  position: number;

  @ApiProperty()
  @IsObject()
  config: Record<string, any>;
}

export class UpdatePageBlockDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  position?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;
}

export class CreatePageDto {
  @ApiProperty({ enum: PageType })
  @IsEnum(PageType)
  pageType: PageType;

  @ApiProperty({ example: '/about', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  slug?: string;

  @ApiProperty({ example: 'About Us' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePageBlockDto)
  blocks?: CreatePageBlockDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  featuredImageId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  seoId?: string;
}

export class UpdatePageDto {
  @ApiProperty({ example: '/about', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  slug?: string;

  @ApiProperty({ example: 'About Us', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  title?: string;

  @ApiProperty({ enum: PageStatus, required: false })
  @IsOptional()
  @IsEnum(PageStatus)
  status?: PageStatus;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', required: false })
  @IsOptional()
  scheduledAt?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePageBlockDto)
  blocks?: UpdatePageBlockDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  featuredImageId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  seoId?: string;
}

export class PublishPageDto {
  @ApiProperty({ example: 'Published new hero section', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  changeNote?: string;
}

export class RestoreVersionDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  versionNumber: number;
}

export class PageQueryDto {
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

  @ApiProperty({ enum: PageType, required: false })
  @IsOptional()
  @IsEnum(PageType)
  pageType?: PageType;

  @ApiProperty({ enum: PageStatus, required: false })
  @IsOptional()
  @IsEnum(PageStatus)
  status?: PageStatus;

  @ApiProperty({ required: false, example: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiProperty({ required: false, enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}