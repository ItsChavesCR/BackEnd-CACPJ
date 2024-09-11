/* eslint-disable prettier/prettier */
import {Module} from '@nestjs/common';
import { AfiliadosModule } from './afiliados/afiliados.module';
import { GanaderiaModule } from './ganaderia/ganaderia.module';
import { PreRegistroPsaModule } from './psa/psaModule/pre_registro.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Afiliado } from './afiliados/entities/afiliados.entity';
import { Ganaderia } from './ganaderia/entities/ganaderia.entity';
import { TipoCredito } from './credito/CreditoEntities/tipo_credito.entity';
import { ListaRequisitos } from './credito/CreditoEntities/lista_requisitos.entity';

import { PreguntasFrecuentes } from './credito/CreditoEntities/preguntas_frecuentes.entity';
import { TipoCreditoModule } from './credito/creditoModule/tipo_credito.module';
import { PreguntasFrecuentesModule }  from './credito/creditoModule/pregunta_frecuente.module';
import { ListaRequisitosModule } from './credito/creditoModule/lista_requisitos.module';
import { PreRegistroPsa } from './psa/psaEntities/pre_registro.entity';
import { Psa } from './psa/psaEntities/Psa.entity';
import { PsaModule } from './psa/psaModule/psa.module';
import { FAQsAi } from './AreaInformativa/AreaInformativaEntities/FAQs_AI.entity';
import { FAQsModule } from './AreaInformativa/AreaInformativaModule/FAQs_AI.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: '123456',
      database: 'cacpjdb',
      entities: [TipoCredito,PreguntasFrecuentes, ListaRequisitos, PreRegistroPsa, Psa, FAQsAi],
      synchronize: false
    }),
    TipoCreditoModule,
    ListaRequisitosModule,
    PreguntasFrecuentesModule,
    PreRegistroPsaModule,
    PsaModule,
    FAQsModule],
  controllers: [],
  providers: [],

  
})

export class AppModule {}
