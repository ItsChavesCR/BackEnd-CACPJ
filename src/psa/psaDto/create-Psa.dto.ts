/* eslint-disable prettier/prettier */
import {  IsDateString, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";


export class CreatePsaDto {
  @IsString()
  @IsNotEmpty()
  Nombre_Completo: string;

  @IsString()
  @IsNotEmpty()
  Cedula: string;

  @IsString()
  @IsNotEmpty()
  Telefono: string;

  @IsString()
  @IsNotEmpty()
  Correo: string;


  @IsNumber()
  @IsNotEmpty()
  Area_Efectiva: number;

  @IsString()
  @IsNotEmpty()
  Num_Solicitud: string;

  @IsDateString()
  @IsNotEmpty()
  Fecha_Final_Contrato: Date;

  @IsNumber()
  @IsNotEmpty()
  Año_Ingreso: number;

  @IsNumber()
  @IsNotEmpty()
  Area_Total: number;

  @IsString()
  @IsNotEmpty()
  Folio: string;

  @IsString()
  @IsNotEmpty()
  Plano: string;

  @IsString()
  @IsNotEmpty()
  Ubicacion: string;

  @IsInt({ message: 'El campo modalidadId debe ser un número entero' })
  @IsPositive({ message: 'El campo modalidadId debe ser un número positivo' })
  @Min(1, { message: 'El campo modalidadId debe ser mayor o igual a 1' })
  modalidadId: number;
}
