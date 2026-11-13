import { ApiProperty } from '@nestjs/swagger';

/** Usuario sin contrasena: forma de create y update. Clase (no Pick) para
 *  que Swagger pueda documentar la respuesta. */
export class UsuarioPublicoDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'samuel@example.com' })
  correo!: string;

  @ApiProperty({ example: 'Samuel' })
  nombre!: string;

  @ApiProperty({ format: 'date-time' })
  createdAt!: Date;
}
