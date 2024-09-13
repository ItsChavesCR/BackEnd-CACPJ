import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Psa } from './Psa.entity';

@Entity({ name: 'Modalidad' })
export class Modalidad {
  @PrimaryGeneratedColumn()
  Id_Modalidad: number;

  @Column()
  Nombre_Modalidad: string;

  @OneToMany(() => Psa, (psa) => psa.modalidad)
  psa: Psa[];
}
