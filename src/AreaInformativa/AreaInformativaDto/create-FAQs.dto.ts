import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateFAQsDto {
    @IsNumber()
    Id_Pregunta: number;
    
    @IsString()
    @IsNotEmpty()
    pregunta: string;

    @IsString()
    @IsNotEmpty()
    respuesta: string;
}