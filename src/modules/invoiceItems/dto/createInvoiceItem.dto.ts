import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateInvoiceItemDto {
  @IsOptional()
  service_id: number;

  @IsNotEmpty({ message: 'quantity không được để trống' })
  quantity: number;

  @IsNotEmpty({ message: 'unit_price không được để trống' })
  unit_price: number;

  @IsNotEmpty({ message: 'total_price không được để trống' })
  total_price: number;

  @IsNotEmpty({ message: 'invoice_id không được để trống' })
  invoice_id: number;
}
