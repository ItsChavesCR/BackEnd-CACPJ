// src/controllers/GanaderiaContactController.ts
import { Controller, Post, Body } from '@nestjs/common';
import { UploadService } from 'src/pre-registro/pre-registro.service';
import { GanaderiaContactFormDto } from '../AreaInformativaDto/GanaderiaContactForm.dto';

@Controller('ganaderia-contacto')
export class GanaderiaContactController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  async handleGanaderiaContactForm(@Body() ganaderiaContactFormDto: GanaderiaContactFormDto) {
    try {
      await this.uploadService.sendEmailWithAttachment(
        ganaderiaContactFormDto.email,
        'chaves03x@gmail.com',
        ganaderiaContactFormDto,
        null  // No hay archivo adjunto
      );
      return { message: 'Consulta enviada correctamente' };
    } catch (error) {
      throw new Error('Error al enviar la consulta');
    }
  }
}
