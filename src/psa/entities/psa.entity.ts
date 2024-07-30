/* eslint-disable prettier/prettier */

import { Entity, Column } from "typeorm";

@Entity()
export class Psa {

    @Column()
    Cedula: number
}
