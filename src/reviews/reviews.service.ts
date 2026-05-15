import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
  ) {}

  async create(data: Partial<Review>): Promise<Review> {
    const review = this.reviewsRepository.create(data);
    return this.reviewsRepository.save(review);
  }

  async findByCompany(company_id: string): Promise<Review[]> {
    return this.reviewsRepository.find({
      where: { company_id },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async findByOrder(order_id: string): Promise<Review[]> {
    return this.reviewsRepository.find({
      where: { order_id },
      relations: ['user'],
    });
  }

  async getAverageRating(company_id: string): Promise<{ average: number; total: number }> {
    const result = await this.reviewsRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'average')
      .addSelect('COUNT(review.id)', 'total')
      .where('review.company_id = :company_id', { company_id })
      .getRawOne();

    return {
      average: parseFloat(result.average) || 0,
      total: parseInt(result.total) || 0,
    };
  }
}