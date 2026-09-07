import { IsString, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignLeadDto {
  @ApiProperty({ example: 'uuid-user-id', required: false })
  @IsOptional()
  @IsUUID()
  toUserId?: string;

  @ApiProperty({ example: 'uuid-cp-id', required: false })
  @IsOptional()
  @IsUUID()
  toCpId?: string;

  @ApiProperty({ example: 'Assigning to senior sales rep', required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}