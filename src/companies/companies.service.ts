import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  async create(data: Partial<Company>): Promise<Company> {
    const company = this.companiesRepository.create(data);
    return this.companiesRepository.save(company);
  }

  async findAll(): Promise<Company[]> {
    return this.companiesRepository.find();
  }

  async findApproved(): Promise<Company[]> {
    return this.companiesRepository.find({ where: { approved: true } });
  }

  async approve(id: string): Promise<Company | null> {
  await this.companiesRepository.update(id, { approved: true });
  return this.companiesRepository.findOne({ where: { id } });
}
}