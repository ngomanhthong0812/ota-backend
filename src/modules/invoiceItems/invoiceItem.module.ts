import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceItemController } from './invoiceItem.controller';
import { InvoiceItemService } from './invoiceItem.service';
import { InvoiceItemEntity } from 'src/entities/invoiceItems.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceItemEntity])],
  controllers: [InvoiceItemController],
  providers: [InvoiceItemService],
})
export class InvoiceItemModule {}
