import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginAuthDto {
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
}
