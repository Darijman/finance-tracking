import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/user.entity';
import { FinanceCategory } from 'src/financeCategories/financeCategory.entity';
import { Exclude, Expose } from 'class-transformer';

export enum NoteType {
  'INCOME' = 'INCOME',
  'EXPENSE' = 'EXPENSE',
}

@Entity('finance_notes')
export class FinanceNote {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'timestamp' })
  noteDate: Date;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: NoteType })
  type: NoteType;

  @Expose()
  @ManyToOne(() => FinanceCategory, { nullable: false })
  @JoinColumn({ name: 'categoryId' })
  category: FinanceCategory;

  @Exclude()
  @Column({ type: 'int' })
  categoryId: number;

  @Column({ nullable: true, default: null, length: 255 })
  comment?: string;

  @Expose()
  @ManyToOne(() => User, (user) => user.financeNotes)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Exclude()
  @Column({ type: 'int' })
  userId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
