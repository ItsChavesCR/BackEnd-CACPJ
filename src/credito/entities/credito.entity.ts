/* eslint-disable prettier/prettier */
import { Entity, Column } from 'typeorm';

@Entity()
export class Credito {
    
  @Column()
  Cedula: number;
}
