// archivo: creditoModule/credito.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditoService } from '../creditoServices/credito.service';
import { CreditoController } from '../creditoController/credito.controller';
import { TipoCredito } from '../CreditoEntities/tipo_credito.entity';
import { TipoGarantia } from '../CreditoEntities/tipo_garantia.entity';
import { FuenteFondos } from '../CreditoEntities/fuente_fondos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoCredito, TipoGarantia, FuenteFondos])],
  providers: [CreditoService],
  controllers: [CreditoController],
})
export class CreditoModule {}
