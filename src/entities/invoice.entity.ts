import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BookingEntity } from './booking.entity';
import { HotelEntity } from './hotel.entity';
import { CustomerEntity } from './customer.entity';

@Entity('invoice')
export class InvoiceEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' }) // Tự động lấy thời gian tạo bản ghi
  issue_at: Date;

  @Column()
  total_amount: number;

  // Thêm trường giảm giá vào bảng invoice
  @Column({ nullable: true, default: 0 })
  discount_amount: number; // Giảm giá theo số tiền

  @Column({ nullable: true, default: 0 })
  discount_percentage: number; // Giảm giá theo phần trăm

  @ManyToOne(() => CustomerEntity, (customer) => customer.id)
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity;

  @Column()
  customer_id: number;

  @Column({
    type: 'enum',
    enum: ['Cash', 'Credit_card', 'Bank_transfer'],
    default: 'Cash', // Giá trị mặc định là 'Cash'
  })
  payment_method: 'Cash' | 'Credit_card' | 'Bank_transfer';

  @Column({
    type: 'enum',
    enum: ['Paid', 'Unpaid'],
    default: 'Unpaid', // Giá trị mặc định là 'Unpaid'
  })
  status: 'Paid' | 'Unpaid';

  @ManyToOne(() => BookingEntity, (booking) => booking.id)
  @JoinColumn({ name: 'booking_id' })
  booking: BookingEntity;

  @Column()
  booking_id: number;

  @ManyToOne(() => HotelEntity, (hotel) => hotel.id)
  @JoinColumn({ name: 'hotel_id' })
  hotel: HotelEntity;

  @Column()
  hotel_id: number;
}
