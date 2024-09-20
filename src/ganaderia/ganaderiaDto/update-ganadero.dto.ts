// // src/ganadero/dto/update-ganadero.dto.ts
// import { PartialType } from '@nestjs/mapped-types';
// import { CreateGanaderoDto } from './create-ganadero.dto';
// import { IsInt } from 'class-validator';

// export class UpdateGanaderoDto extends PartialType(CreateGanaderoDto) {
//   // Puedes agregar campos adicionales para actualizar si es necesario
//   @IsInt()
//   idGanadero?: number; // El campo es opcional en la actualización
// }