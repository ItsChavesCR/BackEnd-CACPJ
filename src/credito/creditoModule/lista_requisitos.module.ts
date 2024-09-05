import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListaRequisitosService } from '../creditoServices/lista_requisitos.service';
import { ListaRequisitosController } from '../creditoController/lista_requisitos.controller';
import { ListaRequisitos } from '../CreditoEntities/lista_requisitos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ListaRequisitos])],
  controllers: [ListaRequisitosController],
  providers: [ListaRequisitosService],
})
export class ListaRequisitosModule {}
