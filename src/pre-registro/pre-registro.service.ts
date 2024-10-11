/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { join } from 'path';

@Injectable()
export class UploadService {
  async sendEmailWithAttachment(fromEmail: string, toEmail: string, formData: any, file: Express.Multer.File) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'achaba03x@gmail.com',
        pass: 'smze wyrn okir gdim',   // Contraseña de aplicación generada
        },
      });

      const mailOptions = {
        from: fromEmail,  // Usa el correo ingresado por el usuario
        to: toEmail,      // Cambia por el correo de destino real
        subject: 'Nuevo formulario de Pre-Registro',
        text: `Datos del formulario: 
        Nombre: ${formData.nombre}
        Cedula: ${formData.cedula}
        Direccion: ${formData.direccion}
        Telefono: ${formData.telefono}
        Correo Electrónico: ${formData.email}
        Actividades Agrícolas: ${formData.actividades}
        Genero: ${formData.genero}
        Año de Nacimiento: ${formData.annoNacimiento}`,
        attachments: [
          {
            filename: file.filename,
            path: join(__dirname, '..', '..', 'uploads', file.filename),  // Ruta al archivo subido
          },
        ],
      };

      await transporter.sendMail(mailOptions);
      console.log('Correo enviado correctamente');
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('No se pudo enviar el correo');
    }
  }
}
