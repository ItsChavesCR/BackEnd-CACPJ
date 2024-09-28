/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as sgMail from '@sendgrid/mail';
import { patchAfiliado } from '../afiliadosEntities/patchAfiliado.entity';
import { CreatePatchAfiliadoDto } from '../afiliadosDto/create-patchAfiliado.dto';

@Injectable()
export class patchAfiliadoService {
  constructor(
    @InjectRepository(patchAfiliado)
    private patchAfiliadoRepository: Repository<patchAfiliado>,
  ) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Asegúrate de tener esta variable en tu .env
  }

  async createPatchAfiliado(createDto: CreatePatchAfiliadoDto): Promise<patchAfiliado> {
    // Validación adicional para la cédula
    if (!/^\d{9}$/.test(createDto.cedula)) {
      throw new BadRequestException('La cédula debe tener 9 dígitos');
    }


    const newPatchAfiliado = this.patchAfiliadoRepository.create({
      ...createDto,
    });

    const savedPatchAfiliado = await this.patchAfiliadoRepository.save(newPatchAfiliado);
    

    // Después de guardar el pre-registro, envía el correo
    const msg = {
      to: 'sjimenezsofia@gmail.com', // Correo del administrador
      from: 'sjimenezsofia@gmail.com', // Correo configurado en SendGrid
      subject: `Nueva pedido de actualización de afiliado: ${savedPatchAfiliado.nombreCompleto} ${savedPatchAfiliado.cedula}`,
      text: `Se ha registrado una nueva solicitud de actualización con la siguiente información:
      
      Nombre: ${savedPatchAfiliado.nombreCompleto} con # de cédula: ${savedPatchAfiliado.cedula}
      Correo: ${savedPatchAfiliado.correo}
      Dirección: ${savedPatchAfiliado.direccion}
      Teléfono: ${savedPatchAfiliado.telefono}
      Género: ${savedPatchAfiliado.genero}
      `,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
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
