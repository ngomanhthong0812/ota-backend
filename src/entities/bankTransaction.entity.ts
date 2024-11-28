import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionEntity } from './transaction.entity';

@Entity('bank_transaction')
export class BankTransactionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  receiverAccount: string; // Số tài khoản người nhận

  @Column({ type: 'varchar', length: 255 })
  receiverName: string; // Tên người nhận

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  bankAmount: number; // Số tiền chuyển khoản

  @OneToOne(() => TransactionEntity)
  @JoinColumn({ name: 'transaction_id' })
  transaction: TransactionEntity;

  @Column()
  transaction_id: number;
}
