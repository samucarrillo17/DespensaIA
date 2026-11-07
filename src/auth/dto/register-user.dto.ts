import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class registerUserDto {
  @IsString()
  nombre!: string;

  @IsEmail()
  correo!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  contrasena!: string;
}
