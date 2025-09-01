import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAuthDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'example@test.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(4)
  @ApiProperty({ example: 'strongPassword123' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(2)
  @ApiProperty({ example: 'John Doe' })
  name: string;
  @IsNotEmpty()
  @IsPhoneNumber('PK')
  @ApiProperty({ example: '+923001234567' })
  phone_number: string;
}
