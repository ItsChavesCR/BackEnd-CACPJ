/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AreaInformativa } from '../AreaInformativaEntities/AreaInformativa.entity';
import { Categoria } from '../AreaInformativaEntities/Categoria.entity';
import { InformacionController } from '../AreaInformativaController/AreaInformativa.controller';
import { InformacionService } from '../AreaInformativaServices/AreaInformativa.service';

@Module({
  imports: [TypeOrmModule.forFeature([AreaInformativa, Categoria])], 
  controllers: [InformacionController],
  providers: [InformacionService],
  exports: [InformacionService], 
})
export class InformacionModule {}
