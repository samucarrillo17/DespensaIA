import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCalificacioneDto {
  @IsInt({ message: 'El puntaje debe ser un número entero' })
  @Min(1, { message: 'El puntaje mínimo es 1 estrella' })
  @Max(5, { message: 'El puntaje máximo es 5 estrellas' })
  puntaje!: number;

  @IsOptional()
  @IsString({ message: 'El comentario debe ser un texto' })
  @MaxLength(500, {
    message: 'El comentario no puede superar 500 caracteres',
  })
  comentario?: string;
}
