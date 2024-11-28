export class Booking {
  id?: number;
  booking_at?: Date;
  check_in_at?: Date;
  check_out_at?: Date;
  children?: number;
  adults?: number;
  total_amount?: number;
  status?: 'Booked' | 'Cancelled';
  customer_id?: number;
  hotel_id?: number;

  constructor(
    id: number,
    booking_at: Date,
    check_in_at: Date,
    check_out_at: Date,
    children: number,
    adults: number,
    total_amount: number,
    status: 'Booked' | 'Cancelled',
    customer_id: number,
    hotel_id: number,
  ) {
    if (id !== null) this.id = id;
    if (booking_at !== null) this.booking_at = booking_at;
    if (check_in_at !== null) this.check_in_at = check_in_at;
    if (check_out_at !== null) this.check_out_at = check_out_at;
    if (children !== null) this.children = children;
    if (adults !== null) this.adults = adults;
    if (total_amount !== null) this.total_amount = total_amount;
    if (status !== null) this.status = status;
    if (customer_id !== null) this.customer_id = customer_id;
    if (hotel_id !== null) this.hotel_id = hotel_id;
  }
}
