import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceEntity } from 'src/entities/invoice.entity';
import { CreateInvoiceDto } from './dto/createInvoice.dto';
import { UpdateInvoiceDto } from './dto/updateInvoice.dto';
import { Invoice } from 'src/models/invoice.model';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
  ) {}

  // Lấy danh sách tất cả hóa đơn
  async getInvoices(): Promise<Invoice[]> {
    const invoices = await this.invoiceRepository.find();
    return invoices.map(
      (invoice) =>
        new Invoice(
          invoice.id,
          invoice.issue_at,
          invoice.total_amount,
          invoice.discount_amount,
          invoice.discount_percentage,
          invoice.customer_id,
          invoice.payment_method,
          invoice.status,
          invoice.booking_id,
          invoice.hotel_id,
        ),
    );
  }

  // Lấy chi tiết hóa đơn theo ID
  async getDetailInvoice(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({ where: { id } });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return new Invoice(
      invoice.id,
      invoice.issue_at,
      invoice.total_amount,
      invoice.discount_amount,
      invoice.discount_percentage,
      invoice.customer_id,
      invoice.payment_method,
      invoice.status,
      invoice.booking_id,
      invoice.hotel_id,
    );
  }

  // Tạo mới hóa đơn
  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const invoice = this.invoiceRepository.create({
      ...createInvoiceDto,
    });
    await this.invoiceRepository.save(invoice);
    return new Invoice(
      invoice.id,
      invoice.issue_at,
      invoice.total_amount,
      invoice.discount_amount,
      invoice.discount_percentage,
      invoice.customer_id,
      invoice.payment_method,
      invoice.status,
      invoice.booking_id,
      invoice.hotel_id,
    );
  }

  // Cập nhật hóa đơn theo ID
  async updateInvoice(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    const invoice = await this.getDetailInvoice(id);
    Object.assign(invoice, updateInvoiceDto);
    await this.invoiceRepository.save(invoice);
    return 'Update success';
  }

  // Xóa hóa đơn theo ID
  async deleteInvoice(id: number): Promise<string> {
    const result = await this.invoiceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return `Delete invoice ${id} success`;
  }
}
