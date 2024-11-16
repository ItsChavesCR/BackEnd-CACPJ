/* eslint-disable prettier/prettier */
import { CreateDateColumn, PrimaryGeneratedColumn, Entity, Column } from "typeorm";

@Entity('consulta_contacto')
export class ConsultaContacto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 150 })
  email: string;

  @Column('text')
  mensaje: string;

  @CreateDateColumn()
  fechaEnvio: Date;
}
