/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaInformativaController } from '../AreaInformativaController/AreaInformativa.controller';
import { AreaInformativa } from '../AreaInformativaEntities/AreaInformativa.entity';
import { CategoriaModule } from './Categoria.module';
import { AreaInformativaService } from '../AreaInformativaServices/AreaInformativa.service';


@Module({
  imports: [TypeOrmModule.forFeature([AreaInformativa]), CategoriaModule],  // Asegúrate de importar CategoriaModule aquí
  controllers: [AreaInformativaController],
  providers: [AreaInformativaService],
})
export class AreaInformativaModule {}
