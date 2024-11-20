// src/ganadero/entities/ganadero.entity.ts

import { Entity, PrimaryColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Afiliado } from 'src/afiliados/afiliadosEntities/afiliados.entity';
import { Envios } from 'src/ganaderia/ganaderiaEntities/envios.entity';

@Entity('ganadero')
export class Ganadero {
  @PrimaryColumn() // La PK es también la FK a Afiliado
  idGanadero: number;

  @OneToOne(() => Afiliado, (afiliado) => afiliado.ganadero, { onDelete: 'CASCADE' }) // Relación con Afiliado
  @JoinColumn({ name: 'idGanadero' }) // FK está en la misma columna que PK
  afiliado: Afiliado;

  @OneToMany(() => Envios, (envios) => envios.ganadero) // Relación 1:N con Envios
  envios: Envios[];  // Un ganadero puede tener múltiples envíos
}