/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; 
// Importación de tus módulos
import { PreRegistroPsaModule } from './psa/psaModule/pre_registro.module';
import { TipoCreditoModule } from './credito/creditoModule/tipo_credito.module';
import { PreguntasFrecuentesModule } from './credito/creditoModule/pregunta_frecuente.module';
import { ListaRequisitosModule } from './credito/creditoModule/lista_requisitos.module';
import { PsaModule } from './psa/psaModule/psa.module';
import { FAQsModule } from './AreaInformativa/AreaInformativaModule/FAQs_AI.module';
import { ConsultasModule } from './AreaInformativa/AreaInformativaModule/Consultas_AI.module';
import { ModalidadModule } from './psa/psaModule/modalidad.module';
import { AfiliadosModule } from './afiliados/afiliadosModule/afiliados.module';
import { PatchAfiliadoModule } from './afiliados/afiliadosModule/patchAfiliado.module';


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
import { Categoria } from './AreaInformativa/AreaInformativaEntities/Categoria.entity';
import { AreaInformativa } from './AreaInformativa/AreaInformativaEntities/AreaInformativa.entity';
import { AreaInformativaModule } from './AreaInformativa/AreaInformativaModule/Informativa.module';
import { TipoGarantia } from './credito/CreditoEntities/tipo_garantia.entity';
import { TipoGarantiaModule } from './credito/creditoModule/tipo_garantia.module';
import { FuenteFondosModule } from './credito/creditoModule/fuente_fondos.module';
import { FuenteFondos } from './credito/CreditoEntities/fuente_fondos.entity';
import { CategoriaModule } from './AreaInformativa/AreaInformativaModule/Categoria.module';
import { Ganadero } from './ganaderia/ganaderiaEntities/ganadero.entity';
import { GanaderoModule } from './ganaderia/ganaderiaModule/ganadero.module';
import { CreditoModule } from './credito/creditoModule/credito.module';
import { EnviosModule } from './ganaderia/ganaderiaModule/envios.module';
import { Envios } from './ganaderia/ganaderiaEntities/envios.entity';
import { patchAfiliado } from './afiliados/afiliadosEntities/patchAfiliado.entity';
import { PagoPsa } from './psa/psaEntities/pago_psa.entity';
import { PagoPsaModule } from './psa/psaModule/pago_psa.module';
import { Usuario } from './auth/loginEntities/login.entity';
import { LoginModule } from './auth/loginModule/login.module';


@Module({
  imports: [
    // Configura ConfigModule para que sea global
    ConfigModule.forRoot({
      isGlobal: true, // Esto permite que el ConfigService esté disponible en todos los módulos sin tener que importarlo cada vez
    }),

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
        Categoria, 
        AreaInformativa,
        TipoGarantia,
        Ganadero,
        Envios,
        FuenteFondos,
        patchAfiliado,
        PagoPsa,
        Usuario
      ],
      synchronize: true,
      logging: false,
    }),

    // Importación de otros módulos
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
    FuenteFondosModule,
    AfiliadosModule,
    AreaInformativaModule,
    GanaderoModule,
    EnviosModule,
    CreditoModule,
    CategoriaModule,
    PatchAfiliadoModule,
    PagoPsaModule,
    LoginModule
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
