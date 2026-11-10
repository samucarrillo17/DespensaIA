import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Receta } from '../../recetas/entities/receta.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

/**
 * Una sola calificacion por receta: la restriccion unique sobre
 * (recetaId, usuarioId) lo garantiza a nivel de Base de Datos.
 */
@Entity('calificaciones')
@Unique(['recetaId', 'usuarioId'])
export class Calificacione {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  recetaId!: string;

  @ManyToOne(() => Receta, (receta) => receta.calificaciones, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'recetaId' })
  receta!: Receta;

  /** Quien califica. Se asigna desde el JWT, nunca desde el body. */
  @Column('uuid')
  usuarioId!: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.calificaciones, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'usuarioId' })
  usuario!: Usuario;

  /** Estrellas del 1 al 5. */
  @Column('int')
  puntaje!: number;

  @Column('text', { nullable: true })
  comentario!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
