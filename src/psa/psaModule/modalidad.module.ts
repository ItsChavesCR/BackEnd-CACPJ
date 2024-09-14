import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Modalidad } from '../psaEntities/modalidad.entity';
import { ModalidadController } from '../psaController/modalidad.controller';
import { ModalidadService } from '../psaServices/modalidad.service';


@Module({
  imports: [TypeOrmModule.forFeature([Modalidad])],
  controllers: [ModalidadController],
  providers: [ModalidadService],
})
export class ModalidadModule {}