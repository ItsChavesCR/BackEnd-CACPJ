/* eslint-disable prettier/prettier */
import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsString, Min, Matches } from "class-validator"

export class CreatePatchAfiliadoDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{9,10}$/, {
  message: 'La cédula debe tener 9 o 10 dígitos numéricos',
})
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
