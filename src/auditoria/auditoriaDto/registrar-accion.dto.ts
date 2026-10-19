import {
  IsEnum,
  IsInt,
  IsIP,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
  MaxLength,
} from 'class-validator';

// Solo mensajes controlados por el servidor, nunca texto libre de una petición.
export enum DetalleAuditoria {
  CONSULTA_INDICADORES_KRI = 'Consulta de indicadores KRI activos',
  CONSULTA_RESULTADOS_KRI = 'Consulta de resultados KRI almacenados',
}

export class RegistrarAccionDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(2147483647)
  idUsuario?: number | null;

  @IsString()
  @Matches(/^[A-Z][A-Z0-9_]*$/)
  @MaxLength(255)
  accion: string;

  @IsString()
  @Matches(/^[A-Z][A-Z0-9_]*$/)
  @MaxLength(255)
  modulo: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z][A-Za-z0-9_]*$/)
  @MaxLength(255)
  entidad?: string | null;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z0-9_-]+$/)
  @MaxLength(255)
  idRegistro?: string | null;

  @IsOptional()
  @IsEnum(DetalleAuditoria)
  detalle?: DetalleAuditoria | null;

  @IsString()
  @Matches(/^[A-Z][A-Z0-9_]*$/)
  @MaxLength(255)
  resultado: string;

  @IsOptional()
  @IsIP()
  @MaxLength(45)
  direccionIp?: string | null;
}
