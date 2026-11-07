import { IsNumber, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class IngredienteRecetaDto {
  @IsString()
  @MinLength(2, {
    message: 'El nombre del ingrediente debe tener al menos 2 caracteres',
  })
  ingrediente!: string;

  /** Cantidad >= 1 de la unidad indicada (ej: 2 cucharadas -> cantidad 2).
   *  Medidas fijas ("una pizca", "una taza") -> cantidad 1.
   *  "Al gusto" -> unidad 'al gusto', cantidad 1. */
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'La cantidad debe ser mayor a cero' })
  cantidad!: number;

  /** Unidad en texto libre: g, ml, uds, cucharadas, tazas, pizca, 'al gusto'... */
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  unidad!: string;
}
