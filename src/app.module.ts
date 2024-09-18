import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; 

// Importación de tus módulos
import { GanaderiaModule } from './ganaderia/ganaderia.module';
import { PreRegistroPsaModule } from './psa/psaModule/pre_registro.module';
import { TipoCreditoModule } from './credito/creditoModule/tipo_credito.module';
import { PreguntasFrecuentesModule } from './credito/creditoModule/pregunta_frecuente.module';
import { ListaRequisitosModule } from './credito/creditoModule/lista_requisitos.module';
import { PsaModule } from './psa/psaModule/psa.module';
import { FAQsModule } from './AreaInformativa/AreaInformativaModule/FAQs_AI.module';
import { ConsultasModule } from './AreaInformativa/AreaInformativaModule/Consultas_AI.module';
import { ModalidadModule } from './psa/psaModule/modalidad.module';
import { AfiliadosModule } from './afiliados/afiliadosModule/afiliados.module';
import { TipoGarantiaModule } from './credito/creditoModule/tipo_garantia.module';

// Importación de entidades
import { TipoCredito } from './credito/CreditoEntities/tipo_credito.entity';
import { PreguntasFrecuentes } from './credito/CreditoEntities/preguntas_frecuentes.entity';
import { ListaRequisitos } from './credito/CreditoEntities/lista_requisitos.entity';
import { PreRegistroPsa } from './psa/psaEntities/pre_registro.entity';
import { Psa } from './psa/psaEntities/Psa.entity';
import { FAQsAi } from './AreaInformativa/AreaInformativaEntities/FAQs_AI.entity';
import { ConsultasAI } from './AreaInformativa/AreaInformativaEntities/Consultas_AI.entity';
import { Modalidad } from './psa/psaEntities/modalidad.entity';
import { Afiliado } from './afiliados/afiliadosEntities/afiliados.entity';
import { TipoGarantia } from './credito/CreditoEntities/tipo_garantia.entity';
import { FuenteFondosModule } from './credito/creditoModule/fuente_fondos.module';
import { FuenteFondos } from './credito/CreditoEntities/fuente_fondos.entity';
import * as sgMail from '@sendgrid/mail';

@Module({
  imports: [
    ConfigModule.forRoot(), // Carga las variables de entorno del archivo .env
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'junction.proxy.rlwy.net',
      port: 31987,
      username: 'root',
      password: 'ksfUlaHQlBEkIWQFSMyGOVRaovqKjaQk',
      database: 'cacpjdb',
      entities: [
        TipoCredito,
        PreguntasFrecuentes,
        ListaRequisitos,
        PreRegistroPsa,
        Psa,
        FAQsAi,
        ConsultasAI,
        Modalidad,
        Afiliado,
        TipoGarantia,
        FuenteFondos
      ],
      synchronize: true, 
    }),

    // Importación de otros módulos
    GanaderiaModule,
    PreRegistroPsaModule,
    TipoCreditoModule,
    PreguntasFrecuentesModule,
    ListaRequisitosModule,
    PsaModule,
    FAQsModule,
    ConsultasModule,
    ModalidadModule,
    FuenteFondosModule,
    AfiliadosModule,
    TipoGarantiaModule,
    FuenteFondosModule],
  
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Configura la API Key de SendGrid
  }
}
