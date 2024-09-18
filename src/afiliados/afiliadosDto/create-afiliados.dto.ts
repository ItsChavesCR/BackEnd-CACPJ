/* eslint-disable prettier/prettier */
import { IsBoolean, IsEmail, IsIn, IsNotEmpty, IsNumber, IsString, Length, Min, Max } from "class-validator"

export class CreateAfiliadoDto {
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

    @IsString()
    @IsNotEmpty()
    actividadesAgricolas: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(10000000, { message: 'El número de teléfono debe tener al menos 8 dígitos' })
    telefono: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(1900, { message: 'El año de nacimiento debe ser mayor o igual a 1900' })
    @Max(new Date().getFullYear(), { message: 'El año de nacimiento no puede ser mayor al año actual' })
    annoNacimiento: number;

    @IsBoolean()
    @IsNotEmpty()
    comercializacion: boolean;
}
