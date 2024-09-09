import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePreRegistroPsaDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    apellido1: string;

    @IsString()
    @IsNotEmpty()
    apellido2: string;

    @IsString()
    @IsNotEmpty()
    cedula: string;

    @IsString()
    @IsNotEmpty()
    modalidadPSA: string;
}


import { PartialType } from '@nestjs/mapped-types';

export class UpdatePreRegistroPsaDto extends PartialType(CreatePreRegistroPsaDto) {}