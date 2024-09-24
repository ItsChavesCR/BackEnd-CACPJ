/* eslint-disable prettier/prettier */
import { IsInt, IsPositive, IsString, Min } from 'class-validator';

export class CreateInformativaDto {
  @IsString()
  titulo: string;

  @IsString()
  contenido: string;

  @IsString()
  multimedia?: string;

  @IsInt({ message: 'El campo categoriaId debe ser un número entero' }) // Verifica que sea un número entero
  @IsPositive({ message: 'El campo categoriaId debe ser un número positivo' }) // Verifica que sea positivo
  @Min(1, { message: 'El campo categoriaId debe ser mayor o igual a 1' }) // Asegura que sea mayor o igual a 1
  categoriaId: number;
}
