import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/** Entrada del frontend para generar una receta con IA. */
export class GenerateRecipeDto {
  /** Ingredientes que tiene el usuario disponibles (ej: ['tomate', 'pasta']). */
  @IsArray({ message: 'Los ingredientes deben ser un array de textos' })
  @ArrayMinSize(1, { message: 'Debe enviar al menos un ingrediente' })
  @ArrayMaxSize(20, { message: 'No puede enviar más de 20 ingredientes' })
  @IsString({ each: true, message: 'Cada ingrediente debe ser un texto' })
  @MinLength(2, {
    each: true,
    message: 'Cada ingrediente debe tener al menos 2 caracteres',
  })
  ingredientes!: string[];

  /** Preferencia opcional del usuario (ej: 'sin lactosa' o 'estilo mexicano'). */
  @IsOptional()
  @IsString({ message: 'El prompt personalizado debe ser un texto' })
  @MaxLength(500, {
    message: 'El prompt personalizado no puede superar 500 caracteres',
  })
  promptPersonalizado?: string;
}
