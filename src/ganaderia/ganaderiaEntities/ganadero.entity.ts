// src/ganadero/entities/ganadero.entity.ts

import { Entity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Afiliado } from 'src/afiliados/afiliadosEntities/afiliados.entity';

@Entity('ganadero')
export class Ganadero {
  @PrimaryColumn() // La PK es también la FK a Afiliado
  idGanadero: number;

  @OneToOne(() => Afiliado) // Relación 1:1 con Afiliado
  @JoinColumn({ name: 'idGanadero' }) // El campo FK es el mismo que el de la PK
  afiliado: Afiliado;
}