/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { join } from 'path';

@Injectable()
export class UploadService {
  // Método para enviar correo con o sin archivo adjunto
  async sendEmailWithAttachment(fromEmail: string, toEmail: string, formData: any, file?: Express.Multer.File) {
    try {
      // Configurar el transporte de correo
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'achaba03x@gmail.com', // Cambia esto por tu correo
          pass: 'smze wyrn okir gdim',   // Contraseña de aplicación generada
        },
      });

      // Opciones del correo (Cuerpo generado dinámicamente según el formulario)
      const mailOptions: any = {
        from: fromEmail,
        to: toEmail,
        subject: 'Nuevo formulario recibido',
        text: this.generateEmailBody(formData),  // Generar el cuerpo del correo según los datos
      };

      // Si hay un archivo, adjuntarlo
      if (file) {
        mailOptions.attachments = [
          {
            filename: file.filename,
            path: join(__dirname, '..', '..', 'uploads', file.filename),
          },
        ];
      }

      // Enviar el correo
      await transporter.sendMail(mailOptions);
      console.log('Correo enviado correctamente');
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('No se pudo enviar el correo');
    }
  }

  // Método para generar dinámicamente el cuerpo del correo según el formulario
  private generateEmailBody(formData: any): string {
    // Si existe 'mensaje', es el formulario de contacto
    if (formData.mensaje) {
      return `Formulario de Contacto:
              Nombre: ${formData.nombre}
              Email: ${formData.email}
              Mensaje: ${formData.mensaje}`;
    } 
    // Si existe 'cedula', es el formulario de pre-registro
    else {
      return `Formulario de Pre-Registro:
              Nombre: ${formData.nombre}
              Cedula: ${formData.cedula}
              Direccion: ${formData.direccion}
              Telefono: ${formData.telefono}
              Correo Electrónico: ${formData.email}
              Actividades Agrícolas: ${formData.actividades}
              Genero: ${formData.genero}
              Año de Nacimiento: ${formData.annoNacimiento}`;
    }
  }
}
