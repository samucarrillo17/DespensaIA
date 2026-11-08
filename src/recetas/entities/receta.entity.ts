import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EstadoDificultad } from '../interfaces/estado-dificultad.enum';
import { Usuario } from '../../usuarios/entities/usuario.entity';

export interface IngredienteReceta {
  ingrediente: string;
  cantidad: number;
  unidad: string;
}

@Entity('Recetas')
export class Receta {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  nombre!: string;

  @Column({ type: 'text' })
  descripcion!: string;

  @Column({ type: 'jsonb' })
  ingredientes!: IngredienteReceta[];

  @Column({ type: 'jsonb' })
  pasos!: string[];

  @Column({ type: 'int' })
  minutos!: number;

  @Column({
    type: 'enum',
    enum: EstadoDificultad,
    default: EstadoDificultad.facil,
  })
  dificultad!: EstadoDificultad;

  /** Dueño de la receta. Se asigna desde el JWT, nunca desde el body. */
  @Column('uuid')
  usuarioId!: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.recetas, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'usuarioId' })
  usuario!: Usuario;

  @CreateDateColumn()
  createdAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
