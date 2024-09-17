import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateTipoCreditoDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    @IsString()
    Nombre_TipoCredito?: string;

    @IsOptional()
    @IsNumber()
    Monto_Minimo?: number;

    @IsOptional()
    @IsNumber()
    Monto_Maximo?: number;

    @IsOptional()
    @IsNumber()
    Tasa_Interes?: number;

    @IsOptional()
    @IsNumber()
    Plazo_Minimo?: number;

    @IsOptional()
    @IsNumber()
    Plazo_Maximo?: number;
}
