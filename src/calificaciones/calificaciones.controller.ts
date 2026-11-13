import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CalificacionesService } from './calificaciones.service';
import { CreateCalificacioneDto } from './dto/create-calificacione.dto';
import { UpdateCalificacioneDto } from './dto/update-calificacione.dto';
import { CalificacioneResponseDto } from './dto/calificacione-response.dto';
import { MessageDto } from '../common/dto/message.dto';
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
  ): Promise<CalificacioneResponseDto> {
    return this.calificacionesService.create(
      recetaId,
      createCalificacioneDto,
      usuarioId,
    );
  }
  @Get()
  findAll(
    @GetUser('id') usuarioId: string,
  ): Promise<CalificacioneResponseDto[]> {
    return this.calificacionesService.findAll(usuarioId);
  }

  @Get(':recetaId')
  findOne(
    @Param('recetaId') recetaId: string,
    @GetUser('id') usuarioId: string,
  ): Promise<CalificacioneResponseDto> {
    return this.calificacionesService.findOne(recetaId, usuarioId);
  }

  @Throttle({ default: { limit: 5, ttl: 120000 } })
  @Patch(':recetaId')
  update(
    @Param('recetaId') recetaId: string,
    @GetUser('id') usuarioId: string,
    @Body() updateCalificacioneDto: UpdateCalificacioneDto,
  ): Promise<CalificacioneResponseDto> {
    return this.calificacionesService.update(
      recetaId,
      updateCalificacioneDto,
      usuarioId,
    );
  }

  @Throttle({ default: { limit: 5, ttl: 120000 } })
  @Delete(':recetaId')
  remove(
    @Param('recetaId') recetaId: string,
    @GetUser('id') usuarioId: string,
  ): Promise<MessageDto> {
    return this.calificacionesService.remove(recetaId, usuarioId);
  }
}
