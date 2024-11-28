import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsEnum,
  IsDateString,
} from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsNotEmpty()
  id: number;

  @IsOptional()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(['Male', 'Female', 'Other'])
  gender?: 'Male' | 'Female' | 'Other';

  @IsOptional()
  @IsInt()
  hotel_id?: number;
}
