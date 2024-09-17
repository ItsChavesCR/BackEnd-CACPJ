import { IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateFuenteFondosDto {

  @IsOptional()
  @IsNotEmpty()
  Nombre_FuenteFondos?: string;

  @IsOptional()
  @IsNumber()
  Monto_Minimo?: number;

  @IsOptional()
  @IsNumber()
  Monto_Maximo?: number;

  @IsOptional()
  @IsNumber()
  Plazo_Minimo?: number;

  @IsOptional()
  @IsNumber()
  Plazo_Maximo?: number;

  @IsOptional()
  @IsNumber()
  Tasa_Interes?: number;

  @IsOptional()
  @IsNotEmpty()
  tipoGarantiaId?: number;
}
