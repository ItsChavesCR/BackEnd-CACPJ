/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { UploadModule } from './pre-registro/pre-registro.module';
import { ConsultaContactoModule } from './AreaInformativa/AreaInformativaModule/Consulta-contacto.module';
import { ConsultaContacto } from './AreaInformativa/AreaInformativaEntities/consulta-contacto.entity';
import { GanaderiaConsultasModule } from './AreaInformativa/AreaInformativaModule/GanaderiaConsultas.module';
import { IndicadorKri } from './kri/kriEntities/indicador-kri.entity';
import { ResultadoKri } from './kri/kriEntities/resultado-kri.entity';
import { KriModule } from './kri/kriModule/kri.module';
import { AuditoriaAccion } from './auditoria/auditoriaEntities/auditoria-accion.entity';
import { AuditoriaModule } from './auditoria/auditoriaModule/auditoria.module';

@Module({
  imports: [
    // Configura ConfigModule para que sea global
    ConfigModule.forRoot({
      isGlobal: true, // Esto permite que el ConfigService esté disponible en todos los módulos sin tener que importarlo cada vez
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbPort = Number(configService.getOrThrow<string>('DB_PORT'));
        if (!Number.isInteger(dbPort) || dbPort < 1 || dbPort > 65535) {
          throw new Error('DB_PORT debe ser un puerto válido');
        }

        return {
          type: 'mysql',
          host: configService.getOrThrow<string>('DB_HOST'),
          port: dbPort,
          username: configService.getOrThrow<string>('DB_USERNAME'),
          password: configService.getOrThrow<string>('DB_PASSWORD'),
          database: configService.getOrThrow<string>('DB_DATABASE'),
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
            Usuario,
            ConsultaContacto,
            IndicadorKri,
            ResultadoKri,
            AuditoriaAccion,
          ],
          synchronize: false,
          logging: false,
        };
      },
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
    LoginModule,
    UploadModule,
    ConsultaContactoModule,
    GanaderiaConsultasModule,
    KriModule,
    AuditoriaModule
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
