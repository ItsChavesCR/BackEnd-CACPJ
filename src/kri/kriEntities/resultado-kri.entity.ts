import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { IndicadorKri } from './indicador-kri.entity';

@Entity('resultado_kri')
@Unique('UQ_resultado_kri_indicador_periodo', ['idIndicador', 'periodo'])
@Index('IDX_resultado_kri_indicador', ['idIndicador'])
@Index('IDX_resultado_kri_periodo', ['periodo'])
@Index('IDX_resultado_kri_clasificacion', ['clasificacion'])
export class ResultadoKri {
  // BIGINT puede superar el rango de enteros seguros de JavaScript.
  @PrimaryGeneratedColumn({ type: 'bigint' })
  idResultado: string;

  @Column({ type: 'int' })
  idIndicador: number;

  @Column({ type: 'varchar', length: 255 })
  periodo: string;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  valor: string;

  @Column({ type: 'varchar', length: 255 })
  clasificacion: string;

  @CreateDateColumn({
    type: 'datetime',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaCalculo: Date;

  @ManyToOne(() => IndicadorKri, (indicador) => indicador.resultados, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({
    name: 'idIndicador',
    referencedColumnName: 'idIndicador',
    foreignKeyConstraintName: 'FK_resultado_kri_indicador',
  })
  indicador: IndicadorKri;
}
