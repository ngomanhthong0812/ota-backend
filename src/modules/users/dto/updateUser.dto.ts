import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty({ message: 'id không được để trống' })
  @Type(() => Number)
  @IsInt({ message: 'id phải là số nguyên' })
  id: number;

  @IsOptional()
  @IsNotEmpty({ message: 'user_name không được để trống' })
  user_name: string;

  @IsOptional()
  @MinLength(6, { message: 'Mật khẩu chứa ít nhất 6 ký tự' })
  password: string;

  @IsOptional()
  @IsEmail({}, { message: 'email không hợp lệ' })
  email: string;

  @IsOptional()
  @MinLength(10, { message: 'Số điện thoại chứa ít nhất 10 ký tự' })
  @MaxLength(15, { message: 'Số điện thoại chứa nhiều nhất 15 ký tự' })
  phone: string;

  @IsNotEmpty({ message: 'hotel_id không được để trống' })
  @Type(() => Number)
  @IsInt({ message: 'hotel_id phải là số nguyên' })
  hotel_id: number;

  @IsOptional()
  isActive: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'role_id phải là số nguyên' })
  role_id: number;
}
