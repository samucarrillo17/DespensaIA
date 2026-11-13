import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@google/genai';
import { EstadoDificultad } from '../../recetas/interfaces/estado-dificultad.enum';

/** Ingrediente dentro de la receta generada por IA. */
export class IngredienteRecetaRespuesta {
  @ApiProperty({ example: 'arroz', description: 'Nombre en minúsculas, singular' })
  ingrediente!: string;

  @ApiProperty({ example: 2, description: 'Cantidad >= 1 (medidas fijas -> 1, al gusto -> 1)' })
  cantidad!: number;

  @ApiProperty({
    example: 'tazas',
    description: "Unidad corta: g, kg, ml, l, uds, cucharadas, tazas, pizca, 'al gusto'...",
  })
  unidad!: string;
}

/** Espejo exacto de CreateRecetaDto: es la forma en que Gemini devuelve la
 *  receta, la que se muestra en el preview del frontend y la que se reenvía
 *  tal cual a POST /recetas. Clase (no interface) para que Swagger pueda
 *  documentar la respuesta del endpoint. Fuente única de verdad. */
export class RecipeGenerated {
  @ApiProperty({ example: 'Arroz con pollo' })
  nombre!: string;

  @ApiProperty({ example: 'Delicioso arroz con pollo en una olla' })
  descripcion!: string;

  @ApiProperty({ type: IngredienteRecetaRespuesta, isArray: true })
  ingredientes!: IngredienteRecetaRespuesta[];

  @ApiProperty({ type: String, isArray: true, description: 'Pasos ordenados' })
  pasos!: string[];

  @ApiProperty({ example: 30, description: 'Minutos totales de preparación + cocción' })
  minutos!: number;

  @ApiProperty({ enum: EstadoDificultad })
  dificultad!: EstadoDificultad;
}

/** responseSchema exigido a Gemini para que su salida respete la estructura
 *  de RecipeGenerated (solo con type/responseMimeType: 'application/json'). */
export const RECETA_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    nombre: { type: Type.STRING },
    descripcion: { type: Type.STRING },
    ingredientes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          ingrediente: { type: Type.STRING },
          cantidad: { type: Type.NUMBER },
          unidad: { type: Type.STRING },
        },
        required: ['ingrediente', 'cantidad', 'unidad'],
      },
    },
    pasos: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    minutos: { type: Type.NUMBER },
    dificultad: {
      type: Type.STRING,
      enum: ['facil', 'media', 'dificil'],
    },
  },
  required: [
    'nombre',
    'descripcion',
    'ingredientes',
    'pasos',
    'minutos',
    'dificultad',
  ],
} as const;
