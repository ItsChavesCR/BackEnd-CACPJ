import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Modalidad } from '../psaEntities/modalidad.entity';
import { CreateModalidadDto } from '../psaDto/create-modalidad.dto';

@Injectable()
export class ModalidadService {
    constructor(
        @InjectRepository(Modalidad) 
        private modalidadRepository: Repository<Modalidad>
    ) {}

    async createModalidad(createDto: CreateModalidadDto): Promise<Modalidad> {
        const newModalidad = this.modalidadRepository.create(createDto);
        return this.modalidadRepository.save(newModalidad);
    }


    async getModalidad(): Promise<Modalidad[]> {
        return this.modalidadRepository.find();
    }

    async getModalidadById(id: number): Promise<Modalidad> {
        const modalidad = await this.modalidadRepository.findOne({ where: { Id_Modalidad: id } });
        if (!modalidad) {
            throw new NotFoundException(`Modalidad with ID ${id} not found`);
        }
        return modalidad;
    }
    

    updateModalidad(id: number, updateDto: CreateModalidadDto) {
        return this.modalidadRepository.update({ Id_Modalidad: id }, updateDto);
    }
}
