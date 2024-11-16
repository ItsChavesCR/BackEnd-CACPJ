/* eslint-disable prettier/prettier */

import { Controller, Post, Body } from '@nestjs/common';
import { UploadService } from 'src/pre-registro/pre-registro.service';
import { ConsultaContactoService } from '../AreaInformativaServices/ConsultaContacto.service'; // Importa el servicio de ConsultaContacto
import { ContactFormDto } from '../AreaInformativaDto/contactForm.dto';

@Controller('contacto')
export class ContactController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly consultaContactoService: ConsultaContactoService, // Inyecta el servicio
  ) {}

  @Post()
  async handleContactForm(
    @Body() contactFormDto: ContactFormDto,
  ) {
    try {
      // 1. Enviar el correo
      await this.uploadService.sendEmailWithAttachment(
        contactFormDto.email, 
        'chaves03x@gmail.com', 
        contactFormDto, 
        null, // No hay archivo adjunto
      );

      // 2. Guardar la consulta en la base de datos
      await this.consultaContactoService.create(contactFormDto);

      // 3. Retornar el mensaje de éxito
      return { message: 'Consulta enviada y registrada correctamente' };
    } catch (error) {
      console.error('Error al procesar la consulta:', error);
      throw new Error('Error al enviar y registrar la consulta');
    }
  }
}
