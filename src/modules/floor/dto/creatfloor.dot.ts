// src/floor/dto/create-floor.dto.ts
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateFloorDTO {
  @IsString()
  @IsNotEmpty()
  name: string; // Tên tầng

  @IsInt()
  level: number; // Mức độ của tầng

  @IsInt()
  room_count: number; // Số phòng trên tầng

  @IsInt()
  hotel_id: number; // Khách sạn mà tầng này thuộc về
}
