/* eslint-disable prettier/prettier */

import { Entity, Column } from "typeorm";

@Entity()
export class Ganaderia {

    @Column()
    Cedula: number
}
