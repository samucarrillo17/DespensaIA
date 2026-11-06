import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UnidadIngredientes } from '../interfaces/unidad-ingredientes.enum';
@Entity('Ingredientes')
export class Ingrediente {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  nombre!: string;

  @Column({ type: 'int' })
  cantidad!: number;

  @Column({
    type: 'enum',
    enum: UnidadIngredientes,
    default: UnidadIngredientes.g,
  })
  unidad!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
