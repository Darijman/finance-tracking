import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Transaction } from 'src/transactions/transaction.entity';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @Column({ unique: true })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }
}
