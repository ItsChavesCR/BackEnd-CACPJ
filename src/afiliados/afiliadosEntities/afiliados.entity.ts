/* eslint-disable prettier/prettier */

import { IsNumberString, Matches } from "class-validator";
import { Ganadero } from "src/ganaderia/ganaderiaEntities/ganadero.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from "typeorm";

@Entity('afiliados')
export class Afiliado {

    @PrimaryGeneratedColumn()
    afiliadoId : number

    @Column( { unique : true } )
    @IsNumberString({ no_symbols: true }, { message: 'La cédula debe contener solo números.' }) 
    @Matches(/^\d{9,10}$/, {
  message: 'La cédula debe tener 9 o 10 dígitos numéricos.',
})

    cedula: string

    @Column()
    nombreCompleto : string

    @Column()
    direccion : string 

    @Column()
    correo : string

    @Column()
    genero : string

    @Column({ default: false })
    comercializacion: boolean;

    @Column()
    actividadesAgricolas : string

    @Column()
    telefono : number

    @Column()
    annoNacimiento : number

    @Column({ default: true })  // Asegúrate de que este campo esté definido
    isActive: boolean;

    // Relación 1:1 con Ganadero
  @OneToOne(() => Ganadero, (ganadero) => ganadero.afiliado)
  ganadero: Ganadero;
}
