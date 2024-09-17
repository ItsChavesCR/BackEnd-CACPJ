import { IsOptional, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePreguntasFrecuentesDto {
    @IsNumber()
    @IsOptional()
    Id_Pregunta: number;

    @IsString()
    @IsNotEmpty()
    Pregunta: string;

    @IsString()
    @IsNotEmpty()
    Respuesta: string;
}
