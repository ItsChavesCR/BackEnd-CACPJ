import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PsaController } from '../psaController/psa.controller';
import { PsaService } from '../psaServices/psa.service';
import { Psa } from '../psaEntities/Psa.entity';
import { Modalidad } from '../psaEntities/modalidad.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Psa, Modalidad])],
  controllers: [PsaController],
  providers: [PsaService],
})
export class PsaModule {}
