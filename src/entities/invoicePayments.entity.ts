import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InvoiceEntity } from './invoice.entity'; // Giả sử bạn đã tạo entity InvoiceEntity

@Entity('invoice_payments')
export class InvoicePaymentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  payment_date: Date;

  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: ['Cash', 'Credit_card', 'Bank_transfer'], // Liệt kê các giá trị phương thức thanh toán trực tiếp
    default: 'Cash', // Giá trị mặc định là 'Cash'
  })
  payment_method: 'Cash' | 'Credit_card' | 'Bank_transfer';

  @Column({ nullable: true })
  note: string; // Ghi chú thanh toán (nếu có)

  @ManyToOne(() => InvoiceEntity, (invoice) => invoice.id)
  @JoinColumn({ name: 'invoice_id' })
  invoice: InvoiceEntity;

  @Column()
  invoice_id: number;
}
