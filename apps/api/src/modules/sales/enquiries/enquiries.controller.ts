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
import { EnquiriesService } from './enquiries.service';
import { CreateEnquiryDto, UpdateEnquiryDto, EnquiryQueryDto } from './dto/enquiry.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@ApiTags('enquiries')
@Controller('enquiries')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class EnquiriesController {
  constructor(private enquiriesService: EnquiriesService) {}

  @Post()
  @RequirePermissions('enquiry.create')
  @ApiOperation({ summary: 'Create a new enquiry' })
  @ApiResponse({ status: 201, description: 'Enquiry created successfully' })
  async create(@Body() createEnquiryDto: CreateEnquiryDto, @CurrentUser() user: any) {
    return this.enquiriesService.create(createEnquiryDto, user);
  }

  @Get()
  @RequirePermissions('enquiry.view')
  @ApiOperation({ summary: 'Get all enquiries with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'leadId', required: false, type: String })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiQuery({ name: 'propertyId', required: false, type: String })
  @ApiQuery({ name: 'source', required: false, enum: ['WEBSITE', 'MOBILE', 'PHONE', 'WALK_IN', 'CP', 'REFERRAL', 'EMAIL', 'SOCIAL_MEDIA'] })
  @ApiQuery({ name: 'type', required: false, enum: ['GENERAL', 'PRICING', 'AVAILABILITY', 'SITE_VISIT', 'BROCHURE', 'FLOOR_PLAN', 'PAYMENT_PLAN', 'OTHER'] })
  @ApiQuery({ name: 'status', required: false, enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] })
  @ApiQuery({ name: 'priority', required: false, enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'] })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'Enquiries retrieved successfully' })
  async findAll(@Query() query: EnquiryQueryDto, @CurrentUser() user: any) {
    return this.enquiriesService.findAll(query, user);
  }

  @Get('stats')
  @RequirePermissions('enquiry.view')
  @ApiOperation({ summary: 'Get enquiry statistics' })
  @ApiResponse({ status: 200, description: 'Enquiry stats retrieved successfully' })
  async getStats(@CurrentUser() user: any) {
    return this.enquiriesService.getEnquiryStats(user);
  }

  @Get(':id')
  @RequirePermissions('enquiry.view')
  @ApiOperation({ summary: 'Get enquiry by ID' })
  @ApiResponse({ status: 200, description: 'Enquiry retrieved successfully' })
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.enquiriesService.findById(id, user);
  }

  @Patch(':id')
  @RequirePermissions('enquiry.update')
  @ApiOperation({ summary: 'Update enquiry' })
  @ApiResponse({ status: 200, description: 'Enquiry updated successfully' })
  async update(@Param('id') id: string, @Body() updateEnquiryDto: UpdateEnquiryDto, @CurrentUser() user: any) {
    return this.enquiriesService.update(id, updateEnquiryDto, user);
  }

  @Post(':id/respond')
  @RequirePermissions('enquiry.update')
  @ApiOperation({ summary: 'Respond to enquiry' })
  @ApiResponse({ status: 200, description: 'Enquiry responded successfully' })
  async respond(@Param('id') id: string, @Body('response') response: string, @CurrentUser() user: any) {
    return this.enquiriesService.respond(id, response, user);
  }

  @Delete(':id')
  @RequirePermissions('enquiry.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete enquiry (soft delete)' })
  @ApiResponse({ status: 200, description: 'Enquiry deleted successfully' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.enquiriesService.delete(id, user);
  }
}