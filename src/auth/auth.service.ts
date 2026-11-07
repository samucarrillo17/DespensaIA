// ! Lo que esta comentado depende de la creacion del modulo User

import { BadRequestException, Injectable } from '@nestjs/common';
import { registerUserDto } from './dto/register-user.dto';
// import { UserService } from 'src/user/user.service';
import { JwtPayload } from './interfaces/jwt.interface';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: registerUserDto) {
    const nuevoUsuario = await this.usuarioService.create(registerDto);
    const { id, correo} = nuevoUsuario;
    const token = this.getJwtToken({ id, correo});
    return {
      ...nuevoUsuario,
      token,
    };
  }

  async login(loginDto: LoginUserDto) {
    const { correo, contrasena } = loginDto;
    const usuario = await this.usuarioService.findByEmail(correo);
    if (!usuario || !bcrypt.compareSync(contrasena, usuario.contrasena)) {
      throw new BadRequestException('Usuario o contraseña incorrectos');
    }
    const { contrasena: _, ...rest } = usuario;
    const token = this.getJwtToken({
      id: usuario.id,
      correo: usuario.correo,
    });
    return {
      ...rest,
      token,
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
