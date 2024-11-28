import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateServiceDto {
  @IsNotEmpty({ message: 'id không được để trống' })
  id: number;

  @IsOptional()
  @IsNotEmpty({ message: 'name không được để trống' })
  name: string;

  @IsOptional()
  @IsNotEmpty({ message: 'description không được để trống' })
  description: string;

  @IsOptional()
  @IsNotEmpty({ message: 'unit_price không được để trống' })
  unit_price: number;

  @IsOptional()
  @IsNotEmpty({ message: 'category_id không được để trống' })
  category_id: number;
}
