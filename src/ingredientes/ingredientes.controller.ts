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
import { GetUser } from '../auth/decorator/get-user.decorator';
import { Throttle } from '@nestjs/throttler';

@Auth()
@Controller('ingredientes')
export class IngredientesController {
  constructor(private readonly ingredientesService: IngredientesService) {}

  @Throttle({ default: { limit: 5, ttl: 120000 } })
  @Post()
  create(
    @GetUser('id') usuarioId: string,
    @Body() createIngredienteDto: CreateIngredienteDto,
  ) {
    return this.ingredientesService.create(createIngredienteDto, usuarioId);
  }

  @Get()
  findAll(@GetUser('id') usuarioId: string) {
    return this.ingredientesService.findAll(usuarioId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('id') usuarioId: string) {
    return this.ingredientesService.findOne(id, usuarioId);
  }

  @Throttle({ default: { limit: 5, ttl: 120000 } })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @GetUser('id') usuarioId: string,
    @Body() updateIngredienteDto: UpdateIngredienteDto,
  ) {
    return this.ingredientesService.update(id, updateIngredienteDto, usuarioId);
  }

  @Throttle({ default: { limit: 5, ttl: 120000 } })
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('id') usuarioId: string) {
    return this.ingredientesService.remove(id, usuarioId);
  }
}
