/* eslint-disable prettier/prettier */

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Categoria } from './Categoria.entity';

@Entity('informativa')
export class AreaInformativa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  contenido: string;

  @Column()
  multimedia: string;

  // Relación con Categoria, nullable si no siempre tiene una categoría
  @ManyToOne(() => Categoria, categoria => categoria.areaInformativa, { nullable: true })
  @JoinColumn({ name: 'categoriaId' })  // Este es el campo clave foránea
  categoria: Categoria;
}
