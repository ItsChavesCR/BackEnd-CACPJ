import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuarios') // Cambia 'usuarios' por el nombre de tu tabla
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  area: string;

  @Column()
  password: string;
}
