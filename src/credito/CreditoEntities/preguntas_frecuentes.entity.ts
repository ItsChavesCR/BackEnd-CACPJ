import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({name: 'Preguntas_Frecuentes'})

export class PreguntasFrecuentes {

    @PrimaryGeneratedColumn()
    Id_Pregunta: number;

    @Column('text')
    Pregunta: string;

    @Column('text')
    Respuesta: string;
}