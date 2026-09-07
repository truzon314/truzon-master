import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({ example: 'uuid-token' })
  @IsString()
  @IsNotEmpty()
  token: string;
}