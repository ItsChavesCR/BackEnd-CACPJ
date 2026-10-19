import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditoriaController } from '../auditoriaController/auditoria.controller';
import { AuditoriaAccion } from '../auditoriaEntities/auditoria-accion.entity';
import { AuditoriaService } from '../auditoriaServices/auditoria.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuditoriaAccion])],
  controllers: [AuditoriaController],
  providers: [AuditoriaService],
  exports: [TypeOrmModule, AuditoriaService],
})
export class AuditoriaModule {}
