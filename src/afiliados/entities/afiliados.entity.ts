/* eslint-disable prettier/prettier */

import { Entity, Column } from "typeorm";

@Entity()
export class Afiliado {

    @Column()
    Cedula: number
}
