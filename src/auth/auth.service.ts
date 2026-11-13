// ! Lo que esta comentado depende de la creacion del modulo User

import { BadRequestException, Injectable } from '@nestjs/common';
import { registerUserDto } from './dto/register-user.dto';
// import { UserService } from 'src/user/user.service';
import { JwtPayload } from './interfaces/jwt.interface';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: registerUserDto): Promise<AuthResponseDto> {
    const nuevoUsuario = await this.usuarioService.create(registerDto);
    const { id, correo } = nuevoUsuario;
    const token = this.getJwtToken({ id, correo });
    // Se construye campo por campo (no spread) para que TypeScript
    // garantice que contrasena nunca se escape en la respuesta.
    return {
      id: nuevoUsuario.id,
      correo: nuevoUsuario.correo,
      nombre: nuevoUsuario.nombre,
      createdAt: nuevoUsuario.createdAt,
      token,
    };
  }

  async login(loginDto: LoginUserDto): Promise<AuthResponseDto> {
    const { correo, contrasena } = loginDto;
    const usuario = await this.usuarioService.findByEmail(correo);
    if (!usuario || !bcrypt.compareSync(contrasena, usuario.contrasena)) {
      throw new BadRequestException('Usuario o contraseña incorrectos');
    }
    const token = this.getJwtToken({
      id: usuario.id,
      correo: usuario.correo,
    });
    // Idem: cada campo explícito, contrasena fuera de la respuesta.
    return {
      id: usuario.id,
      correo: usuario.correo,
      nombre: usuario.nombre,
      createdAt: usuario.createdAt,
      token,
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
