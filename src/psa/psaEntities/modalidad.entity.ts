import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Psa } from './Psa.entity';
import { PreRegistroPsa } from './pre_registro.entity';

@Entity({ name: 'Modalidad' })
export class Modalidad {
  @PrimaryGeneratedColumn()
  Id_Modalidad: number;

  @Column()
  Nombre_Modalidad: string;

  @OneToMany(() => Psa, (psa) => psa.modalidad)
  psa: Psa[];

  @OneToMany(() => PreRegistroPsa, (pre_registro) => pre_registro.modalidad)
  pre_registro: PreRegistroPsa[];
}
