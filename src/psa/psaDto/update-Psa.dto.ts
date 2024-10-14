import { IS_DATE, IsDate, isDateString, IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { isDate } from "date-fns";

export class UpdatePsaDto {
  @IsString()
  Nombre_Completo: string;

  @IsString()
  Cedula: string;

  @IsString()
  Telefono: string;

  @IsString()
  Correo: string;

  @IsString()
  Nombre_Modalidad: string;  // El nombre de la modalidad que se enviará para la validación

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
}
