import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ListaRequisitos } from './lista_requisitos.entity';
import { TipoGarantia } from './tipo_garantia.entity';

@Entity({name: 'Tipo_Credito'})

export class TipoCredito {
  
  @PrimaryGeneratedColumn()
  Id_TipoCredito: number;

  @Column()
  Nombre_TipoCredito: string;

  @Column('decimal', { precision: 15, scale: 2 })
  Monto_Minimo: number;

  @Column('decimal', { precision: 15, scale: 2 })
  Monto_Maximo: number;

  @Column('decimal', { precision: 5, scale: 2 })
  Tasa_Interes: number;

  @Column()
  Plazo_Minimo: number;

  @Column()
  Plazo_Maximo: number;

  @OneToMany(() => ListaRequisitos, (requisito) => requisito.tipoCredito)
  requisitos: ListaRequisitos[];

  // Nueva relación con TipoGarantia
  @OneToMany(() => TipoGarantia, (garantia) => garantia.tipoCredito)
  garantias: TipoGarantia[];
}
