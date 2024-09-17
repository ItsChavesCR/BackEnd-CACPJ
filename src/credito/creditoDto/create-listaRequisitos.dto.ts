import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateListaRequisitosDto {
    @IsArray()
    @IsNotEmpty()
    Descripcion: string[];  // Es un array de strings

    @IsNumber()
    @IsNotEmpty()
    tipoCreditoId: number;
}
