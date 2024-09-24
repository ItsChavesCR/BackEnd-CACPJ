import { IS_DATE, IsDate, isDateString, IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { isDate } from "date-fns";

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

  @IsString()
  @IsNotEmpty()
  Nombre_Modalidad: string;  // El nombre de la modalidad que se enviará para la validación

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
}
