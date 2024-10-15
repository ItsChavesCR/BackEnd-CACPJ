import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({name: 'FAQs_AI'})

export class FAQsAi {

    @PrimaryGeneratedColumn()
    Id_Pregunta: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    Pregunta: string;

   @Column({ type: 'varchar', length: 255, nullable: false })
    Respuesta: string;
}