import { IsString, IsOptional, IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '@prisma/client';

export class CreateRoleDto {
  @ApiProperty({ enum: RoleType, example: RoleType.MANAGER })
  name: RoleType;

  @ApiProperty({ example: 'Manager' })
  @IsString()
  displayName: string;

  @ApiProperty({ example: 'Can manage leads and team', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: [String], example: ['lead.view', 'lead.create'] })
  @IsArray()
  @IsUUID('4', { each: true })
  permissionKeys: string[];
}