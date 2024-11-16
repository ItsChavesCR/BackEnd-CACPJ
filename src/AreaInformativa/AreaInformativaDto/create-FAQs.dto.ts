/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from "class-validator";

export class CreateFAQsDto {

    @IsString()
    @IsNotEmpty()
    Pregunta: string;

    @IsString()
    @IsNotEmpty()
    Respuesta: string;

}
