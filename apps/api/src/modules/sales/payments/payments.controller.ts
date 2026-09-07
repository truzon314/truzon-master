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
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, UpdatePaymentDto, VerifyPaymentDto, PaymentQueryDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RoleType } from '@prisma/client';
import { PaymentStatus } from '@prisma/client';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post()
  @RequirePermissions('payment.create')
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  async create(@Body() createPaymentDto: CreatePaymentDto, @CurrentUser() user: any) {
    return this.paymentsService.create(createPaymentDto, user);
  }

  @Get()
  @RequirePermissions('payment.view')
  @ApiOperation({ summary: 'Get all payments with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'bookingId', required: false, type: String })
  @ApiQuery({ name: 'customerId', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, enum: ['BOOKING_AMOUNT', 'DOWN_PAYMENT', 'MILESTONE', 'FINAL', 'OTHER'] })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'PARTIAL', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED'] })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully' })
  async findAll(@Query() query: PaymentQueryDto, @CurrentUser() user: any) {
    return this.paymentsService.findAll(query, user);
  }

  @Get('stats')
  @RequirePermissions('payment.view')
  @ApiOperation({ summary: 'Get payment statistics' })
  @ApiResponse({ status: 200, description: 'Payment stats retrieved successfully' })
  async getStats(@CurrentUser() user: any) {
    return this.paymentsService.getPaymentStats(user);
  }

  @Get(':id')
  @RequirePermissions('payment.view')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully' })
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.paymentsService.findById(id, user);
  }

  @Patch(':id')
  @RequirePermissions('payment.update')
  @ApiOperation({ summary: 'Update payment' })
  @ApiResponse({ status: 200, description: 'Payment updated successfully' })
  async update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto, @CurrentUser() user: any) {
    return this.paymentsService.update(id, updatePaymentDto, user);
  }

  @Post(':id/verify')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.FINANCE, RoleType.MANAGER)
  @RequirePermissions('payment.verify')
  @ApiOperation({ summary: 'Verify payment (finance/manager only)' })
  @ApiResponse({ status: 200, description: 'Payment verified successfully' })
  async verify(@Param('id') id: string, @Body() verifyPaymentDto: VerifyPaymentDto, @CurrentUser() user: any) {
    return this.paymentsService.verify(id, verifyPaymentDto, user);
  }

  @Delete(':id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @RequirePermissions('payment.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete payment (soft delete)' })
  @ApiResponse({ status: 200, description: 'Payment deleted successfully' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.paymentsService.delete(id, user);
  }
}