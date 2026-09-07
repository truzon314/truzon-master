import { IsString, IsOptional, IsUUID, IsNumber, IsDecimal, IsDateString, IsBoolean, IsEnum, Min, Max, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateProjectDto {
  @ApiProperty({ example: 'Truzon Heights' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name: string;

  @ApiProperty({ example: 'truzon-heights', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  slug?: string;

  @ApiProperty({ example: 'Luxury villas in prime location', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Premium gated community', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  shortDescription?: string;

  @ApiProperty({ example: 'Where luxury meets lifestyle', required: false })
  @IsOptional()
  @IsString()
  tagline?: string;

  @ApiProperty({ example: 'Hyderabad' })
  @IsString()
  @MaxLength(100)
  city: string;

  @ApiProperty({ example: 'Telangana' })
  @IsString()
  @MaxLength(100)
  state: string;

  @ApiProperty({ example: '500001', required: false })
  @IsOptional()
  @IsString()
  pincode?: string;

  @ApiProperty({ example: 'India', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string = 'India';

  @ApiProperty({ example: '17.3850', required: false })
  @IsOptional()
  @IsDecimal()
  latitude?: string;

  @ApiProperty({ example: '78.4867', required: false })
  @IsOptional()
  @IsDecimal()
  longitude?: string;

  @ApiProperty({ example: 'RERA12345', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  reraNumber?: string;

  @ApiProperty({ example: '2025-12-31', required: false })
  @IsOptional()
  @IsDateString()
  possessionDate?: string;

  @ApiProperty({ example: '2024-01-15', required: false })
  @IsOptional()
  @IsDateString()
  launchDate?: string;

  @ApiProperty({ example: 'UPCOMING', required: false })
  @IsOptional()
  @IsEnum(['UPCOMING', 'LAUNCHED', 'ONGOING', 'COMPLETED'])
  status?: string = 'UPCOMING';

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean = false;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number = 0;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  featuredImageId?: string;
}

export class UpdateProjectDto {
  @ApiProperty({ example: 'truzon-heights', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  slug?: string;

  @ApiProperty({ example: 'Truzon Heights', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name?: string;

  @ApiProperty({ example: 'Luxury villas in prime location', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Premium gated community', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  shortDescription?: string;

  @ApiProperty({ example: 'Where luxury meets lifestyle', required: false })
  @IsOptional()
  @IsString()
  tagline?: string;

  @ApiProperty({ example: 'Hyderabad', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiProperty({ example: 'Telangana', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiProperty({ example: '500001', required: false })
  @IsOptional()
  @IsString()
  pincode?: string;

  @ApiProperty({ example: 'India', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiProperty({ example: '17.3850', required: false })
  @IsOptional()
  @IsDecimal()
  latitude?: string;

  @ApiProperty({ example: '78.4867', required: false })
  @IsOptional()
  @IsDecimal()
  longitude?: string;

  @ApiProperty({ example: 'RERA12345', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  reraNumber?: string;

  @ApiProperty({ example: '2025-12-31', required: false })
  @IsOptional()
  @IsDateString()
  possessionDate?: string;

  @ApiProperty({ example: '2024-01-15', required: false })
  @IsOptional()
  @IsDateString()
  launchDate?: string;

  @ApiProperty({ enum: ['UPCOMING', 'LAUNCHED', 'ONGOING', 'COMPLETED'], required: false })
  @IsOptional()
  @IsEnum(['UPCOMING', 'LAUNCHED', 'ONGOING', 'COMPLETED'])
  status?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  featuredImageId?: string;
}

export class ProjectQueryDto {
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
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['UPCOMING', 'LAUNCHED', 'ONGOING', 'COMPLETED'])
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isFeatured?: boolean;

  @ApiProperty({ required: false, example: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiProperty({ required: false, enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}