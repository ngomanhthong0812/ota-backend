import {
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsInt,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCustomerDto {
  @IsOptional()
  @MinLength(10, { message: 'Số điện thoại chứa ít nhất 10 ký tự' })
  @MaxLength(15, { message: 'Số điện thoại chứa nhiều nhất 15 ký tự' })
  phone: string;

  @IsNotEmpty({ message: 'email không được để trống' })
  @IsEmail({}, { message: 'email không hợp lệ' })
  email: string;

  @IsEnum(['Male', 'Female', 'Other'])
  gender: 'Male' | 'Female' | 'Other';

  @IsNotEmpty()
  hotel_id: number;
}
