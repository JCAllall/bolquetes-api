import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
  ) {}

  async create(data: Partial<Service>): Promise<Service> {
    const service = this.servicesRepository.create(data);
    return this.servicesRepository.save(service);
  }

  async findByCompany(company_id: string): Promise<Service[]> {
    return this.servicesRepository.find({ where: { company_id, active: true } });
  }

  async findByCategory(category: string): Promise<Service[]> {
    return this.servicesRepository.find({ where: { category, active: true } });
  }
}