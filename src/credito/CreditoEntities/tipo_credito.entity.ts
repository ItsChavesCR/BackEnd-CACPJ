import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ListaRequisitos } from './lista_requisitos.entity';

@Entity({name: 'Tipo_Credito'})

export class TipoCredito {
  
  @PrimaryGeneratedColumn()
  Id_TipoCredito: number;

  @Column()
  Nombre_TipoCredito: string;

  @Column('decimal', { precision: 10, scale: 4 })
  Monto_Minimo: number;

  @Column('decimal', { precision: 10, scale: 4 })
  Monto_Maximo: number;

  @Column('decimal', { precision: 5, scale: 4 })
  Tasa_Interes: number;

  @Column()
  Plazo_Minimo: number;

  @Column()
  Plazo_Maximo: number;

  @OneToMany(() => ListaRequisitos, (requisito) => requisito.tipoCredito)
  requisitos: ListaRequisitos[];
}
