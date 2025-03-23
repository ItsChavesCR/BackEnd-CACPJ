/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreRegistroPsa } from '../psaEntities/pre_registro.entity';
import { CreatePreRegistroPsaDto } from '../psaDto/create-preRegistro.dto';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Modalidad } from '../psaEntities/modalidad.entity';

@Injectable()
export class PreRegistroPsaService {
  constructor(
    @InjectRepository(PreRegistroPsa)
    private preRegistroPsaRepository: Repository<PreRegistroPsa>,
    @InjectRepository(Modalidad)
    private modalidadRepository: Repository<Modalidad>,
    private configService: ConfigService,
  ) {}
  
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
  
  try {
    // Configurar el transporte de correo con nodemailer usando variables de entorno
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,  // Usando la variable de entorno con el correo
        pass: process.env.EMAIL_PASS,  // Usando la variable de entorno con la contraseña
      },
    });
    
    // Formatear la fecha a dd/mm/yyyy
    const fechaObj = new Date(savedPreRegistro.fechaPreRegistro);
    const dia = fechaObj.getDate().toString().padStart(2, '0');
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
    const año = fechaObj.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${año}`;
    
    // Crear el cuerpo del correo con la información del pre-registro
    const emailBody = `
      Se ha recibido un nuevo pre-registro con la siguiente información:
      
      Nombre: ${savedPreRegistro.nombre} ${savedPreRegistro.apellido1} ${savedPreRegistro.apellido2}
      Cédula: ${savedPreRegistro.cedula}
      Teléfono: ${savedPreRegistro.Telefono}
      Modalidad: ${savedPreRegistro.modalidad.Nombre_Modalidad}
      Fecha de Pre-Registro: ${fechaFormateada}
    `;
    
    // Crear el HTML con estilos en línea (mejor compatibilidad con clientes de correo)
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px;">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 25px; border-bottom: 2px solid #4285f4; padding-bottom: 15px;">
            <h1 style="color: #4285f4; margin: 0; font-size: 24px;">Nuevo Pre-Registro PSA</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 10px 0;">
            <!-- Nombre -->
            <div style="margin-bottom: 12px;">
              <div style="font-weight: bold; color: #555555; background-color: #e8f0fe; padding: 5px; border-radius: 4px;">Nombre:</div>
              <div style="margin-top: 3px;">${savedPreRegistro.nombre} ${savedPreRegistro.apellido1} ${savedPreRegistro.apellido2}</div>
            </div>
            
            <!-- Cédula -->
            <div style="margin-bottom: 12px;">
              <div style="font-weight: bold; color: #555555; background-color: #e8f0fe; padding: 5px; border-radius: 4px;">Cédula:</div>
              <div style="margin-top: 3px;">${savedPreRegistro.cedula}</div>
            </div>
            
            <!-- Teléfono -->
            <div style="margin-bottom: 12px;">
              <div style="font-weight: bold; color: #555555; background-color: #e8f0fe; padding: 5px; border-radius: 4px;">Teléfono:</div>
              <div style="margin-top: 3px;">${savedPreRegistro.Telefono}</div>
            </div>
            
            <!-- Modalidad -->
            <div style="margin-bottom: 12px;">
              <div style="font-weight: bold; color: #555555; background-color: #e8f0fe; padding: 5px; border-radius: 4px;">Modalidad:</div>
              <div style="margin-top: 3px;">${savedPreRegistro.modalidad.Nombre_Modalidad}</div>
            </div>
            
            <!-- Fecha -->
            <div style="margin-bottom: 12px;">
              <div style="font-weight: bold; color: #555555; background-color: #e8f0fe; padding: 5px; border-radius: 4px;">Fecha de Pre-Registro:</div>
              <div style="margin-top: 3px;">${fechaFormateada}</div>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eeeeee; text-align: center; font-size: 12px; color: #777777;">
            <p>Este es un correo automático. Por favor no responder a este mensaje.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Opciones del correo
    const mailOptions = {
      from: process.env.EMAIL_USER, // Usar la variable de entorno para el remitente
      to: process.env.EMAIL_RECIPIENT || process.env.EMAIL_USER, // Usar la variable de entorno para el destinatario
      subject: 'Nuevo Pre-Registro PSA',
      text: emailBody,
      html: html
    };
    
    // Enviar el correo
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado con éxito');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    // No lanzamos excepción para no interrumpir el proceso, pero registramos el error
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