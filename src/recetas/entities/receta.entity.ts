import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EstadoDificultad } from '../interfaces/estado-dificultad.enum';

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

  @CreateDateColumn()
  createdAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
