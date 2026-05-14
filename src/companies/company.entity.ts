import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  cuit: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  logo_url: string;

  @Column({ default: false })
  approved: boolean;

  @Column({ type: 'decimal', default: 10 })
  commission_pct: number;

  @CreateDateColumn()
  created_at: Date;
}