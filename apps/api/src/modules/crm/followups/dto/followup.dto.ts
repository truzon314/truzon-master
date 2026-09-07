import { IsString, IsOptional, IsUUID, IsEnum, IsDateString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFollowUpDto {
  @ApiProperty({ example: 'CALL' })
  @IsEnum(['CALL', 'MEETING', 'EMAIL', 'WHATSAPP', 'SITE_VISIT', 'OTHER'])
  type: string;

  @ApiProperty({ example: 'Follow up on villa interest', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  subject?: string;

  @ApiProperty({ example: 'Discussed pricing and availability', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z' })
  @IsDateString()
  scheduledAt: string;

  @ApiProperty({ example: 'INTERESTED', required: false })
  @IsOptional()
  @IsEnum(['INTERESTED', 'NOT_INTERESTED', 'CALLBACK', 'MEETING_SCHEDULED', 'SITE_VISIT_SCHEDULED', 'NO_ANSWER', 'BUSY', 'WRONG_NUMBER', 'OTHER'])
  outcome?: string;
}

export class UpdateFollowUpDto {
  @ApiProperty({ example: 'CALL', required: false })
  @IsOptional()
  @IsEnum(['CALL', 'MEETING', 'EMAIL', 'WHATSAPP', 'SITE_VISIT', 'OTHER'])
  type?: string;

  @ApiProperty({ example: 'Follow up on villa interest', required: false })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ example: 'Discussed pricing and availability', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiProperty({ example: 'INTERESTED', required: false })
  @IsOptional()
  @IsEnum(['INTERESTED', 'NOT_INTERESTED', 'CALLBACK', 'MEETING_SCHEDULED', 'SITE_VISIT_SCHEDULED', 'NO_ANSWER', 'BUSY', 'WRONG_NUMBER', 'OTHER'])
  outcome?: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', required: false })
  @IsOptional()
  @IsDateString()
  completedAt?: string;
}