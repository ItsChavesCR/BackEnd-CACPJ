import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditoriaModule } from '../../auditoria/auditoriaModule/auditoria.module';
import { KriController } from '../kriController/kri.controller';
import { IndicadorKri } from '../kriEntities/indicador-kri.entity';
import { ResultadoKri } from '../kriEntities/resultado-kri.entity';
import { KriService } from '../kriServices/kri.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([IndicadorKri, ResultadoKri]),
    AuditoriaModule,
  ],
  controllers: [KriController],
  providers: [KriService],
  exports: [TypeOrmModule],
})
export class KriModule {}
