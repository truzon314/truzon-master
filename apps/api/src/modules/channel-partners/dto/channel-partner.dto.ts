import { IsString, IsOptional, IsEmail, IsPhoneNumber, IsUUID, IsNumber, IsDecimal, IsEnum, Min, Max, MinLength, MaxLength, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateChannelPartnerDto {
  @ApiProperty({ example: 'ABC Realty' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name: string;

  @ApiProperty({ example: 'ABC Realty Pvt Ltd', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  companyName?: string;

  @ApiProperty({ example: 'Rajesh Kumar' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  contactPerson: string;

  @ApiProperty({ example: 'rajesh@abcrealty.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+919876543210' })
  @IsPhoneNumber('IN')
  phone: string;

  @ApiProperty({ example: '+919876543211', required: false })
  @IsOptional()
  @IsPhoneNumber('IN')
  alternatePhone?: string;

  @ApiProperty({ example: '123 Business Park', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

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
  @MaxLength(20)
  pincode?: string;

  @ApiProperty({ example: '29ABCDE1234F1Z5', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  gstNumber?: string;

  @ApiProperty({ example: 'ABCDE1234F', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  panNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  bankAccount?: {
    accountNumber: string;
    ifsc: string;
    bankName: string;
    accountHolder: string;
  };

  @ApiProperty({ example: 2.5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  commissionRate?: number = 2.5;
}

export class UpdateChannelPartnerDto {
  @ApiProperty({ example: 'ABC Realty', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name?: string;

  @ApiProperty({ example: 'ABC Realty Pvt Ltd', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  companyName?: string;

  @ApiProperty({ example: 'Rajesh Kumar', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  contactPerson?: string;

  @ApiProperty({ example: 'rajesh@abcrealty.com', required: false })
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

  @ApiProperty({ example: '123 Business Park', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

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
  @MaxLength(20)
  pincode?: string;

  @ApiProperty({ example: '29ABCDE1234F1Z5', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  gstNumber?: string;

  @ApiProperty({ example: 'ABCDE1234F', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  panNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  bankAccount?: {
    accountNumber: string;
    ifsc: string;
    bankName: string;
    accountHolder: string;
  };

  @ApiProperty({ example: 2.5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  commissionRate?: number;

  @ApiProperty({ enum: ['ACTIVE', 'INACTIVE', 'BLACKLISTED'], required: false })
  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE', 'BLACKLISTED'])
  status?: string;
}

export class CreateChannelPartnerUserDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty({ enum: ['CP_ADMIN', 'CP_USER'], default: 'CP_USER', required: false })
  @IsOptional()
  @IsEnum(['CP_ADMIN', 'CP_USER'])
  role?: string = 'CP_USER';

  @ApiProperty({ default: false, required: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean = false;
}

export class ChannelPartnerQueryDto {
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
  @IsEnum(['ACTIVE', 'INACTIVE', 'BLACKLISTED'])
  status?: string;

  @ApiProperty({ required: false, example: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiProperty({ required: false, enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}