import { ApiProperty } from '@nestjs/swagger';
import { EstadoDificultad } from '../interfaces/estado-dificultad.enum';

/** Ingrediente de la receta (columna jsonb `ingredientes`). */
export class IngredienteReceta {
  @ApiProperty({ example: 'arroz', description: 'Nombre en minúsculas, singular' })
  ingrediente!: string;

  @ApiProperty({ example: 2, description: 'Cantidad >= 1' })
  cantidad!: number;

  @ApiProperty({ example: 'tazas', description: 'Unidad corta: g, kg, ml, l, uds...' })
  unidad!: string;
}

/** Forma real de la respuesta de /recetas: columnas de la tabla, sin las
 *  relaciones `usuario` ni `calificaciones` ni la columna interna `deletedAt`.
 *  Clase en vez de la entidad para que Swagger no documente las relaciones. */
export class RecetaResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Arroz con pollo' })
  nombre!: string;

  @ApiProperty({ example: 'Delicioso arroz con pollo en una olla' })
  descripcion!: string;

  @ApiProperty({ type: IngredienteReceta, isArray: true })
  ingredientes!: IngredienteReceta[];

  @ApiProperty({ type: String, isArray: true, description: 'Pasos ordenados' })
  pasos!: string[];

  @ApiProperty({ example: 30, description: 'Minutos totales de preparación + cocción' })
  minutos!: number;

  @ApiProperty({ enum: EstadoDificultad })
  dificultad!: EstadoDificultad;

  /** Dueño de la receta (del JWT), útil sin exponer la relación completa. */
  @ApiProperty({ format: 'uuid' })
  usuarioId!: string;

  @ApiProperty({ format: 'date-time' })
  createdAt!: Date;
}
