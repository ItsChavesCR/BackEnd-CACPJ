// src/ganadero/ganadero.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ganadero } from '../ganaderiaEntities/ganadero.entity';
import { GanaderoController } from '../ganaderiaController/ganadero.controller';
import { GanaderoService } from '../ganaderiaServices/ganadero.service';


@Module({
  imports: [TypeOrmModule.forFeature([Ganadero])],  // Importa el repositorio
  controllers: [GanaderoController],
  providers: [GanaderoService],
})
export class GanaderoModule {}
