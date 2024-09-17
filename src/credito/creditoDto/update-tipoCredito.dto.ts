import { IsOptional, IsString } from 'class-validator';

export class UpdateTipoCreditoDto {
    @IsOptional()
    @IsString()
    Nombre_TipoCredito?: string;
}
