import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoCreditoService } from '../creditoServices/tipo_credito.service';
import { TipoCreditoController } from '../creditoController/tipo_credito.controller';
import { TipoCredito } from '../CreditoEntities/tipo_credito.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoCredito])],
  controllers: [TipoCreditoController],
  providers: [TipoCreditoService],
  exports: [TypeOrmModule],
})
export class TipoCreditoModule {}