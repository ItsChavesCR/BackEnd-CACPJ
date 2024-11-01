// src/AreaInformativaDto/GanaderiaContactFormDto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GanaderiaContactFormDto {
  @IsNotEmpty()
  @IsString()
  nombre?: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email?: string;

  @IsNotEmpty()
  @IsString()
  telefono?: string;

  @IsNotEmpty()
  @IsString()
  asunto?: string;

  @IsNotEmpty()
  @IsString()
  mensaje?: string;
}