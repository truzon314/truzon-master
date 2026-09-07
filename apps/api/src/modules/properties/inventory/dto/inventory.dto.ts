import { IsString, IsOptional, IsUUID, IsNumber, IsDecimal, IsEnum, Min, Max, MinLength, MaxLength, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PropertyType, InventoryStatus } from '@prisma/client';

export class CreateVillaDto {
  @ApiProperty()
  @IsUUID()
  projectId: string;

  @ApiProperty({ example: 'V-001' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  unitNumber: string;

  @ApiProperty({ example: 'Premium Villa 1', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ example: '3000' })
  @IsNumber()
  @Min(0)
  plotSize: number;

  @ApiProperty({ example: '2500' })
  @IsNumber()
  @Min(0)
  builtUpArea: number;

  @ApiProperty({ example: '2200', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  carpetArea?: number;

  @ApiProperty({ example: '3' })
  @IsNumber()
  @Min(1)
  bedrooms: number;

  @ApiProperty({ example: '3' })
  @IsNumber()
  @Min(1)
  bathrooms: number;

  @ApiProperty({ example: '2' })
  @IsNumber()
  @Min(1)
  floors: number;

  @ApiProperty({ example: 'East', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  facing?: string;

  @ApiProperty({ example: 50000000 })
  @IsNumber()
  @Min(0)
  priceValue: number;

  @ApiProperty({ example: 16666, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerSqft?: number;

  @ApiProperty({ enum: InventoryStatus, default: InventoryStatus.AVAILABLE, required: false })
  @IsOptional()
  @IsEnum(InventoryStatus)
  status?: InventoryStatus = InventoryStatus.AVAILABLE;

  @ApiProperty({ example: 'https://example.com/floorplan.pdf', required: false })
  @IsOptional()
  @IsString()
  floorPlanUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  specifications?: Record<string, any>;
}

export class CreatePlotDto {
  @ApiProperty()
  @IsUUID()
  projectId: string;

  @ApiProperty({ example: 'P-001' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  unitNumber: string;

  @ApiProperty({ example: 'Corner Plot 1', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ example: '2000' })
  @IsNumber()
  @Min(0)
  plotSize: number;

  @ApiProperty({ example: 'North', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  facing?: string;

  @ApiProperty({ example: 25000000 })
  @IsNumber()
  @Min(0)
  priceValue: number;

  @ApiProperty({ example: 12500, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerSqft?: number;

  @ApiProperty({ enum: InventoryStatus, default: InventoryStatus.AVAILABLE, required: false })
  @IsOptional()
  @IsEnum(InventoryStatus)
  status?: InventoryStatus = InventoryStatus.AVAILABLE;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  cornerPlot?: boolean = false;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  parkFacing?: boolean = false;

  @ApiProperty({ example: '40', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  roadWidth?: number;
}

export class CreateInventoryUnitDto {
  @ApiProperty()
  @IsUUID()
  projectId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  villaId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  plotId?: string;

  @ApiProperty({ enum: PropertyType })
  @IsEnum(PropertyType)
  unitType: PropertyType;

  @ApiProperty({ example: 'UNIT-001' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  unitNumber: string;

  @ApiProperty({ example: 50000000 })
  @IsNumber()
  @Min(0)
  priceValue: number;

  @ApiProperty({ enum: InventoryStatus, default: InventoryStatus.AVAILABLE, required: false })
  @IsOptional()
  @IsEnum(InventoryStatus)
  status?: InventoryStatus = InventoryStatus.AVAILABLE;
}

export class UpdateInventoryUnitDto {
  @ApiProperty({ enum: InventoryStatus, required: false })
  @IsOptional()
  @IsEnum(InventoryStatus)
  status?: InventoryStatus;

  @ApiProperty({ example: 50000000, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priceValue?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  holdExpiresAt?: string;

  @ApiProperty({ example: 'Holding for client visit', required: false })
  @IsOptional()
  @IsString()
  holdReason?: string;

  @ApiProperty({ example: 'Legal issue', required: false })
  @IsOptional()
  @IsString()
  blockedReason?: string;
}

export class InventoryQueryDto {
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
  @IsUUID()
  projectId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @ApiProperty({ enum: PropertyType, required: false })
  @IsOptional()
  @IsEnum(PropertyType)
  unitType?: PropertyType;

  @ApiProperty({ enum: InventoryStatus, required: false })
  @IsOptional()
  @IsEnum(InventoryStatus)
  status?: InventoryStatus;

  @ApiProperty({ required: false, example: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiProperty({ required: false, enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}