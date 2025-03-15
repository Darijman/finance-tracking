import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/user.entity';

export enum Categories {
  'FOOD' = 'FOOD',
  'TRANSPORT' = 'TRANSPORT',
  'ENTERTAINMENT' = 'ENTERTAINMENT',
  'CLOTHES' = 'CLOTHES',
  'HEALTH' = 'HEALTH',
  'DIFFERENT' = 'DIFFERENT',
}

export enum TransactionType {
  'INCOME' = 'INCOME',
  'EXPENSE' = 'EXPENSE',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'datetime' })
  transactionDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'enum', enum: Categories })
  category: Categories;

  @Column({ nullable: true, default: null, length: 255 })
  comment?: string;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'int' })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
