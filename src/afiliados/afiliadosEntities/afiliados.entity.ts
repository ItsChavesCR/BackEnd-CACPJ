/* eslint-disable prettier/prettier */

import { IsNumberString, Length } from "class-validator";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('afiliados')
export class Afiliado {

    @PrimaryGeneratedColumn()
    afiliadoId : number

    @Column( { unique : true } )
    @IsNumberString({ no_symbols: true }, { message: 'La cédula debe contener solo números.' }) 
    @Length(9, 9, { message: 'La cédula debe tener exactamente 9 dígitos.' }) 
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
}
