import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class UpdateBookingRoomDto {
  @IsInt()
  @IsOptional()
  @IsPositive()
  price?: number;

  @IsInt()
  @IsOptional()
  @IsPositive()
  booking_id?: number;

  @IsInt()
  @IsOptional()
  @IsPositive()
  room_id?: number;

  @IsInt()
  @IsOptional()
  @IsPositive()
  hotel_id?: number;
}
