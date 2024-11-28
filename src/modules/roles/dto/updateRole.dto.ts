import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateRoleDto {
  @IsNotEmpty({ message: 'id không được để trống' })
  id: number;

  @IsOptional()
  @IsNotEmpty({ message: 'name không được để trống' })
  name: string;

  @IsOptional()
  @IsNotEmpty({ message: 'description không được để trống' })
  description: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'hotel_id phải là số nguyên' })
  hotel_id: number;
}
