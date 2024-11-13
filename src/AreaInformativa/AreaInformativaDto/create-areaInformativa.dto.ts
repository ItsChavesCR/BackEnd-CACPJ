/* eslint-disable prettier/prettier */
import { IsInt, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreateInformativaDto {
  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  contenido?: string;

  @IsString()
  multimedia?: string;

  @IsInt({ message: 'El campo categoriaId debe ser un número entero' }) // Verifica que sea un número entero
  @IsPositive({ message: 'El campo categoriaId debe ser un número positivo' }) // Verifica que sea positivo
  @Min(1, { message: 'El campo categoriaId debe ser mayor o igual a 1' }) // Asegura que sea mayor o igual a 1
  categoriaId: number;
}
