import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../../auth/loginEntities/login.entity';

@Entity('auditoria_accion')
@Index('IDX_auditoria_accion_usuario', ['idUsuario'])
@Index('IDX_auditoria_accion_fecha', ['fechaHora'])
@Index('IDX_auditoria_accion_modulo', ['modulo'])
@Index('IDX_auditoria_accion_accion', ['accion'])
export class AuditoriaAccion {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  idAuditoria: string;

  @Column({ type: 'int', nullable: true })
  idUsuario: number | null;

  @Column({ type: 'varchar', length: 255 })
  accion: string;

  @Column({ type: 'varchar', length: 255 })
  modulo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  entidad: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  idRegistro: string | null;

  @Column({ type: 'text', nullable: true })
  detalle: string | null;

  @Column({ type: 'varchar', length: 255 })
  resultado: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  direccionIp: string | null;

  @CreateDateColumn({
    type: 'datetime',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaHora: Date;

  // Conservar la auditoría aunque el usuario asociado sea eliminado.
  @ManyToOne(() => Usuario, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({
    name: 'idUsuario',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_auditoria_accion_usuario',
  })
  usuario: Usuario | null;
}
