import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFuenteFondosDto {

  @IsNotEmpty()
  Nombre_FuenteFondos: string;

  @IsNumber()
  Monto_Minimo: number;

  @IsNumber()
  Monto_Maximo: number;

  @IsNumber()
  Plazo_Minimo: number;

  @IsNumber()
  Plazo_Maximo: number;

  @IsNumber()
  Tasa_Interes: number;

  @IsNotEmpty()
  tipoGarantiaId: number;
}
