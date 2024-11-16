/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Body, Delete, Param } from '@nestjs/common';
import { ConsultaContactoService } from '../AreaInformativaServices/consultaContacto.service';
import { ContactFormDto } from '../AreaInformativaDto/contactForm.dto';

@Controller('contacto')
export class ConsultaContactoController {
  constructor(private readonly consultaContactoService: ConsultaContactoService) {}

  @Post()
  async create(@Body() contactFormDto: ContactFormDto) {
    const consulta = await this.consultaContactoService.create(contactFormDto);
    return { message: 'Consulta registrada correctamente', consulta };
  }

  @Get()
  async findAll() {
    return this.consultaContactoService.findAll();
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.consultaContactoService.delete(id);
    return { message: `Consulta con id ${id} eliminada correctamente` };
  }
}
