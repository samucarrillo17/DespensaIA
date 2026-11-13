import { ApiProperty } from '@nestjs/swagger';

/** Respuesta estándar de las operaciones que solo devuelven un mensaje
 *  (por ejemplo DELETE). Evita los `{ message: string }` anónimos, que
 *  Swagger no puede documentar. */
export class MessageDto {
  @ApiProperty({ example: 'Receta con id 3f9... eliminada' })
  message!: string;
}
