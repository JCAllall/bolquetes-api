import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(data: Partial<User>): Promise<Partial<User>> {
  const hashed = await (bcrypt as any).hash(data.password!, 10);
  const user = this.usersRepository.create({ ...data, password: hashed });
  const saved = await this.usersRepository.save(user);
  const { password, ...rest } = saved;
  return rest;
}

  async findAll(): Promise<Partial<User>[]> {
  const users = await this.usersRepository.find();
  return users.map(({ password, ...rest }) => rest);
}
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }
}