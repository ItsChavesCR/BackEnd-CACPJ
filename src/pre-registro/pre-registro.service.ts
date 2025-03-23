import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { join } from 'path';

@Injectable()
export class UploadService {
  // Configuración del transporter usando variables de entorno
  private transporter = nodemailer.createTransport({
    service: 'gmail',  // Gmail como proveedor de correo
    auth: {
      user: process.env.EMAIL_USER,  // Usando la variable de entorno con el correo
      pass: process.env.EMAIL_PASS,  // Usando la variable de entorno con la contraseña
    },
  });

  // Método para enviar correo con o sin archivo adjunto
  async sendEmailWithAttachment(fromEmail: string, toEmail: string, formData: any, file?: Express.Multer.File) {
    try {
      // Usar el correo de la variable de entorno como destino
      const destinationEmail = process.env.EMAIL_RECIPIENT || process.env.EMAIL_USER;
      
      // Formatear la fecha actual
      const fechaObj = new Date();
      const dia = fechaObj.getDate().toString().padStart(2, '0');
      const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
      const año = fechaObj.getFullYear();
      const fechaFormateada = `${dia}/${mes}/${año}`;

      // Opciones del correo (Cuerpo generado dinámicamente según el formulario)
      const mailOptions: any = {
        from: process.env.EMAIL_USER, // Usar el correo de la variable de entorno como remitente
        to: destinationEmail,         // Usar el correo de la variable de entorno como destinatario
        subject: this.getEmailSubject(formData),
        text: this.generatePlainTextEmailBody(formData, fechaFormateada),
        html: this.generateHtmlEmailBody(formData, fechaFormateada)
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
      await this.transporter.sendMail(mailOptions);
      console.log('Correo enviado correctamente');
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('No se pudo enviar el correo');
    }
  }

  // Método para determinar el asunto del correo
  private getEmailSubject(formData: any): string {
    // Si existe 'mensaje', es el formulario de contacto
    if (formData.mensaje) {
      return 'Nueva Consulta';
    } 
    // Si existe 'cedula', es el formulario de pre-registro
    else {
      return 'Nueva Pre-Afiliación';
    }
  }

  // Método para generar el cuerpo del correo en texto plano
  private generatePlainTextEmailBody(formData: any, fechaFormateada: string): string {
    // Si existe 'mensaje', es el formulario de contacto
    if (formData.mensaje) {
      return `
        Se ha recibido una nueva consulta:
        
        Nombre: ${formData.nombre}
        Email: ${formData.email}
        Mensaje: ${formData.mensaje}
      `;
    } 
    // Si existe 'cedula', es el formulario de pre-registro
    else {
      return `
        Se ha recibido una nueva pre-afiliación con la siguiente información:
        
        Nombre: ${formData.nombre}
        Cédula: ${formData.cedula}
        Dirección: ${formData.direccion}
        Teléfono: ${formData.telefono}
        Correo Electrónico: ${formData.email}
        Actividades Agrícolas: ${formData.actividades}
        Género: ${formData.genero}
        Año de Nacimiento: ${formData.annoNacimiento}
        Fecha de Pre-Afiliación: ${fechaFormateada}
      `;
    }
  }

  // Método para generar el cuerpo del correo en HTML
  private generateHtmlEmailBody(formData: any, fechaFormateada: string): string {
    // Si existe 'mensaje', es el formulario de contacto
    if (formData.mensaje) {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px;">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 25px; border-bottom: 2px solid #4285f4; padding-bottom: 15px;">
              <h1 style="color: #4285f4; margin: 0; font-size: 24px;">Nueva Consulta</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 10px 0;">
              <!-- Nombre -->
              <div style="margin-bottom: 12px;">
                <div style="font-weight: bold; color: #555555; background-color: #e8f0fe; padding: 5px; border-radius: 4px;">Nombre:</div>
                <div style="margin-top: 3px;">${formData.nombre}</div>
              </div>
              
              <!-- Email -->
              <div style="margin-bottom: 12px;">
                <div style="font-weight: bold; color: #555555; background-color: #e8f0fe; padding: 5px; border-radius: 4px;">Email:</div>
                <div style="margin-top: 3px;">${formData.email}</div>
              </div>
              
              <!-- Mensaje -->
              <div style="margin-bottom: 12px;">
                <div style="font-weight: bold; color: #555555; background-color: #e8f0fe; padding: 5px; border-radius: 4px;">Mensaje:</div>
                <div style="margin-top: 3px; padding: 10px; background-color: #f8f9fa; border-radius: 4px; border-left: 3px solid #4285f4;">${formData.mensaje}</div>
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
    } 
    // Si existe 'cedula', es el formulario de pre-registro
    else {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px;">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 25px; border-bottom: 2px solid #4285f4; padding-bottom: 15px;">
              <h1 style="color: #4285f4; margin: 0; font-size: 24px;">Nueva Pre-Afiliación</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 10px 0;">
              <!-- Nombre -->
              <div style="margin-bottom: 12px;">
                <div style="font-weight: bold; color: #555555; background-color: #e8f0fe; padding: 5px; border-radius: 4px;">Nombre:</div>
                <div style="margin-top: 3px;">${formData.nombre}</div>
              </div>
              
              <!-- Cédula -->
              <div style="margin-bottom: 12px;">
                <div style="font-weight: bold; color: #555555; background-color: #e8f0fe; padding: 5px; border-radius: 4px;">Cédula:</div>
                <div style="margin-top: 3px;">${formData.cedula}</div>
              </div>
              
              <!-- Dirección -->
              <div style="margin-bottom: 12px;">
                <div style="font-weight: bold; color: #555555; background-color: #e8f0fe; padding: 5px; border-radius: 4px;">Dirección:</div>
                <div style="margin-top: 3px;">${formData.direccion}</div>
              </div>
              
              <!-- Teléfono -->
              <div style="margin-bottom: 12px;">
                <div style="font-weight: bold; color: #555555; background-color: #e8f0fe; padding: 5px; border-radius: 4px;">Teléfono:</div>
                <div style="margin-top: 3px;">${formData.telefono}</div>
              </div>
              
              <!-- Email -->
              <div style="margin-bottom: 12px;">
                <div style="font-weight: bold; color: #555555; background-color: #e8f0fe; padding: 5px; border-radius: 4px;">Correo Electrónico:</div>
                <div style="margin-top: 3px;">${formData.email}</div>
              </div>
              
              <!-- Actividades -->
              <div style="margin-bottom: 12px;">
                <div style="font-weight: bold; color: #555555; background-color: #e8f0fe; padding: 5px; border-radius: 4px;">Actividades Agrícolas:</div>
                <div style="margin-top: 3px;">${formData.actividades}</div>
              </div>
              
              <!-- Género -->
              <div style="margin-bottom: 12px;">
                <div style="font-weight: bold; color: #555555; background-color: #e8f0fe; padding: 5px; border-radius: 4px;">Género:</div>
                <div style="margin-top: 3px;">${formData.genero}</div>
              </div>
              
              <!-- Año de Nacimiento -->
              <div style="margin-bottom: 12px;">
                <div style="font-weight: bold; color: #555555; background-color: #e8f0fe; padding: 5px; border-radius: 4px;">Año de Nacimiento:</div>
                <div style="margin-top: 3px;">${formData.annoNacimiento}</div>
              </div>
              
              <!-- Fecha -->
              <div style="margin-bottom: 12px;">
                <div style="font-weight: bold; color: #555555; background-color: #e8f0fe; padding: 5px; border-radius: 4px;">Fecha de Pre-Afiliación:</div>
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
    }
  }
}