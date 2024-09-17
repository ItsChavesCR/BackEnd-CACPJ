import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoGarantiaService } from '../creditoServices/tipo_garantia.service';
import { TipoGarantiaController } from '../creditoController/tipo_garantia.controller';
import { TipoGarantia } from '../CreditoEntities/tipo_garantia.entity';
import { TipoCredito } from '../CreditoEntities/tipo_credito.entity'; // Asegúrate de la ruta correcta para TipoCredito

@Module({
  imports: [TypeOrmModule.forFeature([TipoGarantia, TipoCredito])],
  controllers: [TipoGarantiaController],
  providers: [TipoGarantiaService],
})
export class TipoGarantiaModule {}
