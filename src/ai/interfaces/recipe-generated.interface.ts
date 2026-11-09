import { Type } from '@google/genai';
import { EstadoDificultad } from '../../recetas/interfaces/estado-dificultad.enum';

/** Espejo exacto de CreateRecetaDto: es la forma en que Gemini devuelve la
 *  receta, la que se muestra en el preview del frontend y la que se reenvía
 *  tal cual a POST /recetas (fuente única de verdad). */
export interface RecipeGenerated {
  nombre: string;
  descripcion: string;
  ingredientes: {
    ingrediente: string;
    /** Cantidad >= 1 (medidas fijas -> 1, 'al gusto' -> 1). */
    cantidad: number;
    /** Unidad corta: g, kg, ml, l, uds, cucharadas, tazas, pizca, 'al gusto'... */
    unidad: string;
  }[];
  pasos: string[];
  minutos: number;
  dificultad: EstadoDificultad;
}

/** responseSchema exigido a Gemini para que su salida respete la estructura
 *  de RecipeGenerated (óslo con type/responseMimeType: 'application/json'). */
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
