import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { TipoCredito } from './tipo_credito.entity';

@Entity({name: 'Lista_Requisitos'})


export class ListaRequisitos {
  @PrimaryGeneratedColumn()
  Id_Requisito: number;

  @Column()
  Descripcion: string;

  @ManyToOne(() => TipoCredito, (tipoCredito) => tipoCredito.requisitos)
  tipoCredito: TipoCredito;
}
