import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto, UpdateDocumentDto, DocumentQueryDto } from './dto/document.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RoleType } from '@prisma/client';
import { DocumentType } from '@prisma/client';

@ApiTags('documents')
@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post()
  @RequirePermissions('document.upload')
  @ApiOperation({ summary: 'Upload document' })
  @ApiResponse({ status: 201, description: 'Document uploaded successfully' })
  async create(@Body() createDocumentDto: CreateDocumentDto, @CurrentUser() user: any) {
    return this.documentsService.create(createDocumentDto, user);
  }

  @Get()
  @RequirePermissions('document.view')
  @ApiOperation({ summary: 'Get all documents with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'entityType', required: false, type: String })
  @ApiQuery({ name: 'entityId', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, enum: ['KYC', 'AGREEMENT', 'PAYMENT_RECEIPT', 'FLOOR_PLAN', 'BROCHURE', 'PROJECT_IMAGE', 'PROPERTY_IMAGE', 'OTHER'] })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED'] })
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully' })
  async findAll(@Query() query: DocumentQueryDto, @CurrentUser() user: any) {
    return this.documentsService.findAll(query, user);
  }

  @Get(':id')
  @RequirePermissions('document.view')
  @ApiOperation({ summary: 'Get document by ID' })
  @ApiResponse({ status: 200, description: 'Document retrieved successfully' })
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.documentsService.findById(id, user);
  }

  @Patch(':id')
  @RequirePermissions('document.update')
  @ApiOperation({ summary: 'Update document' })
  @ApiResponse({ status: 200, description: 'Document updated successfully' })
  async update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto, @CurrentUser() user: any) {
    return this.documentsService.update(id, updateDocumentDto, user);
  }

  @Post(':id/verify')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.MANAGER)
  @RequirePermissions('document.verify')
  @ApiOperation({ summary: 'Verify document' })
  @ApiResponse({ status: 200, description: 'Document verified successfully' })
  async verify(@Param('id') id: string, @CurrentUser() user: any) {
    return this.documentsService.verify(id, user);
  }

  @Delete(':id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @RequirePermissions('document.delete')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete document' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.documentsService.delete(id, user);
  }
}