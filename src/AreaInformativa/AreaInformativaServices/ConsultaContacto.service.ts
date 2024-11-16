/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsultaContacto } from '../AreaInformativaEntities/consulta-contacto.entity';
import { ContactFormDto } from '../AreaInformativaDto/contactForm.dto';

@Injectable()
export class ConsultaContactoService {
  constructor(
    @InjectRepository(ConsultaContacto)
    private readonly consultaContactoRepository: Repository<ConsultaContacto>,
  ) {}

  async create(contactFormDto: ContactFormDto): Promise<ConsultaContacto> {
    const consulta = this.consultaContactoRepository.create(contactFormDto);
    return this.consultaContactoRepository.save(consulta);
  }

  async findAll(): Promise<ConsultaContacto[]> {
    return this.consultaContactoRepository.find();
  }

  // Eliminar una consulta por ID
  async delete(id: number): Promise<void> {
    const consulta = await this.consultaContactoRepository.findOne({ where: { id } });
    if (!consulta) {
      throw new NotFoundException(`Consulta con id ${id} no encontrada`);
    }
    await this.consultaContactoRepository.remove(consulta);
  }
}
