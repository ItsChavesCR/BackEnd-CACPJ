import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuenteFondosService } from '../creditoServices/fuente_fondos.service';
import { FuenteFondosController } from '../creditoController/fuente_fondos.controller';
import { FuenteFondos } from '../CreditoEntities/fuente_fondos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FuenteFondos])],
  controllers: [FuenteFondosController],
  providers: [FuenteFondosService],
})
export class FuenteFondosModule {}
