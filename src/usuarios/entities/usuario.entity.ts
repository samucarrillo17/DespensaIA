import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';



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
