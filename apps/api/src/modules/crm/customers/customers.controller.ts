import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RoleType } from '@prisma/client';

@ApiTags('customers')
@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Post()
  @RequirePermissions('customer.create')
  @ApiOperation({ summary: 'Create customer from converted lead' })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  async create(@Body() createCustomerDto: CreateCustomerDto, @CurrentUser() user: any) {
    return this.customersService.create(createCustomerDto, user);
  }

  @Get()
  @RequirePermissions('customer.view')
  @ApiOperation({ summary: 'Get all customers with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'kycStatus', required: false, type: String })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('kycStatus') kycStatus?: string,
    @CurrentUser() user?: any,
  ) {
    return this.customersService.findAll({ page, limit, search, kycStatus }, user);
  }

  @Get(':id')
  @RequirePermissions('customer.view')
  @ApiOperation({ summary: 'Get customer by ID' })
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.customersService.findById(id, user);
  }

  @Patch(':id')
  @RequirePermissions('customer.update')
  @ApiOperation({ summary: 'Update customer' })
  async update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto, @CurrentUser() user: any) {
    return this.customersService.update(id, updateCustomerDto, user);
  }

  @Post(':id/verify-kyc')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.MANAGER)
  @RequirePermissions('customer.update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify customer KYC' })
  async verifyKyc(@Param('id') id: string, @CurrentUser() user: any) {
    return this.customersService.verifyKyc(id, user);
  }

  @Delete(':id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @RequirePermissions('customer.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete customer (soft delete)' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.customersService.delete(id, user);
  }
}