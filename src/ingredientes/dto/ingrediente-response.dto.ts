import { ApiProperty } from '@nestjs/swagger';
import { UnidadIngredientes } from '../interfaces/unidad-ingredientes.enum';

/** Forma real de la respuesta de /ingredientes: solo las columnas de la
 *  tabla, sin la relación `usuario` (y todo su árbol). Clase en vez de la
 *  entidad para que Swagger no documente las relaciones. */
export class IngredienteResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'uvas' })
  nombre!: string;

  @ApiProperty({ example: 100 })
  cantidad!: number;

  @ApiProperty({ example: 'g', enum: UnidadIngredientes })
  unidad!: string;

  /** Dueño del ingrediente (del JWT), útil sin exponer la relación completa. */
  @ApiProperty({ format: 'uuid' })
  usuarioId!: string;

  @ApiProperty({ format: 'date-time' })
  createdAt!: Date;
}
