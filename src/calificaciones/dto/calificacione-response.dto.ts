import { ApiProperty } from '@nestjs/swagger';

/** Forma real de la respuesta de /calificaciones: solo las columnas de la
 *  tabla, sin las relaciones `receta` ni `usuario`. Clase en vez de la
 *  entidad para que Swagger no documente las relaciones. */
export class CalificacioneResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid', description: 'Receta calificada' })
  recetaId!: string;

  /** Quien califica (del JWT), útil sin exponer la relación completa. */
  @ApiProperty({ format: 'uuid' })
  usuarioId!: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  puntaje!: number;

  @ApiProperty({ example: 'Muy rica', nullable: true })
  comentario!: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt!: Date;
}
