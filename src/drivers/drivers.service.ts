import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './driver.entity';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private driversRepository: Repository<Driver>,
  ) {}

  async create(data: Partial<Driver>): Promise<Driver> {
    const driver = this.driversRepository.create(data);
    return this.driversRepository.save(driver);
  }

  async findByCompany(company_id: string): Promise<Driver[]> {
    return this.driversRepository.find({ where: { company_id, active: true } });
  }

  async findOne(id: string): Promise<Driver | null> {
    return this.driversRepository.findOne({ where: { id } });
  }

  async deactivate(id: string): Promise<Driver | null> {
    await this.driversRepository.update(id, { active: false });
    return this.driversRepository.findOne({ where: { id } });
  }
}