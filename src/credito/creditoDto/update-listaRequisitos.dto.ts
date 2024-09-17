import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateListaRequisitosDto {
    @IsOptional()
    @IsString()
    Descripcion?: string;

    @IsOptional()
    @IsNumber()
    tipoCreditoId?: number;
}
