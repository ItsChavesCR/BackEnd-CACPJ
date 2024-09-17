import { IsNotEmpty, IsNumber} from 'class-validator';
export class CreateTipoGarantiaDto {
     
     @IsNotEmpty()
     Nombre_TipoGarantia: string;

     @IsNumber({}, { message: 'El campo Id_TipoCredito debe ser un número' })
     @IsNotEmpty({ message: 'El campo Id_TipoCredito no puede estar vacío' })
     Id_TipoCredito: number; // Llave foránea
  }