import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateTipoCreditoDto {
    @IsNotEmpty()
    Nombre_TipoCredito: string;

    @IsNumber()
    Monto_Minimo: number;

    @IsNumber()
    Monto_Maximo: number;

    @IsOptional()
    @IsNumber()
    Tasa_Interes?: number;

    @IsNumber()
    Plazo_Minimo: number;

    @IsNumber()
    Plazo_Maximo: number;
}
