import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/user.entity';

export enum Categories {
  'Food' = 'Food',
  'Transport' = 'Transport',
  'Entertainment' = 'Entertainment',
  'Clothes' = 'Clothes',
  'Health' = 'Health',
  'Different' = 'Different',
}

export enum TransactionType {
  'Income' = 'Income',
  'Expense' = 'Expense',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'datetime' })
  transactionDate: Date;

  @Column('decimal', {precision: 10, scale: 2 })
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

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
