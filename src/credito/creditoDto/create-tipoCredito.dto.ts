import { IsNotEmpty } from 'class-validator';

export class CreateTipoCreditoDto {
    @IsNotEmpty()
    Nombre_TipoCredito: string;
}
