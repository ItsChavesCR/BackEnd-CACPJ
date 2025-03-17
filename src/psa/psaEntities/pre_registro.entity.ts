/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Modalidad } from './modalidad.entity';

@Entity({name: 'Pre_RegistroPsa'})
export class PreRegistroPsa {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    apellido1: string;

    @Column()
    apellido2: string;

    @Column()
    cedula: string;

    @Column()
    Telefono: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fechaPreRegistro: Date;

    @ManyToOne(() => Modalidad, (modalidad) => modalidad.pre_registro)
    @JoinColumn({ name: 'Id_Modalidad' })  // Esto asegura que la columna sea 'Id_Modalidad'
    modalidad: Modalidad;

}
