import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Modalidad } from './modalidad.entity';
import { PagoPsa } from './pago_psa.entity';


@Entity({ name: 'Agregar_Psa' })
export class Psa {
  @PrimaryGeneratedColumn()
  Id_Psa: number;

  @Column()
  Nombre_Completo: string;

  @Column()
  Cedula: string;

  @Column()
  Telefono: string;

  @Column()
  Correo: string;

  @Column('decimal', { precision: 15, scale: 2 })
  Area_Efectiva: number;

  @Column()
  Num_Solicitud: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  Fecha_Final_Contrato: Date;

  @Column()
  Año_Ingreso: number;

  @Column('decimal', { precision: 15, scale: 2 })
  Area_Total: number;

  @Column()
  Folio: string;

  @Column()
  Plano: string;

  @Column()
  Ubicacion: string;

  @Column({ default: true })
  isActive: boolean;

  // Relación ManyToOne con Modalidad
  @ManyToOne(() => Modalidad, (modalidad) => modalidad.psa)
  @JoinColumn({ name: 'Id_Modalidad' })  // Esto asegura que la columna sea 'Id_Modalidad'
  modalidad: Modalidad;

  @OneToMany(() => PagoPsa, (pagoPsa) => pagoPsa.psa)
  pagos: PagoPsa[];  // Relación con pagos
}
