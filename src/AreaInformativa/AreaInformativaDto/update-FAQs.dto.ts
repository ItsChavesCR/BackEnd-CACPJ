/* eslint-disable prettier/prettier */
import { IsString } from "class-validator";

export class UpdateFAQsDto {

    @IsString()
    Pregunta: string;

    @IsString()
    Respuesta: string;
}