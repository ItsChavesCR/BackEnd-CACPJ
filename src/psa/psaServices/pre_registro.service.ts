/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreRegistroPsa } from '../psaEntities/pre_registro.entity';
import { CreatePreRegistroPsaDto, UpdatePreRegistroPsaDto } from '../psaDto/create-preRegistro.dto';
import { format } from 'date-fns';

@Injectable()
export class PreRegistroPsaService {
    constructor(
        @InjectRepository(PreRegistroPsa) 
        private preRegistroPsaRepository: Repository<PreRegistroPsa>
    ) {}

    async createPreRegistroPsa(createDto: CreatePreRegistroPsaDto): Promise<PreRegistroPsa> {
        // Validación adicional para la cédula
        if (!/^\d{9}$/.test(createDto.cedula)) {
            throw new BadRequestException('La cédula debe tener 9 dígitos');
        }

        const newPreRegistro = this.preRegistroPsaRepository.create({
            ...createDto,
          
        });

        return this.preRegistroPsaRepository.save(newPreRegistro);
    }


    async getPreRegistros(): Promise<any[]> {
        const registros = await this.preRegistroPsaRepository.find();
        return registros.map(registro => ({
            ...registro,
            fechaPreRegistro: format(new Date(registro.fechaPreRegistro), 'dd/MM/yy'),  // Formato de fecha
        }));
    }


    async getPreRegistroById(id: number): Promise<any> {
        const registro = await this.preRegistroPsaRepository.findOne({ where: { id } });
        if (!registro) {
            throw new BadRequestException('Registro no encontrado');
        }

        return {
            ...registro,
            fechaPreRegistro: format(new Date(registro.fechaPreRegistro), 'dd/MM/yy'),  // Formato de fecha
        };
    }


    async updatePreRegistro(id: number, updateDto: UpdatePreRegistroPsaDto) {
        // Validación adicional para la cédula
        if (updateDto.cedula && !/^\d{9}$/.test(updateDto.cedula)) {
            throw new BadRequestException('La cédula debe tener 9 dígitos');
        }

        return this.preRegistroPsaRepository.update(id, updateDto);
    }

    async deletePreRegistro(id: number) {
        return this.preRegistroPsaRepository.delete(id);
    }
}
