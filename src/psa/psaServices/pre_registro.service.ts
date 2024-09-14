import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreRegistroPsa } from '../psaEntities/pre_registro.entity';
import { CreatePreRegistroPsaDto, UpdatePreRegistroPsaDto } from '../psaDto/create-preRegistro.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class PreRegistroPsaService {
  constructor(
    @InjectRepository(PreRegistroPsa)
    private preRegistroPsaRepository: Repository<PreRegistroPsa>,
    private readonly mailerService: MailerService, // Inyectamos el servicio de correos
  ) {}

  async createPreRegistroPsa(createDto: CreatePreRegistroPsaDto): Promise<PreRegistroPsa> {
    // Validación adicional para la cédula
    if (!/^\d{9}$/.test(createDto.cedula)) {
      throw new BadRequestException('La cédula debe tener 9 dígitos');
    }

    const newPreRegistro = this.preRegistroPsaRepository.create({
      ...createDto,
    });

    const savedPreRegistro = await this.preRegistroPsaRepository.save(newPreRegistro);

    // Enviar correo de notificación a la empresa
    await this.sendPreRegistroNotification(savedPreRegistro);

    return savedPreRegistro;
  }

  private async sendPreRegistroNotification(preRegistro: PreRegistroPsa) {
    await this.mailerService.sendMail({
      to: 'sjimenezsofia@gmail.com', // Dirección de la empresa
      subject: 'Nuevo Pre-Registro',
      template: './pre-registro', // Nombre del archivo de plantilla
      context: {
        nombre: preRegistro.nombre,
        apellido1: preRegistro.apellido1,
        apellido2: preRegistro.apellido2,
        cedula: preRegistro.cedula,
        Telefono: preRegistro.Telefono,
        modalidadPSA: preRegistro.modalidadPSA,
      },
    });
  }
}
