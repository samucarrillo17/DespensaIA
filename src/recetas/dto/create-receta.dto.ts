import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoDificultad } from '../interfaces/estado-dificultad.enum';
import { IngredienteRecetaDto } from './ingrediente-receta.dto';

export class CreateRecetaDto {
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  nombre!: string;

  @IsString({
    message: 'La descripción debe ser un texto',
  })
  @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres' })
  @MaxLength(500, {
    message: 'La descripción no puede superar 500 caracteres',
  })
  descripcion!: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Debe incluir al menos un ingrediente' })
  @ValidateNested({ each: true })
  @Type(() => IngredienteRecetaDto)
  ingredientes!: IngredienteRecetaDto[];

  @IsArray()
  @ArrayMinSize(1, { message: 'Debe incluir al menos un paso' })
  @ArrayMaxSize(100, { message: 'No pueden ser más de 100 pasos' })
  @IsString({ each: true, message: 'Cada paso debe ser un texto' })
  @MinLength(3, {
    each: true,
    message: 'Cada paso debe tener al menos 3 caracteres',
  })
  pasos!: string[];

  @IsInt({ message: 'El tiempo debe ser un número entero de minutos' })
  @Min(1, { message: 'El tiempo debe ser mayor a cero' })
  @Max(10080, {
    message: 'El tiempo máximo permitido es 10080 minutos (7 días)',
  })
  minutos!: number;

  @IsEnum(EstadoDificultad, {
    message: `Dificultad inválida. Valores permitidos: ${Object.values(
      EstadoDificultad,
    ).join(', ')}`,
  })
  dificultad!: EstadoDificultad;
}
