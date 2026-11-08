import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';
import { Receta } from './entities/receta.entity';
import { handleDBException } from '../common/helpers/handleDbException';

@Injectable()
export class RecetasService {
  constructor(
    @InjectRepository(Receta)
    private readonly recetaRepository: Repository<Receta>,
  ) {}

  private validarId(id: string): void {
    if (!id || !isUUID(id)) {
      throw new NotFoundException(`id no válido: ${id}`);
    }
  }

  async create(
    createRecetaDto: CreateRecetaDto,
    usuarioId: string,
  ): Promise<Receta> {
    try {
      // El dueño siempre viene del JWT, nunca del body.
      const receta = this.recetaRepository.create({
        ...createRecetaDto,
        usuarioId,
      });
      return await this.recetaRepository.save(receta);
    } catch (error) {
      handleDBException(error);
    }
  }

  /** Solo devuelve las recetas del usuario autenticado. */
  async findAll(
    usuarioId: string,
    limit = 10,
    offset = 0,
  ): Promise<Receta[]> {
    return this.recetaRepository.find({
      where: { usuarioId },
      order: { createdAt: 'DESC' },
      skip: offset,
      take: Math.min(limit, 100),
    });
  }

  /**
   * Busca la receta acotada al dueño: si el id existe pero pertenece a
   * otro usuario, responde 404 (no revela que el recurso existe).
   */
  async findOne(id: string, usuarioId: string): Promise<Receta> {
    this.validarId(id);

    const receta = await this.recetaRepository.findOneBy({ id, usuarioId });

    if (!receta) {
      throw new NotFoundException(`Receta con id ${id} no encontrada`);
    }

    return receta;
  }

  /**
   * Actualización parcial. Si el cuerpo incluye `ingredientes`, el array
   * completo se reemplaza; si no viene, el array actual se conserva.
   */
  async update(
    id: string,
    updateRecetaDto: UpdateRecetaDto,
    usuarioId: string,
  ): Promise<Receta> {
    this.validarId(id);

    // Se busca acotado por usuario: preload({ id, ...dto }) NO comprobaría
    // el dueño y permitiría editar filas ajenas.
    const receta = await this.findOne(id, usuarioId);

    Object.assign(receta, updateRecetaDto);

    try {
      return await this.recetaRepository.save(receta);
    } catch (error) {
      handleDBException(error);
    }
  }

  /** Soft delete: marca deletedAt, la receta sigue en la BD. */
  async remove(id: string, usuarioId: string): Promise<{ message: string }> {
    this.validarId(id);

    const receta = await this.findOne(id, usuarioId);

    await this.recetaRepository.softRemove(receta);

    return { message: `Receta con id ${id} eliminada` };
  }
}
