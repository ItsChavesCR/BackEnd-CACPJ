import { IsNumber, IsString } from "class-validator";

export class CreateConsultasAiDto {
    @IsNumber()
    Id_Pregunta: number;
    
    @IsString()
    pregunta: string;
}