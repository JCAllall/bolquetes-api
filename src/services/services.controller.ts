import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: Partial<import('./service.entity').Service>) {
    return this.servicesService.create(body);
  }

  @Get('company/:company_id')
  findByCompany(@Param('company_id') company_id: string) {
    return this.servicesService.findByCompany(company_id);
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.servicesService.findByCategory(category);
  }
}