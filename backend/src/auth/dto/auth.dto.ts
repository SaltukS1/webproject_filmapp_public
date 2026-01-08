import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Ahmet Yılmaz', description: 'Kullanıcının tam adı' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'Kullanıcının e-posta adresi' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'sifre123', description: 'Kullanıcının şifresi (en az 8 karakter)', minLength: 8 })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'Kullanıcının e-posta adresi' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'sifre123', description: 'Kullanıcının şifresi' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
