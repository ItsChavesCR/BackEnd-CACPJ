import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ResultadoKri } from './resultado-kri.entity';

@Entity('indicador_kri')
@Unique('UQ_indicador_kri_nombre', ['nombre'])
export class IndicadorKri {
  @PrimaryGeneratedColumn()
  idIndicador: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 255 })
  areaRiesgo: string;

  @Column({ type: 'varchar', length: 255 })
  ambito: string;

  @Column({ type: 'varchar', length: 255 })
  unidadMedida: string;

  // MySQL devuelve DECIMAL como string para conservar su precisión.
  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  limite: string | null;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  alerta: string | null;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  aceptable: string | null;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  optimo: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  direccionRiesgo: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tolerancia: string | null;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => ResultadoKri, (resultado) => resultado.indicador)
  resultados: ResultadoKri[];
}
