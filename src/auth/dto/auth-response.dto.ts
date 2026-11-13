import { ApiProperty } from '@nestjs/swagger';

/** Respuesta de /auth/register y /auth/login: usuario público + JWT.
 *  Nunca incluye contrasena. */
export class AuthResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'samuel@example.com' })
  correo!: string;

  @ApiProperty({ example: 'Samuel' })
  nombre!: string;

  @ApiProperty({ format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ description: 'Token JWT para autenticar las demás rutas' })
  token!: string;
}
