// src/envios/envios.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnviosController } from '../ganaderiaController/envios.controller';
import { EnviosService } from '../ganaderiaServices/envios.service';
import { Envios } from '../ganaderiaEntities/envios.entity';
import { GanaderoModule } from './ganadero.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Envios]), 
    forwardRef(() => GanaderoModule),  // Uso de forwardRef para evitar la importación circular
  ],
  controllers: [EnviosController],
  providers: [EnviosService],
})
export class EnviosModule {}
