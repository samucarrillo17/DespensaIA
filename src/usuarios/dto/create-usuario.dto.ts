import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsEmail()
  correo!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  contrasena!: string;

  @IsString()
  @IsNotEmpty()
  nombre!: string;
}
