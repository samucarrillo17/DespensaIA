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
import { RecetaResponseDto } from './dto/receta-response.dto';
import { MessageDto } from '../common/dto/message.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { Throttle } from '@nestjs/throttler';

@Auth()
@Controller('recetas')
export class RecetasController {
  constructor(private readonly recetasService: RecetasService) {}

  @Throttle({ default: { limit: 5, ttl: 120000 } })
  @Post()
  create(
    @GetUser('id') usuarioId: string,
    @Body() createRecetaDto: CreateRecetaDto,
  ): Promise<RecetaResponseDto> {
    return this.recetasService.create(createRecetaDto, usuarioId);
  }

  @Get()
  findAll(
    @GetUser('id') usuarioId: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<RecetaResponseDto[]> {
    return this.recetasService.findAll(usuarioId, limit, offset);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @GetUser('id') usuarioId: string,
  ): Promise<RecetaResponseDto> {
    return this.recetasService.findOne(id, usuarioId);
  }

  @Throttle({ default: { limit: 5, ttl: 120000 } })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @GetUser('id') usuarioId: string,
    @Body() updateRecetaDto: UpdateRecetaDto,
  ): Promise<RecetaResponseDto> {
    return this.recetasService.update(id, updateRecetaDto, usuarioId);
  }

  @Throttle({ default: { limit: 5, ttl: 120000 } })
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @GetUser('id') usuarioId: string,
  ): Promise<MessageDto> {
    return this.recetasService.remove(id, usuarioId);
  }
}
