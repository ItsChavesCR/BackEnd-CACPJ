import { IsOptional, IsArray, IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateListaRequisitosDto {
    @IsOptional()
    @IsArray()  // Mantener como array para consistencia
    @IsString({ each: true })  // Valida que cada elemento en el array sea un string
    Descripcion?: string[];

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))  // Asegura que el valor se convierta a número
    tipoCreditoId?: number;
}
