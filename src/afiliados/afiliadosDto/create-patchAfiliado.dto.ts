/* eslint-disable prettier/prettier */
import { IsBoolean, IsEmail, IsIn, IsNotEmpty, IsNumber, IsString, Length, Min, Max } from "class-validator"

export class CreatePatchAfiliadoDto {
    @IsString()
    @IsNotEmpty()
    @Length(9, 9, { message: 'La cédula debe tener exactamente 9 dígitos' })
    cedula: string;

    @IsString()
    @IsNotEmpty()
    nombreCompleto: string;
    
    @IsString()
    @IsNotEmpty()
    direccion: string;

    @IsEmail({}, { message: 'El correo electrónico no tiene un formato válido' })
    @IsNotEmpty()
    correo: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(['M', 'F'], { message: 'El género debe ser "M" (Masculino) o "F" (Femenino)' })
    genero: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(10000000, { message: 'El número de teléfono debe tener al menos 8 dígitos' })
    telefono: number;


}
