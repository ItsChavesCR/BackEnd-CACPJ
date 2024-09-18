/* eslint-disable prettier/prettier */

import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateCategoriaDto {

    @IsString()
    nombre: string;

    @IsBoolean()
    @IsOptional()
    estado?: boolean; 
  }
  