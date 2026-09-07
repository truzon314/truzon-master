import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsObject,
  IsArray,
  IsEnum,
  Min,
  Max,
} from 'class-validator';

export class CreateMapProjectDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  mapProviderType?: string;

  @IsNumber()
  @IsOptional()
  centerLat?: number;

  @IsNumber()
  @IsOptional()
  centerLng?: number;

  @IsNumber()
  @IsOptional()
  zoomLevel?: number;

  @IsOptional()
  bounds?: any;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

export class UpdateMapProjectDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  mapProviderType?: string;

  @IsNumber()
  @IsOptional()
  centerLat?: number;

  @IsNumber()
  @IsOptional()
  centerLng?: number;

  @IsNumber()
  @IsOptional()
  zoomLevel?: number;

  @IsOptional()
  bounds?: any;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

export class UploadMapLayerDto {
  @IsString()
  projectId: string;

  @IsString()
  label: string;

  @IsObject()
  geojson: any;

  @IsString()
  @IsOptional()
  strokeColor?: string;

  @IsString()
  @IsOptional()
  fillColor?: string;

  @IsNumber()
  @IsOptional()
  fillOpacity?: number;

  @IsNumber()
  @IsOptional()
  strokeWeight?: number;

  @IsEnum(['solid', 'dashed', 'dotted'])
  @IsOptional()
  strokeStyle?: 'solid' | 'dashed' | 'dotted';

  @IsBoolean()
  @IsOptional()
  defaultVisible?: boolean;

  @IsOptional()
  colorRules?: any;

  @IsString()
  @IsOptional()
  labelProperty?: string;

  @IsEnum(['top', 'center', 'bottom', 'left', 'right'])
  @IsOptional()
  labelAlignment?: 'top' | 'center' | 'bottom' | 'left' | 'right';

  @IsBoolean()
  @IsOptional()
  popupEnabled?: boolean;

  @IsOptional()
  popupProperties?: any;
}

export class UpdateMapLayerDto {
  @IsString()
  @IsOptional()
  label?: string;

  @IsObject()
  @IsOptional()
  geojson?: any;

  @IsString()
  @IsOptional()
  strokeColor?: string;

  @IsString()
  @IsOptional()
  fillColor?: string;

  @IsNumber()
  @IsOptional()
  fillOpacity?: number;

  @IsNumber()
  @IsOptional()
  strokeWeight?: number;

  @IsEnum(['solid', 'dashed', 'dotted'])
  @IsOptional()
  strokeStyle?: 'solid' | 'dashed' | 'dotted';

  @IsBoolean()
  @IsOptional()
  defaultVisible?: boolean;

  @IsOptional()
  colorRules?: any;

  @IsString()
  @IsOptional()
  labelProperty?: string;

  @IsEnum(['top', 'center', 'bottom', 'left', 'right'])
  @IsOptional()
  labelAlignment?: 'top' | 'center' | 'bottom' | 'left' | 'right';

  @IsBoolean()
  @IsOptional()
  popupEnabled?: boolean;

  @IsOptional()
  popupProperties?: any;

  @IsNumber()
  @IsOptional()
  position?: number;
}

export class UpdateLayerFeaturesDto {
  @IsString()
  featureId: string;

  @IsObject()
  properties: Record<string, any>;
}

export class UpsertMapProviderConfigDto {
  @IsString()
  providerType: string;

  @IsString()
  @IsOptional()
  apiKey?: string;

  @IsString()
  @IsOptional()
  customTileUrl?: string;

  @IsNumber()
  @IsOptional()
  maxZoom?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpsertMapShareLinkDto {
  @IsString()
  projectId: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  expiresAt?: string;

  @IsNumber()
  @IsOptional()
  maxViews?: number;
}
