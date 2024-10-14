import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Ganadero } from 'src/ganaderia/ganaderiaEntities/ganadero.entity';

@Entity('envios')
export class Envios {
  @PrimaryGeneratedColumn()
  idEnvio: number;

  @Column({ type: 'date' })
  fechaEnvio: Date;

  // Modificamos el campo para que sea de tipo number
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  liquidacionREA: number;

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

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  total: number;  // Campo para almacenar el total

  
  @BeforeInsert()
  @BeforeUpdate()
  calcularTotal() {
    this.total =
      (this.montoTotal || 0) +
      (this.bonoProductor || 0) +
      (this.reconocimiento || 0) +
      (this.excedente || 0);
  }

  @ManyToOne(() => Ganadero, (ganadero) => ganadero.envios) // Relación N:1 con Ganadero
  @JoinColumn({ name: 'idGanadero' }) // Llave foránea hacia Ganadero
  ganadero: Ganadero;
}
