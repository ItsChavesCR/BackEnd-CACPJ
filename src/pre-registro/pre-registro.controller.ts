/* eslint-disable prettier/prettier */

import { Controller, Post, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadService } from './pre-registro.service';
import { CreateFormDto } from './pre-registro-dto';


@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = file.originalname.split('.').pop();
        const filename = `${file.fieldname}-${uniqueSuffix}.${ext}`;
        callback(null, filename);
      },
    }),
  }))
  async handleUpload(
    @UploadedFile() file: Express.Multer.File,  // Para manejar el archivo
    @Body() createFormDto: CreateFormDto        // Para manejar los datos del formulario
  ) {
    console.log('Datos del formulario:', createFormDto);
    console.log('Archivo subido:', file);

    if (!file) {
      throw new Error('No se ha subido ningún archivo');
    }

    try {
      // Aquí llamas al servicio para enviar el correo
      await this.uploadService.sendEmailWithAttachment(createFormDto.email, 'chaves03x@gmail.com', createFormDto, file);
      return { message: 'Formulario y archivo enviados correctamente' };
    } catch (error) {
      console.error('Error en el proceso:', error);
      throw new Error('Error al enviar el formulario y el archivo');
    }
  }
}
