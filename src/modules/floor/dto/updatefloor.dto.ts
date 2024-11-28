// src/floor/dto/update-floor.dto.ts
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateFloorDTO {
  @IsOptional()
  @IsString()
  name?: string; // Tên tầng (optional)

  @IsOptional()
  @IsInt()
  level?: number; // Mức độ của tầng (optional)

  @IsOptional()
  @IsInt()
  room_count?: number; // Số lượng phòng (optional)

  @IsOptional()
  @IsInt()
  hotel_id?: number; // ID khách sạn (optional)
}
