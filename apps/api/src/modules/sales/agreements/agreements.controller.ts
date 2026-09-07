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
import { AgreementsService } from './agreements.service';
import { CreateAgreementDto, UpdateAgreementDto, AgreementQueryDto } from './dto/agreement.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AgreementStatus } from '@prisma/client';

@ApiTags('agreements')
@Controller('agreements')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class AgreementsController {
  constructor(private agreementsService: AgreementsService) {}

  @Post()
  @RequirePermissions('agreement.create')
  @ApiOperation({ summary: 'Create a new agreement' })
  @ApiResponse({ status: 201, description: 'Agreement created successfully' })
  @ApiResponse({ status: 409, description: 'Agreement already exists or invalid booking status' })
  async create(@Body() createAgreementDto: CreateAgreementDto, @CurrentUser() user: any) {
    return this.agreementsService.create(createAgreementDto, user);
  }

  @Get()
  @RequirePermissions('agreement.view')
  @ApiOperation({ summary: 'Get all agreements with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'bookingId', required: false, type: String })
  @ApiQuery({ name: 'customerId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: ['DRAFT', 'PENDING_SIGNATURE', 'SIGNED', 'EXPIRED', 'CANCELLED'] })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'Agreements retrieved successfully' })
  async findAll(@Query() query: AgreementQueryDto, @CurrentUser() user: any) {
    return this.agreementsService.findAll(query, user);
  }

  @Get('stats')
  @RequirePermissions('agreement.view')
  @ApiOperation({ summary: 'Get agreement statistics' })
  @ApiResponse({ status: 200, description: 'Agreement stats retrieved successfully' })
  async getStats(@CurrentUser() user: any) {
    return this.agreementsService.getAgreementStats(user);
  }

  @Get(':id')
  @RequirePermissions('agreement.view')
  @ApiOperation({ summary: 'Get agreement by ID with document' })
  @ApiResponse({ status: 200, description: 'Agreement retrieved successfully' })
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.agreementsService.findById(id, user);
  }

  @Patch(':id')
  @RequirePermissions('agreement.update')
  @ApiOperation({ summary: 'Update agreement' })
  @ApiResponse({ status: 200, description: 'Agreement updated successfully' })
  @ApiResponse({ status: 409, description: 'Invalid status transition' })
  async update(@Param('id') id: string, @Body() updateAgreementDto: UpdateAgreementDto, @CurrentUser() user: any) {
    return this.agreementsService.update(id, updateAgreementDto, user);
  }

  @Post(':id/sign')
  @RequirePermissions('agreement.update')
  @ApiOperation({ summary: 'Sign agreement' })
  @ApiResponse({ status: 200, description: 'Agreement signed successfully' })
  async sign(@Param('id') id: string, @CurrentUser() user: any) {
    return this.agreementsService.sign(id, user);
  }

  @Post(':id/cancel')
  @RequirePermissions('agreement.update')
  @ApiOperation({ summary: 'Cancel agreement' })
  @ApiResponse({ status: 200, description: 'Agreement cancelled successfully' })
  async cancel(@Param('id') id: string, @Body('reason') reason: string, @CurrentUser() user: any) {
    return this.agreementsService.cancel(id, reason, user);
  }

  @Post(':id/document')
  @RequirePermissions('agreement.update')
  @ApiOperation({ summary: 'Link document to agreement' })
  @ApiResponse({ status: 200, description: 'Document linked successfully' })
  async linkDocument(@Param('id') id: string, @Body('documentId') documentId: string, @CurrentUser() user: any) {
    return this.agreementsService.linkDocument(id, documentId, user);
  }

  @Delete(':id')
  @RequirePermissions('agreement.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete agreement (soft delete)' })
  @ApiResponse({ status: 200, description: 'Agreement deleted successfully' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.agreementsService.delete(id, user);
  }
}