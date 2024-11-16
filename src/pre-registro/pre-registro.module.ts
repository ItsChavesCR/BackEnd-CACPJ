/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './pre-registro.controller';
import { UploadService } from './pre-registro.service';
import { ContactController } from 'src/AreaInformativa/AreaInformativaController/Contact.controller';
import { ConsultaContactoModule } from 'src/AreaInformativa/AreaInformativaModule/Consulta-contacto.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    ConsultaContactoModule,
  ],
  controllers: [UploadController, ContactController],
  providers: [UploadService],
})
export class UploadModule {}
