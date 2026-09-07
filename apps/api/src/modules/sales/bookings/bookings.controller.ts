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
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto, BookingQueryDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { BookingStatus } from '@prisma/client';

@ApiTags('bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @RequirePermissions('booking.create')
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 409, description: 'Unit not available or scheduling conflict' })
  async create(@Body() createBookingDto: CreateBookingDto, @CurrentUser() user: any) {
    return this.bookingsService.create(createBookingDto, user);
  }

  @Get()
  @RequirePermissions('booking.view')
  @ApiOperation({ summary: 'Get all bookings with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'leadId', required: false, type: String })
  @ApiQuery({ name: 'customerId', required: false, type: String })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiQuery({ name: 'propertyId', required: false, type: String })
  @ApiQuery({ name: 'inventoryUnitId', required: false, type: String })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'cpId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'EXPIRED', 'COMPLETED'] })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully' })
  async findAll(@Query() query: BookingQueryDto, @CurrentUser() user: any) {
    return this.bookingsService.findAll(query, user);
  }

  @Get('stats')
  @RequirePermissions('booking.view')
  @ApiOperation({ summary: 'Get booking statistics' })
  @ApiResponse({ status: 200, description: 'Booking stats retrieved successfully' })
  async getStats(@CurrentUser() user: any) {
    return this.bookingsService.getBookingStats(user);
  }

  @Get(':id')
  @RequirePermissions('booking.view')
  @ApiOperation({ summary: 'Get booking by ID with payments and agreements' })
  @ApiResponse({ status: 200, description: 'Booking retrieved successfully' })
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingsService.findById(id, user);
  }

  @Patch(':id')
  @RequirePermissions('booking.update')
  @ApiOperation({ summary: 'Update booking' })
  @ApiResponse({ status: 200, description: 'Booking updated successfully' })
  @ApiResponse({ status: 409, description: 'Invalid status transition' })
  async update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto, @CurrentUser() user: any) {
    return this.bookingsService.update(id, updateBookingDto, user);
  }

  @Post(':id/confirm')
  @RequirePermissions('booking.update')
  @ApiOperation({ summary: 'Confirm booking' })
  @ApiResponse({ status: 200, description: 'Booking confirmed successfully' })
  async confirm(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingsService.confirm(id, user);
  }

  @Post(':id/cancel')
  @RequirePermissions('booking.update')
  @ApiOperation({ summary: 'Cancel booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  async cancel(@Param('id') id: string, @Body('reason') reason: string, @CurrentUser() user: any) {
    return this.bookingsService.cancel(id, reason, user);
  }

  @Delete(':id')
  @RequirePermissions('booking.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete booking (soft delete)' })
  @ApiResponse({ status: 200, description: 'Booking deleted successfully' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingsService.delete(id, user);
  }
}