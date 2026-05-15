import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: Partial<import('./driver.entity').Driver>) {
    return this.driversService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('company/:company_id')
  findByCompany(@Param('company_id') company_id: string) {
    return this.driversService.findByCompany(company_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driversService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.driversService.deactivate(id);
  }
}