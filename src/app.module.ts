/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
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

import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path'; // Necesario para las plantillas de correo

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'cacpjdb',
      entities: [TipoCredito, PreguntasFrecuentes, ListaRequisitos, PreRegistroPsa, Psa, FAQsAi, ConsultasAI, Modalidad],
      synchronize: false
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
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
