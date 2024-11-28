import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateHotelDto {
  @IsNotEmpty({ message: 'name không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'email không được để trống' })
  @IsEmail({}, { message: 'email không đúng định dạng' })
  email: string;

  @IsOptional()
  address: string;

  @IsOptional()
  phone: string;
}
