import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { OrderStatus } from './order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: Partial<import('./order.entity').Order>) {
    return this.ordersService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:user_id')
  findByUser(@Param('user_id') user_id: string) {
    return this.ordersService.findByUser(user_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('company/:company_id')
  findByCompany(@Param('company_id') company_id: string) {
    return this.ordersService.findByCompany(company_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.ordersService.updateStatus(id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/assign')
  assignDriver(
    @Param('id') id: string,
    @Body() body: { driver_id: string; vehicle_id: string },
  ) {
    return this.ordersService.assignDriver(id, body.driver_id, body.vehicle_id);
  }
}