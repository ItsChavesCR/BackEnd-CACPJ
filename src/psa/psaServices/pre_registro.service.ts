/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreRegistroPsa } from '../psaEntities/pre_registro.entity';
import { CreatePreRegistroPsaDto } from '../psaDto/create-preRegistro.dto';
import { ConfigService } from '@nestjs/config'; // Importar ConfigService
import * as sgMail from '@sendgrid/mail';
import { Modalidad } from '../psaEntities/modalidad.entity';

@Injectable()
export class PreRegistroPsaService {
  constructor(
    @InjectRepository(PreRegistroPsa)
    private preRegistroPsaRepository: Repository<PreRegistroPsa>,
    @InjectRepository(Modalidad)
    private modalidadRepository: Repository<Modalidad>,
    private configService: ConfigService, // Inyecta ConfigService para obtener las variables de entorno
  ) {
    // Configurar la API Key de SendGrid utilizando ConfigService
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY no está configurada');
    }
    sgMail.setApiKey(apiKey);
  }
  

  

  // Método para crear un pre-registro y enviar un correo
  async createPreRegistroPsa(createDto: CreatePreRegistroPsaDto): Promise<PreRegistroPsa> {
    // Validar la cédula (9 dígitos)
    if (!/^\d{9}$/.test(createDto.cedula)) {
      throw new BadRequestException('La cédula debe tener 9 dígitos');
    }

    // Buscar la modalidad por nombre
    const modalidad = await this.modalidadRepository.findOne({
      where: { Nombre_Modalidad: createDto.Nombre_Modalidad },
    });

    if (!modalidad) {
      throw new BadRequestException('La modalidad indicada no existe');
    }

    // Crear y guardar el pre-registro en la base de datos
    const newPreRegistro = this.preRegistroPsaRepository.create({
      ...createDto,
      modalidad: modalidad, // Asociar modalidad al pre-registro
    });

    const savedPreRegistro = await this.preRegistroPsaRepository.save(newPreRegistro);

    // Enviar correo de notificación
    const msg = {
      to: 'sjimenezsofia@gmail.com', // Correo del destinatario
      from: this.configService.get<string>('SENDGRID_FROM_EMAIL'), // Correo del remitente
      templateId: 'd-b8dca905498b4e2c8300a3948f154552', // Reemplázalo con tu Template ID de SendGrid
      dynamicTemplateData: {
        nombre: savedPreRegistro.nombre,
        apellido1: savedPreRegistro.apellido1,
        apellido2: savedPreRegistro.apellido2,
        cedula: savedPreRegistro.cedula,
        telefono: savedPreRegistro.Telefono,
        modalidad: savedPreRegistro.modalidad.Nombre_Modalidad,
        fechaPreRegistro: savedPreRegistro.fechaPreRegistro,
      },
    };
    

    try {
      await sgMail.send(msg);
      console.log('Correo enviado con éxito');
    } catch (error) {
      console.error('Error al enviar el correo:', error.response ? error.response.body : error);
    }
    

    return savedPreRegistro; // Devolver el pre-registro guardado
  }

  // Método para obtener todos los pre-registros con sus modalidades
  async getPreRegistro(): Promise<PreRegistroPsa[]> {
    return this.preRegistroPsaRepository.find({
      relations: ['modalidad'], // Cargar la relación con modalidad
    });
  }

  // Método para eliminar un pre-registro por ID
  deletePreRegistroService(id: number) {
    return this.preRegistroPsaRepository.delete({ id });
  }
}
