// src/ganadero/ganadero.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ganadero } from '../ganaderiaEntities/ganadero.entity';
import { GanaderoController } from '../ganaderiaController/ganadero.controller';
import { GanaderoService } from '../ganaderiaServices/ganadero.service';
import { EnviosModule } from './envios.module';



@Module({
  imports: [
    TypeOrmModule.forFeature([Ganadero]),
    forwardRef(() => EnviosModule),  // Uso de forwardRef para evitar la importación circular
  ],
  controllers: [GanaderoController],
  providers: [GanaderoService],
  exports: [TypeOrmModule],
})
export class GanaderoModule {}
