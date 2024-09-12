import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
    modalidadPSA: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fechaPreRegistro: Date;
}
