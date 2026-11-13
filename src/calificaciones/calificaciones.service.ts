import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { CreateCalificacioneDto } from './dto/create-calificacione.dto';
import { UpdateCalificacioneDto } from './dto/update-calificacione.dto';
import { CalificacioneResponseDto } from './dto/calificacione-response.dto';
import { MessageDto } from '../common/dto/message.dto';
import { Calificacione } from './entities/calificacione.entity';
import { Receta } from '../recetas/entities/receta.entity';
import { handleDBException } from '../common/helpers/handleDbException';

@Injectable()
export class CalificacionesService {
  constructor(
    @InjectRepository(Calificacione)
    private readonly calificacionRepository: Repository<Calificacione>,
    @InjectRepository(Receta)
    private readonly recetaRepository: Repository<Receta>,
  ) {}

  private validarId(id: string): void {
    if (!id || !isUUID(id)) {
      throw new NotFoundException(`id no válido: ${id}`);
    }
  }

  /**
   * Crea una calificacion sobre la receta dada por URL.
   *
   * Restriccion: solo el dueño de la receta puede calificarla. Se aplica
   * buscando la receta acotada por usuario: si el id existe pero pertenece
   * a otro usuario, responde 404 (no revela que el recurso existe).
   */
  async create(
    recetaId: string,
    createCalificacioneDto: CreateCalificacioneDto,
    usuarioId: string,
  ): Promise<CalificacioneResponseDto> {
    this.validarId(recetaId);

    const receta = await this.recetaRepository.findOneBy({
      id: recetaId,
      usuarioId,
    });

    if (!receta) {
      throw new NotFoundException(`Receta con id ${recetaId} no encontrada`);
    }

    try {
      // El autor de la calificacion siempre viene del JWT, nunca del body.
      return await this.calificacionRepository.save(
        this.calificacionRepository.create({
          ...createCalificacioneDto,
          recetaId,
          usuarioId,
        }),
      );
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('Ya calificaste esta receta');
      }
      handleDBException(error);
    }
  }
  
  async findAll(usuarioId: string): Promise<CalificacioneResponseDto[]> {
    return this.calificacionRepository.find({
      where: { usuarioId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Devuelve la calificacion del usuario autenticado para la receta dada.
   *
   * Se busca por (recetaId, usuarioId): si el recetaId existe pero la
   * calificacion es de otro usuario, responde 404 (no revela que existe).
   */
  async findOne(
    recetaId: string,
    usuarioId: string,
  ): Promise<CalificacioneResponseDto> {
    this.validarId(recetaId);

    const calificacion = await this.calificacionRepository.findOneBy({
      recetaId,
      usuarioId,
    });

    if (!calificacion) {
      throw new NotFoundException(
        `No hay calificación para la receta con id ${recetaId}`,
      );
    }

    return calificacion;
  }

  async update(
    recetaId: string,
    updateCalificacioneDto: UpdateCalificacioneDto,
    usuarioId: string,
  ): Promise<CalificacioneResponseDto> {
    this.validarId(recetaId);

    // Se busca acotado por usuario: preload({ recetaId, ...dto }) NO
    // comprobaría el dueño y permitiría editar calificaciones ajenas.
    const calificacion = await this.findOne(recetaId, usuarioId);

    // El puntaje solo cambia si viene en el PATCH.
    if (updateCalificacioneDto.puntaje !== undefined) {
      calificacion.puntaje = updateCalificacioneDto.puntaje;
    }

    // El comentario es opcional: si no se envia o llega vacio, se borra
    // (null). Nunca se conserva el comentario anterior.
    calificacion.comentario = updateCalificacioneDto.comentario?.trim() || null;

    try {
      return await this.calificacionRepository.save(calificacion);
    } catch (error) {
      handleDBException(error);
    }
  }

  async remove(recetaId: string, usuarioId: string): Promise<MessageDto> {
    this.validarId(recetaId);

    // Se consulta la entidad completa (findOne devuelve el tipo de la
    // respuesta pública): remove() requiere la entidad de TypeORM.
    const calificacion = await this.calificacionRepository.findOneBy({
      recetaId,
      usuarioId,
    });

    if (!calificacion) {
      throw new NotFoundException(
        `No hay calificación para la receta con id ${recetaId}`,
      );
    }

    await this.calificacionRepository.remove(calificacion);

    return {
      message: `Calificación de la receta con id ${recetaId} eliminada`,
    };
  }
}
