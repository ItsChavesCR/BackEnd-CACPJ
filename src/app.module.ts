/* eslint-disable prettier/prettier */
import {Module} from '@nestjs/common';
import { AfiliadosModule } from './afiliados/afiliados.module';
import { GanaderiaModule } from './ganaderia/ganaderia.module';
import { PsaModule } from './psa/psa.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Afiliado } from './afiliados/entities/afiliados.entity';
import { Ganaderia } from './ganaderia/entities/ganaderia.entity';
import { TipoCredito } from './credito/CreditoEntities/tipo_credito.entity';
import { ListaRequisitos } from './credito/CreditoEntities/lista_requisitos.entity';
import { Psa } from './psa/entities/psa.entity';
import { PreguntasFrecuentes } from './credito/CreditoEntities/preguntas_frecuentes.entity';
import { TipoCreditoModule } from './credito/creditoModule/tipo_credito.module';
import { PreguntasFrecuentesModule }  from './credito/creditoModule/pregunta_frecuente.module';
import { ListaRequisitosModule } from './credito/creditoModule/lista_requisitos.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'cacpjdb',
      entities: [TipoCredito,PreguntasFrecuentes, ListaRequisitos],
      synchronize: false
    }),
    TipoCreditoModule,
    ListaRequisitosModule,
    PreguntasFrecuentesModule,
    PsaModule],
  controllers: [],
  providers: [],

  
})

export class AppModule {}
