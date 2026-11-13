import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { CreateIngredienteDto } from './dto/create-ingrediente.dto';
import { UpdateIngredienteDto } from './dto/update-ingrediente.dto';
import { IngredienteResponseDto } from './dto/ingrediente-response.dto';
import { Ingrediente } from './entities/ingrediente.entity';
import { handleDBException } from '../common/helpers/handleDbException';

@Injectable()
export class IngredientesService {
  constructor(
    @InjectRepository(Ingrediente)
    private readonly ingredienteRepository: Repository<Ingrediente>,
  ) {}

  async create(
    createIngredienteDto: CreateIngredienteDto,
    usuarioId: string,
  ): Promise<IngredienteResponseDto> {
    try {
      // El dueño siempre viene del JWT, nunca del body.
      const ingrediente = this.ingredienteRepository.create({
        ...createIngredienteDto,
        usuarioId,
      });
      return await this.ingredienteRepository.save(ingrediente);
    } catch (error) {
      handleDBException(error);
    }
  }

  /** Solo devuelve los ingredientes del usuario autenticado. */
  async findAll(usuarioId: string): Promise<IngredienteResponseDto[]> {
    return this.ingredienteRepository.find({
      where: { usuarioId },
      order: { createdAt: 'DESC' },
    });
  }

  private validarId(id: string): void {
    if (!id || !isUUID(id)) {
      throw new NotFoundException(`id no válido: ${id}`);
    }
  }

  /**
   * Busca el ingrediente acotado al dueño: si el id existe pero pertenece a
   * otro usuario, responde 404 (no revela que el recurso existe).
   */
  async findOne(id: string, usuarioId: string): Promise<IngredienteResponseDto> {
    this.validarId(id);

    const ingrediente = await this.ingredienteRepository.findOneBy({
      id,
      usuarioId,
    });

    if (!ingrediente) {
      throw new NotFoundException(`Ingrediente con id ${id} no encontrado`);
    }

    return ingrediente;
  }

  async update(
    id: string,
    updateIngredienteDto: UpdateIngredienteDto,
    usuarioId: string,
  ): Promise<IngredienteResponseDto> {
    this.validarId(id);

    // Se busca acotado por usuario: preload({ id, ...dto }) NO comprobaría
    // el dueño y permitiría editar filas ajenas.
    const ingrediente = await this.findOne(id, usuarioId);

    Object.assign(ingrediente, updateIngredienteDto);

    try {
      return await this.ingredienteRepository.save(ingrediente);
    } catch (error) {
      handleDBException(error);
    }
  }

  async remove(id: string, usuarioId: string): Promise<{ message: string }> {
    this.validarId(id);

    // Se consulta la entidad completa (findOne devuelve el tipo de la
    // respuesta pública): remove() requiere la entidad de TypeORM.
    const ingrediente = await this.ingredienteRepository.findOneBy({
      id,
      usuarioId,
    });

    if (!ingrediente) {
      throw new NotFoundException(`Ingrediente con id ${id} no encontrado`);
    }

    await this.ingredienteRepository.remove(ingrediente);

    return { message: `Ingrediente con id ${id} eliminado` };
  }
}
