/* eslint-disable prettier/prettier */
import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";
export class UpdatePsaDto {
  @IsString()
  Nombre_Completo: string;

  @IsString()
  Cedula: string;

  @IsString()
  Telefono: string;

  @IsString()
  Correo: string;


  @IsNumber()
  Area_Efectiva: number;

  @IsString()
  Num_Solicitud: string;

  @IsDateString()
  Fecha_Final_Contrato: Date;

  @IsNumber()
  Año_Ingreso: number;

  @IsNumber()
  @IsNotEmpty()
  Area_Total: number;

  @IsString()
  Folio: string;

  @IsString()
  Plano: string;

  @IsString()
  Ubicacion: string;

  @IsInt({ message: 'El campo modalidadId debe ser un número entero' })
  @IsPositive({ message: 'El campo modalidadId debe ser un número positivo' })
  @Min(1, { message: 'El campo modalidadId debe ser mayor o igual a 1' })
  modalidadId?: number;
}
