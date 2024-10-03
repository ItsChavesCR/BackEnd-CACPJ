import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Psa } from './Psa.entity';

@Entity({ name: 'pagos_psa' })
export class PagoPsa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Numero_Pago: number;  // El número de pago secuencial por cada PSA

  @Column()
  Fecha_Pago: Date;

  @ManyToOne(() => Psa, (psa) => psa.pagos)
  psa: Psa;
}
