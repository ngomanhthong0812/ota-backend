export class InvoicePayment {
  id?: number;
  payment_date?: Date;
  amount?: number;
  payment_method?: 'Cash' | 'Credit_card' | 'Bank_transfer';
  note?: string;
  invoice_id?: number;

  constructor(
    id?: number,
    payment_date?: Date,
    amount?: number,
    payment_method?: 'Cash' | 'Credit_card' | 'Bank_transfer',
    note?: string,
    invoice_id?: number,
  ) {
    if (id !== null) this.id = id;
    if (payment_date !== null) this.payment_date = payment_date;
    if (amount !== null) this.amount = amount;
    if (payment_method !== null) this.payment_method = payment_method;
    if (note !== null) this.note = note;
    if (invoice_id !== null) this.invoice_id = invoice_id;
  }
}
