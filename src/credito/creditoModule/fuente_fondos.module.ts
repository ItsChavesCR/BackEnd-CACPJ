import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuenteFondosService } from '../creditoServices/fuente_fondos.service';
import { FuenteFondosController } from '../creditoController/fuente_fondos.controller';
import { FuenteFondos } from '../CreditoEntities/fuente_fondos.entity';
import { TipoGarantia } from '../CreditoEntities/tipo_garantia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FuenteFondos, TipoGarantia])],
  controllers: [FuenteFondosController],
  providers: [FuenteFondosService],
})
export class FuenteFondosModule {}
