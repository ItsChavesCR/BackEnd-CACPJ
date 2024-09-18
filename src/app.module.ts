/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { PreRegistroPsaModule } from './psa/psaModule/pre_registro.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoCredito } from './credito/CreditoEntities/tipo_credito.entity';
import { ListaRequisitos } from './credito/CreditoEntities/lista_requisitos.entity';
import { PreguntasFrecuentes } from './credito/CreditoEntities/preguntas_frecuentes.entity';
import { TipoCreditoModule } from './credito/creditoModule/tipo_credito.module';
import { PreguntasFrecuentesModule } from './credito/creditoModule/pregunta_frecuente.module';
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
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path'; // Necesario para las plantillas de correo
import { AfiliadosModule } from './afiliados/afiliadosModule/afiliados.module';
import { Categoria } from './AreaInformativa/AreaInformativaEntities/Categoria.entity';
import { AreaInformativa } from './AreaInformativa/AreaInformativaEntities/AreaInformativa.entity';
import { InformacionModule } from './AreaInformativa/AreaInformativaModule/Informativa.module';


@Module({
  imports: [
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
          AreaInformativa],
        synchronize: true
    }),

    // Módulo para manejo de correos
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com', // Cambia esto a tu proveedor SMTP
        port: 587,
        secure: false, // true para SSL
        auth: {
          user: 'sjimenezsofia@gmail.com', // Cambia esto a tu correo SMTP
          pass: 'uxat sxbk ncdu nscn', // Cambia esto a tu contraseña SMTP
        },
      },
      defaults: {
        from: '"Atención al cliente" <sofiajs0409@gmail.com>',
      },
      template: {
        dir: join(__dirname, '../src/templates'), // Asegúrate de que apunte a la carpeta correcta
        adapter: new (require('@nestjs-modules/mailer/dist/adapters/handlebars.adapter')).HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),

    // Otros módulos
    TipoCreditoModule,
    ListaRequisitosModule,
    PreguntasFrecuentesModule,
    PreRegistroPsaModule,
    PsaModule,
    FAQsModule,
    ConsultasModule,
    ModalidadModule,
    AfiliadosModule,
    InformacionModule],

  controllers: [],
  providers: [],
})

export class AppModule {}
