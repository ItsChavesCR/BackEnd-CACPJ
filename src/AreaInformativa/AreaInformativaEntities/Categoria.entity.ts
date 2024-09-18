/* eslint-disable prettier/prettier */

import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AreaInformativa } from './AreaInformativa.entity';

@Entity('categorias')
export class Categoria {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ default: true })
  estado: boolean;

  // Relación con AreaInformativa (1 categoría puede tener varias áreas)
  @OneToMany(() => AreaInformativa, areaInformativa => areaInformativa.categoria)
  areaInformativa: AreaInformativa[];
}
