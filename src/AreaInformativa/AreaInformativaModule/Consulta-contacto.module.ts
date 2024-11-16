/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultaContacto } from '../AreaInformativaEntities/consulta-contacto.entity';
import { ConsultaContactoService } from '../AreaInformativaServices/ConsultaContacto.service';
import { ConsultaContactoController } from '../AreaInformativaController/Consulta-contacto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ConsultaContacto])],
  controllers: [ConsultaContactoController],
  providers: [ConsultaContactoService], // Registra el servicio
  exports: [ConsultaContactoService],   // Exporta el servicio
})
export class ConsultaContactoModule {}
