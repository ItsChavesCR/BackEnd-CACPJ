import { DateValues } from 'date-fns';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'Agregar_Psa' })

export class Psa{
    @PrimaryGeneratedColumn()
    Id_Psa: number;

    @Column()
    Nombre_Completo: string;

    @Column()
    Cedula: string;

    @Column()
    Telefono: string;  

    @Column()
    Correo: string;  

    @Column()
    Area_Efectiva: string;  

    @Column()
    Num_Solicitud: string;  
     
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    Fecha_Final_Contrato: Date;  

    @Column()
    Area_Total: string;  

    @Column()
    Folio: string;  

    @Column()
    Plano: string; 
    
    @Column()
    Ubicacion: string;  

}
