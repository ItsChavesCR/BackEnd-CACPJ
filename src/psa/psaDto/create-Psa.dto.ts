export class CreatePsaDto {
  Nombre_Completo: string;
  Cedula: string;
  Telefono: string;
  Correo: string;
  Nombre_Modalidad: string;  // El nombre de la modalidad que se enviará para la validación
  Area_Efectiva: number;
  Num_Solicitud: string;
  Fecha_Final_Contrato: Date;
  Año_Ingreso: number;
  Area_Total: number;
  Folio: string;
  Plano: string;
  Ubicacion: string;
}
