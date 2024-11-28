import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateHotelDto {
  @IsNotEmpty({ message: 'id không được để trống' })
  id: number;

  @IsOptional()
  @IsNotEmpty({ message: 'name không được để trống' })
  name: string;

  @IsOptional()
  @IsNotEmpty({ message: 'address không được để trống' })
  address: string;

  @IsOptional()
  @MinLength(10, { message: 'Số điện thoại chứa ít nhất 10 ký tự' })
  @MaxLength(15, { message: 'Số điện thoại chứa nhiều nhất 15 ký tự' })
  phone: string;

  @IsOptional()
  @IsEmail({}, { message: 'email không đúng định dạng' })
  email: string;
}
