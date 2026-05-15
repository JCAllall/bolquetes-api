import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './payment.entity';
import { ConfigService } from '@nestjs/config';
import MercadoPagoConfig, { Preference } from 'mercadopago';

@Injectable()
export class PaymentsService {
  private mpClient: MercadoPagoConfig;

  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private config: ConfigService,
  ) {
    this.mpClient = new MercadoPagoConfig({
      accessToken: this.config.get<string>('MP_ACCESS_TOKEN')!,
    });
  }

  async createPreference(order_id: string, amount: number, description: string) {
    const preference = new Preference(this.mpClient);

    const response = await preference.create({
      body: {
        items: [
          {
            id: order_id,
            title: description,
            quantity: 1,
            unit_price: Number(amount),
            currency_id: 'ARS',
          },
        ],
        external_reference: order_id,
        back_urls: {
          success: `${this.config.get('APP_URL')}/payments/success`,
          failure: `${this.config.get('APP_URL')}/payments/failure`,
          pending: `${this.config.get('APP_URL')}/payments/pending`,
        },
        auto_return: 'approved',
        notification_url: `${this.config.get('APP_URL')}/payments/webhook`,
      },
    });

    const payment = this.paymentsRepository.create({
      order_id,
      amount,
      status: PaymentStatus.PENDING,
      mp_preference_id: response.id,
    });

    await this.paymentsRepository.save(payment);

    return {
      payment_id: payment.id,
      preference_id: response.id,
      init_point: response.init_point,
    };
  }

  async handleWebhook(mp_payment_id: string, status: string, order_id: string) {
    const paymentStatus =
      status === 'approved' ? PaymentStatus.APPROVED :
      status === 'rejected' ? PaymentStatus.REJECTED :
      PaymentStatus.PENDING;

    await this.paymentsRepository.update(
      { order_id },
      { status: paymentStatus, mp_payment_id },
    );

    return { received: true };
  }

  async findByOrder(order_id: string): Promise<Payment[]> {
    return this.paymentsRepository.find({ where: { order_id } });
  }
}