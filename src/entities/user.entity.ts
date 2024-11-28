import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { HotelEntity } from './hotel.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_name: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  // Quan hệ nhiều đến một với bảng Role => 1 user có 1 role duy nhất và 1 role có nhiều user
  @ManyToOne(() => RoleEntity, (role) => role.id)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @Column()
  role_id: number;

  @Column()
  code: string;

  @Column()
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ManyToOne(() => HotelEntity, (hotel) => hotel.id)
  @JoinColumn({ name: 'hotel_id' })
  hotel: HotelEntity;

  @Column()
  hotel_id: number;
}
