/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuarios')

export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  area: string;

  @Column()
  password: string;
}
