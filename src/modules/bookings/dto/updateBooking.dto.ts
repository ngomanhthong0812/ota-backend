import { IsOptional, IsDateString, IsInt, IsEnum } from 'class-validator';

export class UpdateBookingDto {
  @IsOptional()
  @IsDateString()
  booking_at?: Date;

  @IsOptional()
  @IsDateString()
  check_in_at?: Date;

  @IsOptional()
  @IsDateString()
  check_out_at?: Date;

  @IsOptional()
  @IsInt()
  children?: number;

  @IsOptional()
  @IsInt()
  adults?: number;

  @IsOptional()
  @IsInt()
  total_amount?: number;

  @IsOptional()
  @IsEnum(['Booked', 'Cancelled'])
  status?: 'Booked' | 'Cancelled';

  @IsOptional()
  @IsInt()
  customer_id?: number;

  @IsOptional()
  @IsInt()
  hotel_id?: number;
}
