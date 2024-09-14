/* eslint-disable prettier/prettier */
import {Module} from '@nestjs/common';
import { PreRegistroPsaModule } from './psa/psaModule/pre_registro.module';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { ConsultasAI } from './AreaInformativa/AreaInformativaEntities/Consultas_AI.entity';
import { ConsultasModule } from './AreaInformativa/AreaInformativaModule/Consultas_AI.module';
import { Modalidad } from './psa/psaEntities/modalidad.entity';
import { ModalidadModule } from './psa/psaModule/modalidad.module';
import { Afiliado } from './afiliados/afiliadosEntities/afiliados.entity';
import { AfiliadosModule } from './afiliados/afiliadosModule/afiliados.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'junction.proxy.rlwy.net',
      port: 31987,
      username: 'root',
      password: 'ksfUlaHQlBEkIWQFSMyGOVRaovqKjaQk',
      database: 'cacpjdb',
      entities: [TipoCredito, PreguntasFrecuentes, ListaRequisitos, PreRegistroPsa, Psa, FAQsAi, ConsultasAI, Modalidad, Afiliado],
      synchronize: true
    }),
    TipoCreditoModule,
    ListaRequisitosModule,
    PreguntasFrecuentesModule,
    PreRegistroPsaModule,
    PsaModule,
    FAQsModule,
    ConsultasModule,
    ModalidadModule,
    AfiliadosModule],
  controllers: [],
  providers: [],

  
})

export class AppModule {}
