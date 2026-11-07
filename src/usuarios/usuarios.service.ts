import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { handleDBException } from '../common/helpers/handleDbException';
import * as bcrypt from 'bcrypt';
import { UsuarioPublico } from './interfaces/usuario-publico.pick';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) {}
  
  async create(createUsuarioDto: CreateUsuarioDto): Promise<UsuarioPublico> {
    try {
      const usuario = this.usuariosRepository.create({
        ...createUsuarioDto,
        contrasena: await bcrypt.hash(createUsuarioDto.contrasena, 10),
      });

      return this.omitirPassword(await this.usuariosRepository.save(usuario));
    } catch (error) {
      handleDBException(error);
    }
  }

 
  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<UsuarioPublico> {
    const datosActualizados = { ...updateUsuarioDto };

    if (datosActualizados.contrasena) {
      datosActualizados.contrasena = await bcrypt.hash(
        datosActualizados.contrasena,
        10,
      );
    }

    const usuario = await this.usuariosRepository.preload({
      id,
      ...datosActualizados,
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    try {
      return this.omitirPassword(await this.usuariosRepository.save(usuario));
    } catch (error) {
      handleDBException(error);
    }
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuariosRepository.findOne({
      where: { correo: email.trim().toLowerCase() },
      select: {
        id: true,
        correo: true,
        contrasena: true,
        nombre: true,
        createdAt: true,
      },
    });
  }

  private omitirPassword(usuario: Usuario): UsuarioPublico {
    return {
      id: usuario.id,
      correo: usuario.correo,
      nombre: usuario.nombre,
      createdAt: usuario.createdAt,
    };
  }
}

