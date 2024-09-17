import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreRegistroPsaController } from '../psaController/pre_registro.controller';
import { PreRegistroPsaService } from '../psaServices/pre_registro.service';
import { PreRegistroPsa } from '../psaEntities/pre_registro.entity';
import { Modalidad } from '../psaEntities/modalidad.entity';


@Module({
  imports: [TypeOrmModule.forFeature([PreRegistroPsa, Modalidad])],
  controllers: [PreRegistroPsaController],
  providers: [PreRegistroPsaService],
})
export class PreRegistroPsaModule {}