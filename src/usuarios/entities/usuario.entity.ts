import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Ingrediente } from '../../ingredientes/entities/ingrediente.entity';
import { Receta } from '../../recetas/entities/receta.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text', { unique: true })
  correo!: string;

  @Column('text', { select: false })
  contrasena!: string;

  @Column('text')
  nombre!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Ingrediente, (ingrediente) => ingrediente.usuario)
  ingredientes!: Relation<Ingrediente[]>;

  @OneToMany(() => Receta, (receta) => receta.usuario)
  recetas!: Relation<Receta[]>;

  @BeforeInsert()
  LOWERCASE_EMAIL() {
    if (this.correo) {
      this.correo = this.correo.trim().toLowerCase();
    }
  }

  @BeforeUpdate()
  LOWERCASE_EMAIL_UPDATE() {
    if (this.correo) {
      this.correo = this.correo.trim().toLowerCase();
    }
  }
}
