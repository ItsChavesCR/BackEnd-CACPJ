import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagoPsa } from '../psaEntities/pago_psa.entity';
import { Psa } from '../psaEntities/Psa.entity';
import { PagoPsaController } from '../psaController/pago_psa.controller';
import { PagoPsaService } from '../psaServices/pago_psa.service';


@Module({
  imports: [TypeOrmModule.forFeature([PagoPsa, Psa])],
  controllers: [PagoPsaController],
  providers: [PagoPsaService],
})
export class PagoPsaModule {}
