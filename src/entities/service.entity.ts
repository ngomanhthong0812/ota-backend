import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { CategoryEntity } from './category.entity'; // Import CategoryEntity

@Entity('services')
export class ServiceEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number; // Mã dịch vụ

  @Column()
  name: string; // Tên dịch vụ (Ví dụ: "Dọn phòng", "Giặt là", "Spa")

  @Column({ nullable: true })
  description: string; // Mô tả chi tiết về dịch vụ

  @Column()
  unit_price: number; // Đơn giá của dịch vụ

  @ManyToOne(() => CategoryEntity, (category) => category.id)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity; // Liên kết với loại dịch vụ

  @Column()
  category_id: number; // ID của loại dịch vụ
}
