/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreRegistroPsa } from '../psaEntities/pre_registro.entity';
import { CreatePreRegistroPsaDto, UpdatePreRegistroPsaDto } from '../psaDto/create-preRegistro.dto';
import * as sgMail from '@sendgrid/mail';
import { Modalidad } from '../psaEntities/modalidad.entity';


@Injectable()
export class PreRegistroPsaService {
  constructor(
    @InjectRepository(PreRegistroPsa)
    private preRegistroPsaRepository: Repository<PreRegistroPsa>,
    @InjectRepository(Modalidad) private modalidadRepository: Repository<Modalidad>,
  ) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Asegúrate de tener esta variable en tu .env
  }

  async createPreRegistroPsa(createDto: CreatePreRegistroPsaDto): Promise<PreRegistroPsa> {
    // Validación adicional para la cédula
    if (!/^\d{9}$/.test(createDto.cedula)) {
      throw new BadRequestException('La cédula debe tener 9 dígitos');
    }

    // Buscar si la modalidad existe por su nombre
    const modalidad = await this.modalidadRepository.findOne({
      where: { Nombre_Modalidad: createDto.Nombre_Modalidad },
    });

    // Si no existe, lanzar una excepción
    if (!modalidad) {
      throw new BadRequestException('La modalidad indicada no existe');
    }

    const newPreRegistro = this.preRegistroPsaRepository.create({
      ...createDto,
      modalidad: modalidad, // A
    });

    const savedPreRegistro = await this.preRegistroPsaRepository.save(newPreRegistro);
    

    // Después de guardar el pre-registro, envía el correo
    const msg = {
      to: 'sjimenezsofia@gmail.com', // Correo del administrador
      from: 'sjimenezsofia@gmail.com', // Correo configurado en SendGrid
      subject: `Nuevo Pre-Registro PSA: ${savedPreRegistro.nombre} ${savedPreRegistro.apellido1}`,
      text: `Se ha registrado un nuevo pre-registro de PSA con la siguiente información:
      
      Nombre: ${savedPreRegistro.nombre} ${savedPreRegistro.apellido1} ${savedPreRegistro.apellido2}
      Cédula: ${savedPreRegistro.cedula}
      Teléfono: ${savedPreRegistro.Telefono}
      Modalidad PSA: ${savedPreRegistro.modalidad}
      Fecha de Pre-Registro: ${savedPreRegistro.fechaPreRegistro}
      `,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
    }

    return savedPreRegistro;
  }

  async getPreRegistro(): Promise<PreRegistroPsa[]> {
    return this.preRegistroPsaRepository.find({
      relations: ['modalidad'], // Asegúrate de cargar la relación con modalidad
    });
  }

  deletePreRegistroService(id: number) {
    return this.preRegistroPsaRepository.delete({ id: id });
  }
}
