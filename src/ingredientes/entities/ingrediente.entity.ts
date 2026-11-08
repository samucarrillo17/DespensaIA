import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UnidadIngredientes } from '../interfaces/unidad-ingredientes.enum';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('Ingredientes')
// El nombre es único POR usuario, no global: el usuario B puede crear "sal"
// aunque el usuario A ya la tenga. El trim/lowercase en los hooks evita
// duplicados por mayúsculas ("Sal" vs "sal").
@Unique('UQ_ingrediente_usuario_nombre', ['usuarioId', 'nombre'])
export class Ingrediente {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  nombre!: string;

  @Column({ type: 'int' })
  cantidad!: number;

  @Column({
    type: 'enum',
    enum: UnidadIngredientes,
    default: UnidadIngredientes.g,
  })
  unidad!: string;

  /** Dueño del ingrediente. Se asigna desde el JWT, nunca desde el body. */
  @Column('uuid')
  usuarioId!: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.ingredientes, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'usuarioId' })
  usuario!: Usuario;

  @CreateDateColumn()
  createdAt!: Date;

  @BeforeInsert()
  normalizarNombre() {
    if (this.nombre) {
      this.nombre = this.nombre.trim().toLowerCase();
    }
  }

  @BeforeUpdate()
  normalizarNombreUpdate() {
    if (this.nombre) {
      this.nombre = this.nombre.trim().toLowerCase();
    }
  }
}
