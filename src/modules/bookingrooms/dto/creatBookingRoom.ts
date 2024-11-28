import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateBookingRoomDto {
  @IsInt()
  @IsPositive()
  price: number;

  @IsInt()
  @IsPositive()
  booking_id: number;

  @IsInt()
  @IsPositive()
  room_id: number;

  @IsInt()
  @IsPositive()
  hotel_id: number;
}
