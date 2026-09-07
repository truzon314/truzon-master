import { IsString, IsOptional, IsEmail, IsPhoneNumber, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'uuid-lead-id' })
  @IsUUID()
  leadId: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+919876543210' })
  @IsPhoneNumber('IN')
  phone: string;

  @ApiProperty({ example: '+919876543211', required: false })
  @IsOptional()
  @IsPhoneNumber('IN')
  alternatePhone?: string;

  @ApiProperty({ example: '1990-01-15', required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ example: 'Male', required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ example: '123 Main St', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Hyderabad', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'Telangana', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: '500001', required: false })
  @IsOptional()
  @IsString()
  pincode?: string;

  @ApiProperty({ example: 'ABCDE1234F', required: false })
  @IsOptional()
  @IsString()
  panNumber?: string;

  @ApiProperty({ example: '123456789012', required: false })
  @IsOptional()
  @IsString()
  aadhaarNumber?: string;
}

export class UpdateCustomerDto {
  @ApiProperty({ example: 'John', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+919876543210', required: false })
  @IsOptional()
  @IsPhoneNumber('IN')
  phone?: string;

  @ApiProperty({ example: '+919876543211', required: false })
  @IsOptional()
  @IsPhoneNumber('IN')
  alternatePhone?: string;

  @ApiProperty({ example: '123 Main St', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Hyderabad', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'Telangana', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: '500001', required: false })
  @IsOptional()
  @IsString()
  pincode?: string;

  @ApiProperty({ example: 'ABCDE1234F', required: false })
  @IsOptional()
  @IsString()
  panNumber?: string;

  @ApiProperty({ example: '123456789012', required: false })
  @IsOptional()
  @IsString()
  aadhaarNumber?: string;

  @ApiProperty({ example: 'VERIFIED', required: false })
  @IsOptional()
  @IsString()
  kycStatus?: string;
}