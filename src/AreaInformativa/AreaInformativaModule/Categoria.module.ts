/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from '../AreaInformativaEntities/Categoria.entity';
import { CategoriaController } from '../AreaInformativaController/Categoria.controller';
import { CategoriaService } from '../AreaInformativaServices/Categoria.service';


@Module({
  imports: [TypeOrmModule.forFeature([Categoria])],
  controllers: [CategoriaController],
  providers: [CategoriaService],
  exports: [CategoriaService],
})
export class CategoriaModule {}
