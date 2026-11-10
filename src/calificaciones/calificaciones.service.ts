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
  ): Promise<Calificacione> {
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
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Ya calificaste esta receta');
      }
      handleDBException(error);
    }
  }

  findAll() {
    return `This action returns all calificaciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} calificacione`;
  }

  update(id: number, updateCalificacioneDto: UpdateCalificacioneDto) {
    return `This action updates a #${id} calificacione`;
  }

  remove(id: number) {
    return `This action removes a #${id} calificacione`;
  }
}
