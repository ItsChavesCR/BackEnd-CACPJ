/* eslint-disable prettier/prettier */

import { Controller, Post, Body } from '@nestjs/common';
import { UploadService } from 'src/pre-registro/pre-registro.service';
import { ContactFormDto } from '../AreaInformativaDto/contactForm.dto';


@Controller('contacto')
export class ContactController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  async handleContactForm(
    @Body() contactFormDto: ContactFormDto
  ) {
    try {
      await this.uploadService.sendEmailWithAttachment(
        contactFormDto.email, 
        'chaves03x@gmail.com',
        contactFormDto, 
        null  // No hay archivo adjunto
      );
      return { message: 'Consulta enviada correctamente' };
    } catch (error) {
      throw new Error('Error al enviar la consulta');
    }
  }
}
