/* eslint-disable prettier/prettier */
import { IsString } from 'class-validator';

export class CreateInformativaDto {
  @IsString() 
  titulo: string;

  @IsString()  
  contenido: string;

  @IsString()  
  multimedia?: string;
}
