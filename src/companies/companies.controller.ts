import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() body: Partial<import('./company.entity').Company>) {
    return this.companiesService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  @Get('approved')
  findApproved() {
    return this.companiesService.findApproved();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.companiesService.approve(id);
  }
}