// src/ganaderia/ganaderiaModule/GanaderiaConsultasModule.ts
import { Module } from '@nestjs/common';
import { GanaderiaContactController } from '../AreaInformativaController/GanaderiaContact.controller';
import { UploadService } from '../../pre-registro/pre-registro.service';

@Module({
  controllers: [GanaderiaContactController],
  providers: [UploadService],
})
export class GanaderiaConsultasModule {}
