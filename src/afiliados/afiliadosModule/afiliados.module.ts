import { Module } from '@nestjs/common';
import { AfiliadosController } from '../afiliadosController/afiliados.controller';
import { AfiliadosService } from '../afiliadosService/afiliados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Afiliado } from '../afiliadosEntities/afiliados.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Afiliado])],
  controllers: [AfiliadosController],
  providers: [AfiliadosService],
})
export class AfiliadosModule {}
