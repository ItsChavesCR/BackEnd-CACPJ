// src/envios/dto/update-envios.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateEnviosDto } from './create-envios.dto';

export class UpdateEnviosDto extends PartialType(CreateEnviosDto) {
  // Hereda los campos de CreateEnviosDto pero todos serán opcionales
}
