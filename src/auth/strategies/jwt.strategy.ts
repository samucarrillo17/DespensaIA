
// ! Lo que esta comentado depende de la creacion del modulo User


import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtPayload } from '../interfaces/jwt.interface';
import { Usuario } from '../../usuarios/entities/usuario.entity';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET')!,
    });
  }

  async validate(payload: any | JwtPayload) {
    const { id } = payload;
    const user = await this.usuarioRepository.findOne({
      where: { id },
      select: {
        id: true,
        nombre: true,
        correo: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Token no valido');
    }


    return user;
  }
}
