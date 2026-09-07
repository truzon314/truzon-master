import { IsString, IsOptional, IsUUID, IsBoolean, IsNumber, Min, Max, MinLength, MaxLength, ValidateNested, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreateMenuItemDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiProperty({ example: 'Home' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  label: string;

  @ApiProperty({ example: '/home', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  href?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  pageId?: string;

  @ApiProperty({ default: false, required: false })
  @IsOptional()
  @IsBoolean()
  isExternal?: boolean = false;

  @ApiProperty({ default: false, required: false })
  @IsOptional()
  @IsBoolean()
  openInNewTab?: boolean = false;

  @ApiProperty({ example: 'home', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  position?: number = 0;

  @ApiProperty({ default: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}

export class UpdateMenuItemDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiProperty({ example: 'Home', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  label?: string;

  @ApiProperty({ example: '/home', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  href?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  pageId?: string;

  @ApiProperty({ default: false, required: false })
  @IsOptional()
  @IsBoolean()
  isExternal?: boolean;

  @ApiProperty({ default: false, required: false })
  @IsOptional()
  @IsBoolean()
  openInNewTab?: boolean;

  @ApiProperty({ example: 'home', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  position?: number;

  @ApiProperty({ default: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateMenuDto {
  @ApiProperty({ example: 'header' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  key: string;

  @ApiProperty({ example: 'Header Navigation' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  label: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ default: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiProperty({ type: [CreateMenuItemDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMenuItemDto)
  items?: CreateMenuItemDto[];
}

export class UpdateMenuDto {
  @ApiProperty({ example: 'Header Navigation', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  label?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ default: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ type: [UpdateMenuItemDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateMenuItemDto)
  items?: UpdateMenuItemDto[];
}

export class MenuQueryDto {
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
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isActive?: boolean;
}