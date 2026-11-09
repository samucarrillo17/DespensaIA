import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Auth } from '../auth/decorator/auth.decorator';
import { AiService } from './ai.service';
import { GenerateRecipeDto } from './dto/generate-recipe.dto';
import { RecipeGenerated } from './interfaces/recipe-generated.interface';

@Auth()
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /** Único endpoint del módulo: genera una receta con IA a partir de los
   *  ingredientes del usuario. NO la guarda; el frontend la muestra y, si el
   *  usuario acepta, reenvía esta misma respuesta a POST /recetas. */
  // Más estricto que el global para no quemar la cuota gratuita de Google.
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('generar-receta')
  @HttpCode(HttpStatus.OK)
  generarReceta(
    @Body() generateRecipeDto: GenerateRecipeDto,
  ): Promise<RecipeGenerated> {
    return this.aiService.generarReceta(generateRecipeDto);
  }
}
