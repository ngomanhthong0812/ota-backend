import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @IsNotEmpty({ message: 'id không được để trống' })
  id: number;

  @IsOptional()
  @IsNotEmpty({ message: 'name không được để trống' })
  name: string;

  @IsOptional()
  @IsNotEmpty({ message: 'description không được để trống' })
  description: string;
}
