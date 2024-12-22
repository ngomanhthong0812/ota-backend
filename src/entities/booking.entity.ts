import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { HotelEntity } from './hotel.entity';
import { BookingRoomEntity } from './bookingRoom.entity';
import { InvoiceEntity } from './invoice.entity';
import { UserEntity } from './user.entity';

@Entity('booking')
export class BookingEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  booking_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  check_in_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  check_out_at: Date;

  @Column()
  children: number;

  @Column()
  adults: number;

  @Column()
  total_amount: number;

  @Column({
    type: 'enum',
    enum: ['Booked', 'Cancelled', 'CheckedIn', 'CheckedOut', 'NoShow'],
    default: 'Booked', // Trạng thái mặc định là đã đặt
  })
  status: 'Booked' | 'Cancelled' | 'CheckedIn' | 'CheckedOut' | 'NoShow';

  @ManyToOne(() => CustomerEntity, (customer) => customer.id)
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity;

  @Column()
  customer_id: number;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ nullable: true })
  user_id: number;

  @ManyToOne(() => HotelEntity, (hotel) => hotel.id)
  @JoinColumn({ name: 'hotel_id' })
  hotel: HotelEntity;

  @Column()
  hotel_id: number;

  @OneToMany(() => BookingRoomEntity, (bookingRoom) => bookingRoom.booking)
  booking_rooms: BookingRoomEntity[];

  @OneToMany(() => InvoiceEntity, (invoice) => invoice.booking)
  invoices: InvoiceEntity[];
}
