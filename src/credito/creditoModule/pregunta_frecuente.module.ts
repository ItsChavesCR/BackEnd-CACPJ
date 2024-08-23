import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreguntasFrecuentesService } from '../creditoServices/preguntas_frecuentes.service';
import { PreguntasFrecuentesController } from '../creditoController/pregunta_frecuente.controller';
import { PreguntasFrecuentes } from '../CreditoEntities/preguntas_frecuentes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PreguntasFrecuentes])],
  controllers: [PreguntasFrecuentesController],
  providers: [PreguntasFrecuentesService],
})
export class PreguntasFrecuentesModule {}