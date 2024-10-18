import { IsNotEmpty, IsString } from "class-validator";

export class CreateFAQsDto {

    @IsString()
    @IsNotEmpty()
    Pregunta: string;

    @IsString()
    @IsNotEmpty()
    respuesta: string;

}
