import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ListaRequisitos } from './lista_requisitos.entity';
import { TipoGarantia } from './tipo_garantia.entity';

@Entity({name: 'Tipo_Credito'})

export class TipoCredito {
  
  @PrimaryGeneratedColumn()
  Id_TipoCredito: number;

  @Column()
  Nombre_TipoCredito: string;

  @OneToMany(() => ListaRequisitos, (requisito) => requisito.tipoCredito)
  requisitos: ListaRequisitos[];

  // Nueva relación con TipoGarantia
 // @OneToMany(() => TipoGarantia, (garantia) => garantia.tipoCredito)
  // garantias: TipoGarantia[];

  @OneToMany(() => TipoGarantia, (tipoGarantia) => tipoGarantia.tipoCredito)
  garantias: TipoGarantia[];
}
