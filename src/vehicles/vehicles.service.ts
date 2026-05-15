import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
  ) {}

  async create(data: Partial<Vehicle>): Promise<Vehicle> {
    const vehicle = this.vehiclesRepository.create(data);
    return this.vehiclesRepository.save(vehicle);
  }

  async findByCompany(company_id: string): Promise<Vehicle[]> {
    return this.vehiclesRepository.find({ where: { company_id, active: true } });
  }

  async findOne(id: string): Promise<Vehicle | null> {
    return this.vehiclesRepository.findOne({ where: { id } });
  }

  async deactivate(id: string): Promise<Vehicle | null> {
    await this.vehiclesRepository.update(id, { active: false });
    return this.vehiclesRepository.findOne({ where: { id } });
  }
}