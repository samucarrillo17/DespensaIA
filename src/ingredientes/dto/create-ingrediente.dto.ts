import { IsEnum, IsInt, IsString, Min, MinLength } from 'class-validator';
import { UnidadIngredientes } from '../interfaces/unidad-ingredientes.enum';

export class CreateIngredienteDto {
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  nombre!: string;

  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad debe ser mayor a cero' })
  cantidad!: number;

  @IsEnum(UnidadIngredientes, {
    message: `Unidad inválida. Valores permitidos: ${Object.values(
      UnidadIngredientes,
    ).join(', ')}`,
  })
  unidad!: UnidadIngredientes;
}
