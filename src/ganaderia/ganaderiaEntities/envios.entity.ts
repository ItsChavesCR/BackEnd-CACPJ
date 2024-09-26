// src/envios/entities/envios.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Ganadero } from 'src/ganaderia/ganaderiaEntities/ganadero.entity';

@Entity('envios')
export class Envios {
  @PrimaryGeneratedColumn()
  idEnvio: number;

  @Column({ type: 'date' })
  fechaEnvio: Date;

  @Column({ type: 'varchar', length: 50 })
  liquidacionREA: string;

  @Column()
  totalHembras: number;

  @Column()
  totalMachos: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pesoEnPie: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pesoCanal: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  montoTotal: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  bonoProductor: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  reconocimiento: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  excedente: number;

  @ManyToOne(() => Ganadero, (ganadero) => ganadero.envios) // Relación N:1 con Ganadero
  @JoinColumn({ name: 'idGanadero' }) // Llave foránea hacia Ganadero
  ganadero: Ganadero;
}
