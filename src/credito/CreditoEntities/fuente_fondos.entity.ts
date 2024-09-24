import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { TipoGarantia } from './tipo_garantia.entity';

@Entity({ name: 'Fuente_Fondos' })
export class FuenteFondos {

  @PrimaryGeneratedColumn()
  Id_FuenteFondos: number;

  @Column()
  Nombre_FuenteFondos: string;

  @Column('decimal', { precision: 15, scale: 2 })
  Monto_Minimo: number;

  @Column('decimal', { precision: 15, scale: 2 })
  Monto_Maximo: number;

  @Column()
  Plazo_Minimo: number;

  @Column()
  Plazo_Maximo: number;

  @Column('decimal', { precision: 5, scale: 2 })
  Tasa_Interes: number;

  @ManyToOne(() => TipoGarantia, (tipoGarantia) => tipoGarantia.fuentesFondos)
  tipoGarantia: TipoGarantia;
}
