import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-preference')
  createPreference(
    @Body() body: { order_id: string; amount: number; description: string },
  ) {
    return this.paymentsService.createPreference(
      body.order_id,
      body.amount,
      body.description,
    );
  }

  @Post('webhook')
  handleWebhook(
    @Body() body: { data: { id: string }; type: string; external_reference: string },
  ) {
    if (body.type === 'payment') {
      return this.paymentsService.handleWebhook(
        body.data.id,
        'approved',
        body.external_reference,
      );
    }
    return { received: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('order/:order_id')
  findByOrder(@Param('order_id') order_id: string) {
    return this.paymentsService.findByOrder(order_id);
  }
}