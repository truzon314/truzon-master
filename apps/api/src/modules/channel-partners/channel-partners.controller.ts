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
import { ChannelPartnersService } from './channel-partners.service';
import { CreateChannelPartnerDto, UpdateChannelPartnerDto, CreateChannelPartnerUserDto, ChannelPartnerQueryDto } from './dto/channel-partner.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RoleType } from '@prisma/client';

@ApiTags('channel-partners')
@Controller('channel-partners')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class ChannelPartnersController {
  constructor(private channelPartnersService: ChannelPartnersService) {}

  @Post()
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @RequirePermissions('channel_partner.create')
  @ApiOperation({ summary: 'Create a new channel partner' })
  @ApiResponse({ status: 201, description: 'Channel partner created successfully' })
  @ApiResponse({ status: 409, description: 'Email/Phone/GST/PAN already exists' })
  async create(@Body() createChannelPartnerDto: CreateChannelPartnerDto, @CurrentUser() user: any) {
    return this.channelPartnersService.create(createChannelPartnerDto, user);
  }

  @Get()
  @RequirePermissions('channel_partner.view')
  @ApiOperation({ summary: 'Get all channel partners with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: ['ACTIVE', 'INACTIVE', 'BLACKLISTED'] })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'Channel partners retrieved successfully' })
  async findAll(@Query() query: ChannelPartnerQueryDto, @CurrentUser() user: any) {
    return this.channelPartnersService.findAll(query, user);
  }

  @Get('stats/:id')
  @RequirePermissions('channel_partner.view')
  @ApiOperation({ summary: 'Get channel partner statistics' })
  @ApiResponse({ status: 200, description: 'Channel partner stats retrieved successfully' })
  async getStats(@Param('id') id: string, @CurrentUser() user: any) {
    return this.channelPartnersService.getChannelPartnerStats(id, user);
  }

  @Get(':id')
  @RequirePermissions('channel_partner.view')
  @ApiOperation({ summary: 'Get channel partner by ID with leads and commissions' })
  @ApiResponse({ status: 200, description: 'Channel partner retrieved successfully' })
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.channelPartnersService.findById(id, user);
  }

  @Patch(':id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @RequirePermissions('channel_partner.update')
  @ApiOperation({ summary: 'Update channel partner' })
  @ApiResponse({ status: 200, description: 'Channel partner updated successfully' })
  @ApiResponse({ status: 409, description: 'Email/Phone/GST/PAN already exists' })
  async update(@Param('id') id: string, @Body() updateChannelPartnerDto: UpdateChannelPartnerDto, @CurrentUser() user: any) {
    return this.channelPartnersService.update(id, updateChannelPartnerDto, user);
  }

  @Post(':id/users')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @RequirePermissions('channel_partner.update')
  @ApiOperation({ summary: 'Add user to channel partner' })
  @ApiResponse({ status: 201, description: 'User added to channel partner' })
  async addUser(@Param('id') id: string, @Body() createChannelPartnerUserDto: CreateChannelPartnerUserDto, @CurrentUser() user: any) {
    return this.channelPartnersService.addUser(id, createChannelPartnerUserDto, user);
  }

  @Delete(':id/users/:userId')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @RequirePermissions('channel_partner.update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove user from channel partner' })
  @ApiResponse({ status: 200, description: 'User removed from channel partner' })
  async removeUser(@Param('id') id: string, @Param('userId') userId: string, @CurrentUser() user: any) {
    return this.channelPartnersService.removeUser(id, userId, user);
  }

  @Delete(':id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @RequirePermissions('channel_partner.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete channel partner (soft delete)' })
  @ApiResponse({ status: 200, description: 'Channel partner deleted successfully' })
  @ApiResponse({ status: 409, description: 'Channel partner has dependencies' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.channelPartnersService.delete(id, user);
  }
}