import { Entity, Column, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TipoCredito } from './tipo_credito.entity'; // Asegúrate de que la importación sea correcta
import { FuenteFondos } from './fuente_fondos.entity';

@Entity('tipo_garantia')
export class TipoGarantia {

  @PrimaryGeneratedColumn()
  Id_TipoGarantia: number;

  @Column()
  Nombre_TipoGarantia: string;

  // Relación con TipoCredito
  @ManyToOne(() => TipoCredito, (tipoCredito) => tipoCredito.garantias)
  @JoinColumn({ name: 'Id_TipoCredito' })  // Llave foránea que referencia a TipoCredito
  tipoCredito: TipoCredito;

  // Relación inversa con FuenteFondos
  @OneToMany(() => FuenteFondos, (fuenteFondos) => fuenteFondos.tipoGarantia)
  fuentesFondos: FuenteFondos[];  // Esto debe añadirse para que la relación funcione correctamente

}
