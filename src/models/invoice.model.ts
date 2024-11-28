export class Invoice {
  id?: number;
  issue_at?: Date;
  total_amount?: number;
  discount_amount?: number;
  discount_percentage?: number;
  customer_id?: number;
  payment_method?: 'Cash' | 'Credit_card' | 'Bank_transfer';
  status?: 'Paid' | 'Unpaid';
  booking_id?: number;
  hotel_id?: number;

  constructor(
    id: number,
    issue_at: Date,
    total_amount: number,
    discount_amount: number,
    discount_percentage: number,
    customer_id: number,
    payment_method: 'Cash' | 'Credit_card' | 'Bank_transfer',
    status: 'Paid' | 'Unpaid',
    booking_id: number,
    hotel_id: number,
  ) {
    if (id !== null) this.id = id;
    if (issue_at !== null) this.issue_at = issue_at;
    if (total_amount !== null) this.total_amount = total_amount;
    if (discount_amount !== null) this.discount_amount = discount_amount;
    if (discount_percentage !== null)
      this.discount_percentage = discount_percentage;
    if (customer_id !== null) this.customer_id = customer_id;
    if (payment_method !== null) this.payment_method = payment_method;
    if (status !== null) this.status = status;
    if (booking_id !== null) this.booking_id = booking_id;
    if (hotel_id !== null) this.hotel_id = hotel_id;
  }
}
