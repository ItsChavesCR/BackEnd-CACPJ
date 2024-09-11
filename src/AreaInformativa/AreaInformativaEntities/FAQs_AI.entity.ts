import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({name: 'FAQs_AI'})

export class FAQsAi {

    @PrimaryGeneratedColumn()
    Id_Pregunta: number;

    @Column('text')
    Pregunta: string;

    @Column('text')
    Respuesta: string;
}