import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FormsService } from './forms.service';
import { CreateFormSubmissionDto, UpdateFormSubmissionDto, FormSubmissionQueryDto } from './dto/form.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { IpAddress } from '../../../common/decorators/ip-address.decorator';
import { Req } from '@nestjs/common';

@ApiTags('forms')
@Controller('forms')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class FormsController {
  constructor(private formsService: FormsService) {}

  @Post('submit')
  @ApiOperation({ summary: 'Submit form (public)' })
  @ApiResponse({ status: 201, description: 'Form submitted successfully' })
  async submit(@Body() createFormSubmissionDto: CreateFormSubmissionDto, @IpAddress() ip: string, @Req() req: any) {
    return this.formsService.submit(createFormSubmissionDto, ip, req.headers['user-agent']);
  }

  @Get()
  @RequirePermissions('form_submission.view')
  @ApiOperation({ summary: 'Get all form submissions with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'formKey', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'assignedUserId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Form submissions retrieved successfully' })
  async findAll(@Query() query: FormSubmissionQueryDto, @CurrentUser() user: any) {
    return this.formsService.findAll(query, user);
  }

  @Get('export')
  @RequirePermissions('form_submission.export')
  @ApiOperation({ summary: 'Export form submissions' })
  @ApiResponse({ status: 200, description: 'Form submissions exported successfully' })
  async export(@Query() query: FormSubmissionQueryDto, @CurrentUser() user: any) {
    return this.formsService.export(query, user);
  }

  @Get(':id')
  @RequirePermissions('form_submission.view')
  @ApiOperation({ summary: 'Get form submission by ID' })
  @ApiResponse({ status: 200, description: 'Form submission retrieved successfully' })
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.formsService.findById(id, user);
  }

  @Patch(':id')
  @RequirePermissions('form_submission.update')
  @ApiOperation({ summary: 'Update form submission' })
  @ApiResponse({ status: 200, description: 'Form submission updated successfully' })
  async update(@Param('id') id: string, @Body() updateFormSubmissionDto: UpdateFormSubmissionDto, @CurrentUser() user: any) {
    return this.formsService.update(id, updateFormSubmissionDto, user);
  }
}