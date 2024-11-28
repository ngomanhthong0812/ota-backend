import { IsDateString, IsInt, IsEnum } from 'class-validator';

export class CreateBookingDto {
  @IsDateString()
  booking_at: Date;

  @IsDateString()
  check_in_at: Date;

  @IsDateString()
  check_out_at: Date;

  @IsInt()
  children: number;

  @IsInt()
  adults: number;

  @IsInt()
  total_amount: number;

  @IsEnum(['Booked', 'Cancelled'])
  status: 'Booked' | 'Cancelled';

  @IsInt()
  customer_id: number;

  @IsInt()
  hotel_id: number;
}
