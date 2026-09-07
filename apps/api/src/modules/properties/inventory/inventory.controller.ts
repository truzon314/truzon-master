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
import { InventoryService } from './inventory.service';
import { CreateVillaDto, CreatePlotDto, CreateInventoryUnitDto, UpdateInventoryUnitDto, InventoryQueryDto } from './dto/inventory.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RoleType } from '@prisma/client';
import { InventoryStatus } from '@prisma/client';

@ApiTags('inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  // ============ VILLAS ============
  @Post('villas')
  @RequirePermissions('inventory.create')
  @ApiOperation({ summary: 'Create a new villa' })
  @ApiResponse({ status: 201, description: 'Villa created with inventory unit' })
  async createVilla(@Body() createVillaDto: CreateVillaDto, @CurrentUser() user: any) {
    return this.inventoryService.createVilla(createVillaDto, user);
  }

  @Get('villas')
  @RequirePermissions('inventory.view')
  @ApiOperation({ summary: 'Get all villas with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: ['AVAILABLE', 'HOLD', 'BOOKED', 'SOLD', 'BLOCKED'] })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'Villas retrieved successfully' })
  async findVillas(@Query() query: InventoryQueryDto, @CurrentUser() user: any) {
    return this.inventoryService.findVillas(query, user);
  }

  @Get('villas/:id')
  @RequirePermissions('inventory.view')
  @ApiOperation({ summary: 'Get villa by ID' })
  @ApiResponse({ status: 200, description: 'Villa retrieved successfully' })
  async findVillaById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.inventoryService.findVillaById(id);
  }

  @Patch('villas/:id')
  @RequirePermissions('inventory.update')
  @ApiOperation({ summary: 'Update villa' })
  @ApiResponse({ status: 200, description: 'Villa updated successfully' })
  async updateVilla(@Param('id') id: string, @Body() updateData: any, @CurrentUser() user: any) {
    return this.inventoryService.updateVilla(id, updateData, user);
  }

  @Delete('villas/:id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @RequirePermissions('inventory.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete villa' })
  @ApiResponse({ status: 200, description: 'Villa deleted successfully' })
  async deleteVilla(@Param('id') id: string, @CurrentUser() user: any) {
    return this.inventoryService.deleteVilla(id, user);
  }

  // ============ PLOTS ============
  @Post('plots')
  @RequirePermissions('inventory.create')
  @ApiOperation({ summary: 'Create a new plot' })
  @ApiResponse({ status: 201, description: 'Plot created with inventory unit' })
  async createPlot(@Body() createPlotDto: any, @CurrentUser() user: any) {
    return this.inventoryService.createPlot(createPlotDto, user);
  }

  @Get('plots')
  @RequirePermissions('inventory.view')
  @ApiOperation({ summary: 'Get all plots with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: ['AVAILABLE', 'HOLD', 'BOOKED', 'SOLD', 'BLOCKED'] })
  @ApiResponse({ status: 200, description: 'Plots retrieved successfully' })
  async findPlots(@Query() query: InventoryQueryDto, @CurrentUser() user: any) {
    return this.inventoryService.findPlots(query, user);
  }

  @Get('plots/:id')
  @RequirePermissions('inventory.view')
  @ApiOperation({ summary: 'Get plot by ID' })
  @ApiResponse({ status: 200, description: 'Plot retrieved successfully' })
  async findPlotById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.inventoryService.findPlotById(id);
  }

  @Patch('plots/:id')
  @RequirePermissions('inventory.update')
  @ApiOperation({ summary: 'Update plot' })
  async updatePlot(@Param('id') id: string, @Body() updateData: any, @CurrentUser() user: any) {
    return this.inventoryService.updatePlot(id, updateData, user);
  }

  @Delete('plots/:id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @RequirePermissions('inventory.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete plot' })
  async deletePlot(@Param('id') id: string, @CurrentUser() user: any) {
    return this.inventoryService.deletePlot(id, user);
  }

  // ============ INVENTORY UNITS ============
  @Post('units')
  @RequirePermissions('inventory.create')
  @ApiOperation({ summary: 'Create inventory unit' })
  @ApiResponse({ status: 201, description: 'Inventory unit created' })
  async createUnit(@Body() createDto: CreateInventoryUnitDto, @CurrentUser() user: any) {
    return this.inventoryService.createInventoryUnit(createDto, user);
  }

  @Get('units')
  @RequirePermissions('inventory.view')
  @ApiOperation({ summary: 'Get all inventory units' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiQuery({ name: 'propertyId', required: false, type: String })
  @ApiQuery({ name: 'unitType', required: false, enum: ['VILLA', 'PLOT', 'APARTMENT', 'COMMERCIAL'] })
  @ApiQuery({ name: 'status', required: false, enum: ['AVAILABLE', 'HOLD', 'BOOKED', 'SOLD', 'BLOCKED'] })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'Inventory units retrieved successfully' })
  async findUnits(@Query() query: InventoryQueryDto, @CurrentUser() user: any) {
    return this.inventoryService.findAll(query, user);
  }

  @Get('units/stats/:projectId')
  @RequirePermissions('inventory.view')
  @ApiOperation({ summary: 'Get inventory statistics for project' })
  @ApiResponse({ status: 200, description: 'Inventory stats retrieved successfully' })
  async getStats(@Param('projectId') projectId: string, @CurrentUser() user: any) {
    return this.inventoryService.getInventoryStats(projectId, user);
  }

  @Get('units/available/:propertyId')
  @RequirePermissions('inventory.view')
  @ApiOperation({ summary: 'Get available units for a property' })
  async getAvailable(@Param('propertyId') propertyId: string, @CurrentUser() user: any) {
    return this.inventoryService.findAll({ propertyId, status: 'AVAILABLE' } as any, user);
  }

  @Get('units/:id')
  @RequirePermissions('inventory.view')
  @ApiOperation({ summary: 'Get inventory unit by ID' })
  async findUnitById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.inventoryService.findById(id, user);
  }

  @Patch('units/:id')
  @RequirePermissions('inventory.update')
  @ApiOperation({ summary: 'Update inventory unit' })
  async updateUnit(@Param('id') id: string, @Body() updateDto: UpdateInventoryUnitDto, @CurrentUser() user: any) {
    return this.inventoryService.update(id, updateDto, user);
  }

  @Post('units/:id/hold')
  @RequirePermissions('inventory.update')
  @ApiOperation({ summary: 'Place unit on hold' })
  async holdUnit(
    @Param('id') id: string,
    @Body('expiresAt') expiresAt: string,
    @Body('reason') reason: string,
    @CurrentUser() user: any,
  ) {
    return this.inventoryService.holdUnit(id, new Date(expiresAt), reason, user);
  }

  @Post('units/:id/release-hold')
  @RequirePermissions('inventory.update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Release unit hold' })
  async releaseHold(@Param('id') id: string, @CurrentUser() user: any) {
    return this.inventoryService.releaseHold(id, user);
  }

  @Delete('units/:id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @RequirePermissions('inventory.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete inventory unit' })
  @ApiResponse({ status: 200, description: 'Unit deleted successfully' })
  async deleteUnit(@Param('id') id: string, @CurrentUser() user: any) {
    return this.inventoryService.delete(id, user);
  }
}