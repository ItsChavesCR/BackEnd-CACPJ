// src/ganadero/dto/create-ganadero.dto.ts
import { IsInt } from 'class-validator';

export class CreateGanaderoDto {
  @IsInt()
  idGanadero: number; // Este campo debe coincidir con un afiliado existente
}