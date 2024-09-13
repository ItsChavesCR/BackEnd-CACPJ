import { IsNotEmpty, IsString } from 'class-validator';

export class CreateModalidadDto {
  @IsNotEmpty()
  @IsString()
  Nombre_Modalidad: string;
}
