import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateInvoiceItemDto {
  @IsNotEmpty({ message: 'id không được để trống' })
  id: number;

  @IsOptional()
  @IsNotEmpty({ message: 'service_id không được để trống' })
  service_id: number;

  @IsOptional()
  @IsNotEmpty({ message: 'quantity không được để trống' })
  quantity: number;

  @IsOptional()
  @IsNotEmpty({ message: 'unit_price không được để trống' })
  unit_price: number;

  @IsOptional()
  @IsNotEmpty({ message: 'total_price không được để trống' })
  total_price: number;

  @IsOptional()
  @IsNotEmpty({ message: 'invoice_id không được để trống' })
  invoice_id: number;
}
