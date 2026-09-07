import { IsString, IsOptional, IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty({ example: 'Manager', required: false })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiProperty({ example: 'Can manage leads and team', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: [String], example: ['lead.view', 'lead.create'], required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  permissionKeys?: string[];
}