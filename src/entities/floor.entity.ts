import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('floor')
export class FloorEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Tên tầng (ví dụ: Tầng 1, Tầng 2, v.v.)

  @Column()
  level: number; // Mức độ của tầng (ví dụ: 1 cho tầng đầu tiên, 2 cho tầng thứ hai)

  @Column({ default: 0 })
  room_count: number; // Số lượng phòng trên tầng này

  @Column()
  hotel_id: number;
}
