import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({name: 'Consultas_AI'})

export class ConsultasAI {

    @PrimaryGeneratedColumn()
    Id_Pregunta: number;

    @Column('text')
    Pregunta: string;
}