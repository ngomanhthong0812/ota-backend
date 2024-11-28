import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateInvoicePaymentDto {
  @IsNotEmpty({ message: 'amount không được để trống' })
  amount: number;

  @IsEnum(['Cash', 'Credit_card', 'Bank_transfer'])
  @IsNotEmpty({ message: 'payment_method không được để trống' })
  payment_method: 'Cash' | 'Credit_card' | 'Bank_transfer';

  @IsNotEmpty({ message: 'note không được để trống' })
  note: string;

  @IsNotEmpty({ message: 'invoice_id không được để trống' })
  invoice_id: number;
}
