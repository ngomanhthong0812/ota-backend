import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HotelEntity } from './hotel.entity';

@Entity('customer')
export class CustomerEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  name: string;

  @Column({ type: 'timestamp' })
  birthday: Date;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: ['Male', 'Female', 'Other'],
    default: 'Male', // Giới tính mặc định là Male
  })
  gender: 'Male' | 'Female' | 'Other';

  @ManyToOne(() => HotelEntity, (hotel) => hotel.id)
  @JoinColumn({ name: 'hotel_id' })
  hotel: HotelEntity;

  @Column()
  hotel_id: number;
}
