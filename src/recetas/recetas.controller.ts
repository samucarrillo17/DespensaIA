import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { RecetasService } from './recetas.service';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { Throttle } from '@nestjs/throttler';

@Auth()
@Controller('recetas')
export class RecetasController {
  constructor(private readonly recetasService: RecetasService) {}

  @Throttle({ default: { limit: 5, ttl: 120000 } })
  @Post()
  create(@Body() createRecetaDto: CreateRecetaDto) {
    return this.recetasService.create(createRecetaDto);
  }

  @Get()
  findAll(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    return this.recetasService.findAll(limit, offset);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recetasService.findOne(id);
  }

  @Throttle({ default: { limit: 5, ttl: 120000 } })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecetaDto: UpdateRecetaDto) {
    return this.recetasService.update(id, updateRecetaDto);
  }

  @Throttle({ default: { limit: 5, ttl: 120000 } })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recetasService.remove(id);
  }
}
