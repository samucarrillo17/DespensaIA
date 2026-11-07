import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { IngredientesService } from './ingredientes.service';
import { CreateIngredienteDto } from './dto/create-ingrediente.dto';
import { UpdateIngredienteDto } from './dto/update-ingrediente.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { Throttle } from '@nestjs/throttler';

@Auth()
@Controller('ingredientes')
export class IngredientesController {
  constructor(private readonly ingredientesService: IngredientesService) {}

  @Throttle({ default: { limit: 5, ttl: 120000 } })
  @Post()
  create(@Body() createIngredienteDto: CreateIngredienteDto) {
    return this.ingredientesService.create(createIngredienteDto);
  }

  @Get()
  findAll() {
    return this.ingredientesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ingredientesService.findOne(id);
  }

  @Throttle({ default: { limit: 5, ttl: 120000 } })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIngredienteDto: UpdateIngredienteDto) {
    return this.ingredientesService.update(id, updateIngredienteDto);
  }

  @Throttle({ default: { limit: 5, ttl: 120000 } })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ingredientesService.remove(id);
  }
}
