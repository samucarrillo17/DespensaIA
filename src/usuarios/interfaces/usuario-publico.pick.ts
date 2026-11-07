import { Usuario } from '../entities/usuario.entity';
export type UsuarioPublico = Pick<
  Usuario,
  'id' | 'correo' | 'nombre' | 'createdAt'
>;
