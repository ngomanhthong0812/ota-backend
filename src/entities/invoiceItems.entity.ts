import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { InvoiceEntity } from './invoice.entity';
import { ServiceEntity } from './service.entity';

@Entity('invoice_items')
export class InvoiceItemEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ServiceEntity, (service) => service.id)
  @JoinColumn({ name: 'service_id' })
  service: ServiceEntity;

  @Column({ nullable: true })
  service_id: number;

  @Column()
  quantity: number; // Số lượng dịch vụ sử dụng (ví dụ: số ngày phòng hoặc số lần sử dụng dịch vụ)

  @Column()
  unit_price: number; // Đơn giá của dịch vụ

  @Column()
  total_price: number; // Tổng giá trị dịch vụ (tính toán từ quantity * unit_price)

  @ManyToOne(() => InvoiceEntity, (invoice) => invoice.id)
  @JoinColumn({ name: 'invoice_id' })
  invoice: InvoiceEntity;

  @Column()
  invoice_id: number;

  // Trước khi lưu hoặc cập nhật bản ghi, tính toán lại tổng giá trị
  @BeforeInsert()
  @BeforeUpdate()
  calculateTotalPrice() {
    this.total_price = this.quantity * this.unit_price;
  }
}
