import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async create(data: Partial<Order>): Promise<Order> {
    const order = this.ordersRepository.create(data);
    return this.ordersRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['user', 'company', 'driver', 'vehicle'],
      order: { created_at: 'DESC' },
    });
  }

  async findByUser(user_id: string): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { user_id },
      relations: ['company', 'driver', 'vehicle'],
      order: { created_at: 'DESC' },
    });
  }

  async findByCompany(company_id: string): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { company_id },
      relations: ['user', 'driver', 'vehicle'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user', 'company', 'driver', 'vehicle'],
    });
    if (!order) throw new NotFoundException('Orden no encontrada');
    return order;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    await this.ordersRepository.update(id, { status });
    return this.findOne(id);
  }

  async assignDriver(id: string, driver_id: string, vehicle_id: string): Promise<Order> {
    await this.ordersRepository.update(id, {
      driver_id,
      vehicle_id,
      status: OrderStatus.ASSIGNED,
    });
    return this.findOne(id);
  }
}