import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ZonesService } from './zones.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any) {
    return this.zonesService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('company/:company_id')
  findByCompany(@Param('company_id') company_id: string) {
    return this.zonesService.findByCompany(company_id);
  }

  @Get('search')
  findByPoint(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
  ) {
    return this.zonesService.findZonesContainingPoint(
      parseFloat(lat),
      parseFloat(lng),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.zonesService.deactivate(id);
  }
}