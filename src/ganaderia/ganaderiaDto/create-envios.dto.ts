import { IsInt, IsDate, IsString, IsOptional, IsNumber, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEnviosDto {
  @IsInt()
  idGanadero: number;  // Referencia a un ganadero existente

  @IsNotEmpty({ message: 'La fecha de envío no puede estar vacía' })
  @IsDate()
  @Type(() => Date)
  fechaEnvio: Date;

  @IsNotEmpty({ message: 'La liquidación REA no puede estar vacía' })
  @IsNumber({}, { message: 'Liquidación REA debe ser un número' })
  @Type(() => Number)
  @Min(0, { message: 'Liquidación REA no puede ser negativa' })
  liquidacionREA: number;

  @IsNotEmpty({ message: 'El total de hembras no puede estar vacío' })
  @IsNumber({}, { message: 'Total hembras debe ser un número' })
  @Type(() => Number)
  @Min(0, { message: 'Total hembras no puede ser negativo' })
  totalHembras: number;

  @IsNotEmpty({ message: 'El total de machos no puede estar vacío' })
  @IsNumber({}, { message: 'Total machos debe ser un número' })
  @Type(() => Number)
  @Min(0, { message: 'Total machos no puede ser negativo' })
  totalMachos: number;

  @IsNotEmpty({ message: 'El peso en pie no puede estar vacío' })
  @IsNumber({}, { message: 'Peso en pie debe ser un número' })
  @Type(() => Number)
  @Min(0, { message: 'Peso en pie no puede ser negativo' })
  pesoEnPie: number;

  @IsNotEmpty({ message: 'El peso canal no puede estar vacío' })
  @IsNumber({}, { message: 'Peso canal debe ser un número' })
  @Type(() => Number)
  @Min(0, { message: 'Peso canal no puede ser negativo' })
  pesoCanal: number;

  @IsNotEmpty({ message: 'El monto total no puede estar vacío' })
  @IsNumber({}, { message: 'Monto total debe ser un número' })
  @Type(() => Number)
  @Min(0, { message: 'Monto total no puede ser negativo' })
  montoTotal: number;

  @IsNotEmpty({ message: 'El bono productor no puede estar vacío' })
  @IsNumber({}, { message: 'Bono productor debe ser un número' })
  @Type(() => Number)
  @Min(0, { message: 'Bono productor no puede ser negativo' })
  bonoProductor: number;

  @IsNotEmpty({ message: 'El reconocimiento no puede estar vacío' })
  @IsNumber({}, { message: 'Reconocimiento debe ser un número' })
  @Type(() => Number)
  @Min(0, { message: 'Reconocimiento no puede ser negativo' })
  reconocimiento: number;

  @IsOptional()
  @IsNumber({}, { message: 'Excedente debe ser un número' })
  @Type(() => Number)
  @Min(0, { message: 'Excedente no puede ser negativo' })
  excedente?: number;  // Campo opcional
}
