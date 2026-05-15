import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: Partial<import('./review.entity').Review>) {
    return this.reviewsService.create(body);
  }

  @Get('company/:company_id')
  findByCompany(@Param('company_id') company_id: string) {
    return this.reviewsService.findByCompany(company_id);
  }

  @Get('company/:company_id/rating')
  getAverageRating(@Param('company_id') company_id: string) {
    return this.reviewsService.getAverageRating(company_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('order/:order_id')
  findByOrder(@Param('order_id') order_id: string) {
    return this.reviewsService.findByOrder(order_id);
  }
}