import { IsString, IsOptional, IsUUID, IsNumber, IsDecimal, IsEnum, Min, Max, MinLength, MaxLength, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PropertyType } from '@prisma/client';

export class CreatePropertyDto {
  @ApiProperty()
  @IsUUID()
  projectId: string;

  @ApiProperty({ example: 'Luxury Villa 3BHK' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'luxury-villa-3bhk', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @ApiProperty({ enum: PropertyType })
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @ApiProperty({ example: 'Premium luxury villa with modern amenities', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Spacious 3BHK villa', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  shortDescription?: string;

  @ApiProperty({ example: '3 BHK', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  configuration?: string;

  @ApiProperty({ example: 'East', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  facing?: string;

  @ApiProperty({ example: '2500', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  plotSize?: number;

  @ApiProperty({ example: '2200', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  builtUpArea?: number;

  @ApiProperty({ example: '2000', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  carpetArea?: number;

  @ApiProperty({ example: '₹2.5 Cr*', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  priceDisplay?: string;

  @ApiProperty({ example: 25000000, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priceValue?: number;

  @ApiProperty({ example: 11363, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerSqft?: number;

  @ApiProperty({ example: '3', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @ApiProperty({ example: '3', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bathrooms?: number;

  @ApiProperty({ example: '2', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  balconies?: number;

  @ApiProperty({ example: '1', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  floorNumber?: number;

  @ApiProperty({ example: '2', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalFloors?: number;

  @ApiProperty({ example: ['Pool', 'Garden', 'Parking'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @ApiProperty({ example: { 'Flooring': 'Italian Marble', 'Kitchen': 'Modular' }, required: false })
  @IsOptional()
  specifications?: Record<string, any>;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isSignature?: boolean = false;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number = 0;

  @ApiProperty({ example: 'luxury-villa', required: false })
  @IsOptional()
  @IsString()
  tagText?: string;

  @ApiProperty({ example: 'Ready to Move', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  statusText?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  featuredImageId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  brochureMediaId?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds?: string[];
}

export class UpdatePropertyDto {
  @ApiProperty({ example: 'luxury-villa-3bhk', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @ApiProperty({ example: 'Luxury Villa 3BHK', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name?: string;

  @ApiProperty({ example: 'Premium luxury villa with modern amenities', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Spacious 3BHK villa', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  shortDescription?: string;

  @ApiProperty({ example: '3 BHK', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  configuration?: string;

  @ApiProperty({ example: 'East', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  facing?: string;

  @ApiProperty({ example: '2500', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  plotSize?: number;

  @ApiProperty({ example: '2200', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  builtUpArea?: number;

  @ApiProperty({ example: '2000', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  carpetArea?: number;

  @ApiProperty({ example: '₹2.5 Cr*', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  priceDisplay?: string;

  @ApiProperty({ example: 25000000, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priceValue?: number;

  @ApiProperty({ example: 11363, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerSqft?: number;

  @ApiProperty({ example: '3', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @ApiProperty({ example: '3', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bathrooms?: number;

  @ApiProperty({ example: '2', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  balconies?: number;

  @ApiProperty({ example: '1', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  floorNumber?: number;

  @ApiProperty({ example: '2', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalFloors?: number;

  @ApiProperty({ example: ['Pool', 'Garden', 'Parking'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @ApiProperty({ example: { 'Flooring': 'Italian Marble', 'Kitchen': 'Modular' }, required: false })
  @IsOptional()
  specifications?: Record<string, any>;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isSignature?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;

  @ApiProperty({ example: 'luxury-villa', required: false })
  @IsOptional()
  @IsString()
  tagText?: string;

  @ApiProperty({ example: 'Ready to Move', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  statusText?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  featuredImageId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  brochureMediaId?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds?: string[];
}

export class PropertyQueryDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiProperty({ enum: PropertyType, required: false })
  @IsOptional()
  @IsEnum(PropertyType)
  propertyType?: PropertyType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  budgetBracket?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isSignature?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isActive?: boolean;

  @ApiProperty({ required: false, example: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiProperty({ required: false, enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}