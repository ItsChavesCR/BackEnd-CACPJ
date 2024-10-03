import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PsaController } from '../psaController/psa.controller';
import { PsaService } from '../psaServices/psa.service';
import { Modalidad } from '../psaEntities/modalidad.entity';
import { PagoPsa } from '../psaEntities/pago_psa.entity';
import { Psa } from '../psaEntities/Psa.entity';



@Module({
  imports: [TypeOrmModule.forFeature([Psa, Modalidad, PagoPsa])],
  controllers: [PsaController],
  providers: [PsaService],
})
export class PsaModule {}
