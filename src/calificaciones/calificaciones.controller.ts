import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CalificacionesService } from './calificaciones.service';
import { CreateCalificacioneDto } from './dto/create-calificacione.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { GetUser } from '../auth/decorator/get-user.decorator';

@Auth()
@Controller('calificaciones')
export class CalificacionesController {
  constructor(private readonly calificacionesService: CalificacionesService) {}

  @Throttle({ default: { limit: 5, ttl: 120000 } })
  @Post(':recetaId')
  create(
    @Param('recetaId') recetaId: string,
    @GetUser('id') usuarioId: string,
    @Body() createCalificacioneDto: CreateCalificacioneDto,
  ) {
    return this.calificacionesService.create(
      recetaId,
      createCalificacioneDto,
      usuarioId,
    );
  }

  @Get()
  findAll() {
    return this.calificacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.calificacionesService.findOne(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.calificacionesService.remove(Number(id));
  }
}
