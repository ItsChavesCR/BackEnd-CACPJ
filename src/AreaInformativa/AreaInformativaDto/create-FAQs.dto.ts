import { IsNotEmpty, IsString } from "class-validator";

export class CreateFAQsDto {
    @IsString()
    @IsNotEmpty()
    pregunta: string;

    @IsString()
    @IsNotEmpty()
    respuesta: string;
}
