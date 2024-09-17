import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdatePreguntasFrecuentesDto {
    @IsOptional()
    @IsNumber()
    Id_Pregunta?: number;

    @IsOptional()
    @IsString()
    Pregunta?: string;

    @IsOptional()
    @IsString()
    Respuesta?: string;
}
