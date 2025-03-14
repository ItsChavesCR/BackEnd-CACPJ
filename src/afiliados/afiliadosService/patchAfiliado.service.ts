
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { patchAfiliado } from '../afiliadosEntities/patchAfiliado.entity';
import { CreatePatchAfiliadoDto } from '../afiliadosDto/create-patchAfiliado.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class patchAfiliadoService {
  constructor(
    @InjectRepository(patchAfiliado)
    private patchAfiliadoRepository: Repository<patchAfiliado>,
  ) {}

  async createPatchAfiliado(createDto: CreatePatchAfiliadoDto): Promise<patchAfiliado> {
    // Validación adicional para la cédula
    if (!/^\d{9}$/.test(createDto.cedula)) {
      throw new BadRequestException('La cédula debe tener 9 dígitos');
    }
    const newPatchAfiliado = this.patchAfiliadoRepository.create({
      ...createDto,
    });
    const savedPatchAfiliado = await this.patchAfiliadoRepository.save(newPatchAfiliado);
   
    try {
      // Configurar el transporte de correo con nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'achaba03x@gmail.com', // Cambiar por tu correo configurado
          pass: 'smze wyrn okir gdim',  // Contraseña de aplicación
        },
      });
      
      // Crear el cuerpo del correo con la información de la solicitud
      const emailBody = `
        Se ha registrado una nueva solicitud de actualización con la siguiente información:
       
        Nombre: ${savedPatchAfiliado.nombreCompleto} con # de cédula: ${savedPatchAfiliado.cedula}
        Correo: ${savedPatchAfiliado.correo}
        Dirección: ${savedPatchAfiliado.direccion}
        Teléfono: ${savedPatchAfiliado.telefono}
        Género: ${savedPatchAfiliado.genero}
      `;
      
      // Crear el HTML con estilos en línea para mejor compatibilidad con clientes de correo
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
              <h1 style="color: #4285f4; margin: 0; font-size: 24px;">Solicitud de Actualización de Afiliado</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 10px 0;">
              <!-- Nombre -->
              <div style="margin-bottom: 12px;">
                <div style="font-weight: bold; color: #555555; background-color: #e8f0fe; padding: 5px; border-radius: 4px;">Nombre:</div>
                <div style="margin-top: 3px;">${savedPatchAfiliado.nombreCompleto}</div>
              </div>
              
              <!-- Cédula -->
              <div style="margin-bottom: 12px;">
                <div style="font-weight: bold; color: #555555; background-color: #e8f0fe; padding: 5px; border-radius: 4px;">Cédula:</div>
                <div style="margin-top: 3px;">${savedPatchAfiliado.cedula}</div>
              </div>
              
              <!-- Correo -->
              <div style="margin-bottom: 12px;">
                <div style="font-weight: bold; color: #555555; background-color: #e8f0fe; padding: 5px; border-radius: 4px;">Correo:</div>
                <div style="margin-top: 3px;">${savedPatchAfiliado.correo}</div>
              </div>
              
              <!-- Dirección -->
              <div style="margin-bottom: 12px;">
                <div style="font-weight: bold; color: #555555; background-color: #e8f0fe; padding: 5px; border-radius: 4px;">Dirección:</div>
                <div style="margin-top: 3px;">${savedPatchAfiliado.direccion}</div>
              </div>
              
              <!-- Teléfono -->
              <div style="margin-bottom: 12px;">
                <div style="font-weight: bold; color: #555555; background-color: #e8f0fe; padding: 5px; border-radius: 4px;">Teléfono:</div>
                <div style="margin-top: 3px;">${savedPatchAfiliado.telefono}</div>
              </div>
              
              <!-- Género -->
              <div style="margin-bottom: 12px;">
                <div style="font-weight: bold; color: #555555; background-color: #e8f0fe; padding: 5px; border-radius: 4px;">Género:</div>
                <div style="margin-top: 3px;">${savedPatchAfiliado.genero}</div>
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
        from: 'achaba03x@gmail.com', // Remitente
        to: 'achaba03x@gmail.com', // Destinatario
        subject: `Nueva solicitud de actualización de afiliado: ${savedPatchAfiliado.nombreCompleto} ${savedPatchAfiliado.cedula}`,
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
    
    return savedPatchAfiliado;
  }

  async getPatchAfiliado(): Promise<patchAfiliado[]> {
    return this.patchAfiliadoRepository.find({
    });
  }

  deletePatchAfiliado(id: number) {
    return this.patchAfiliadoRepository.delete({ patchAfiliadoId: id });
  }
}