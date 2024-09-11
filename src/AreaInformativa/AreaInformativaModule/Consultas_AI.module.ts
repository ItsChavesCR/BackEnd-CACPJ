import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultasAI } from '../AreaInformativaEntities/Consultas_AI.entity';
import { ConsultasAiController } from '../AreaInformativaController/Consultas_AI.controller';
import { ConsultasAiService } from '../AreaInformativaServices/Consultas_AI.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConsultasAI])],
  controllers: [ConsultasAiController],
  providers: [ConsultasAiService],
})

export class ConsultasModule {}