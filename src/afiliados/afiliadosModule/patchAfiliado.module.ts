import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { patchAfiliado } from '../afiliadosEntities/patchAfiliado.entity';
import { PatchAfiliadoController } from '../afiliadosController/PatchAfiliados.controller';
import { patchAfiliadoService } from '../afiliadosService/patchAfiliado.service';


@Module({
  imports: [TypeOrmModule.forFeature([patchAfiliado])],
  controllers: [PatchAfiliadoController],
  providers: [patchAfiliadoService],
})
export class PatchAfiliadoModule {}