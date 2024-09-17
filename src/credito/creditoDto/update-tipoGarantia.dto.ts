
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateTipoGarantiaDto {
   @IsOptional()
   @IsNotEmpty()
   Nombre_TipoGarantia?: string;

   @IsOptional()
   @IsNumber({}, { message: 'El campo Id_TipoCredito debe ser un número' })
   Id_TipoCredito?: number; // Llave foránea opcional
  }