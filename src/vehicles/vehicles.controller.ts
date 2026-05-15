import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: Partial<import('./vehicle.entity').Vehicle>) {
    return this.vehiclesService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('company/:company_id')
  findByCompany(@Param('company_id') company_id: string) {
    return this.vehiclesService.findByCompany(company_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.vehiclesService.deactivate(id);
  }
}