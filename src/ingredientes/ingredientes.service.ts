import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { CreateIngredienteDto } from './dto/create-ingrediente.dto';
import { UpdateIngredienteDto } from './dto/update-ingrediente.dto';
import { Ingrediente } from './entities/ingrediente.entity';
import { handleDBException } from '../common/helpers/handleDbException';

@Injectable()
export class IngredientesService {
  constructor(
    @InjectRepository(Ingrediente)
    private readonly ingredienteRepository: Repository<Ingrediente>,
  ) {}

  async create(createIngredienteDto: CreateIngredienteDto): Promise<Ingrediente> {
    try {
      const ingrediente = this.ingredienteRepository.create(createIngredienteDto);
      return await this.ingredienteRepository.save(ingrediente);
    } catch (error) {
      handleDBException(error);
    }
  }

  async findAll(): Promise<Ingrediente[]> {
    return this.ingredienteRepository.find();
  }

  private validarId(id: string): void {
    if (!id || !isUUID(id)) {
      throw new NotFoundException(`id no válido: ${id}`);
    }
  }

  async findOne(id: string): Promise<Ingrediente> {
    this.validarId(id);

    const ingrediente = await this.ingredienteRepository.findOneBy({ id });

    if (!ingrediente) {
      throw new NotFoundException(`Ingrediente con id ${id} no encontrado`);
    }

    return ingrediente;
  }

  async update(
    id: string,
    updateIngredienteDto: UpdateIngredienteDto,
  ): Promise<Ingrediente> {
    this.validarId(id);

    const ingrediente = await this.ingredienteRepository.preload({
      id,
      ...updateIngredienteDto,
    });

    if (!ingrediente) {
      throw new NotFoundException(`Ingrediente con id ${id} no encontrado`);
    }

    try {
      return await this.ingredienteRepository.save(ingrediente);
    } catch (error) {
      handleDBException(error);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    this.validarId(id);
    const ingrediente = await this.findOne(id);
    await this.ingredienteRepository.remove(ingrediente);
    return { message: `Ingrediente con id ${id} eliminado` };
  }
}
