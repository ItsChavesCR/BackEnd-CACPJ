// src/envios/dto/create-envios.dto.ts
import { IsInt, IsDate, IsString, IsDecimal, IsBoolean, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEnviosDto {
  @IsInt()
  idGanadero: number;  // Referencia a un ganadero existente

  @IsDate()
  @Type(() => Date)
  fechaEnvio: Date;

  @IsString()
  liquidacionREA: number;

  @IsNumber()
  @Type(() => Number)
  totalHembras: number;

  @IsNumber()
  @Type(() => Number)
  totalMachos: number;

  @IsNumber()
  @Type(() => Number)
  pesoEnPie: number;

  @IsNumber()
  @Type(() => Number)
  pesoCanal: number;

  @IsNumber()
  @Type(() => Number)
  montoTotal: number;

  @IsNumber()
  @Type(() => Number)
  bonoProductor: number;

  @IsNumber()
  @Type(() => Number)
  reconocimiento: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  excedente?: number;  // Campo opcional
  
}
