/* eslint-disable prettier/prettier */

import { IsOptional, IsString, IsEmail, IsNumber, IsBoolean, Length, Min, Max } from 'class-validator';

export class UpdateAfiliadoDto {
  @IsOptional()
  @IsString()
  @Length(9, 9, { message: 'La cédula debe tener exactamente 9 dígitos.' })
  cedula: string; // Cambiado de número a string para manejar cédulas con ceros iniciales

  @IsOptional()
  @IsString()
  @Length(1, 100, { message: 'El nombre completo debe tener entre 1 y 100 caracteres.' })
  nombreCompleto: string;

  @IsOptional()
  @IsString()
  @Length(1, 255, { message: 'La dirección debe tener entre 1 y 255 caracteres.' })
  direccion: string;

  @IsOptional()
  @IsEmail({}, { message: 'El correo debe ser una dirección de correo válida.' })
  correo: string;

  @IsOptional()
  @IsString()
  @Length(1, 1, { message: 'El género debe ser "M" o "F".' })
  genero: string;

  @IsOptional()
  @IsString()
  @Length(1, 255, { message: 'Las actividades agrícolas deben tener entre 1 y 255 caracteres.' })
  actividadesAgricolas: string;

  @IsOptional()
  @IsNumber({}, { message: 'El teléfono debe ser un número.' })
  @Min(10000000, { message: 'El teléfono debe tener al menos 8 dígitos.' })
  telefono: number;

  @IsOptional()
  @IsNumber({}, { message: 'El año de nacimiento debe ser un número.' })
  @Min(1900, { message: 'El año de nacimiento debe ser mayor o igual a 1900.' })
  @Max(new Date().getFullYear(), { message: 'El año de nacimiento no puede ser mayor al año actual.' })
  annoNacimiento: number;

  @IsOptional()
  @IsBoolean({ message: 'Comercialización debe ser un valor booleano.' })
  comercializacion: boolean;
}
